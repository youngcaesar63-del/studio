
import { AddPersonnelForm } from '@/components/dashboard/add-personnel-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddPersonnelPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">إضافة فرد جديد</CardTitle>
          <CardDescription>أدخل البيانات المطلوبة لإضافة فرد جديد للنظام.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AddPersonnelForm />
        </CardContent>
      </Card>
    </div>
  );
}
