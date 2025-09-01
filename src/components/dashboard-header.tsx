'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Moon, Sun, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export function DashboardHeader() {
  const { setTheme } = useTheme();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    toast({ title: 'تم تسجيل الخروج بنجاح' });
    setLogoutModalOpen(false);
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 shadow-lg sticky top-0 z-40 no-print">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Users className="w-8 h-8" />
          <h1 className="text-2xl font-bold">سجل الأفراد</h1>
        </div>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/90">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                فاتح
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                داكن
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                النظام
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/90 relative">
                <Bell />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-primary animate-pulse"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="p-2">
                <div className="flex justify-between items-center mb-3 px-2">
                  <h4 className="font-bold text-foreground">الإشعارات</h4>
                  <Button variant="link" className="text-xs h-auto p-0">تعيين الكل كمقروء</Button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                   <DropdownMenuItem className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg focus:bg-blue-100 dark:focus:bg-blue-900/50 cursor-pointer">
                       <div className="flex flex-col">
                           <p className="text-sm text-foreground">تمت إضافة فرد جديد: أحمد محمد</p>
                           <p className="text-xs text-muted-foreground">منذ ٣٠ دقيقة</p>
                       </div>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg focus:bg-amber-100 dark:focus:bg-amber-900/50 cursor-pointer">
                       <div className="flex flex-col">
                           <p className="text-sm text-foreground">هناك ٥ وثائق تحتاج إلى تجديد</p>
                           <p className="text-xs text-muted-foreground">منذ ساعتين</p>
                       </div>
                   </DropdownMenuItem>
                   <DropdownMenuItem className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg focus:bg-red-100 dark:focus:bg-red-900/50 cursor-pointer">
                       <div className="flex flex-col">
                           <p className="text-sm text-foreground">بيانات غير مكتملة لـ ٣ أفراد</p>
                           <p className="text-xs text-muted-foreground">منذ ٥ ساعات</p>
                       </div>
                   </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-primary/90">
                <span>المستخدم: مدير النظام</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem asChild><Link href="/dashboard/settings">الملف الشخصي</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/settings">الإعدادات</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setLogoutModalOpen(true)} className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50 focus:text-red-600">
                  تسجيل الخروج
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <AlertDialog open={isLogoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد تسجيل الخروج</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد تسجيل الخروج؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">تسجيل الخروج</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
