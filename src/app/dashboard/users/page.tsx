
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/dashboard/users-table';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const initialUsersData = [
  { id: 1, name: 'مدير النظام', role: 'مسؤول', lastLogin: '2024-05-20 10:30 ص', status: 'نشط' as const },
];

type User = {
    id: number;
    name: string;
    role: string;
    lastLogin: string;
    status: 'نشط' | 'غير نشط';
};


export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  const loadData = useCallback(() => {
    const storedUsers = getLocalStorage('usersData', null);
    if(storedUsers === null) {
        updateLocalStorage('usersData', initialUsersData);
        setUsers(initialUsersData);
    } else {
        setUsers(storedUsers);
    }

    const storedRoles = getLocalStorage('rolesData', []);
    setRoles(storedRoles.map((r: any) => r.name));
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'usersData' || customEvent.detail.key === 'rolesData' || customEvent.detail.key === 'all') {
            loadData();
        }
    };

    window.addEventListener('storage-update', handleStorageChange);

    return () => {
        window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [loadData]);

  const handleAddUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserRole('');
    setDialogOpen(true);
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserRole(user.role);
    setDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userName || !userRole) {
        toast({ title: "خطأ", description: "الرجاء إدخال اسم المستخدم والدور.", variant: "destructive" });
        return;
    }

    let updatedUsers;
    const currentUsers = getLocalStorage('usersData', []);

    if (editingUser) {
        // Edit existing user
        updatedUsers = currentUsers.map((u: User) => u.id === editingUser.id ? { ...u, name: userName, role: userRole } : u);
        toast({ title: 'تم التحديث', description: `تم تحديث بيانات المستخدم: ${userName}` });
    } else {
        // Add new user
        const newUser: User = {
            id: Date.now(),
            name: userName,
            role: userRole,
            lastLogin: 'لم يسجل دخول بعد',
            status: 'نشط',
        };
        updatedUsers = [...currentUsers, newUser];
        toast({ title: 'تمت الإضافة', description: `تم إضافة المستخدم: ${userName}` });
    }
    
    updateLocalStorage('usersData', updatedUsers);
    setDialogOpen(false);
  };


  const handleDeleteUser = (userId: number) => {
    if (userId === 1) {
        toast({ title: "غير مسموح", description: "لا يمكن حذف حساب مدير النظام الافتراضي.", variant: "destructive" });
        return;
    }
    const currentUsers = getLocalStorage('usersData', []) as User[];
    const user = currentUsers.find(u => u.id === userId);
    const updatedUsers = currentUsers.filter(u => u.id !== userId);
    updateLocalStorage('usersData', updatedUsers);
     toast({
        title: 'تم الحذف',
        description: `تم حذف المستخدم: ${user?.name}`,
        variant: 'destructive'
    });
  }

  const handleToggleStatus = (userId: number) => {
      if (userId === 1) {
          toast({ title: "غير مسموح", description: "لا يمكن تغيير حالة مدير النظام الافتراضي.", variant: "destructive" });
          return;
      }
      const currentUsers = getLocalStorage('usersData', []) as User[];
      const user = currentUsers.find(u => u.id === userId);
      const updatedUsers = currentUsers.map(u => u.id === userId ? {...u, status: u.status === 'نشط' ? 'غير نشط' : 'نشط'} : u)
      updateLocalStorage('usersData', updatedUsers);
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
          <UsersTable data={users} onEdit={handleEditUser} onDelete={handleDeleteUser} onToggleStatus={handleToggleStatus} />
        </CardContent>
      </Card>
        
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'قم بتعديل بيانات المستخدم ثم اضغط على حفظ.' : 'أدخل بيانات المستخدم الجديد ثم اضغط على إضافة.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                الدور
              </Label>
              <Select dir="rtl" value={userRole} onValueChange={setUserRole}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  )) : <div className='p-4 text-sm text-muted-foreground text-center'>لا توجد أدوار، يرجى إضافتها من صفحة الصلاحيات.</div>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" onClick={handleSaveUser}>{editingUser ? 'حفظ التغييرات' : 'إضافة مستخدم'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
