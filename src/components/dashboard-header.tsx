
'use client';

import { useState } from 'react';
import { Bell, ChevronDown, LogOut, Moon, Settings, Sun, User as UserIcon } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function DashboardHeader() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    toast({ title: 'تم تسجيل الخروج بنجاح' });
    setLogoutModalOpen(false);
    router.push('/login');
  };

  return (
    <header className="bg-card border-b py-2 px-6 shadow-sm sticky top-0 z-40 no-print">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Image 
              src="https://i.postimg.cc/JhCP857V/1-removebg-preview.png"
              alt="شعار"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold text-foreground">سجل الأفراد</h1>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>فاتح</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>داكن</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>النظام</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5"/>
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-card animate-pulse"></span>
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
              <Button variant="ghost" className="flex items-center space-x-2 rtl:space-x-reverse rounded-full p-2 h-auto">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className='text-right'>
                    <p className='text-sm font-medium'>مدير النظام</p>
                    <p className='text-xs text-muted-foreground'>مسؤول</p>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild><Link href="/dashboard/settings"><UserIcon className="ml-2 h-4 w-4"/>الملف الشخصي</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/dashboard/settings"><Settings className="ml-2 h-4 w-4"/>الإعدادات</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setLogoutModalOpen(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="ml-2 h-4 w-4"/>
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
