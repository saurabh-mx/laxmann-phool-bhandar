import { createClient } from '@supabase/supabase-js';
import { Service, services as defaultServices } from './data';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.trim().length > 0 && key.trim().length > 0);
}

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function dbRowToService(row: any): Service {
  let features: string[] = [];
  if (Array.isArray(row.features)) {
    features = row.features;
  } else if (typeof row.features === 'string') {
    try {
      features = JSON.parse(row.features);
    } catch {
      features = [row.features];
    }
  }

  return {
    id: String(row.id),
    title: String(row.title || ''),
    category: row.category || 'weddings',
    short: String(row.short || ''),
    description: String(row.description || ''),
    price: String(row.price || ''),
    startingNumericPrice: Number(row.starting_numeric_price ?? row.startingNumericPrice ?? 0),
    image: String(row.image || ''),
    tag: String(row.tag || ''),
    features,
  };
}

export function serviceToDbRow(service: Service, displayOrder = 0) {
  return {
    id: service.id,
    title: service.title,
    category: service.category,
    short: service.short,
    description: service.description,
    price: service.price,
    starting_numeric_price: service.startingNumericPrice,
    image: service.image,
    tag: service.tag,
    features: service.features,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchSupabaseServices(): Promise<Service[] | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('services')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error (services table may not exist yet):', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      // Auto-seed default services if table is empty
      console.log('Supabase services table is empty. Seeding defaults...');
      await syncAllServicesToSupabase(defaultServices);
      return defaultServices;
    }

    return data.map(dbRowToService);
  } catch (err) {
    console.error('Error fetching services from Supabase:', err);
    return null;
  }
}

export async function upsertSupabaseService(service: Service, displayOrder = 0): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const row = serviceToDbRow(service, displayOrder);
    const { error } = await client.from('services').upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error upserting service in Supabase:', err);
    return false;
  }
}

export async function deleteSupabaseService(id: string): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { error } = await client.from('services').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting service in Supabase:', err);
    return false;
  }
}

export async function syncAllServicesToSupabase(servicesList: Service[]): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const rows = servicesList.map((s, idx) => serviceToDbRow(s, idx));
    const { error } = await client.from('services').upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Supabase bulk upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error syncing all services to Supabase:', err);
    return false;
  }
}
