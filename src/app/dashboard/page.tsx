
import { ImportantAlerts } from '@/components/dashboard/important-alerts';
import { QuickSearch } from '@/components/dashboard/quick-search';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RanksChart } from '@/components/dashboard/ranks-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { WellbeingAnalysis } from '@/components/dashboard/wellbeing-analysis';
import { DateTimeDisplay } from '@/components/dashboard/date-time-display';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const WellbeingSkeleton = () => (
    <Skeleton className="h-[250px] w-full" />
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">لوحة التحكم</h2>
        <DateTimeDisplay />
      </div>
      
      <QuickSearch />
      <StatsCards />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RanksChart />
        <RecentActivity />
      </div>

      <Suspense fallback={<WellbeingSkeleton />}>
        <WellbeingAnalysis />
      </Suspense>

      <ImportantAlerts />
      <UpcomingEvents />
    </div>
  );
}
