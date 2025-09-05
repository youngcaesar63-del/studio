
'use client';

import { useEffect, useState }from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, BookOpen, ShieldAlert, Footprints, UserPlus, UserMinus, Briefcase, Plane, GraduationCap, Shield, LandPlot, Group, HardHat } from "lucide-react"
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

type Personnel = {
  rank: string;
  administration: string;
  status: string;
  specialization?: string;
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

type StatsDetailCardProps = {
  title: string;
  icon: React.ElementType;
  total: number;
  data: { name: string; value: number }[];
  loading: boolean;
};

const formatArabicNumber = (num: number) => {
    if (typeof num !== 'number') return '';
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
};

const StatsDetailCard = ({ title, icon: Icon, total, data, loading }: StatsDetailCardProps) => (
    <Card className="shadow-md flex flex-col">
        <CardHeader className='pb-4'>
            <CardTitle className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
            {loading ? <Skeleton className="h-full w-full" /> : 
            <>
              <p className="text-3xl font-bold text-primary mb-4">{formatArabicNumber(total)}</p>
              <Separator className='mb-4' />
              <div className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                {data.length > 0 ? data.map(item => (
                    <div key={item.name} className="flex justify-between items-center hover:bg-muted/50 p-1 rounded-md">
                       <span className="font-medium text-muted-foreground">{item.name}</span>
                       <span className="font-bold">{formatArabicNumber(item.value)}</span>
                    </div>
                )) : <p className="text-muted-foreground text-center">لا توجد بيانات</p>}
              </div>
            </>
            }
        </CardContent>
    </Card>
);


export default function StatisticsPage() {
    const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = getLocalStorage('personnelData', []);
        setPersonnelData(data);
        setLoading(false);
    }, []);

    const processChartData = (key: keyof Personnel) => {
        if (loading || personnelData.length === 0) return { total: 0, data: [] };
        
        const counts = personnelData.reduce((acc, p) => {
            const value = p[key] || 'غير محدد';
            // Ensure value is a string before using it as a key
            const stringValue = String(value);
            acc[stringValue] = (acc[stringValue] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});

        let data = Object.entries(counts).map(([name, value]) => ({ name, value }));

        if (key === 'rank') {
            data.sort((a,b) => (rankOrder[a.name] || 99) - (rankOrder[b.name] || 99));
        } else {
            data.sort((a, b) => b.value - a.value);
        }
        
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return { total, data };
    }
    
    const processArrayChartData = (key: keyof Personnel, nameKey: string) => {
        if (loading || personnelData.length === 0) return { total: 0, data: [] };

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
        
        let data = Object.entries(counts).map(([name, value]) => ({ name, value }));
        data.sort((a, b) => b.value - a.value);
        const total = data.reduce((sum, item) => sum + item.value, 0);


        return { total, data };
    };

    const rankStats = processChartData('rank');
    const adminStats = processChartData('administration');
    const statusStats = processChartData('status');
    const batchStats = processChartData('batch');
    const qualificationStats = processChartData('academicQualification');
    const specializationStats = processChartData('specialization');
    const serviceOpsStats = processArrayChartData('serviceOperations', 'areaName');
    const coursesStats = processArrayChartData('trainingCourses', 'courseName');
    const stormStats = processArrayChartData('decisiveStorm', 'name');
    const mechanismsStats = processArrayChartData('mechanisms', 'name');

    const statsCardsData = [
        { title: 'إجمالي الرتب', icon: Shield, ...rankStats },
        { title: 'إجمالي الإدارات', icon: Group, ...adminStats },
        { title: 'إجمالي الدفعات', icon: Users, ...batchStats },
        { title: 'الحالة', icon: Briefcase, ...statusStats },
        { title: 'المؤهلات الأكاديمية', icon: GraduationCap, ...qualificationStats },
        { title: 'التخصصات', icon: HardHat, ...specializationStats },
        { title: 'خدمة العمليات', icon: ShieldAlert, ...serviceOpsStats },
        { title: 'عاصفة الحزم', icon: LandPlot, ...stormStats },
        { title: 'الدورات التدريبية', icon: BookOpen, ...coursesStats },
        { title: 'الآليات', icon: Users2, ...mechanismsStats },
    ];


    return (
        <div className="animate-in fade-in duration-500 space-y-6 mb-12">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><BarChart2 className="h-6 w-6"/>إحصائيات شاملة</CardTitle>
                    <CardDescription>نظرة عامة مفصلة على بيانات الأفراد في النظام.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? [...Array(10)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />) :
                    statsCardsData.map((stat) => (
                        <StatsDetailCard
                            key={stat.title}
                            title={stat.title}
                            icon={stat.icon}
                            total={stat.total}
                            data={stat.data}
                            loading={loading}
                        />
                    ))
                }
            </div>
        </div>
    )
}
