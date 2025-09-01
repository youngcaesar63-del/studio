import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/dashboard/users-table';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const usersData = [
  { id: 1, name: 'مدير النظام', role: 'مدير', lastLogin: '2024-05-20 10:30 ص', status: 'نشط' },
  { id: 2, name: 'علي محمد', role: 'محرر', lastLogin: '2024-05-20 09:15 ص', status: 'نشط' },
  { id: 3, name: 'فاطمة أحمد', role: 'مشاهد', lastLogin: '2024-05-19 03:00 م', status: 'غير نشط' },
  { id: 4, name: 'خالد سعيد', role: 'محرر', lastLogin: '2024-05-20 11:00 ص', status: 'نشط' },
];

export default function UsersPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              إدارة المستخدمين
            </CardTitle>
            <CardDescription>عرض وإدارة حسابات مستخدمي النظام.</CardDescription>
          </div>
          <Button>إضافة مستخدم جديد</Button>
        </CardHeader>
        <CardContent>
          <UsersTable data={usersData} />
        </CardContent>
      </Card>
    </div>
  );
}
