import { http, HttpResponse, delay } from 'msw';
import farmsData from '../data/farms.json';
import weatherData from '../data/weather.json';
import ndviData from '../data/ndvi-index.json';
import thermalData from '../data/thermal.json';
import sensorsData from '../data/sensors.json';
import alertsData from '../data/alerts.json';
import aiPresetsData from '../data/aiPresets.json';
import marketData from '../data/market.json';

const mockUsers = {
  '+919000011111': {
    id: '1',
    phone: '+919000011111',
    role: 'farmer' as const,
    name: 'रमेश पाटील',
    farms: ['farm-1', 'farm-2'],
    preferredLanguage: 'mr',
  },
  'farmer@smartkrishi.in': {
    id: '1b',
    email: 'farmer@smartkrishi.in',
    role: 'farmer' as const,
    name: 'रमेश पाटील',
    farms: ['farm-1', 'farm-2'],
    preferredLanguage: 'mr',
  },
  'advisor@smartkrishi.in': {
    id: '2',
    email: 'advisor@smartkrishi.in',
    role: 'advisor' as const,
    name: 'Dr. संजय देशमुख',
    farms: ['farm-1', 'farm-2'],
    preferredLanguage: 'mr',
  },
  'admin@smartkrishi.in': {
    id: '3',
    email: 'admin@smartkrishi.in',
    role: 'admin' as const,
    name: 'Admin',
    farms: [],
    preferredLanguage: 'en',
  },
};

const randomDelay = () => delay(150 + Math.random() * 450);

export const handlers = [
  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    await randomDelay();
    const body = await request.json() as any;
    
    if (body.phone && body.otp === '123456') {
      const user = mockUsers[body.phone as keyof typeof mockUsers];
      if (user) {
        return HttpResponse.json({
          token: 'mock-token-' + Date.now(),
          role: user.role,
          user,
          farms: farmsData.filter(f => user.farms.includes(f.id))
        });
      }
    }
    
    if (body.email && body.password) {
      const user = mockUsers[body.email as keyof typeof mockUsers];
      if (user && 
          ((body.email === 'farmer@smartkrishi.in' && body.password === 'farmer123') ||
           (body.email === 'advisor@smartkrishi.in' && body.password === 'advisor123') ||
           (body.email === 'admin@smartkrishi.in' && body.password === 'admin123'))) {
        return HttpResponse.json({
          token: 'mock-token-' + Date.now(),
          role: user.role,
          user,
          farms: farmsData.filter(f => user.farms.includes(f.id))
        });
      }
    }
    
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Farms
  http.get('/api/farms', async () => {
    await randomDelay();
    return HttpResponse.json(farmsData);
  }),

  http.get('/api/farm/:id/summary', async ({ params }) => {
    await randomDelay();
    const now = new Date();
    return HttpResponse.json({
      ndviAvg: 0.78 + Math.random() * 0.1,
      soilMoisturePct: 34 + Math.random() * 10,
      eto: 5.2 + Math.random() * 0.8,
      irrigationNeedLPA: 1200 + Math.random() * 400,
      forecastRainMM: Math.random() * 20,
      groundwaterM: -6.1 + Math.random() * 0.5,
      diseaseRiskPct: 32 + Math.random() * 20,
      yield: {
        qPerAcre: 78 + Math.random() * 10,
        ci: [72, 86]
      },
      updatedAt: now.toISOString()
    });
  }),

  // NDVI
  http.get('/api/farm/:id/ndvi', async () => {
    await randomDelay();
    return HttpResponse.json(ndviData);
  }),

  // Thermal
  http.get('/api/farm/:id/thermal', async () => {
    await randomDelay();
    return HttpResponse.json(thermalData);
  }),

  // IoT
  http.get('/api/farm/:id/iot/streams', async () => {
    await randomDelay();
    const generateTimeseries = () => {
      const data = [];
      for (let i = 0; i < 48; i++) {
        const ts = new Date(Date.now() - (48 - i) * 3600000).toISOString();
        data.push({
          ts,
          value: 30 + Math.sin(i / 6) * 10 + Math.random() * 5
        });
      }
      return data;
    };

    return HttpResponse.json(
      sensorsData.map(sensor => ({
        nodeId: sensor.id,
        metrics: {
          soilMoisture: generateTimeseries(),
          soilTemp: generateTimeseries().map(d => ({ ...d, value: d.value * 0.8 })),
          ec: generateTimeseries().map(d => ({ ...d, value: d.value * 0.03 })),
          battery: Array.from({ length: 48 }, (_, i) => ({
            ts: new Date(Date.now() - (48 - i) * 3600000).toISOString(),
            value: 85 - i * 0.1
          })),
          rssi: generateTimeseries().map(d => ({ ...d, value: -60 + Math.random() * 20 }))
        }
      }))
    );
  }),

  // Weather
  http.get('/api/farm/:id/weather', async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || 'hourly';
    
    console.log('MSW Weather API called:', range);
    
    if (range === 'hourly') {
      console.log('Returning hourly data:', weatherData.hourly?.length, 'hours');
      return HttpResponse.json({ hourly: weatherData.hourly });
    }
    console.log('Returning daily data:', weatherData.daily?.length, 'days');
    return HttpResponse.json({ daily: weatherData.daily });
  }),

  // AI Predict
  http.post('/api/farm/:id/ai/predict', async ({ request }) => {
    await randomDelay();
    const body = await request.json() as any;
    const model = body.model;
    
    console.log('MSW AI Predict API called for model:', model);
    
    const responses: Record<string, any> = {
      yield: {
        output: 82.5 + Math.random() * 8,
        ci: [76, 89],
        explanation: [
          { feature: 'NDVI_t-7', importance: 35 },
          { feature: 'SoilMoisture_mean', importance: 28 },
          { feature: 'Rain_7d', importance: 22 },
          { feature: 'N_level', importance: 15 }
        ],
        version: 'v1.3.2',
        inferenceMs: Math.floor(120 + Math.random() * 80),
        confidencePct: Math.floor(87 + Math.random() * 8)
      },
      groundwater: {
        output: [
          { day: 'Day 1', depth: -6.1, ciLower: -6.4, ciUpper: -5.8 },
          { day: 'Day 2', depth: -6.3, ciLower: -6.6, ciUpper: -6.0 },
          { day: 'Day 3', depth: -6.5, ciLower: -6.8, ciUpper: -6.2 },
          { day: 'Day 4', depth: -6.4, ciLower: -6.7, ciUpper: -6.1 },
          { day: 'Day 5', depth: -6.2, ciLower: -6.5, ciUpper: -5.9 },
          { day: 'Day 6', depth: -6.0, ciLower: -6.3, ciUpper: -5.7 },
          { day: 'Day 7', depth: -5.9, ciLower: -6.2, ciUpper: -5.6 }
        ],
        ci: [-6.8, -5.6],
        explanation: [
          { feature: 'Rain_cum', importance: 45 },
          { feature: 'ET0', importance: 32 },
          { feature: 'Season', importance: 23 }
        ],
        version: 'v1.3.2',
        inferenceMs: Math.floor(95 + Math.random() * 60),
        confidencePct: Math.floor(82 + Math.random() * 10)
      },
      disease: {
        output: Math.floor(32 + Math.random() * 35),
        explanation: [
          { feature: 'Humidity', importance: 42 },
          { feature: 'Temp', importance: 35 },
          { feature: 'LeafWetnessProxy', importance: 23 }
        ],
        version: 'v1.3.2',
        inferenceMs: Math.floor(78 + Math.random() * 50),
        confidencePct: Math.floor(79 + Math.random() * 12)
      },
      fertilizer: {
        output: [
          { nutrient: 'N', kgPerAcre: 120 },
          { nutrient: 'P', kgPerAcre: 60 },
          { nutrient: 'K', kgPerAcre: 80 }
        ],
        explanation: [
          { feature: 'Soil_OC', importance: 38 },
          { feature: 'N_rate', importance: 28 },
          { feature: 'P_rate', importance: 18 },
          { feature: 'K_rate', importance: 16 }
        ],
        version: 'v1.3.2',
        inferenceMs: Math.floor(142 + Math.random() * 90),
        confidencePct: Math.floor(85 + Math.random() * 9)
      }
    };
    
    console.log('MSW AI Predict returning result for:', model, responses[model]);
    return HttpResponse.json(responses[model] || responses.yield);
  }),

  // Alerts
  http.get('/api/farm/:id/alerts', async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    
    let filtered = [...alertsData];
    if (status) filtered = filtered.filter(a => a.status === status);
    if (type) filtered = filtered.filter(a => a.type === type);
    
    return HttpResponse.json(filtered);
  }),

  http.post('/api/alerts/:id/resolve', async () => {
    await randomDelay();
    return HttpResponse.json({
      ok: true,
      resolvedAt: new Date().toISOString()
    });
  }),

  // Soil
  http.get('/api/soil/:fieldId/report', async ({ params }) => {
    await randomDelay();
    return HttpResponse.json({
      fieldId: params.fieldId,
      sampledAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      params: {
        pH: 7.2, EC: 0.45, OC: 0.68, N: 245, P: 18, K: 312, S: 15,
        Ca: 1250, Mg: 280, Zn: 0.8, Fe: 4.5, Mn: 3.2, Cu: 0.6, B: 0.45,
        Mo: 0.02, Na: 85, SAR: 2.1, CEC: 42, BulkDensity: 1.32, WHC: 48,
        Texture: 'Clay Loam', NO3N: 22, NH4N: 8, PO4P: 15, K2Oeq: 375,
        CaCO3: 2.8, Cl: 35, SO4: 48, MicrobialC: 320, MicrobialN: 28,
        AvailSi: 55, Clay: 38, Silt: 32, Sand: 30, ActiveCaCO3: 1.2,
        ExchangeableNa: 0.8
      },
      cropTargets: {
        pH: { min: 6.5, max: 7.5 },
        N: { min: 220, max: 280 },
        P: { min: 15, max: 25 },
        K: { min: 280, max: 360 }
      },
      recommendations: {
        fertilizers: [
          { name: 'Urea', kgPerAcre: 120, cost: 840, split: ['basal', 'top'] },
          { name: 'DAP', kgPerAcre: 80, cost: 1680, split: ['basal'] },
          { name: 'MOP', kgPerAcre: 60, cost: 720, split: ['basal', 'top'] }
        ],
        irrigationSchedule: [
          { stage: 'vegetative', frequency: 7, amount: 1200 },
          { stage: 'flowering', frequency: 5, amount: 1500 },
          { stage: 'maturity', frequency: 10, amount: 800 }
        ],
        safetyNotes: ['Wear gloves', 'Store in dry place', 'Keep away from children']
      }
    });
  }),

  // Reports
  http.post('/api/reports/generate', async ({ request }) => {
    await randomDelay();
    const body = await request.json() as any;
    return HttpResponse.json({
      id: 'rpt-' + Date.now(),
      url: '/api/reports/rpt-' + Date.now() + '/pdf',
      type: body.type
    });
  }),

  // Admin
  http.get('/api/admin/users', async () => {
    await randomDelay();
    return HttpResponse.json(Object.values(mockUsers));
  }),

  http.get('/api/admin/thresholds', async () => {
    await randomDelay();
    return HttpResponse.json({
      ndvi: { warn: 0.5, crit: 0.3 },
      soilMoisture: { warn: 25, crit: 15 },
      diseaseRisk: { warn: 50, crit: 70 },
      groundwater: { warn: -8, crit: -10 }
    });
  }),

  // Market
  http.get('/api/market/apmc', async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const commodity = url.searchParams.get('commodity') || 'onion';
    
    const filtered = marketData.filter(m => m.commodity === commodity);
    return HttpResponse.json(filtered);
  })
];
