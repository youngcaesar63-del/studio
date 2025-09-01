import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';

const personnelData = [
    { id: 1, nationalId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', unit: 'الوحدة الأولى', status: 'بالطابور' },
    { id: 2, nationalId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', unit: 'الوحدة الثانية', status: 'إجازة' },
    { id: 3, nationalId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', unit: 'الوحدة الثالثة', status: 'دورة تدريبية' },
    { id: 4, nationalId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', unit: 'الوحدة الرابعة', status: 'عمليات' },
    { id: 5, nationalId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', unit: 'الوحدة الأولى', status: 'بالطابور' },
];

export default function PersonnelListPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">كشف الأفراد</CardTitle>
          <CardDescription>عرض وإدارة جميع الأفراد المسجلين في النظام.</CardDescription>
        </CardHeader>
        <CardContent>
          <PersonnelTable data={personnelData} />
        </CardContent>
      </Card>
    </div>
  );
}
