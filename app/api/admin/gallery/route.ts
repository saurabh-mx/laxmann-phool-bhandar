import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData } from '@/lib/store';
import { GalleryItem } from '@/lib/data';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = getStoreData();
  return NextResponse.json({ gallery: data.gallery });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getStoreData();

    // Bulk update or reordering
    if (Array.isArray(body.gallery)) {
      const updated = saveStoreData({ gallery: body.gallery });
      return NextResponse.json({ success: true, gallery: updated.gallery });
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
    return NextResponse.json({ success: true, gallery: updated.gallery });
  } catch (err) {
    console.error('Error saving gallery item:', err);
    return NextResponse.json({ error: 'Failed to save gallery item' }, { status: 500 });
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
    return NextResponse.json({ success: true, gallery: updated.gallery });
  } catch (err) {
    console.error('Error deleting photo:', err);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
