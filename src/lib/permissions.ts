// Shared permission definitions used by both the roles service (server)
// and the permissions page (client). Kept in a plain module because
// 'use server' files may only export async functions.

export type Permission = {
    id: string;
    name: string;
    enabled: boolean;
};

export type Role = {
    name: string;
    description: string;
    permissions: Permission[];
};

export const allAvailablePermissions: Omit<Permission, 'enabled'>[] = [
    { id: 'p1', name: 'عرض لوحة التحكم' },
    { id: 'p2', name: 'إدارة الضباط' },
    { id: 'p3', name: 'إنشاء التقارير' },
    { id: 'p4', name: 'إدارة المستخدمين والصلاحيات' },
    { id: 'p5', name: 'الوصول للإعدادات المتقدمة' },
];
