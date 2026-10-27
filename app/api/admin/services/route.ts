import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData } from '@/lib/store';
import { Service } from '@/lib/data';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = getStoreData();
  return NextResponse.json({ services: data.services });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = getStoreData();

    // If body contains an array of services (bulk update / reordering)
    if (Array.isArray(body.services)) {
      const updated = saveStoreData({ services: body.services });
      return NextResponse.json({ success: true, services: updated.services });
    }

    // Single service create or update
    const service: Service = body.service;
    if (!service || !service.id || !service.title) {
      return NextResponse.json(
        { error: 'Valid service ID and title are required.' },
        { status: 400 }
      );
    }

    const currentServices = [...data.services];
    const index = currentServices.findIndex((s) => s.id === service.id);

    if (index >= 0) {
      currentServices[index] = service;
    } else {
      currentServices.push(service);
    }

    const updated = saveStoreData({ services: currentServices });
    return NextResponse.json({ success: true, services: updated.services });
  } catch (err) {
    console.error('Error saving service:', err);
    return NextResponse.json({ error: 'Failed to save service' }, { status: 500 });
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
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const data = getStoreData();
    const filtered = data.services.filter((s) => s.id !== id);

    const updated = saveStoreData({ services: filtered });
    return NextResponse.json({ success: true, services: updated.services });
  } catch (err) {
    console.error('Error deleting service:', err);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
