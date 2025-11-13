/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (MSW).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '223d41945c30bc51'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(clientId, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(clientId, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event

  if (request.mode === 'navigate') {
    return
  }

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  if (activeClientIds.size === 0) {
    return
  }

  const requestId = crypto.randomUUID()

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === 'NetworkError') {
        console.warn(
          '[MSW] Successfully emulated a network error for request:',
          request.method,
          request.url,
        )
        return
      }

      console.error(
        `\
[MSW] Caught an exception from the "%s %s" request (%s). This is probably not a problem with Mock Service Worker. There is likely an additional logging output above.`,
        request.method,
        request.url,
        `${error.name}: ${error.message}`,
      )
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await event.target.clients.get(event.clientId)

  if (!client) {
    return passthrough(event.request)
  }

  const response = await getResponse(event, client, requestId)

  if (client.id && activeClientIds.has(client.id)) {
    ;(response.headers || new Headers()).set('x-powered-by', 'msw')
  }

  return response
}

async function getResponse(event, client, requestId) {
  const { request } = event
  const requestClone = request.clone()

  function passthrough() {
    const headers = Object.fromEntries(requestClone.headers.entries())

    delete headers['x-msw-intention']

    return fetch(requestClone, { headers })
  }

  sendToClient(
    client.id,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        cache: request.cache,
        mode: request.mode,
        credentials: request.credentials,
        destination: request.destination,
        integrity: request.integrity,
        redirect: request.redirect,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
        body: await request.text(),
        keepalive: request.keepalive,
      },
    },
    [requestClone.body],
  )

  const responsePromise = new Promise((resolve, reject) => {
    function responseHandler(event) {
      if (!event.data || event.data.type !== 'MOCK_RESPONSE') {
        return
      }

      if (event.data.payload?.id !== requestId) {
        return
      }

      self.removeEventListener('message', responseHandler)

      if (!event.data.payload) {
        return reject(new Error('Missing response payload'))
      }

      resolve(event.data.payload)
    }

    self.addEventListener('message', responseHandler)
  })

  const response = await responsePromise

  if (!response) {
    return passthrough()
  }

  return new Response(response.body, response)
}

function sendToClient(clientId, message, transferables = []) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    self.clients
      .get(clientId)
      .then((client) => {
        if (!client) {
          return reject(new Error('Failed to get client'))
        }

        client.postMessage(message, [channel.port2].concat(transferables))
      })
      .catch(reject)
  })
}
