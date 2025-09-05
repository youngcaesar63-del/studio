
'use client';

import { getLocalStorage, updateLocalStorage } from './localStorage-helpers';

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
    if (typeof window === 'undefined') return;

    const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type,
        title: typeToTitleMap[type] || 'نشاط جديد',
        description: `${description}${details ? ` - ${details}` : ''}`,
        timestamp: new Date().toISOString(),
    };

    const activityLog = getLocalStorage('activityLog', []);
    const updatedLog = [newActivity, ...activityLog].slice(0, 50); // Keep last 50 activities
    updateLocalStorage('activityLog', updatedLog);
}

export function getActivityLog(): Activity[] {
    return getLocalStorage('activityLog', []);
}
