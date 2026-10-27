import { getSupabaseServerClient, isSupabaseConfigured } from './supabase-services';
import { GalleryItem, gallery as defaultGallery } from './data';

export { isSupabaseConfigured };

export function dbRowToGalleryItem(row: any): GalleryItem {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    category: row.category || 'all',
    categoryLabel: String(row.category_label || row.categoryLabel || ''),
    image: String(row.image || ''),
    aspect: row.aspect || 'square',
    highlight: String(row.highlight || ''),
  };
}

export function galleryItemToDbRow(item: GalleryItem, displayOrder = 0) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    category_label: item.categoryLabel,
    image: item.image,
    aspect: item.aspect,
    highlight: item.highlight,
    display_order: displayOrder,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchSupabaseGallery(): Promise<GalleryItem[] | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch gallery warning (table may not exist yet):', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(dbRowToGalleryItem);
  } catch (err) {
    console.error('Error fetching gallery from Supabase:', err);
    return null;
  }
}

export async function upsertSupabaseGalleryItem(item: GalleryItem, displayOrder = 0): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const row = galleryItemToDbRow(item, displayOrder);
    const { error } = await client.from('gallery').upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert gallery error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error upserting gallery item in Supabase:', err);
    return false;
  }
}

export async function deleteSupabaseGalleryItem(id: string): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const { error } = await client.from('gallery').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete gallery error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting gallery item in Supabase:', err);
    return false;
  }
}

export async function syncAllGalleryToSupabase(galleryList: GalleryItem[]): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client) return false;

  try {
    const rows = galleryList.map((g, idx) => galleryItemToDbRow(g, idx));
    const { error } = await client.from('gallery').upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Supabase bulk upsert gallery error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error syncing all gallery items to Supabase:', err);
    return false;
  }
}
