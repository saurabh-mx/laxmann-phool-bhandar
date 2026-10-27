import { NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData, saveStoreData, BusinessInfo } from '@/lib/store';

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = getStoreData();
  return NextResponse.json({ businessInfo: data.businessInfo });
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const info: Partial<BusinessInfo> = body.businessInfo;

    if (!info) {
      return NextResponse.json({ error: 'Business info is required' }, { status: 400 });
    }

    const current = getStoreData();
    const merged: BusinessInfo = {
      ...current.businessInfo,
      ...info,
    };

    const updated = saveStoreData({ businessInfo: merged });
    return NextResponse.json({ success: true, businessInfo: updated.businessInfo });
  } catch (err) {
    console.error('Error saving business info:', err);
    return NextResponse.json({ error: 'Failed to save business info' }, { status: 500 });
  }
}
