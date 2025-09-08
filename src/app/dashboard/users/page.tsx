
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/components/dashboard/users-table';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import db from '@/lib/db';
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


type User = {
    id: number;
    name: string;
    role: string;
    lastLogin: string;
    status: 'نشط' | 'غير نشط';
    password?: string;
};

type Role = {
    name: string;
    description: string;
    permissions: any[];
}


export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(() => {
    try {
        const usersData = db.prepare('SELECT id, name, role, lastLogin, status FROM users').all() as User[];
        setUsers(usersData);

        const rolesData = db.prepare('SELECT name FROM roles').all() as { name: string }[];
        setRoles(rolesData.map(r => r.name));
    } catch (error) {
        console.error("Failed to load users/roles data", error);
        toast({ title: "خطأ", description: "فشل تحميل بيانات المستخدمين أو الأدوار.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserRole('');
    setPassword('');
    setConfirmPassword('');
    setDialogOpen(true);
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserRole(user.role);
    setPassword('');
    setConfirmPassword('');
    setDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userName || !userRole) {
        toast({ title: "خطأ", description: "الرجاء إدخال اسم المستخدم والدور.", variant: "destructive" });
        return;
    }

    if (!editingUser && !password) {
        toast({ title: "خطأ", description: "الرجاء إدخال كلمة مرور للمستخدم الجديد.", variant: "destructive" });
        return;
    }
    
    if(password !== confirmPassword) {
        toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين.", variant: "destructive" });
        return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
          // Edit existing user
          const updates: Partial<User> = { name: userName, role: userRole };
          if(password) {
              updates.password = password;
          }
          const columns = Object.keys(updates).map(k => `${k} = ?`).join(', ');
          const values = [...Object.values(updates), editingUser.id];
          const stmt = db.prepare(`UPDATE users SET ${columns} WHERE id = ?`);
          stmt.run(...values);
          toast({ title: 'تم التحديث', description: `تم تحديث بيانات المستخدم: ${userName}` });
      } else {
          // Add new user
          const newUser: Omit<User, 'id' | 'lastLogin'> = {
              name: userName,
              password: password,
              role: userRole,
              status: 'نشط',
          };
          const stmt = db.prepare('INSERT INTO users (name, password, role, status, lastLogin) VALUES (?, ?, ?, ?, ?)');
          stmt.run(newUser.name, newUser.password, newUser.role, newUser.status, 'لم يسجل دخول بعد');
          toast({ title: 'تمت الإضافة', description: `تم إضافة المستخدم: ${userName}` });
      }
      loadData(); // Reload data from DB
      setDialogOpen(false);
    } catch(error: any) {
      console.error("Failed to save user", error);
       if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            toast({ title: 'خطأ', description: 'اسم المستخدم هذا موجود بالفعل.', variant: 'destructive'});
        } else {
            toast({ title: 'خطأ في الحفظ', description: 'فشلت عملية حفظ المستخدم.', variant: 'destructive'});
        }
    } finally {
        setIsSaving(false);
    }
  };


  const handleDeleteUser = (userId: number) => {
    if (userId === 1) {
        toast({ title: "غير مسموح", description: "لا يمكن حذف حساب مدير النظام الافتراضي.", variant: "destructive" });
        return;
    }
    try {
        const user = users.find(u => u.id === userId);
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        stmt.run(userId);
        toast({
            title: 'تم الحذف',
            description: `تم حذف المستخدم: ${user?.name}`,
            variant: 'destructive'
        });
        loadData();
    } catch(error) {
       console.error("Failed to delete user", error);
       toast({ title: "خطأ", description: "فشل حذف المستخدم.", variant: "destructive" });
    }
  }

  const handleToggleStatus = (userId: number) => {
      if (userId === 1) {
          toast({ title: "غير مسموح", description: "لا يمكن تغيير حالة مدير النظام الافتراضي.", variant: "destructive" });
          return;
      }
      try {
        const user = users.find(u => u.id === userId);
        if (user) {
            const newStatus = user.status === 'نشط' ? 'غير نشط' : 'نشط';
            const stmt = db.prepare('UPDATE users SET status = ? WHERE id = ?');
            stmt.run(newStatus, userId);
            toast({
                title: 'تم تغيير الحالة',
                description: `تم تغيير حالة المستخدم: ${user.name}`,
            });
            loadData();
        }
      } catch (error) {
        console.error("Failed to toggle user status", error);
        toast({ title: "خطأ", description: "فشل تغيير حالة المستخدم.", variant: "destructive" });
      }
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
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                placeholder={editingUser ? 'اتركها فارغة لعدم التغيير' : ''}
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                تأكيد المرور
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" onClick={handleSaveUser} disabled={isSaving}>
              {isSaving ? 'جاري الحفظ...' : (editingUser ? 'حفظ التغييرات' : 'إضافة مستخدم')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
