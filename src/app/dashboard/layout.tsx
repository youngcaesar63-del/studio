
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { AuthGuard } from '@/components/auth-guard';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isWelcomePage = pathname === '/dashboard/welcome';

  return (
    <AuthGuard>
      <div className={cn("min-h-screen w-full bg-muted/40", isWelcomePage && "flex flex-col")}>
        {!isWelcomePage && <DashboardHeader />}
        <div className={cn("flex", isWelcomePage && "flex-grow")}>
          {!isWelcomePage && <DashboardSidebar />}
          <main className={cn("flex-1 p-6", isWelcomePage && "flex items-center justify-center p-0 m-0 w-full h-full")}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
