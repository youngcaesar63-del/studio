
'use server';

import db from '@/lib/db';
import type { UpdatePersonnel } from './personnel.service';

export type User = {
    id: number;
    name: string;
    role: string;
    lastLogin: string;
    status: 'نشط' | 'غير نشط';
    password?: string;
};

export async function getAllUsers(): Promise<User[]> {
  const stmt = db.prepare('SELECT id, name, role, lastLogin, status FROM users');
  const users = stmt.all() as User[];
  return users;
}

export async function login(username: string, password: string):Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE name = ? AND password = ?');
    const user = stmt.get(username, password) as User | undefined;
    
    // if a user is found, the credentials are correct
    if (user) {
        // Update last login
        const updateStmt = db.prepare("UPDATE users SET lastLogin = ? WHERE id = ?");
        updateStmt.run(new Date().toISOString(), user.id);
        
        delete user.password;
        return user;
    }

    return null;
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
