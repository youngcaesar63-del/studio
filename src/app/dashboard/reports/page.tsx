
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Personnel = {
  id: number;
  cardId: string;
  name: string;
  rank: string;
  specialization?: string;
  administration: string;
  status: string;
};

const reportTypes = [
  { value: 'by-administration', label: 'تقرير حسب الإدارة' },
  { value: 'by-rank', label: 'تقرير حسب الرتبة' },
  { value: 'by-status', label: 'تقرير حسب الحالة' },
  { value: 'full-report', label: 'تقرير شامل' },
];

const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة', 'الكل'];
const ranks = ['فريق أول', 'فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم', 'الكل'].sort((a,b) => {
    if (a === 'الكل') return 1;
    if (b === 'الكل') return -1;
    const rankOrder: { [key: string]: number } = { 'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10 };
    return (rankOrder[a] || 99) - (rankOrder[b] || 99);
});
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب', 'الكل'].sort((a,b) => a.localeCompare(b, 'ar'));

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
  const [reportData, setReportData] = useState<Personnel[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('personnelData');
      if (storedData) {
        setPersonnelData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      toast({ title: 'خطأ', description: 'فشل تحميل بيانات الأفراد.', variant: 'destructive' });
    }
  }, []);

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار نوع التقرير أولاً.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let filteredData = [...personnelData];

      if (reportType === 'by-administration' && filterValue && filterValue !== 'الكل') {
        filteredData = personnelData.filter(p => p.administration === filterValue);
      } else if (reportType === 'by-rank' && filterValue && filterValue !== 'الكل') {
        filteredData = personnelData.filter(p => p.rank === filterValue);
      } else if (reportType === 'by-status' && filterValue && filterValue !== 'الكل') {
        filteredData = personnelData.filter(p => p.status === filterValue);
      }

      setReportData(filteredData);
      setLoading(false);
      
      toast({
        title: 'نجاح',
        description: `تم إنشاء التقرير بنجاح وجاهز للطباعة.`,
      });
    }, 500); // Simulate generation time
  };
  
  const getFilterOptions = () => {
    switch(reportType) {
        case 'by-administration':
            return { placeholder: "اختر الإدارة", options: administrations };
        case 'by-rank':
            return { placeholder: "اختر الرتبة", options: ranks };
        case 'by-status':
            return { placeholder: "اختر الحالة", options: statuses };
        default:
            return null;
    }
  }

  const handlePrint = () => {
    window.print();
  }

  const filterOptions = getFilterOptions();
  const reportTitle = reportType ? reportTypes.find(rt => rt.value === reportType)?.label : '';
  const filterSubtitle = filterValue && filterValue !== 'الكل' ? `(تصفية: ${filterValue})` : '(كافة السجلات)';

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
        <Card className="shadow-md no-print">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><FileText className="h-6 w-6" /> تقارير الأفراد</CardTitle>
                <CardDescription>اختر نوع التقرير وقم بتحديد الفلاتر المطلوبة لإنشاء التقرير.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">نوع التقرير</label>
                        <Select dir="rtl" onValueChange={(value) => { setReportType(value); setFilterValue(null); setReportData(null); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر نوع التقرير" />
                            </SelectTrigger>
                            <SelectContent>
                                {reportTypes.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {filterOptions && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{filterOptions.placeholder.replace('اختر', 'تصفية حسب')}</label>
                            <Select dir="rtl" onValueChange={setFilterValue} value={filterValue || undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder={filterOptions.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleGenerateReport} disabled={loading}>
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileText className="ml-2 h-4 w-4" />}
                        {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {reportData && (
            <Card className="shadow-md" id="print-area">
                <CardHeader className="flex flex-row justify-between items-center no-print">
                    <div>
                        <CardTitle>{reportTitle}</CardTitle>
                        <CardDescription>{filterSubtitle}</CardDescription>
                    </div>
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="ml-2 h-4 w-4" />
                        طباعة
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none print:prose-base">
                        <h1 className="text-center text-lg font-bold mb-4 print:block hidden">
                            {reportTitle} <br /> <span className="text-sm font-normal">{filterSubtitle}</span>
                        </h1>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">م</TableHead>
                                    <TableHead>رقم البطاقة</TableHead>
                                    <TableHead>الرتبة / التخصص</TableHead>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>الإدارة</TableHead>
                                    <TableHead>الحالة</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportData.length > 0 ? reportData.map((person, index) => (
                                    <TableRow key={person.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{person.cardId}</TableCell>
                                        <TableCell>{`${person.rank}${person.specialization && person.specialization !== 'لا يوجد' ? ' ' + person.specialization : ''}`}</TableCell>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.administration}</TableCell>
                                        <TableCell>{person.status}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                            لا توجد بيانات تطابق هذه الفلاتر.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         <div className="text-xs text-muted-foreground mt-4 print:block hidden">
                           <p>تاريخ الطباعة: {new Date().toLocaleString('ar-SA')}</p>
                           <p>عدد السجلات: {reportData.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

      <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .no-print, .no-print * {
                display: none !important;
            }
            #print-area, #print-area * {
                visibility: visible;
            }
            #print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                border: none !important;
                box-shadow: none !important;
            }
            .print\\:block {
                display: block !important;
            }
            .print\\:prose-base {
                 font-size: 10pt !important;
            }
             h1 {
                font-size: 14pt !important;
            }
            th, td {
                padding: 4px 8px !important;
            }
        }
      `}</style>
    </div>
  );
}
