
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.sqlite');
const dbExists = fs.existsSync(dbPath);

const db = new Database(dbPath);

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
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
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

  // Seed initial user
  const insertUser = db.prepare("INSERT INTO users (id, name, password, role, lastLogin, status) VALUES (1, 'admin', 'admin', 'مدير', 'لم يسجل دخول بعد', 'نشط')");
  insertUser.run();
  
  console.log('Database initialized and seeded.');
}

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export default db;
