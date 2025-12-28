'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold">
              Thundercloud
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Websites
              </Link>
              <Link
                href="/dashboard/websites/new"
                className="text-sm font-medium hover:text-primary"
              >
                Create New
              </Link>
            </nav>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
