
'use server';

import db from '@/lib/db';

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
