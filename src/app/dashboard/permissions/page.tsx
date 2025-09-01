
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Edit } from "lucide-react";

const roles = [
  {
    name: 'مدير',
    description: 'وصول كامل لجميع ميزات النظام.',
    permissions: [
      { id: 'p1', name: 'عرض لوحة التحكم', enabled: true },
      { id: 'p2', name: 'إدارة الأفراد', enabled: true },
      { id: 'p3', name: 'إنشاء التقارير', enabled: true },
      { id: 'p4', name: 'إدارة المستخدمين والصلاحيات', enabled: true },
      { id: 'p5', name: 'الوصول للإعدادات المتقدمة', enabled: true },
    ]
  },
  {
    name: 'محرر',
    description: 'يمكنه إضافة وتعديل بيانات الأفراد.',
    permissions: [
        { id: 'p1', name: 'عرض لوحة التحكم', enabled: true },
        { id: 'p2', name: 'إدارة الأفراد', enabled: true },
        { id: 'p3', name: 'إنشاء التقارير', enabled: true },
        { id: 'p4', name: 'إدارة المستخدمين والصلاحيات', enabled: false },
        { id: 'p5', name: 'الوصول للإعدادات المتقدمة', enabled: false },
    ]
  },
  {
    name: 'مشاهد',
    description: 'يمكنه عرض البيانات فقط دون تعديل.',
    permissions: [
        { id: 'p1', name: 'عرض لوحة التحكم', enabled: true },
        { id: 'p2', name: 'إدارة الأفراد', enabled: false },
        { id: 'p3', name: 'إنشاء التقارير', enabled: true },
        { id: 'p4', name: 'إدارة المستخدمين والصلاحيات', enabled: false },
        { id: 'p5', name: 'الوصول للإعدادات المتقدمة', enabled: false },
    ]
  }
];

export default function PermissionsPage() {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2"><Shield className="h-6 w-6"/>إدارة الصلاحيات</CardTitle>
                <CardDescription>تحكم في صلاحيات الوصول لكل دور وظيفي في النظام.</CardDescription>
            </div>
            <Button>إضافة دور جديد</Button>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <Card key={role.name} className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-xl">{role.name}</CardTitle>
                <CardDescription className="mt-1">{role.description}</CardDescription>
              </div>
              <Button variant="outline" size="sm"><Edit className="ml-2 h-4 w-4" />تعديل الدور</Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الصلاحية</TableHead>
                            <TableHead className="text-center w-24">الحالة</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {role.permissions.map((permission) => (
                            <TableRow key={permission.id} className="hover:bg-muted/30">
                                <TableCell className="font-medium">{permission.name}</TableCell>
                                <TableCell className="text-center">
                                    <Switch
                                        checked={permission.enabled}
                                        aria-label={permission.name}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
