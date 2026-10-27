import fs from 'fs';
import path from 'path';
import { services as defaultServices, gallery as defaultGallery, businessInfo as defaultBusinessInfo, Service, GalleryItem } from './data';

export interface EventTypeOption {
  id: string;
  name: string;
  baseMin: number;
  baseMax: number;
  icon: string;
}

export interface ScaleOption {
  id: string;
  name: string;
  multiplier: number;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface PricingConfig {
  eventTypes: EventTypeOption[];
  scales: ScaleOption[];
  addons: AddonOption[];
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  phone: string;
  rawPhone: string;
  email: string;
  address: string;
  city: string;
  hours: string;
  experienceYears: number;
  eventsCount: string;
  rating: string;
  reviewsCount: string;
}

export interface AppStoreData {
  services: Service[];
  gallery: GalleryItem[];
  pricing: PricingConfig;
  businessInfo: BusinessInfo;
  lastUpdated: string;
}

const defaultPricing: PricingConfig = {
  eventTypes: [
    { id: 'wedding', name: 'Grand Wedding & Mandap', baseMin: 18000, baseMax: 35000, icon: '🏛️' },
    { id: 'car', name: 'Luxury Car Decoration', baseMin: 1500, baseMax: 3500, icon: '🚗' },
    { id: 'stage', name: 'Reception Stage & Backdrop', baseMin: 12000, baseMax: 25000, icon: '✨' },
    { id: 'haldi', name: 'Haldi & Mehendi Jhoola', baseMin: 5500, baseMax: 12000, icon: '🌼' },
    { id: 'bouquet', name: 'Bespoke Rose Bouquet / Basket', baseMin: 500, baseMax: 2000, icon: '💐' },
    { id: 'custom', name: 'Pinterest / Custom Idea', baseMin: 5000, baseMax: 15000, icon: '🎨' },
  ],
  scales: [
    { id: 'intimate', name: 'Intimate / Home Gathering', multiplier: 1.0 },
    { id: 'grand', name: 'Banquet / Hall (100–300 Guests)', multiplier: 1.4 },
    { id: 'royal', name: 'Grand Royal Resort (500+ Guests)', multiplier: 2.1 },
  ],
  addons: [
    { id: 'varmala', name: 'Rose & Orchid Varmalas (Pair)', price: 2500 },
    { id: 'arch', name: 'Grand Floral Entrance Arch', price: 4500 },
    { id: 'jewelry', name: 'Bridal Floral Jewelry Set', price: 1500 },
    { id: 'car_decor', name: 'Doorstep Wedding Car Decor', price: 1800 },
    { id: 'petals', name: 'Organic Petal Shower Baskets', price: 800 },
  ],
};

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'store.json');

export function getStoreData(): AppStoreData {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      const initialData: AppStoreData = {
        services: defaultServices,
        gallery: defaultGallery,
        pricing: defaultPricing,
        businessInfo: defaultBusinessInfo,
        lastUpdated: new Date().toISOString(),
      };
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }

    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as AppStoreData;

    // Ensure backwards compatibility with any missing fields
    return {
      services: parsed.services || defaultServices,
      gallery: parsed.gallery || defaultGallery,
      pricing: parsed.pricing || defaultPricing,
      businessInfo: parsed.businessInfo || defaultBusinessInfo,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Error reading store data:', err);
    return {
      services: defaultServices,
      gallery: defaultGallery,
      pricing: defaultPricing,
      businessInfo: defaultBusinessInfo,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function saveStoreData(data: Partial<AppStoreData>): AppStoreData {
  const current = getStoreData();
  const updated: AppStoreData = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export async function getStoreDataAsync(): Promise<AppStoreData & { isSupabaseConnected: boolean }> {
  const local = getStoreData();
  
  try {
    const { isSupabaseConfigured, fetchSupabaseServices } = await import('./supabase-services');
    if (isSupabaseConfigured()) {
      const dbServices = await fetchSupabaseServices();
      if (dbServices && dbServices.length > 0) {
        return {
          ...local,
          services: dbServices,
          isSupabaseConnected: true,
        };
      }
    }
  } catch (err) {
    console.warn('Failed to load services from Supabase, using local fallback:', err);
  }

  return {
    ...local,
    isSupabaseConnected: false,
  };
}

