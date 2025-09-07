'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Briefcase, Plane, ShieldAlert, BookOpen, UserMinus, Footprints, LandPlot } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { usePersonnel } from '@/contexts/PersonnelContext';

export function StatsCards() {
  const { personnel, loading } = usePersonnel();

  const formatArabicNumber = (num: number) => {
    if (isNaN(num)) return '٠';
    return new Intl.NumberFormat('ar-SA').format(num);
  }

  const stats = useMemo(() => {
    if (loading || !personnel) {
      return null;
    }

    const total = personnel.length;
    const inService = personnel.filter(p => p.status === 'بالطابور').length;
    const onLeave = personnel.filter(p => p.status === 'إجازة').length;
    const training = personnel.filter(p => p.status === 'دورة تدريبية').length;
    const operations = personnel.filter(p => p.status === 'عمليات').length;
    const sickLeave = personnel.filter(p => p.status === 'إرسالية مرضية').length;
    const attached = personnel.filter(p => p.status === 'إلحاق').length;
    const absent = personnel.filter(p => p.status === 'غياب').length;
    const escaped = personnel.filter(p => p.status === 'هروب').length;
    const decisiveStorm = personnel.filter(p => p.status === 'عاصفة الحزم').length;

    return [
      { title: 'إجمالي قوة الضباط', value: total, icon: Users, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300' },
      { title: 'بالطابور', value: inService, icon: Users, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300' },
      { title: 'عمليات', value: operations, icon: ShieldAlert, iconBg: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-300' },
      { title: 'عاصفة الحزم', value: decisiveStorm, icon: LandPlot, iconBg: 'bg-yellow-100 dark:bg-yellow-900', iconColor: 'text-yellow-600 dark:text-yellow-300' },
      { title: 'إجازة', value: onLeave, icon: Briefcase, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300' },
      { title: 'دورة تدريبية', value: training, icon: BookOpen, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300' },
      { title: 'إرسالية مرضية', value: sickLeave, icon: Plane, iconBg: 'bg-cyan-100 dark:bg-cyan-900', iconColor: 'text-cyan-600 dark:text-cyan-300' },
      { title: 'إلحاق', value: attached, icon: UserPlus, iconBg: 'bg-teal-100 dark:bg-teal-900', iconColor: 'text-teal-600 dark:text-teal-300' },
      { title: 'غياب', value: absent, icon: UserMinus, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300' },
      { title: 'هروب', value: escaped, icon: Footprints, iconBg: 'bg-orange-100 dark:bg-orange-900', iconColor: 'text-orange-600 dark:text-orange-300' },
    ];
  }, [personnel, loading]);

  if (loading || !stats) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-[126px] w-full" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-md transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-3 rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatArabicNumber(stat.value)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
