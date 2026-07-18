
'use client';
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllRoles, saveRole, updateRolePermissions } from '@/services/roles.service';
import { allAvailablePermissions } from '@/lib/permissions';
import type { Role } from '@/lib/permissions';

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [rolePermissions, setRolePermissions] = useState<{[key: string]: boolean}>({});
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
        const rolesFromDb = await getAllRoles();
        setRoles(rolesFromDb);
    } catch(error) {
        console.error("Failed to load roles", error);
        toast({ title: "خطأ", description: "فشل تحميل الأدوار والصلاحيات.", variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePermissionChange = async (roleName: string, permissionId: string, newEnabledState: boolean) => {
    try {
        const roleToUpdate = roles.find(r => r.name === roleName);
        if (!roleToUpdate) return;

        const updatedPermissions = roleToUpdate.permissions.map(p =>
            p.id === permissionId ? { ...p, enabled: newEnabledState } : p
        );

        const result = await updateRolePermissions(roleName, updatedPermissions);
        if (!result.success) {
            throw new Error(result.error);
        }

        const permission = roleToUpdate.permissions.find(p => p.id === permissionId);
        toast({
            title: 'تم تحديث الصلاحية',
            description: `تم ${newEnabledState ? 'تفعيل' : 'تعطيل'} صلاحية "${permission?.name}" لدور "${roleName}".`,
        });
        await loadData();
    } catch (error) {
        console.error("Failed to update permission", error);
        toast({ title: "خطأ", description: "فشل تحديث الصلاحية.", variant: "destructive" });
    }
  }

  const openAddDialog = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setRolePermissions(allAvailablePermissions.reduce((acc, p) => ({...acc, [p.id]: false}), {}));
    setDialogOpen(true);
  }

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description);
    setRolePermissions(role.permissions.reduce((acc, p) => ({...acc, [p.id]: p.enabled}), {}));
    setDialogOpen(true);
  }

  const handleSaveRole = async () => {
    if (!roleName.trim() || !roleDescription.trim()) {
        toast({ title: 'خطأ', description: 'الرجاء إدخال اسم ووصف الدور.', variant: 'destructive' });
        return;
    }

    setIsSaving(true);
    try {
      const newPermissions = allAvailablePermissions.map(p => ({
          ...p,
          enabled: !!rolePermissions[p.id]
      }));

      const isNew = !editingRole;
      const result = await saveRole(
          { name: roleName.trim(), description: roleDescription.trim(), permissions: newPermissions },
          isNew
      );

      if (!result.success) {
          if (result.error === 'duplicate') {
              toast({ title: 'خطأ', description: 'هذا الدور موجود بالفعل.', variant: 'destructive' });
          } else {
              toast({ title: 'خطأ في الحفظ', description: 'فشلت عملية حفظ الدور.', variant: 'destructive'});
          }
          return;
      }

      toast(isNew
          ? { title: 'تمت الإضافة', description: `تم إضافة دور "${roleName}" بنجاح.` }
          : { title: 'تم التحديث', description: `تم تحديث دور "${editingRole!.name}" بنجاح.` });

      await loadData();
      setDialogOpen(false);
    } catch(error) {
       console.error("Failed to save role", error);
       toast({ title: 'خطأ في الحفظ', description: 'فشلت عملية حفظ الدور.', variant: 'destructive'});
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2"><Shield className="h-6 w-6"/>إدارة الصلاحيات</CardTitle>
                <CardDescription>تحكم في صلاحيات الوصول لكل دور وظيفي في النظام.</CardDescription>
            </div>
            <Button onClick={openAddDialog}>إضافة دور جديد</Button>
        </CardHeader>
      </Card>
      
      {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {roles.length > 0 ? roles.map((role) => (
            <Card key={role.name} className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="mt-1">{role.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(role)} disabled={role.name === 'مدير'}><Edit className="ml-2 h-4 w-4" />تعديل الدور</Button>
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
          )) : (
             <Card className="shadow-md text-center p-8">
                <CardTitle>لا توجد أدوار</CardTitle>
                <CardDescription>لم يتم تعريف أي أدوار في النظام حتى الآن. ابدأ بإضافة دور جديد.</CardDescription>
            </Card>
          )}
        </div>
      )}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{editingRole ? 'تعديل دور' : 'إضافة دور جديد'}</DialogTitle>
                    <DialogDescription>
                        {editingRole ? 'قم بتعديل بيانات الدور ثم اضغط على حفظ.' : 'أدخل بيانات الدور الجديد وحدد صلاحياته.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-name" className="text-right">
                            اسم الدور
                        </Label>
                        <Input
                            id="role-name"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="col-span-3"
                            disabled={!!editingRole}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role-desc" className="text-right">
                            الوصف
                        </Label>
                        <Input
                            id="role-desc"
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                     <div>
                        <Label className="text-base font-semibold">الصلاحيات</Label>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md border p-4">
                            {allAvailablePermissions.map(p => (
                                <div key={p.id} className="flex items-center space-x-2 space-x-reverse">
                                    <Checkbox 
                                        id={`perm-${p.id}`} 
                                        checked={rolePermissions[p.id]}
                                        onCheckedChange={(checked) => {
                                            setRolePermissions(prev => ({...prev, [p.id]: !!checked}));
                                        }}
                                        disabled={editingRole?.name === 'مدير'}
                                    />
                                    <Label htmlFor={`perm-${p.id}`}>{p.name}</Label>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button type="submit" onClick={handleSaveRole} disabled={isSaving}>
                      {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
