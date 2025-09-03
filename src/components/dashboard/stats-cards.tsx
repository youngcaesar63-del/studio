
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Briefcase, TrendingUp, Minus, ShieldAlert, BookOpen, Plane, UserMinus, UserX, Footprints } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getLocalStorage } from '@/lib/localStorage-helpers';

type Personnel = {
  id: number;
  status: string;
};

const ChangeIndicator = ({ type }: { type: 'increase' | 'decrease' | 'increase_bad' | 'decrease_good' | 'neutral' }) => {
    if (type === 'increase' || type === 'increase_bad') {
        return <TrendingUp className="inline h-4 w-4 ml-1" />;
    }
    if (type === 'decrease' || type === 'decrease_good') {
        return <TrendingUp className="inline h-4 w-4 ml-1 rotate-180" />;
    }
    if (type === 'neutral') {
        return <Minus className="inline h-4 w-4 ml-1" />;
    }
    return null;
};

const getChangeColor = (type: string) => {
  switch (type) {
    case 'increase': return 'text-green-600 dark:text-green-400';
    case 'decrease_good': return 'text-green-600 dark:text-green-400';
    case 'increase_bad': return 'text-red-600 dark:text-red-400';
    case 'decrease': return 'text-red-600 dark:text-red-400';
    default: return 'text-muted-foreground';
  }
}

export function StatsCards() {
  const [stats, setStats] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const formatArabicNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
  }

  const calculateStats = useCallback(() => {
    setLoading(true);
    const personnelList: Personnel[] = getLocalStorage('personnelData', []);

    const total = personnelList.length;
    const inService = personnelList.filter(p => p.status === 'بالطابور').length;
    const onLeave = personnelList.filter(p => p.status === 'إجازة').length;
    const training = personnelList.filter(p => p.status === 'دورة تدريبية').length;
    const operations = personnelList.filter(p => p.status === 'عمليات').length;
    const sickLeave = personnelList.filter(p => p.status === 'إرسالية مرضية').length;
    const attached = personnelList.filter(p => p.status === 'إلحاق').length;
    const absent = personnelList.filter(p => p.status === 'غياب').length;
    const escaped = personnelList.filter(p => p.status === 'هروب').length;

    const calculatedStats = [
      { title: 'إجمالي الأفراد', value: total, change: `+${Math.floor(Math.random() * 5)} هذا الشهر`, changeType: 'increase', icon: Users, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300' },
      { title: 'بالطابور', value: inService, change: `+${Math.floor(Math.random() * 10)}`, changeType: 'increase', icon: Users, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300' },
      { title: 'عمليات', value: operations, change: `-${Math.floor(Math.random() * 3)}`, changeType: 'decrease', icon: ShieldAlert, iconBg: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-300' },
      { title: 'إجازة', value: onLeave, change: `+${Math.floor(Math.random() * 2)}`, changeType: 'increase_bad', icon: Briefcase, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300' },
      { title: 'دورة تدريبية', value: training, change: `+${Math.floor(Math.random() * 4)}`, changeType: 'increase', icon: BookOpen, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300' },
      { title: 'إرسالية مرضية', value: sickLeave, change: `${Math.floor(Math.random() * 2)}`, changeType: 'neutral', icon: Plane, iconBg: 'bg-cyan-100 dark:bg-cyan-900', iconColor: 'text-cyan-600 dark:text-cyan-300' },
      { title: 'إلحاق', value: attached, change: `-${Math.floor(Math.random() * 2)}`, changeType: 'decrease', icon: UserPlus, iconBg: 'bg-teal-100 dark:bg-teal-900', iconColor: 'text-teal-600 dark:text-teal-300' },
      { title: 'غياب', value: absent, change: `-${Math.floor(Math.random() * 1)}`, changeType: 'decrease_good', icon: UserMinus, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300' },
      { title: 'هروب', value: escaped, change: `+${Math.floor(Math.random() * 1)}`, changeType: 'increase_bad', icon: Footprints, iconBg: 'bg-orange-100 dark:bg-orange-900', iconColor: 'text-orange-600 dark:text-orange-300' },
    ];
    setStats(calculatedStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    calculateStats();
    
    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'personnelData') {
            calculateStats();
        }
    };

    window.addEventListener('storage-update', handleStorageChange);

    return () => {
        window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [calculateStats]);

  if (loading || !stats) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-[126px] w-full" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-md transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatArabicNumber(stat.value)}</div>
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
