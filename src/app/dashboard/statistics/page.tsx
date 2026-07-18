'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, BookOpen, ShieldAlert, Briefcase, GraduationCap, Shield, LandPlot, Users2, HardHat } from "lucide-react"
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Personnel } from '@/services/personnel.service';
import { usePersonnel } from '@/contexts/PersonnelContext';

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

const formatArabicNumber = (num: number | string) => {
    if (num === undefined || num === null) return '';
    const str = String(num);
    return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
};

// Pure helper: aggregate counts of a scalar field across all personnel
const processChartData = (personnelData: Personnel[], key: keyof Personnel) => {
    if (personnelData.length === 0) return { total: 0, data: [] as { name: string; value: number }[] };

    const counts = personnelData.reduce((acc, p) => {
        const value = p[key] || 'غير محدد';
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

// Pure helper: aggregate counts of items inside array fields (e.g. trainingCourses)
const processArrayChartData = (personnelData: Personnel[], key: keyof Personnel, nameKey: string) => {
    if (personnelData.length === 0) return { total: 0, data: [] as { name: string; value: number }[] };

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
    const total = data.length; // Total unique items

    return { total, data };
}

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
    const { personnel: personnelData, loading } = usePersonnel();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogData, setDialogData] = useState<Personnel[]>([]);

    const statsCardsData = useMemo(() => {
        if (loading) {
            return null;
        }

        const rankStats = processChartData(personnelData, 'rank');
        const adminStats = processChartData(personnelData, 'administration');
        const statusStats = processChartData(personnelData, 'status');
        const batchStats = processChartData(personnelData, 'batch');
        const qualificationStats = processChartData(personnelData, 'academicQualification');
        const specializationStats = processChartData(personnelData, 'specialization');
        const serviceOpsStats = processArrayChartData(personnelData, 'serviceOperations', 'areaName');
        const coursesStats = processArrayChartData(personnelData, 'trainingCourses', 'courseName');
        const stormStats = processArrayChartData(personnelData, 'decisiveStorm', 'name');
        const mechanismsStats = processArrayChartData(personnelData, 'mechanisms', 'name');

        return [
            { title: 'إحصائيات الرتب', icon: Shield, total: rankStats.total, data: rankStats.data, category: 'rank' as const, titlePrefix: 'الضباط برتبة' },
            { title: 'إحصائيات الإدارات', icon: Users, total: adminStats.total, data: adminStats.data, category: 'administration' as const, titlePrefix: 'الضباط في إدارة' },
            { title: 'إحصائيات الدفعات', icon: Users, total: batchStats.total, data: batchStats.data, category: 'batch' as const, titlePrefix: 'الضباط من دفعة' },
            { title: 'إحصائيات الحالة', icon: Briefcase, total: statusStats.total, data: statusStats.data, category: 'status' as const, titlePrefix: 'الضباط بحالة' },
            { title: 'المؤهلات الأكاديمية', icon: GraduationCap, total: qualificationStats.total, data: qualificationStats.data, category: 'academicQualification' as const, titlePrefix: 'الضباط الحاصلون على' },
            { title: 'التخصصات', icon: HardHat, total: specializationStats.total, data: specializationStats.data, category: 'specialization' as const, titlePrefix: 'الضباط بتخصص' },
            { title: 'خدمة العمليات', icon: ShieldAlert, total: serviceOpsStats.total, data: serviceOpsStats.data, category: 'serviceOperations' as const, titlePrefix: 'الضباط المشاركون في' },
            { title: 'عاصفة الحزم', icon: LandPlot, total: stormStats.total, data: stormStats.data, category: 'decisiveStorm' as const, titlePrefix: 'الضباط المشاركون في' },
            { title: 'الدورات التدريبية', icon: BookOpen, total: coursesStats.total, data: coursesStats.data, category: 'trainingCourses' as const, titlePrefix: 'الضباط الحاصلون على دورة' },
            { title: 'الآليات', icon: Users2, total: mechanismsStats.total, data: mechanismsStats.data, category: 'mechanisms' as const, titlePrefix: 'الضباط المشاركون في آلية' },
        ];
    }, [personnelData, loading]);

    const handleStatItemClick = (category: keyof Personnel, itemName: string, titlePrefix: string) => {
        const filteredData = personnelData.filter(p => {
             const nameKeyMap: { [key: string]: string } = {
                serviceOperations: 'areaName',
                trainingCourses: 'courseName',
                decisiveStorm: 'name',
                mechanisms: 'name'
            };

            const keyString = category as string;

            if (Array.isArray(p[category])) {
                 const nameKey = nameKeyMap[keyString];
                 if(!nameKey) return false;
                return (p[category] as any[])?.some(item => item[nameKey] === itemName);
            }
            const value = p[category] || 'غير محدد';
            return String(value) === itemName;
        });

        setDialogTitle(`${titlePrefix}: ${itemName}`);
        setDialogData(filteredData.sort((a,b) => (rankOrder[a.rank] || 99) - (rankOrder[b.rank] || 99)));
        setDialogOpen(true);
    };


    return (
        <div className="animate-in fade-in duration-500 space-y-6 mb-12">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><BarChart2 className="h-6 w-6"/>إحصائيات شاملة</CardTitle>
                    <CardDescription>نظرة عامة مفصلة على بيانات الضباط في النظام. انقر على أي عنصر لعرض التفاصيل.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading || !statsCardsData ? [...Array(10)].map((_, i) => <Skeleton key={i} className="h-80 w-full" />) :
                    statsCardsData.map((stat) => (
                        <StatsDetailCard
                            key={stat.title}
                            title={stat.title}
                            icon={stat.icon}
                            total={stat.total}
                            data={stat.data}
                            loading={loading}
                            onItemClick={(itemName) => handleStatItemClick(stat.category, itemName, stat.titlePrefix)}
                        />
                    ))
                }
            </div>

             <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            قائمة بجميع الضباط الذين يطابقون هذا التصنيف.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px] text-center">م</TableHead>
                            <TableHead className="text-center border-r">رقم البطاقة</TableHead>
                            <TableHead className="text-center border-r">الاسم</TableHead>
                            <TableHead className="text-center border-r">الرتبة</TableHead>
                             <TableHead className="text-center border-r">الإدارة</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dialogData.length > 0 ? (
                            dialogData.map((person, index) => (
                              <TableRow key={person.id}>
                                <TableCell className="text-center">{formatArabicNumber(index + 1)}</TableCell>
                                <TableCell className="text-center border-r">{formatArabicNumber(person.cardId)}</TableCell>
                                <TableCell className="text-center border-r">{person.name}</TableCell>
                                <TableCell className="text-center border-r">{person.rank}</TableCell>
                                <TableCell className="text-center border-r">{person.administration}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
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
