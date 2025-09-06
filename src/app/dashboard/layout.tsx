
'use client';

import type { ReactNode } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
        <div className="min-h-screen w-full bg-muted/40">
          <DashboardHeader />
          <div className="container mx-auto py-6 px-4 flex rtl:space-x-reverse space-x-6 relative">
            <DashboardSidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
    </AuthGuard>
  );
}
