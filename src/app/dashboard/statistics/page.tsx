
'use client';

import { useEffect, useState }from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, BookOpen, ShieldAlert, Footprints, UserPlus, UserMinus, Briefcase, Plane, GraduationCap, Shield, LandPlot, Group, HardHat, Users2 } from "lucide-react"
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Personnel = {
  id: number;
  name: string;
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
  onItemClick: (itemName: string) => void;
};

const formatArabicNumber = (num: number) => {
    if (typeof num !== 'number') return '';
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
};

const StatsDetailCard = ({ title, icon: Icon, total, data, loading, onItemClick }: StatsDetailCardProps) => (
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
                    <div 
                        key={item.name} 
                        className="flex justify-between items-center hover:bg-muted/50 p-1 rounded-md cursor-pointer"
                        onClick={() => onItemClick(item.name)}
                    >
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
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogData, setDialogData] = useState<Personnel[]>([]);


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
        const total = personnelData.filter(p => p[key] && (p[key] as any[]).length > 0).length;


        return { total, data };
    };

    const handleStatItemClick = (category: keyof Personnel, itemName: string, titlePrefix: string) => {
        const filteredData = personnelData.filter(p => {
            if (Array.isArray(p[category])) {
                const nameKey = {
                    'serviceOperations': 'areaName',
                    'trainingCourses': 'courseName',
                    'decisiveStorm': 'name',
                    'mechanisms': 'name'
                }[category as string];

                return (p[category] as any[])?.some(item => item[nameKey as string] === itemName);
            }
            return p[category] === itemName;
        });

        setDialogTitle(`${titlePrefix}: ${itemName}`);
        setDialogData(filteredData);
        setDialogOpen(true);
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
        { title: 'إجمالي الرتب', icon: Shield, ...rankStats, category: 'rank', titlePrefix: 'الأفراد برتبة' },
        { title: 'إجمالي الإدارات', icon: Group, ...adminStats, category: 'administration', titlePrefix: 'الأفراد في إدارة' },
        { title: 'إجمالي الدفعات', icon: Users, ...batchStats, category: 'batch', titlePrefix: 'الأفراد من دفعة' },
        { title: 'الحالة', icon: Briefcase, ...statusStats, category: 'status', titlePrefix: 'الأفراد بحالة' },
        { title: 'المؤهلات الأكاديمية', icon: GraduationCap, ...qualificationStats, category: 'academicQualification', titlePrefix: 'الأفراد الحاصلون على' },
        { title: 'التخصصات', icon: HardHat, ...specializationStats, category: 'specialization', titlePrefix: 'الأفراد بتخصص' },
        { title: 'خدمة العمليات', icon: ShieldAlert, ...serviceOpsStats, category: 'serviceOperations', titlePrefix: 'الأفراد المشاركون في' },
        { title: 'عاصفة الحزم', icon: LandPlot, ...stormStats, category: 'decisiveStorm', titlePrefix: 'الأفراد المشاركون في' },
        { title: 'الدورات التدريبية', icon: BookOpen, ...coursesStats, category: 'trainingCourses', titlePrefix: 'الأفراد الحاصلون على دورة' },
        { title: 'الآليات', icon: Users2, ...mechanismsStats, category: 'mechanisms', titlePrefix: 'الأفراد المشاركون في آلية' },
    ];


    return (
        <div className="animate-in fade-in duration-500 space-y-6 mb-12">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><BarChart2 className="h-6 w-6"/>إحصائيات شاملة</CardTitle>
                    <CardDescription>نظرة عامة مفصلة على بيانات الأفراد في النظام. انقر على أي عنصر لعرض التفاصيل.</CardDescription>
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
                            onItemClick={(itemName) => handleStatItemClick(stat.category as keyof Personnel, itemName, stat.titlePrefix)}
                        />
                    ))
                }
            </div>

             <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            قائمة بجميع الأفراد الذين يطابقون هذا التصنيف.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px] text-center">م</TableHead>
                            <TableHead className="text-center">الاسم</TableHead>
                            <TableHead className="text-center">الرتبة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dialogData.length > 0 ? (
                            dialogData.map((person, index) => (
                              <TableRow key={person.id}>
                                <TableCell className="text-center">{formatArabicNumber(index + 1)}</TableCell>
                                <TableCell className="text-center">{person.name}</TableCell>
                                <TableCell className="text-center">{person.rank}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                لا توجد بيانات.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
