
'use server';

import db from '@/lib/db';
import { allAvailablePermissions } from '@/lib/permissions';
import type { Permission, Role } from '@/lib/permissions';

export type { Permission, Role } from '@/lib/permissions';

export type RoleOperationResult = {
    success: boolean;
    error?: 'duplicate' | 'not_found' | 'invalid_input' | 'unknown';
};

const parseRole = (role: any): Role => ({
    name: role.name,
    description: role.description,
    permissions: typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions,
});

function ensureDefaultRole() {
    const count = db.prepare('SELECT COUNT(*) as count FROM roles').get() as { count: number };
    if (count.count === 0) {
        const defaultPermissions = allAvailablePermissions.map(p => ({ ...p, enabled: true }));
        db.prepare('INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)').run(
            'مدير',
            'يمتلك جميع صلاحيات الوصول للنظام.',
            JSON.stringify(defaultPermissions)
        );
    }
}

export async function getAllRoles(): Promise<Role[]> {
    ensureDefaultRole();
    const rows = db.prepare('SELECT * FROM roles').all() as any[];
    return rows.map(parseRole);
}

export async function getRoleNames(): Promise<string[]> {
    ensureDefaultRole();
    const rows = db.prepare('SELECT name FROM roles').all() as { name: string }[];
    return rows.map(r => r.name);
}

export async function saveRole(role: Role, isNew: boolean): Promise<RoleOperationResult> {
    if (!role.name?.trim() || !role.description?.trim()) {
        return { success: false, error: 'invalid_input' };
    }
    try {
        const permissionsJson = JSON.stringify(role.permissions);
        if (isNew) {
            db.prepare('INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)').run(
                role.name.trim(), role.description.trim(), permissionsJson
            );
        } else {
            const result = db.prepare('UPDATE roles SET description = ?, permissions = ? WHERE name = ?').run(
                role.description.trim(), permissionsJson, role.name
            );
            if (result.changes === 0) {
                return { success: false, error: 'not_found' };
            }
        }
        return { success: true };
    } catch (error: any) {
        if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE' || error?.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            return { success: false, error: 'duplicate' };
        }
        console.error('Failed to save role:', error);
        return { success: false, error: 'unknown' };
    }
}

export async function updateRolePermissions(roleName: string, permissions: Permission[]): Promise<RoleOperationResult> {
    const result = db.prepare('UPDATE roles SET permissions = ? WHERE name = ?').run(
        JSON.stringify(permissions), roleName
    );
    if (result.changes === 0) {
        return { success: false, error: 'not_found' };
    }
    return { success: true };
}
