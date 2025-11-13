import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";

async function enableMocking() {
  if (import.meta.env.MODE !== 'development' && import.meta.env.MODE !== 'preview') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js'
    }
  });
  
  console.log('🎭 MSW: Mock Service Worker started');
}

enableMocking()
  .then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  })
  .catch((error) => {
    console.error('Failed to start MSW:', error);
    createRoot(document.getElementById("root")!).render(<App />);
  });
