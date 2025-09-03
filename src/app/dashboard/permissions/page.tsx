
'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Permission = {
  id: string;
  name: string;
  enabled: boolean;
};

type Role = {
  name: string;
  description: string;
  permissions: Permission[];
};

const initialRoles: Role[] = [
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
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = () => {
      try {
        const storedData = localStorage.getItem('rolesData');
        if (storedData) {
          setRoles(JSON.parse(storedData));
        } else {
          setRoles(initialRoles);
          localStorage.setItem('rolesData', JSON.stringify(initialRoles));
        }
      } catch (error) {
          console.error("Failed to load roles from localStorage", error);
          setRoles(initialRoles);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    loadData();
    
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'rolesData') {
            loadData();
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('localStorageChange', loadData);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('localStorageChange', loadData);
    };
  }, []);

  const updateLocalStorage = (data: Role[]) => {
    try {
      localStorage.setItem('rolesData', JSON.stringify(data));
       window.dispatchEvent(new Event('localStorageChange'));
    } catch (error) {
      console.error("Failed to save roles to localStorage", error);
    }
  };

  const handlePermissionChange = (roleName: string, permissionId: string, newEnabledState: boolean) => {
    const updatedRoles = roles.map(role => 
      role.name === roleName
        ? {
            ...role,
            permissions: role.permissions.map(permission => 
              permission.id === permissionId 
                ? { ...permission, enabled: newEnabledState } 
                : permission
            ),
          }
        : role
    );
    
    setRoles(updatedRoles);
    updateLocalStorage(updatedRoles);

    const role = roles.find(r => r.name === roleName);
    const permission = role?.permissions.find(p => p.id === permissionId);
    toast({
      title: 'تم تحديث الصلاحية',
      description: `تم ${newEnabledState ? 'تفعيل' : 'تعطيل'} صلاحية "${permission?.name}" لدور "${roleName}".`,
    });
  };

  const handleAction = (message: string) => {
    toast({
        title: 'تم بنجاح',
        description: message,
    })
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2"><Shield className="h-6 w-6"/>إدارة الصلاحيات</CardTitle>
                <CardDescription>تحكم في صلاحيات الوصول لكل دور وظيفي في النظام.</CardDescription>
            </div>
            <Button onClick={() => handleAction('سيتم إضافة شاشة لإنشاء دور جديد قريبًا.')}>إضافة دور جديد</Button>
        </CardHeader>
      </Card>
      
      {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {roles.map((role) => (
            <Card key={role.name} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="mt-1">{role.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAction(`سيتم إضافة شاشة لتعديل دور "${role.name}" قريبًا.`)}><Edit className="ml-2 h-4 w-4" />تعديل الدور</Button>
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
                                          onCheckedChange={(checked) => handlePermissionChange(role.name, permission.id, checked)}
                                          aria-label={permission.name}
                                          disabled={role.name === 'مدير'}
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
      )}
    </div>
  );
}
