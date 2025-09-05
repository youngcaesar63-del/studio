
'use client';

import { useEffect, useState }from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, BookOpen, ShieldAlert, Footprints, UserPlus, Minus, Briefcase, Plane, GraduationCap, Shield, LandPlot, Group } from "lucide-react"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { Skeleton } from '@/components/ui/skeleton';

type Personnel = {
  rank: string;
  administration: string;
  status: string;
  academicQualification?: string;
  batch?: string;
  serviceOperations?: { areaName: string }[];
  trainingCourses?: { courseName: string }[];
  decisiveStorm?: { name: string }[];
  mechanisms?: { name: string }[];
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
            acc[value as string] = (acc[value as string] || 0) + 1;
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
    
    const processArrayChartData = (key: keyof Personnel, nameKey: string) => {
        if (loading || personnelData.length === 0) return [];
        const counts = personnelData.reduce((acc, p) => {
            const items = p[key] as any[];
            if (items && items.length > 0) {
                items.forEach(item => {
                    const value = item[nameKey] || 'غير محدد';
                    acc[value] = (acc[value] || 0) + 1;
                })
            }
            return acc;
        }, {} as {[key: string]: number});
        
        return Object.entries(counts).map(([name, value], index) => ({
            name,
            value,
            fill: chartColors[index % chartColors.length]
        }));
    };

    const rankData = processChartData('rank');
    const administrationData = processChartData('administration');
    const statusData = processChartData('status');
    const qualificationData = processChartData('academicQualification');
    const batchData = processChartData('batch');
    const serviceOpsData = processArrayChartData('serviceOperations', 'areaName');
    const coursesData = processArrayChartData('trainingCourses', 'courseName');
    const stormData = processArrayChartData('decisiveStorm', 'name');
    const mechanismsData = processArrayChartData('mechanisms', 'name');

    const chartConfig = {
        value: { label: "العدد" },
    };

    const statsCards = getStatsCardsData();

    const GenericBarChart = ({ data, title, icon: Icon }: { data: any[], title: string, icon: React.ElementType }) => (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5" />{title}</CardTitle>
            </CardHeader>
            <CardContent>
               {loading ? <Skeleton className="h-[300px] w-full" /> : 
               <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} angle={-45} textAnchor="end" height={80} interval={0} />
                            <YAxis tickFormatter={arabicNumberFormatter} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <ChartTooltip formatter={arabicNumberFormatter} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="value" radius={4}>
                                 {data.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>}
            </CardContent>
        </Card>
    );

    return (
        <div className="animate-in fade-in duration-500 space-y-6 mb-12">
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
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />توزيع الأفراد حسب الرتبة</CardTitle>
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
                        <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />توزيع الأفراد حسب الحالة</CardTitle>
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
                                     <ChartLegend content={<ChartLegendContent nameKey="name" className="flex-wrap" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>}
                    </CardContent>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenericBarChart data={administrationData} title="توزيع الأفراد على الإدارات" icon={Group} />
                <GenericBarChart data={qualificationData} title="توزيع الأفراد حسب المؤهل الأكاديمي" icon={GraduationCap} />
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenericBarChart data={batchData} title="توزيع الأفراد حسب الدفعة" icon={Users} />
                <GenericBarChart data={serviceOpsData} title="المشاركين في خدمة العمليات" icon={ShieldAlert} />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenericBarChart data={coursesData} title="المشاركين في الدورات التدريبية" icon={BookOpen} />
                <GenericBarChart data={stormData} title="المشاركين في عاصفة الحزم" icon={Shield} />
             </div>

             <div className="grid grid-cols-1 gap-6">
                <GenericBarChart data={mechanismsData} title="المشاركين في الآليات" icon={LandPlot} />
             </div>

        </div>
    )
}
