
import { AddPersonnelForm } from '@/components/dashboard/add-personnel-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';

export default function EditPersonnelPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><Edit className="h-6 w-6" />تعديل بيانات ضابط</CardTitle>
          <CardDescription>قم بتحديث البيانات المطلوبة ثم اضغط على حفظ.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AddPersonnelForm />
        </CardContent>
      </Card>
    </div>
  );
}
