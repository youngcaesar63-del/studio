'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Home,
  Users,
  List,
  UserPlus,
  Folder,
  FileText,
  File,
  BarChart2,
  Printer,
  Settings,
  UserCheck,
  Shield,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';

const mainNav = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: Activity },
];

const personnelNav = [
  { href: '/dashboard/personnel-list', label: 'كشف الأفراد', icon: List },
  { href: '/dashboard/add-personnel', label: 'إضافة فرد جديد', icon: UserPlus },
  { href: '/dashboard/attachments', label: 'المرفقات', icon: Folder },
];

const reportsNav = [
  { href: '/dashboard/reports', label: 'تقارير الأفراد', icon: File },
  { href: '/dashboard/statistics', label: 'إحصاءات', icon: BarChart2 },
  { href: '/dashboard/print', label: 'الطباعة', icon: Printer },
];

const adminNav = [
  { href: '/dashboard/users', label: 'المستخدمون', icon: UserCheck },
  { href: '/dashboard/permissions', label: 'الصلاحيات', icon: Shield },
  { href: '/dashboard/backup', label: 'النسخ الاحتياطي', icon: Database },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

const navSections = [
  { title: 'الرئيسية', icon: Home, items: mainNav },
  { title: 'إدارة الأفراد', icon: Users, items: personnelNav },
  { title: 'التقارير', icon: FileText, items: reportsNav },
  { title: 'الإدارة', icon: Settings, items: adminNav },
];

const NavContent = () => {
  const pathname = usePathname();
  return (
    <nav className="p-4">
      {navSections.map((section) => (
        <div key={section.title} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center px-2 text-muted-foreground">
            <section.icon className="ml-2 h-5 w-5" />
            {section.title}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item) => {
              const isActive = (item.href === '/dashboard' && pathname === item.href) || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-muted',
                      'sidebar-item',
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    <item.icon className="ml-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function DashboardSidebar() {
  return (
    <>
      <aside className="w-64 bg-card text-card-foreground rounded-lg shadow-md mr-6 h-fit sticky top-24 transition-all duration-300 hidden lg:block">
        <NavContent />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden fixed top-20 right-4 z-50">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="lg:hidden w-72 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
