
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Settings, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  { value: 'by-administration', label: 'تقرير حسب الإدارة' },
  { value: 'by-rank', label: 'تقرير حسب الرتبة' },
  { value: 'by-status', label: 'تقرير حسب الحالة' },
  { value: 'full-report', label: 'تقرير شامل' },
];

export default function PrintPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    if (!selectedReport) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار تقرير للطباعة أولاً.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'جاري الطباعة...',
      description: `سيتم طباعة تقرير "${reportTypes.find(r => r.value === selectedReport)?.label}".`,
    });
    // This will trigger the browser's print dialog
    setTimeout(() => window.print(), 300);
  };
  
  const handlePageSettings = () => {
    toast({
        title: 'قيد التطوير',
        description: 'سيتم إضافة إعدادات الصفحة المتقدمة قريبًا.',
    })
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md no-print">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><Printer className="h-6 w-6"/>إعدادات الطباعة</CardTitle>
          <CardDescription>اختر التقرير المطلوب وقم بإعداد خيارات الطباعة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">التقرير المراد طباعته</label>
              <Select dir="rtl" onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر تقريراً" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={handlePageSettings}>
                    <Settings className="ml-2 h-4 w-4" />
                    إعدادات الصفحة
                </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handlePrint} disabled={!selectedReport}>
              <Printer className="ml-2 h-4 w-4" />
              طباعة
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md print:shadow-none print:border-none" id="print-area">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5"/>
            معاينة قبل الطباعة
          </CardTitle>
          <CardDescription>هذه معاينة للتقرير الذي سيتم طباعته.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            {selectedReport ? (
                <>
                    <h1 className="text-center text-lg font-bold mb-4">
                        {reportTypes.find(r => r.value === selectedReport)?.label}
                    </h1>
                    <p>هذا مجرد مثال للمحتوى. المحتوى الفعلي للتقرير سيتم توليده هنا بناء على نوع التقرير المختار...</p>
                    <table className="w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-right p-2 border">الاسم</th>
                                <th className="text-right p-2 border">الرتبة</th>
                                <th className="text-right p-2 border">الإدارة</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border">أحمد محمد علي</td>
                                <td className="p-2 border">نقيب</td>
                                <td className="p-2 border">رئاسة الهيئة</td>
                            </tr>
                            <tr>
                                <td className="p-2 border">محمد خالد سعيد</td>
                                <td className="p-2 border">رائد</td>
                                <td className="p-2 border">الإدارة العامة للأمن العسكري</td>
                            </tr>
                             <tr>
                                <td className="p-2 border">علي حسن محمد</td>
                                <td className="p-2 border">ملازم أول</td>
                                <td className="p-2 border">الإدارة العامة للاستخبارات</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="text-xs text-muted-foreground mt-4">
                       <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-SA')}</p>
                       <p>صفحة ١ من ١</p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16 border border-dashed rounded-lg">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>اختر تقريراً لعرض المعاينة</p>
                </div>
            )}
        </CardContent>
      </Card>

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
                padding: 0 !important;
                margin: 0 !important;
            }
        }
      `}</style>
    </div>
  );
}
