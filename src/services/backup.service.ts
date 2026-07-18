
'use server';

import db from '@/lib/db';

export type BackupMeta = {
    id: string;
    key: string;
    date: string; // ISO Date string
    size: string;
    status: 'مكتمل' | 'فشل';
};

export type AutoBackupSettings = {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
};

export type CreateBackupResult = {
    success: boolean;
    meta?: BackupMeta;
    data?: Record<string, any>;
    error?: string;
};

export type RestoreResult = {
    success: boolean;
    error?: string;
};

// Tables included in a full backup (settings handled separately to preserve stored backups)
const DATA_TABLES = [
    'personnel', 'important_jobs', 'service_operations', 'decisive_storm',
    'training_courses', 'service_history', 'medals', 'languages', 'children',
    'brothers', 'sisters', 'mechanisms', 'attachments', 'users', 'roles', 'activity_log'
];

const BACKUP_KEY_PREFIX = 'backup-';

function collectAllData(): Record<string, any> {
    const allData: Record<string, any> = {};
    DATA_TABLES.forEach(table => {
        allData[table] = db.prepare(`SELECT * FROM ${table}`).all();
    });
    // Stored in-app backups are never re-exported inside other backups
    allData['settings'] = db.prepare("SELECT * FROM settings WHERE key NOT LIKE ?").all(`${BACKUP_KEY_PREFIX}%`);
    return allData;
}

export async function getBackupHistory(): Promise<BackupMeta[]> {
    const rows = db.prepare(`
        SELECT key,
               JSON_EXTRACT(value, '$.id')     as id,
               JSON_EXTRACT(value, '$.date')   as date,
               JSON_EXTRACT(value, '$.size')   as size,
               JSON_EXTRACT(value, '$.status') as status
        FROM settings
        WHERE key LIKE ?
        ORDER BY date DESC
    `).all(`${BACKUP_KEY_PREFIX}%`) as BackupMeta[];
    return rows;
}

export async function getBackupDataById(backupId: string): Promise<Record<string, any> | null> {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(`${BACKUP_KEY_PREFIX}${backupId}`) as { value: string } | undefined;
    if (!row) return null;
    return JSON.parse(row.value).data ?? null;
}

export async function createBackup(): Promise<CreateBackupResult> {
    try {
        const allData = collectAllData();
        const dataString = JSON.stringify(allData, null, 2);
        const sizeInMB = (Buffer.byteLength(dataString, 'utf8') / (1024 * 1024)).toFixed(2);

        const backupId = Date.now().toString();
        const meta: BackupMeta = {
            id: backupId,
            key: `${BACKUP_KEY_PREFIX}${backupId}`,
            date: new Date().toISOString(),
            size: `${sizeInMB} MB`,
            status: 'مكتمل',
        };

        db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(
            meta.key,
            JSON.stringify({ ...meta, data: allData })
        );

        return { success: true, meta, data: allData };
    } catch (error) {
        console.error('Backup failed:', error);
        return { success: false, error: 'create_failed' };
    }
}

export async function deleteBackup(backupId: string): Promise<void> {
    db.prepare('DELETE FROM settings WHERE key = ?').run(`${BACKUP_KEY_PREFIX}${backupId}`);
}

export async function restoreBackupData(restoredData: Record<string, any>): Promise<RestoreResult> {
    // Validate structure before touching the database
    if (!restoredData || !restoredData.personnel || !restoredData.roles) {
        return { success: false, error: 'invalid_file' };
    }

    try {
        const restore = db.transaction(() => {
            // Clear existing data (stored in-app backups are preserved below)
            DATA_TABLES.forEach(table => {
                db.prepare(`DELETE FROM ${table}`).run();
            });
            db.prepare('DELETE FROM settings WHERE key NOT LIKE ?').run(`${BACKUP_KEY_PREFIX}%`);

            const tablesToRestore = [...DATA_TABLES, 'settings'];
            tablesToRestore.forEach(table => {
                const data = restoredData[table];
                if (Array.isArray(data) && data.length > 0) {
                    const columns = Object.keys(data[0]);
                    const placeholders = columns.map(() => '?').join(', ');
                    const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);
                    data.forEach((row: any) => {
                        stmt.run(...columns.map(c => row[c] ?? null));
                    });
                }
            });
        });
        restore();
        return { success: true };
    } catch (error) {
        console.error('Restore failed:', error);
        return { success: false, error: 'restore_failed' };
    }
}

export async function getAutoBackupSettings(): Promise<AutoBackupSettings> {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'autoBackupSettings'").get() as { value: string } | undefined;
    if (row) {
        try {
            return JSON.parse(row.value) as AutoBackupSettings;
        } catch {
            // fall through to defaults
        }
    }
    return { enabled: false, frequency: 'weekly' };
}

export async function saveAutoBackupSettings(settings: AutoBackupSettings): Promise<void> {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
        'autoBackupSettings', JSON.stringify(settings)
    );
}
