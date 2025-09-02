
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Briefcase, TrendingUp, Minus } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type Personnel = {
  id: number;
  status: string;
};

const ChangeIndicator = ({ type }: { type: string }) => {
  if (type === 'increase' || type === 'increase_bad') {
    return <TrendingUp className="inline h-4 w-4 ml-1" />;
  }
  if (type === 'neutral') {
    return <Minus className="inline h-4 w-4 ml-1" />;
  }
  return null;
};

const getChangeColor = (type: string) => {
  switch (type) {
    case 'increase': return 'text-green-600 dark:text-green-400';
    case 'increase_bad': return 'text-red-600 dark:text-red-400';
    default: return 'text-muted-foreground';
  }
}

export function StatsCards() {
  const [stats, setStats] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('personnelData');
      const personnelList: Personnel[] = storedData ? JSON.parse(storedData) : [];

      const total = personnelList.length;
      const inService = personnelList.filter(p => p.status === 'بالطابور').length;
      const onLeave = personnelList.filter(p => p.status === 'إجازة').length;

      // New personnel: added in the last 30 days. ID is a timestamp.
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const newPersonnel = personnelList.filter(p => p.id > thirtyDaysAgo).length;

      const calculatedStats = [
        { title: 'إجمالي الأفراد', value: total.toString(), change: '', changeType: 'neutral', icon: Users, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300' },
        { title: 'الأفراد الجدد (آخر ٣٠ يوم)', value: newPersonnel.toString(), change: '', changeType: 'neutral', icon: UserPlus, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300' },
        { title: 'بالطابور', value: inService.toString(), change: '', changeType: 'neutral', icon: Users, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300' },
        { title: 'في الإجازة', value: onLeave.toString(), change: '', changeType: 'neutral', icon: Briefcase, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300' },
      ];
      setStats(calculatedStats);

    } catch (e) {
      console.error("Failed to calculate stats", e);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[126px] w-full" />)}
      </div>
    )
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats && stats.map((stat, index) => (
        <Card key={index} className="shadow-md transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            {stat.change && (
              <p className={`text-sm mt-4 ${getChangeColor(stat.changeType)}`}>
                <ChangeIndicator type={stat.changeType} />
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
