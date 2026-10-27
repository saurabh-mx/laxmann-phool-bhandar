import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getStoreData } from '@/lib/store';
import AdminDashboard from '@/components/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Studio Control Panel | Laxman Phool Bhandar',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const isAuth = await isAuthenticatedAdmin();

  if (!isAuth) {
    redirect('/admin/login');
  }

  const initialData = getStoreData();

  return <AdminDashboard initialData={initialData} />;
}
