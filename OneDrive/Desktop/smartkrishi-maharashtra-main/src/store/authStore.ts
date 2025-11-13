import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  phone?: string;
  email?: string;
  role: 'farmer' | 'advisor' | 'admin';
  name: string;
  farms: string[];
  preferredLanguage: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { phone?: string; email?: string; password?: string; otp?: string }) => Promise<boolean>;
  logout: () => void;
}

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

const passwordMap: Record<string, string> = {
  'farmer@smartkrishi.in': 'farmer123',
  'advisor@smartkrishi.in': 'advisor123',
  'admin@smartkrishi.in': 'admin123',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phone OTP login
        if (credentials.phone && credentials.otp === '123456') {
          // Normalize phone number (handle +91, spaces, etc.)
          const normalized = credentials.phone.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^91/, '');
          const phoneKey = normalized === '9000011111' ? '+919000011111' : credentials.phone;
          const user = mockUsers[phoneKey as keyof typeof mockUsers] || mockUsers['+919000011111'];
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }
        }

        // Email login
        if (credentials.email && credentials.password) {
          const user = mockUsers[credentials.email as keyof typeof mockUsers];
          const expectedPassword = passwordMap[credentials.email];
          if (user && expectedPassword && credentials.password === expectedPassword) {
            set({ user, isAuthenticated: true });
            return true;
          }
        }

        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'smartkrishi-auth',
    }
  )
);
