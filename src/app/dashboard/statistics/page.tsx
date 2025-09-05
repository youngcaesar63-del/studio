
'use client';

import { useEffect, useState }from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, Calendar, TrendingUp, TrendingDown, MapPin, GraduationCap, ShieldAlert, BookOpen, Plane, UserMinus, Footprints, Briefcase, UserPlus, Minus } from "lucide-react"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart';
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { Skeleton } from '@/components/ui/skeleton';
import { ranks } from '@/lib/constants';

type Personnel = {
  rank: string;
  administration: string;
  status: string;
  academicQualification?: string;
};

const rankOrder: { [key: string]: number } = {
  'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10,
};

const chartColors = [
    'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)',
    'hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(22, 90%, 50%)', 'hsl(280, 85%, 60%)', 'hsl(340, 90%, 65%)'
];

export default function StatisticsPage() {
    const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getLocalStorage('personnelData', []);
        setPersonnelData(data);
        setLoading(false);
    }, []);

    const formatArabicNumber = (num: number) => {
        return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
    }
    
    const arabicNumberFormatter = (value: number) => new Intl.NumberFormat('ar-SA-u-nu-arab').format(value);

    const getStatsCardsData = () => {
        if (loading) return [];
        const total = personnelData.length;
        const inService = personnelData.filter(p => p.status === 'بالطابور').length;
        const onLeave = personnelData.filter(p => p.status === 'إجازة').length;
        const training = personnelData.filter(p => p.status === 'دورة تدريبية').length;
        const operations = personnelData.filter(p => p.status === 'عمليات').length;
        const sickLeave = personnelData.filter(p => p.status === 'إرسالية مرضية').length;
        const attached = personnelData.filter(p => p.status === 'إلحاق').length;
        const absent = personnelData.filter(p => p.status === 'غياب').length;
        const escaped = personnelData.filter(p => p.status === 'هروب').length;

        return [
          { title: 'إجمالي الأفراد', value: total, icon: Users, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300' },
          { title: 'بالطابور', value: inService, icon: Users, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300' },
          { title: 'عمليات', value: operations, icon: ShieldAlert, iconBg: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-300' },
          { title: 'إجازة', value: onLeave, icon: Briefcase, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300' },
          { title: 'دورة تدريبية', value: training, icon: BookOpen, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300' },
          { title: 'إرسالية مرضية', value: sickLeave, icon: Plane, iconBg: 'bg-cyan-100 dark:bg-cyan-900', iconColor: 'text-cyan-600 dark:text-cyan-300' },
          { title: 'إلحاق', value: attached, icon: UserPlus, iconBg: 'bg-teal-100 dark:bg-teal-900', iconColor: 'text-teal-600 dark:text-teal-300' },
          { title: 'غياب', value: absent, icon: UserMinus, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300' },
          { title: 'هروب', value: escaped, icon: Footprints, iconBg: 'bg-orange-100 dark:bg-orange-900', iconColor: 'text-orange-600 dark:text-orange-300' },
        ];
    }
    
    const processChartData = (key: keyof Personnel) => {
        if (loading || personnelData.length === 0) return [];
        const counts = personnelData.reduce((acc, p) => {
            const value = p[key] || 'غير محدد';
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});

        let data = Object.entries(counts).map(([name, value], index) => ({
            name,
            value,
            fill: chartColors[index % chartColors.length]
        }));

        if (key === 'rank') {
            data.sort((a,b) => (rankOrder[a.name] || 99) - (rankOrder[b.name] || 99));
        }

        return data;
    }

    const rankData = processChartData('rank');
    const administrationData = processChartData('administration');
    const statusData = processChartData('status');
    const qualificationData = processChartData('academicQualification');

    const chartConfig = {
        value: { label: "العدد" },
        ...rankData.reduce((acc, item) => ({...acc, [item.name]: {label: item.name, color: item.fill}}), {}),
        ...administrationData.reduce((acc, item) => ({...acc, [item.name]: {label: item.name, color: item.fill}}), {}),
        ...statusData.reduce((acc, item) => ({...acc, [item.name]: {label: item.name, color: item.fill}}), {}),
        ...qualificationData.reduce((acc, item) => ({...acc, [item.name]: {label: item.name, color: item.fill}}), {}),
    };
    
    const statsCards = getStatsCardsData();

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><BarChart2 className="h-6 w-6"/>إحصائيات شاملة</CardTitle>
                    <CardDescription>نظرة عامة على بيانات الأفراد في النظام.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {loading ? [...Array(9)].map((_, i) => <Skeleton key={i} className="h-[108px] w-full" />) :
                 statsCards.map((stat, index) => (
                     <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatArabicNumber(stat.value)}</div>
                        </CardContent>
                    </Card>
                 ))
                 }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد حسب الرتبة</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-[300px] w-full" /> : 
                       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={rankData} layout="vertical" margin={{ right: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                                    <ChartTooltip formatter={arabicNumberFormatter} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" radius={4}>
                                        {rankData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>}
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد حسب الحالة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-[300px] w-full" /> : 
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                           <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <ChartTooltip formatter={arabicNumberFormatter} content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                        return (percent > 0.05) ? (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                                            {formatArabicNumber(Math.round(percent * 100))}%
                                        </text>
                                        ) : null;
                                    }}>
                                        {statusData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                     <Legend content={<ChartLegendContent nameKey="name" className="flex-wrap" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>}
                    </CardContent>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد على الإدارات</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-[300px] w-full" /> : 
                       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={administrationData}>
                                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                                    <YAxis tickFormatter={arabicNumberFormatter} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <ChartTooltip formatter={arabicNumberFormatter} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" radius={4}>
                                         {administrationData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>}
                    </CardContent>
                </Card>
                 <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد حسب المؤهل الأكاديمي</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-[300px] w-full" /> : 
                       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={qualificationData}>
                                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                                    <YAxis tickFormatter={arabicNumberFormatter} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <ChartTooltip formatter={arabicNumberFormatter} content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="value" radius={4}>
                                        {qualificationData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>}
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    