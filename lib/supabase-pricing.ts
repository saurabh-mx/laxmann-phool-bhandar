import { getSupabaseServerClient, isSupabaseConfigured } from './supabase-services';
import { PricingConfig } from './store';

export async function fetchSupabasePricing(): Promise<PricingConfig | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('pricing_config')
      .select('config')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch pricing warning (table may not exist yet):', error.message);
      return null;
    }

    if (!data || !data.config) {
      return null;
    }

    return data.config as PricingConfig;
  } catch (err) {
    console.error('Error fetching pricing from Supabase:', err);
    return null;
  }
}

export async function upsertSupabasePricing(pricing: PricingConfig): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('pricing_config')
      .upsert(
        {
          id: 'default',
          config: pricing,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase upsert pricing error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error upserting pricing in Supabase:', err);
    return false;
  }
}
