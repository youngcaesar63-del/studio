
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  List,
  UserPlus,
  Folder,
  BookCopy,
  BarChart2,
  Printer,
  Settings,
  UserCheck,
  Shield,
  Database,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const mainNav = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: Home },
];

const personnelNav = [
  { href: '/dashboard/personnel-list', label: 'قائمة الضباط', icon: List },
  { href: '/dashboard/add-personnel', label: 'إضافة ضابط جديد', icon: UserPlus },
  { href: '/dashboard/attachments', label: 'المرفقات', icon: Folder },
];

const reportsNav = [
  { href: '/dashboard/reports', label: 'الطباعة والتقارير', icon: Printer },
  { href: '/dashboard/statistics', label: 'إحصاءات', icon: BarChart2 },
];

const adminNav = [
  { href: '/dashboard/users', label: 'المستخدمون', icon: UserCheck },
  { href: '/dashboard/permissions', label: 'الصلاحيات', icon: Shield },
  { href: '/dashboard/backup', label: 'النسخ الاحتياطي', icon: Database },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings },
];

const navSections = [
  { title: 'الرئيسية', icon: Home, items: mainNav },
  { title: 'شئون الضباط', icon: Users, items: personnelNav },
  { title: 'التقارير والإحصاءات', icon: BookCopy, items: reportsNav },
  { title: 'إدارة النظام', icon: Settings, items: adminNav },
];

const NavContent = () => {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<string[]>(['الرئيسية', 'شئون الضباط', 'التقارير والإحصاءات', 'إدارة النظام']);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <nav className="p-4">
      {navSections.map((section) => (
        <Collapsible 
          key={section.title} 
          open={openSections.includes(section.title)}
          onOpenChange={() => toggleSection(section.title)}
          className="mb-4"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
              <h3 className="text-lg font-semibold flex items-center text-muted-foreground">
                <section.icon className="ml-2 h-5 w-5" />
                {section.title}
              </h3>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", openSections.includes(section.title) && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <ul className="space-y-2 pr-4">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-muted gap-2',
                        'sidebar-item',
                        isActive ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/70 hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </nav>
  )
}

export function DashboardSidebar() {
  return (
    <>
      <aside className="w-64 bg-card text-card-foreground rounded-lg shadow-md m-6 mr-0 h-fit sticky top-24 transition-all duration-300 hidden lg:block no-print">
        <NavContent />
      </aside>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden fixed top-20 right-4 z-50 no-print">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="lg:hidden w-72 p-0 no-print overflow-y-auto">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigate through the app sections.</SheetDescription>
          <NavContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
