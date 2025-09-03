
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


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

const rankOrder: { [key: string]: number } = {
  'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10,
};

const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة', 'الكل'];
const ranks = ['فريق أول', 'فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم', 'الكل'].sort((a,b) => {
    if (a === 'الكل') return 1;
    if (b === 'الكل') return -1;
    return (rankOrder[a] || 99) - (rankOrder[b] || 99);
});
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب', 'الكل'].sort((a,b) => a.localeCompare(b, 'ar'));
const confidentialityLevels = ['سري', 'سري للغاية', 'سري وشخصي', 'محظور'];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
  const [reportData, setReportData] = useState<Personnel[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
  const [confidentiality, setConfidentiality] = useState(confidentialityLevels[0]);
  const [reportTitleInput, setReportTitleInput] = useState('');

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
  }, [toast]);

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
      
      const sortedData = filteredData.sort((a: any, b: any) => {
        const rankA = rankOrder[a.rank] || 99;
        const rankB = rankOrder[b.rank] || 99;
        return rankA - rankB;
      });

      setReportData(sortedData);
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
    const printArea = document.getElementById('print-area');
    if (!printArea) {
      toast({ title: 'خطأ', description: 'لم يتم العثور على منطقة الطباعة.', variant: 'destructive' });
      return;
    }

    const printContent = printArea.innerHTML;
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    
    if (printWindow) {
      printWindow.document.write('<html><head><title>طباعة التقرير</title>');
      
      printWindow.document.write('<style>');
      printWindow.document.write(`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        body { 
            font-family: 'Tajawal', sans-serif; 
            direction: rtl;
            margin: 20px;
        }
        .print-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            padding-top: 1cm;
        }
        .print-header h1 {
            font-size: 1.5rem;
            font-weight: bold;
        }
        .print-header .confidentiality, .print-header .title {
            text-align: center;
            width: 100%;
            border-bottom: 1px solid black;
            padding-bottom: 5px;
            margin-top: 10px;
            font-weight: bold;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 12px;
            border: 1px solid #000;
        }
        th, td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: center; 
        }
        th { 
            background-color: #f2f2f2; 
        }
        .print-footer {
            margin-top: 20px;
            text-align: center;
            font-size: 0.8rem;
            color: #777;
        }
      `);
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      
      const headerContent = `
        <div class="print-header">
            <h1>بسم الله الرحمن الرحيم</h1>
            <div class="confidentiality">${confidentiality}</div>
            ${reportTitleInput ? `<div class="title">${reportTitleInput}</div>` : ''}
        </div>
      `;

      printWindow.document.write(headerContent);
      printWindow.document.write(printContent);
      printWindow.document.write('</body></html>');
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
          printWindow.print();
          printWindow.close();
      }, 500);

      setPrintDialogOpen(false);
    } else {
        toast({ title: 'خطأ', description: 'لم يتمكن المتصفح من فتح نافذة الطباعة.', variant: 'destructive' });
    }
  }

  const filterOptions = getFilterOptions();
  const reportTitle = reportType ? reportTypes.find(rt => rt.value === reportType)?.label : '';
  const filterSubtitle = filterValue && filterValue !== 'الكل' ? `(تصفية: ${filterValue})` : '(كافة السجلات)';

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Printer className="h-6 w-6"/> الطباعة والتقارير</CardTitle>
                <CardDescription>اختر نوع التقرير وقم بتحديد الفلاتر المطلوبة لإنشاء وطباعة التقرير.</CardDescription>
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
                    <Button onClick={handleGenerateReport} disabled={loading || !reportType}>
                        {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <FileText className="ml-2 h-4 w-4" />}
                        {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {reportData && (
            <Card id="report-card">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>{reportTitle}</CardTitle>
                        <CardDescription>{filterSubtitle}</CardDescription>
                    </div>
                     <Dialog open={isPrintDialogOpen} onOpenChange={setPrintDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Printer className="ml-2 h-4 w-4" />
                                طباعة
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>خيارات الطباعة</DialogTitle>
                                <DialogDescription>
                                    اختر الخيارات التالية لتضمينها في رأس التقرير المطبوع.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="confidentiality" className="text-right">
                                        درجة السرية
                                    </Label>
                                    <Select dir="rtl" value={confidentiality} onValueChange={setConfidentiality}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="اختر درجة السرية" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {confidentialityLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="report-title" className="text-right">
                                        العنوان
                                    </Label>
                                    <Input
                                        id="report-title"
                                        value={reportTitleInput}
                                        onChange={(e) => setReportTitleInput(e.target.value)}
                                        className="col-span-3"
                                        placeholder="أدخل عنوان التقرير (اختياري)"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handlePrint}>
                                    <Printer className="ml-2 h-4 w-4" />
                                    تأكيد الطباعة
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent id="print-area">
                    <div className="prose prose-sm dark:prose-invert max-w-none print:prose-base">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">م</TableHead>
                                        <TableHead className="text-center border-r">رقم البطاقة</TableHead>
                                        <TableHead className="text-center border-r">الرتبة</TableHead>
                                        <TableHead className="text-center border-r">الاسم</TableHead>
                                        <TableHead className="text-center border-r">الإدارة</TableHead>
                                        <TableHead className="text-center border-r">الحالة</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.length > 0 ? reportData.map((person, index) => {
                                        const displayRank = `${person.rank}${person.specialization && person.specialization !== 'لا يوجد' ? ' ' + person.specialization : ''}`;
                                        return (
                                        <TableRow key={person.id}>
                                            <TableCell className="text-center">{index + 1}</TableCell>
                                            <TableCell className="text-center border-r">{person.cardId}</TableCell>
                                            <TableCell className="text-center border-r">{displayRank}</TableCell>
                                            <TableCell className="text-center border-r">{person.name}</TableCell>
                                            <TableCell className="text-center border-r">{person.administration}</TableCell>
                                            <TableCell className="text-center border-r">{person.status}</TableCell>
                                        </TableRow>
                                    )}) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                                                لا توجد بيانات تطابق هذه الفلاتر.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                         <div className="print-footer hidden">
                           <p>تاريخ الطباعة: {new Date().toLocaleString('ar-SA')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

