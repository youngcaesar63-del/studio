import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';

const personnelData = [
    { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', administration: 'رئاسة الهيئة', status: 'بالطابور' },
    { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة' },
    { id: 3, cardId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', administration: 'الإدارة العامة للاستخبارات', status: 'دورة تدريبية' },
    { id: 4, cardId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', administration: 'الإدارة العامة للمعلومات الاستراتيجية', status: 'عمليات' },
    { id: 5, cardId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', administration: 'رئاسة الهيئة', status: 'بالطابور' },
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
