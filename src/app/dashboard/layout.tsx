
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
        <div className={cn("container mx-auto py-6 px-4 flex rtl:space-x-reverse space-x-6 relative", isWelcomePage && "flex-grow flex items-center justify-center p-0 m-0")}>
          {!isWelcomePage && <DashboardSidebar />}
          <main className={cn("flex-1", isWelcomePage && "w-full h-full")}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
