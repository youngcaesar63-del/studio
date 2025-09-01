'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  { value: 'by-administration', label: 'تقرير حسب الإدارة' },
  { value: 'by-rank', label: 'تقرير حسب الرتبة' },
  { value: 'by-status', label: 'تقرير حسب الحالة' },
  { value: 'full-report', label: 'تقرير شامل' },
];

const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة', 'الكل'];
const ranks = ['رائد', 'عميد', 'عقيد', 'لواء', 'ملازم', 'ملازم أول', 'مقدم', 'نقيب', 'الكل'];
const statuses = ['إجازة', 'إلحاق', 'إرسالية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'مرضية', 'منقول', 'نقل و لم يبلغ', 'هروب', 'الكل'];

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار نوع التقرير أولاً.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'نجاح',
      description: `تم إنشاء التقرير بنجاح وجاهز للطباعة.`,
    });
    // Here you would typically handle the report generation logic
    console.log('Generating report:', { reportType, filterValue });
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

  const filterOptions = getFilterOptions();

  return (
    <div className="animate-in fade-in duration-500">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><FileText className="h-6 w-6" /> تقارير الأفراد</CardTitle>
                <CardDescription>اختر نوع التقرير وقم بتحديد الفلاتر المطلوبة لإنشاء التقرير.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">نوع التقرير</label>
                        <Select dir="rtl" onValueChange={(value) => { setReportType(value); setFilterValue(null); }}>
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
                            <Select dir="rtl" onValueChange={setFilterValue}>
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
                    <Button onClick={handleGenerateReport}>
                        <Printer className="ml-2 h-4 w-4" />
                        إنشاء و طباعة التقرير
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
