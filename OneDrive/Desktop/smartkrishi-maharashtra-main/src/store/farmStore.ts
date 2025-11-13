import { create } from 'zustand';

export interface FarmData {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  area: number; // acres
  crops: string[];
  ndvi: number;
  soilMoisture: number;
  irrigationNeed: number;
  rainfall: number;
  groundwater: number;
  diseaseRisk: number;
  yieldForecast: { value: number; ci: [number, number] };
  lastUpdated: {
    weather: Date;
    iot: Date;
    satellite: Date;
  };
}

interface FarmState {
  selectedFarm: string | null;
  farms: FarmData[];
  setSelectedFarm: (farmId: string) => void;
  getFarmById: (farmId: string) => FarmData | undefined;
}

// Mock data for Western Maharashtra farms
const mockFarms: FarmData[] = [
  {
    id: 'farm1',
    name: 'Shivneri Farm',
    location: { lat: 18.5204, lng: 73.8567 }, // Pune district
    area: 12.5,
    crops: ['Sugarcane', 'Onion'],
    ndvi: 0.78,
    soilMoisture: 42,
    irrigationNeed: 3200,
    rainfall: 15,
    groundwater: 3.8,
    diseaseRisk: 28,
    yieldForecast: { value: 82, ci: [76, 88] },
    lastUpdated: {
      weather: new Date(Date.now() - 15 * 60 * 1000),
      iot: new Date(Date.now() - 5 * 60 * 1000),
      satellite: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  },
  {
    id: 'farm2',
    name: 'Someshwar Farm',
    location: { lat: 17.6868, lng: 74.0123 }, // Satara district
    area: 8.3,
    crops: ['Soybean', 'Wheat'],
    ndvi: 0.65,
    soilMoisture: 38,
    irrigationNeed: 2800,
    rainfall: 22,
    groundwater: 4.2,
    diseaseRisk: 18,
    yieldForecast: { value: 45, ci: [41, 49] },
    lastUpdated: {
      weather: new Date(Date.now() - 15 * 60 * 1000),
      iot: new Date(Date.now() - 5 * 60 * 1000),
      satellite: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  },
];

export const useFarmStore = create<FarmState>((set, get) => ({
  selectedFarm: 'farm1',
  farms: mockFarms,
  setSelectedFarm: (farmId) => set({ selectedFarm: farmId }),
  getFarmById: (farmId) => get().farms.find(f => f.id === farmId),
}));
