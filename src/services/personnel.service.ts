
'use client';

import db from '@/lib/db';
import { rankOrder } from "@/lib/constants";

export type Personnel = {
  id: number;
  name: string;
  cardId: string;
  rank: string;
  specialization?: string;
  academicQualification?: string;
  major?: string;
  batch?: string;
  administration: string;
  status: string;
  statusDetail?: string;
  statusDate?: string;
  appointmentDate?: string;
  certificateType?: string;
  lastReturnDate?: string;
  transferDate?: string;
  reportingDate?: string;
  bloodType?: string;
  maritalStatus?: string;
  religion?: string;
  notes?: string;
  photo?: string;
  dateOfBirth?: string;
  nationalId?: string;
  phoneNumbers?: {
      sudani?: string;
      zain?: string;
      mtn?: string;
  };
  state?: string;
  city?: string;
  locality?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinAddress?: string;
  importantJobs?: any[];
  serviceOperations?: any[];
  decisiveStorm?: any[];
  trainingCourses?: any[];
  serviceHistory?: any[];
  medals?: any[];
  languages?: any[];
  fatherName?: string;
  fatherAddress?: string;
  motherName?: string;
  wifeName?: string;
  children?: any[];
  brothers?: any[];
  sisters?: any[];
  mechanisms?: any[];
};

const subTables = [
    'important_jobs', 'service_operations', 'decisive_storm', 'training_courses', 
    'service_history', 'medals', 'languages', 'children', 'brothers', 'sisters', 'mechanisms'
];

function getSubTableData(personnelId: number, tableName: string) {
    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE personnel_id = ?`);
    return stmt.all(personnelId);
}

function deleteSubTableData(personnelId: number, tableName: string) {
    const stmt = db.prepare(`DELETE FROM ${tableName} WHERE personnel_id = ?`);
    stmt.run(personnelId);
}

function insertSubTableData(personnelId: number, tableName: string, data: any[]) {
    if (!data || data.length === 0) return;
    
    const keys = Object.keys(data[0]);
    const columns = ['personnel_id', ...keys].join(', ');
    const placeholders = ['?', ...keys.map(() => '?')].join(', ');
    
    const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
    
    const insertMany = db.transaction((items) => {
        for (const item of items) {
            const values = [personnelId, ...Object.values(item)];
            stmt.run(...values);
        }
    });

    insertMany(data);
}

const mapPersonnelFromDb = (p: any): Personnel => {
    if (!p) return p;
    return {
        ...p,
        phoneNumbers: p.phoneNumbers ? JSON.parse(p.phoneNumbers) : {},
        importantJobs: getSubTableData(p.id, 'important_jobs'),
        serviceOperations: getSubTableData(p.id, 'service_operations'),
        decisiveStorm: getSubTableData(p.id, 'decisive_storm'),
        trainingCourses: getSubTableData(p.id, 'training_courses'),
        serviceHistory: getSubTableData(p.id, 'service_history'),
        medals: getSubTableData(p.id, 'medals'),
        languages: getSubTableData(p.id, 'languages'),
        children: getSubTableData(p.id, 'children'),
        brothers: getSubTableData(p.id, 'brothers'),
        sisters: getSubTableData(p.id, 'sisters'),
        mechanisms: getSubTableData(p.id, 'mechanisms'),
    };
};

// Helper to convert dates to ISO strings for DB storage
const toISO = (date: Date | undefined | string | null): string | undefined | null => {
    if (!date) return undefined;
    if (typeof date === 'string') return date; // Already a string
    return date.toISOString();
};


const mapPersonnelToDb = (data: Partial<Personnel>): any => {
    const dbData: any = { ...data };
    
    // Map name correctly
    if ('fullName' in dbData) {
        dbData.name = dbData.fullName;
        delete dbData.fullName;
    }

    // Stringify JSON fields
    if (dbData.phoneNumbers) dbData.phoneNumbers = JSON.stringify(dbData.phoneNumbers);

    // Convert date objects to ISO strings
    const dateFields: (keyof Personnel)[] = [
        'appointmentDate', 'lastReturnDate', 'transferDate', 
        'reportingDate', 'dateOfBirth', 'statusDate'
    ];
    dateFields.forEach(field => {
        if (dbData[field]) dbData[field] = toISO(dbData[field]);
    });

    const mapTimeBasedArray = (arr: any[] | undefined) => arr?.map(item => ({ ...item, periodFrom: toISO(item.periodFrom), periodTo: toISO(item.periodTo) })) || [];
    
    subTables.forEach(table => {
        const key = table.replace(/_([a-z])/g, g => g[1].toUpperCase());
        if (dbData[key]) {
            if (['important_jobs', 'service_operations', 'decisive_storm', 'training_courses', 'service_history', 'mechanisms'].includes(table)) {
                dbData[key] = mapTimeBasedArray(dbData[key]);
            }
        }
    });

    return dbData;
};


export async function getAllPersonnel(): Promise<Personnel[]> {
  const stmt = db.prepare('SELECT * FROM personnel');
  const personnelList = stmt.all();

  const fullPersonnelList = personnelList.map(p => mapPersonnelFromDb(p));

  const sortedData = fullPersonnelList.sort((a: Personnel, b: Personnel) => {
    const rankA = rankOrder[a.rank] || 99;
    const rankB = rankOrder[b.rank] || 99;
    return rankA - rankB;
  });

  return sortedData;
}

export async function getPersonnelById(id: number): Promise<Personnel | undefined> {
  const stmt = db.prepare('SELECT * FROM personnel WHERE id = ?');
  const person = stmt.get(id);
  return person ? mapPersonnelFromDb(person) : undefined;
}

export async function addPersonnel(newPersonnelData: Omit<Personnel, 'id'>): Promise<Personnel> {
  const dbData = mapPersonnelToDb(newPersonnelData);

  const mainColumns = Object.keys(dbData).filter(k => !subTables.map(st => st.replace(/_([a-z])/g, g => g[1].toUpperCase())).includes(k) && k !== 'id');
  const mainPlaceholders = mainColumns.map(() => '?').join(', ');
  
  const stmt = db.prepare(`
    INSERT INTO personnel (${mainColumns.join(', ')})
    VALUES (${mainPlaceholders})
  `);
  
  const result = stmt.run(...mainColumns.map(k => dbData[k]));
  const newId = result.lastInsertRowid as number;

  subTables.forEach(table => {
    const key = table.replace(/_([a-z])/g, g => g[1].toUpperCase());
    if (dbData[key]) {
        insertSubTableData(newId, table, dbData[key]);
    }
  });

  return (await getPersonnelById(newId))!;
}

export async function updatePersonnel(id: number, updatedData: Partial<Omit<Personnel, 'id'>>): Promise<Personnel> {
    const dbData = mapPersonnelToDb(updatedData);

    const mainColumns = Object.keys(dbData).filter(k => !subTables.map(st => st.replace(/_([a-z])/g, g => g[1].toUpperCase())).includes(k) && k !== 'id');
    const setClause = mainColumns.map(k => `${k} = ?`).join(', ');

    const stmt = db.prepare(`UPDATE personnel SET ${setClause} WHERE id = ?`);
    stmt.run(...mainColumns.map(k => dbData[k]), id);

    // Update sub-tables by deleting and re-inserting
    subTables.forEach(table => {
        deleteSubTableData(id, table);
        const key = table.replace(/_([a-z])/g, g => g[1].toUpperCase());
        if (dbData[key]) {
            insertSubTableData(id, table, dbData[key]);
        }
    });

    return (await getPersonnelById(id))!;
}

export async function deletePersonnel(id: number): Promise<void> {
    // Sub-table data will be deleted automatically due to ON DELETE CASCADE
    const stmt = db.prepare('DELETE FROM personnel WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
        throw new Error("Personnel not found to delete");
    }
}
