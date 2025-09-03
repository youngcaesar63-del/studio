
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/dashboard/users-table';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const initialUsersData = [
  { id: 1, name: 'مدير النظام', role: 'مدير', lastLogin: '2024-05-20 10:30 ص', status: 'نشط' as const },
  { id: 2, name: 'علي محمد', role: 'محرر', lastLogin: '2024-05-20 09:15 ص', status: 'نشط' as const },
  { id: 3, name: 'فاطمة أحمد', role: 'مشاهد', lastLogin: '2024-05-19 03:00 م', status: 'غير نشط' as const },
  { id: 4, name: 'خالد سعيد', role: 'محرر', lastLogin: '2024-05-20 11:00 ص', status: 'نشط' as const },
];


export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsersData);

  const handleAddUser = () => {
    toast({
        title: 'قيد التطوير',
        description: 'سيتم إضافة شاشة لإضافة مستخدم جديد قريبًا.',
    });
  }

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
     toast({
        title: 'تم الحذف',
        description: `تم حذف المستخدم: ${user?.name}`,
    });
  }

  const handleToggleStatus = (userId: number) => {
      const user = users.find(u => u.id === userId);
      setUsers(users.map(u => u.id === userId ? {...u, status: u.status === 'نشط' ? 'غير نشط' : 'نشط'} : u));
      toast({
          title: 'تم تغيير الحالة',
          description: `تم تغيير حالة المستخدم: ${user?.name}`,
      });
  }
  
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
          <Button onClick={handleAddUser}>إضافة مستخدم جديد</Button>
        </CardHeader>
        <CardContent>
          <UsersTable data={users} onDelete={handleDeleteUser} onToggleStatus={handleToggleStatus} />
        </CardContent>
      </Card>
    </div>
  );
}
