
'use server';

import db from '@/lib/db';

// The built-in system administrator account — must never be deleted or deactivated.
const SYSTEM_ADMIN_ID = 1;

export type User = {
    id: number;
    name: string;
    role: string;
    lastLogin: string;
    status: 'نشط' | 'غير نشط';
    password?: string;
};

export type UserOperationResult = {
    success: boolean;
    error?: 'duplicate' | 'forbidden' | 'not_found' | 'unknown' | 'wrong_password' | 'invalid_input';
};

export async function getAllUsers(): Promise<User[]> {
  const stmt = db.prepare('SELECT id, name, role, lastLogin, status FROM users');
  const users = stmt.all() as User[];
  return users;
}

export async function login(username: string, password: string):Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE name = ?');
    const user: User | undefined = stmt.get(username) as User | undefined;
    
    // In a real app, you would use a library like bcrypt to compare a hashed password.
    if (!user || user.password !== password) {
      return null;
    }

    // Update last login
    const updateStmt = db.prepare("UPDATE users SET lastLogin = ? WHERE id = ?");
    updateStmt.run(new Date().toISOString(), user.id);
    
    delete user.password;
    return user;
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User> {
    const setClause = Object.keys(updates).map(key => `${key} = @${key}`).join(', ');
    const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = @id`);
    
    const result = stmt.run({ ...updates, id });

    if (result.changes === 0) {
        throw new Error("User not found");
    }
    
    const getStmt = db.prepare('SELECT id, name, role, lastLogin, status FROM users WHERE id = ?');
    return getStmt.get(id) as User;
}

export async function addUser(data: { name: string; password: string; role: string }): Promise<UserOperationResult> {
    if (!data.name?.trim() || !data.password || !data.role) {
        return { success: false, error: 'invalid_input' };
    }
    try {
        const stmt = db.prepare('INSERT INTO users (name, password, role, status, lastLogin) VALUES (?, ?, ?, ?, ?)');
        stmt.run(data.name.trim(), data.password, data.role, 'نشط', 'لم يسجل دخول بعد');
        return { success: true };
    } catch (error: any) {
        if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { success: false, error: 'duplicate' };
        }
        console.error('Failed to add user:', error);
        return { success: false, error: 'unknown' };
    }
}

export async function editUser(id: number, updates: { name: string; role: string; password?: string }): Promise<UserOperationResult> {
    if (!updates.name?.trim() || !updates.role) {
        return { success: false, error: 'invalid_input' };
    }
    try {
        const fields: Record<string, string> = { name: updates.name.trim(), role: updates.role };
        if (updates.password) {
            fields.password = updates.password;
        }
        const setClause = Object.keys(fields).map(key => `${key} = @${key}`).join(', ');
        const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = @id`);
        const result = stmt.run({ ...fields, id });
        if (result.changes === 0) {
            return { success: false, error: 'not_found' };
        }
        return { success: true };
    } catch (error: any) {
        if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return { success: false, error: 'duplicate' };
        }
        console.error('Failed to edit user:', error);
        return { success: false, error: 'unknown' };
    }
}

export async function deleteUser(id: number): Promise<UserOperationResult> {
    if (id === SYSTEM_ADMIN_ID) {
        return { success: false, error: 'forbidden' };
    }
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
        return { success: false, error: 'not_found' };
    }
    return { success: true };
}

export async function toggleUserStatus(id: number): Promise<UserOperationResult & { newStatus?: User['status'] }> {
    if (id === SYSTEM_ADMIN_ID) {
        return { success: false, error: 'forbidden' };
    }
    const user = db.prepare('SELECT status FROM users WHERE id = ?').get(id) as { status: User['status'] } | undefined;
    if (!user) {
        return { success: false, error: 'not_found' };
    }
    const newStatus: User['status'] = user.status === 'نشط' ? 'غير نشط' : 'نشط';
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(newStatus, id);
    return { success: true, newStatus };
}

export async function changePassword(id: number, currentPassword: string, newPassword: string): Promise<UserOperationResult> {
    if (!currentPassword || !newPassword) {
        return { success: false, error: 'invalid_input' };
    }
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(id) as { password: string } | undefined;
    if (!user) {
        return { success: false, error: 'not_found' };
    }
    // In a real app, compare hashed passwords (e.g. bcrypt.compare).
    if (user.password !== currentPassword) {
        return { success: false, error: 'wrong_password' };
    }
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, id);
    return { success: true };
}
