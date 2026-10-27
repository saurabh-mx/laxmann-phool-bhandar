import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData } from '@/lib/store';
import {
  isSupabaseConfigured,
  fetchSupabaseGallery,
  upsertSupabaseGalleryItem,
  deleteSupabaseGalleryItem,
  syncAllGalleryToSupabase,
} from '@/lib/supabase-gallery';
import { GalleryItem } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function revalidatePublicGallery() {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/gallery', 'page');
    revalidatePath('/api/data');
  } catch (e) {
    console.warn('Revalidation warning:', e);
  }
}

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    const dbGallery = await fetchSupabaseGallery();
    if (dbGallery && dbGallery.length > 0) {
      return NextResponse.json({ gallery: dbGallery, source: 'supabase' });
    }
  }

  const data = getStoreData();
  return NextResponse.json({ gallery: data.gallery, source: 'local' });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getStoreData();
    const supabaseActive = isSupabaseConfigured();

    // Bulk update or reordering
    if (Array.isArray(body.gallery)) {
      const updated = saveStoreData({ gallery: body.gallery });

      if (supabaseActive) {
        try {
          await syncAllGalleryToSupabase(body.gallery);
        } catch (sbErr) {
          console.warn('Supabase bulk sync gallery error:', sbErr);
        }
      }

      revalidatePublicGallery();

      return NextResponse.json({
        success: true,
        gallery: updated.gallery,
        syncedToSupabase: supabaseActive,
      });
    }

    // Single item add or update
    const item: GalleryItem = body.item;
    if (!item || !item.id || !item.image || !item.title) {
      return NextResponse.json(
        { error: 'Valid photo ID, title, and image source are required.' },
        { status: 400 }
      );
    }

    const currentGallery = [...data.gallery];
    const index = currentGallery.findIndex((g) => g.id === item.id);

    if (index >= 0) {
      currentGallery[index] = item;
    } else {
      // Add new photo at beginning of gallery
      currentGallery.unshift(item);
    }

    const updated = saveStoreData({ gallery: currentGallery });

    let finalGallery = updated.gallery;

    if (supabaseActive) {
      try {
        await upsertSupabaseGalleryItem(item, index >= 0 ? index : 0);
        const dbGallery = await fetchSupabaseGallery();
        if (dbGallery && dbGallery.length > 0) {
          finalGallery = dbGallery;
          saveStoreData({ gallery: dbGallery });
        }
      } catch (sbErr) {
        console.warn('Supabase upsert gallery error:', sbErr);
      }
    }

    revalidatePublicGallery();

    return NextResponse.json({
      success: true,
      gallery: finalGallery,
      syncedToSupabase: supabaseActive,
    });
  } catch (err: any) {
    console.error('Error saving gallery item:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to save gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });
    }

    const data = getStoreData();
    const filtered = data.gallery.filter((g) => g.id !== id);
    const updated = saveStoreData({ gallery: filtered });

    let finalGallery = updated.gallery;

    if (isSupabaseConfigured()) {
      try {
        await deleteSupabaseGalleryItem(id);
        const dbGallery = await fetchSupabaseGallery();
        if (dbGallery !== null) {
          finalGallery = dbGallery;
          saveStoreData({ gallery: dbGallery });
        }
      } catch (sbErr) {
        console.warn('Supabase delete gallery error:', sbErr);
      }
    }

    revalidatePublicGallery();

    return NextResponse.json({
      success: true,
      gallery: finalGallery,
      syncedToSupabase: isSupabaseConfigured(),
    });
  } catch (err: any) {
    console.error('Error deleting photo:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
