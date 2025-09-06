
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.sqlite');
const dbExists = fs.existsSync(dbPath);

const db = new Database(dbPath, { verbose: console.log });

if (!dbExists) {
  console.log('Database does not exist, initializing...');
  
  // Create tables
  const createTablesScript = `
    -- Personnel Table
    CREATE TABLE personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cardId TEXT NOT NULL UNIQUE,
        rank TEXT NOT NULL,
        specialization TEXT,
        academicQualification TEXT,
        major TEXT,
        batch TEXT,
        administration TEXT,
        status TEXT NOT NULL,
        statusDetail TEXT,
        statusDate TEXT,
        appointmentDate TEXT,
        certificateType TEXT,
        lastReturnDate TEXT,
        transferDate TEXT,
        reportingDate TEXT,
        bloodType TEXT,
        maritalStatus TEXT,
        religion TEXT,
        notes TEXT,
        photo TEXT,
        dateOfBirth TEXT,
        nationalId TEXT,
        phoneNumbers TEXT, -- Stored as JSON
        state TEXT,
        city TEXT,
        locality TEXT,
        address TEXT,
        nextOfKinName TEXT,
        nextOfKinPhone TEXT,
        nextOfKinAddress TEXT,
        fatherName TEXT,
        fatherAddress TEXT,
        motherName TEXT,
        wifeName TEXT
    );

    -- Sub-tables with foreign key to personnel
    CREATE TABLE important_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        jobTitle TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE service_operations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        areaName TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE decisive_storm (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE training_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        courseName TEXT,
        courseType TEXT,
        imperativeness TEXT,
        institute TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        grade TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE service_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        unitName TEXT,
        jobTitle TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE medals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );
    
    CREATE TABLE children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE brothers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        address TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE sisters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        address TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    CREATE TABLE mechanisms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,
        name TEXT,
        periodFrom TEXT,
        periodTo TEXT,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    -- Attachments Table
    CREATE TABLE attachments (
        id TEXT PRIMARY KEY,
        personnel_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        size TEXT NOT NULL,
        uploadDate TEXT NOT NULL,
        dataUrl TEXT NOT NULL,
        FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
    );

    -- Users Table
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        lastLogin TEXT,
        status TEXT NOT NULL
    );

    -- Roles Table
    CREATE TABLE roles (
        name TEXT PRIMARY KEY,
        description TEXT,
        permissions TEXT NOT NULL -- Stored as JSON
    );
    
    -- Activity Log Table
    CREATE TABLE activity_log (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    
    -- Settings Table (Key-Value Store)
    CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
  `;
  db.exec(createTablesScript);

  // Seed initial data
    const initialPersonnelData = [
        { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم حاسوب', batch: 'الدفعة 65', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: '2020-10-01T00:00:00.000Z', certificateType: 'مستديمة', bloodType: 'A+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'الخرطوم', city: 'الخرطوم', locality: 'بحري', address: 'شارع النيل', dateOfBirth: '1998-04-15T00:00:00.000Z', nationalId: '1234567890', phoneNumbers: { sudani: '0912345678' }, nextOfKinName: 'محمد علي', nextOfKinPhone: '0912345670', nextOfKinAddress: 'الخرطوم، بحري', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: 'محمد علي', fatherAddress: 'الخرطوم', motherName: 'فاطمة أحمد', wifeName: '' },
        { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', specialization: 'طيار', academicQualification: 'ماجستير', major: 'هندسة طيران', batch: 'الدفعة 62', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة', statusDate: '2024-08-15T00:00:00.000Z', appointmentDate: '2018-05-20T00:00:00.000Z', certificateType: 'مستديمة', bloodType: 'O+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الجزيرة', city: 'ود مدني', locality: 'شرق الجزيرة', address: 'حي المطار', dateOfBirth: '1990-05-15T00:00:00.000Z', nationalId: '2345678901', phoneNumbers: { zain: '0912345679' }, nextOfKinName: 'خالد سعيد', nextOfKinPhone: '0912345671', nextOfKinAddress: 'ود مدني، حي المطار', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: 'خالد سعيد', fatherAddress: 'ود مدني', motherName: 'عائشة الحسن', wifeName: 'سارة عمر' },
    ];
    
    const stmt = db.prepare(`
        INSERT INTO personnel (name, cardId, rank, specialization, academicQualification, major, batch, administration, status, statusDate, appointmentDate, certificateType, bloodType, maritalStatus, religion, state, city, locality, address, dateOfBirth, nationalId, phoneNumbers, nextOfKinName, nextOfKinPhone, nextOfKinAddress, fatherName, fatherAddress, motherName, wifeName)
        VALUES (@name, @cardId, @rank, @specialization, @academicQualification, @major, @batch, @administration, @status, @statusDate, @appointmentDate, @certificateType, @bloodType, @maritalStatus, @religion, @state, @city, @locality, @address, @dateOfBirth, @nationalId, @phoneNumbers, @nextOfKinName, @nextOfKinPhone, @nextOfKinAddress, @fatherName, @fatherAddress, @motherName, @wifeName)
    `);
    
    const insertMany = db.transaction((personnel) => {
        for (const person of personnel) {
            stmt.run({
                ...person,
                phoneNumbers: JSON.stringify(person.phoneNumbers),
            });
        }
    });
    
    insertMany(initialPersonnelData);

    // Seed initial user
    const insertUser = db.prepare("INSERT INTO users (id, name, role, lastLogin, status) VALUES (?, ?, ?, ?, ?)");
    insertUser.run(1, 'مدير النظام', 'مسؤول', '2024-05-20 10:30 ص', 'نشط');
    
    console.log('Database initialized and seeded.');
}

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export default db;
