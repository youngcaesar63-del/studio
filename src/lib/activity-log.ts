
'use client';

import db from './db';

export type ActivityType = 'add_personnel' | 'edit_personnel' | 'delete_personnel' | 'create_report' | 'promotion';

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO date string
};

const typeToTitleMap: Record<ActivityType, string> = {
    add_personnel: 'تمت إضافة ضابط جديد',
    edit_personnel: 'تم تعديل بيانات ضابط',
    delete_personnel: 'تم حذف ضابط',
    create_report: 'تم إنشاء تقرير',
    promotion: 'ترقية ضابط',
};

export function logActivity(type: ActivityType, description: string, details?: string) {
    const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type,
        title: typeToTitleMap[type] || 'نشاط جديد',
        description: `${description}${details ? ` - ${details}` : ''}`,
        timestamp: new Date().toISOString(),
    };

    const stmt = db.prepare('INSERT INTO activity_log (id, type, title, description, timestamp) VALUES (?, ?, ?, ?, ?)');
    stmt.run(newActivity.id, newActivity.type, newActivity.title, newActivity.description, newActivity.timestamp);

    // Optional: Prune old logs to keep the table size manageable
    const pruneStmt = db.prepare(`
        DELETE FROM activity_log WHERE id NOT IN (
            SELECT id FROM activity_log ORDER BY timestamp DESC LIMIT 50
        )
    `);
    pruneStmt.run();
}

export function getActivityLog(): Activity[] {
    const stmt = db.prepare('SELECT * FROM activity_log ORDER BY timestamp DESC');
    return stmt.all() as Activity[];
}
