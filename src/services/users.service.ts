
'use server';

import db from '@/lib/db';

export type User = {
    id: number;
    name: string;
    role: string;
    lastLogin: string;
    status: 'نشط' | 'غير نشط';
};

export async function getAllUsers(): Promise<User[]> {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all() as User[];
  return users;
}
