
'use server';

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
    { name: 'importantJobs', tableName: 'important_jobs' },
    { name: 'serviceOperations', tableName: 'service_operations' },
    { name: 'decisiveStorm', tableName: 'decisive_storm' },
    { name: 'trainingCourses', tableName: 'training_courses' },
    { name: 'serviceHistory', tableName: 'service_history' },
    { name: 'medals', tableName: 'medals' },
    { name: 'languages', tableName: 'languages' },
    { name: 'children', tableName: 'children' },
    { name: 'brothers', tableName: 'brothers' },
    { name: 'sisters', tableName: 'sisters' },
    { name: 'mechanisms', tableName: 'mechanisms' },
];


function getSubTableDataForOne(personnelId: number, tableName: string) {
    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE personnel_id = ?`);
    return stmt.all(personnelId).map((item: any) => {
        delete item.id;
        delete item.personnel_id;
        return item;
    });
}

function deleteSubTableData(personnelId: number, tableName: string) {
    const stmt = db.prepare(`DELETE FROM ${tableName} WHERE personnel_id = ?`);
    stmt.run(personnelId);
}

function insertSubTableData(personnelId: number, tableName: string, data: any[]) {
    if (!data || data.length === 0) return;
    
    const keys = Object.keys(data[0]);
    if(keys.length === 0) return;

    const columns = ['personnel_id', ...keys].join(', ');
    const placeholders = ['?', ...keys.map(() => '?')].join(', ');
    
    const stmt = db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`);
    
    const insertMany = db.transaction((items) => {
        for (const item of items) {
            const values = [personnelId, ...keys.map(k => item[k])];
            stmt.run(...values);
        }
    });

    insertMany(data);
}

const mapPersonnelFromDb = (p: any, allSubData: Record<string, any>): Personnel => {
    if (!p) return p;
    const personnel: Personnel = {
        ...p,
        phoneNumbers: p.phoneNumbers ? JSON.parse(p.phoneNumbers) : {},
    };

    subTables.forEach(tableInfo => {
        personnel[tableInfo.name as keyof Personnel] = allSubData[tableInfo.tableName]?.[p.id] || [];
    });
    
    return personnel;
};

// Helper to convert dates to ISO strings for DB storage
const toISO = (date: Date | undefined | string | null): string | undefined | null => {
    if (!date) return null;
    if (typeof date === 'string') return date; // Already a string
    return date.toISOString();
};


const mapPersonnelToDb = (data: Partial<Personnel>): any => {
    const dbData: any = { ...data };
    
    // Map name correctly from form
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

    const mapTimeBasedArray = (arr: any[] | undefined) => {
      if(!arr) return [];
      return arr.map(item => ({ ...item, periodFrom: toISO(item.periodFrom), periodTo: toISO(item.periodTo) }))
    }

    subTables.forEach(table => {
        const key = table.name as keyof Personnel;
        if (dbData[key]) {
            if (['importantJobs', 'serviceOperations', 'decisiveStorm', 'trainingCourses', 'serviceHistory', 'mechanisms'].includes(key as string)) {
                dbData[key] = mapTimeBasedArray(dbData[key]);
            }
        }
    });

    return dbData;
};


export async function getAllPersonnel(): Promise<Personnel[]> {
  const personnelList = db.prepare('SELECT * FROM personnel').all() as any[];
  
  if (personnelList.length === 0) {
    return [];
  }

  // Fetch all sub-table data in bulk
  const allSubData: Record<string, any> = {};
  for (const tableInfo of subTables) {
    const subItems = db.prepare(`SELECT * FROM ${tableInfo.tableName}`).all() as any[];
    // Group sub-items by personnel_id for quick lookup
    allSubData[tableInfo.tableName] = subItems.reduce((acc, item) => {
      const { id, personnel_id, ...rest } = item;
      if (!acc[personnel_id]) {
        acc[personnel_id] = [];
      }
      acc[personnel_id].push(rest);
      return acc;
    }, {});
  }

  // Map the data together in memory
  const fullPersonnelList = personnelList.map(p => mapPersonnelFromDb(p, allSubData));

  const sortedData = fullPersonnelList.sort((a: Personnel, b: Personnel) => {
    const rankA = rankOrder[a.rank] || 99;
    const rankB = rankOrder[b.rank] || 99;
    return rankA - rankB;
  });

  return sortedData;
}

export async function getPersonnelById(id: number): Promise<Personnel | undefined> {
  const person = db.prepare('SELECT * FROM personnel WHERE id = ?').get(id) as any;
  if (!person) {
    return undefined;
  }
  
  const allSubDataForOne: Record<string, any> = {};
  const onePersonSubData: Record<string, any> = {};

  for (const tableInfo of subTables) {
     const subData = getSubTableDataForOne(id, tableInfo.tableName);
     onePersonSubData[id] = subData;
     allSubDataForOne[tableInfo.tableName] = onePersonSubData;
  }
  
  return mapPersonnelFromDb(person, allSubDataForOne);
}

export async function addPersonnel(newPersonnelData: Omit<Personnel, 'id'>): Promise<Personnel> {
  const dbData = mapPersonnelToDb(newPersonnelData);

  const subTableData: {[key: string]: any[]} = {};
  subTables.forEach(table => {
      const key = table.name;
      if (dbData[key]) {
          subTableData[table.tableName] = dbData[key];
          delete dbData[key];
      }
  });
  
  const mainColumns = Object.keys(dbData).filter(k => k !== 'id');
  const mainPlaceholders = mainColumns.map(() => '?').join(', ');
  
  const stmt = db.prepare(`
    INSERT INTO personnel (${mainColumns.join(', ')})
    VALUES (${mainPlaceholders})
  `);
  
  const result = stmt.run(...mainColumns.map(k => dbData[k]));
  const newId = result.lastInsertRowid as number;

  Object.entries(subTableData).forEach(([tableName, data]) => {
    insertSubTableData(newId, tableName, data);
  });


  return (await getPersonnelById(newId))!;
}

export async function updatePersonnel(id: number, updatedData: Partial<Omit<Personnel, 'id'>>): Promise<Personnel> {
    const dbData = mapPersonnelToDb(updatedData);

    const subTableData: {[key: string]: any[]} = {};
    subTables.forEach(table => {
        const key = table.name;
        if (dbData.hasOwnProperty(key)) {
            subTableData[table.tableName] = dbData[key];
            delete dbData[key];
        }
    });

    const mainColumns = Object.keys(dbData).filter(k => k !== 'id');
    if (mainColumns.length > 0) {
      const setClause = mainColumns.map(k => `${k} = ?`).join(', ');
      const stmt = db.prepare(`UPDATE personnel SET ${setClause} WHERE id = ?`);
      stmt.run(...mainColumns.map(k => dbData[k]), id);
    }
    
    // Update sub-tables by deleting and re-inserting
    Object.entries(subTableData).forEach(([tableName, data]) => {
      deleteSubTableData(id, tableName);
      insertSubTableData(id, tableName, data);
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
