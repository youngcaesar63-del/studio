
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';


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
  const [includeAdministration, setIncludeAdministration] = useState(false);


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
  
   const formatArabicNumber = (numStr: number | string) => {
    if (numStr === undefined || numStr === null) return '';
    const str = String(numStr);
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(Number(str.replace(/,/g, ''))).replace(/٬/g, '');
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const administrationHeaderTitle = includeAdministration ? `<th>الإدارة</th>` : '';
      const administrationHeaderLetter = includeAdministration ? `<th>(هـ)</th>` : '';
      const notesHeaderLetter = includeAdministration ? `<th>(و)</th>` : `<th>(هـ)</th>` ;


      const headerRow1 = `
        <th>م</th>
        <th>رقم البطاقة</th>
        <th>الرتبة</th>
        <th>الاسم</th>
        ${administrationHeaderTitle}
        <th>ملحوظات</th>
      `;

      const headerRow2 = `
        <th>(أ)</th>
        <th>(ب)</th>
        <th>(جـ)</th>
        <th>(د)</th>
        ${administrationHeaderLetter}
        ${notesHeaderLetter}
      `;
      
      const captionContent = `
        <div class="print-header">
            <div class="bismillah">بسم الله الرحمن الرحيم</div>
            <div class="confidentiality">${confidentiality}</div>
            ${reportTitleInput ? `<div class="title">${reportTitleInput}</div>` : ''}
        </div>
      `;

      let tableContent = `
        <table class="report-table">
            <caption class="report-caption">${captionContent}</caption>
          <thead>
            <tr class="header-row-titles">${headerRow1}</tr>
            <tr class="header-row-letters">${headerRow2}</tr>
          </thead>
          <tbody>
      `;
      
      if (reportData) {
        reportData.forEach((person, index) => {
            const displayRank = `${person.rank}${person.specialization && person.specialization !== 'لا يوجد' ? ' ' + person.specialization : ''}`;
            const arabicIndex = formatArabicNumber(index + 1);
            const adminCell = includeAdministration ? `<td>${person.administration}</td>` : '';
            tableContent += `
              <tr>
                <td>${arabicIndex}</td>
                <td>${formatArabicNumber(person.cardId)}</td>
                <td>${displayRank}</td>
                <td>${person.name}</td>
                ${adminCell}
                <td></td>
              </tr>
            `;
        });
      }
      
      tableContent += '</tbody></table>';

      const footerContent = `
        <div class="print-footer">
            ${confidentiality}
        </div>
      `;

      printWindow.document.write('<html><head><title></title>');
      
      const pageOrientation = includeAdministration ? 'landscape' : 'portrait';

      printWindow.document.write('<style>');
      printWindow.document.write(`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;700;900&family=Noto+Kufi+Arabic:wght@700&family=Tajawal:wght@400;500;700&display=swap');
        @page {
            size: A4 ${pageOrientation};
            margin: 1cm;
        }
        body { 
            font-family: 'Tajawal', sans-serif; 
            direction: rtl;
        }
        .report-table {
          width: 100%; 
          border-collapse: collapse; 
          font-size: 12px; 
          border: 2px solid #000;
        }
        .report-caption {
            caption-side: top;
            text-align: center;
            padding: 0;
            margin: 0;
        }
        .print-header {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .bismillah {
            font-family: 'Amiri', serif;
            font-size: 16px;
            font-weight: bold;
        }
        .confidentiality {
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 1px;
        }
        .title {
            font-family: 'Cairo', sans-serif;
            font-weight: 900;
            font-size: 16px;
            margin-top: 5px;
        }
        .report-table th, .report-table td {
          border: 1px solid #000; 
          padding: 8px;
          text-align: center;
          border-left: 2px solid #000;
          border-right: 2px solid #000;
        }
         .report-table th:first-child, .report-table td:first-child {
            border-right: 2px solid #000;
         }
         .report-table th:last-child, .report-table td:last-child {
            border-left: 2px solid #000;
         }
        .report-table thead tr {
          background-color: #e0e0e0 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .report-table tbody tr td:first-child {
            background-color: #e0e0e0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .print-footer {
            font-family: 'Arial', sans-serif;
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 1px;
            width: 100%;
            margin-top: 1rem;
        }
      `);
      printWindow.document.write('</style>');
      printWindow.document.write('</head><body>');
      
      printWindow.document.write(tableContent);
      printWindow.document.write(footerContent);

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
                <CardHeader className="flex flex-row justify-between items-center no-print">
                    <div>
                        <CardTitle>معاينة التقرير</CardTitle>
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
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox id="include-administration" checked={includeAdministration} onCheckedChange={(checked) => setIncludeAdministration(!!checked)} />
                                    <Label htmlFor="include-administration">إضافة عمود الإدارة</Label>
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
                                            <TableCell className="text-center">{formatArabicNumber(index + 1)}</TableCell>
                                            <TableCell className="text-center border-r">{formatArabicNumber(person.cardId)}</TableCell>
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
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );

    

    