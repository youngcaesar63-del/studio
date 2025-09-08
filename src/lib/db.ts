
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.sqlite');
const dbFileExists = fs.existsSync(dbPath);

if (!dbFileExists) {
  // Create an empty file to ensure the database is properly initialized.
  fs.closeSync(fs.openSync(dbPath, 'w'));
}

const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// --- Schema Definition ---
const schema = `
  -- Personnel Table
  CREATE TABLE IF NOT EXISTS personnel (
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
  CREATE TABLE IF NOT EXISTS important_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      jobTitle TEXT,
      periodFrom TEXT,
      periodTo TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS service_operations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      areaName TEXT,
      periodFrom TEXT,
      periodTo TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS decisive_storm (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      periodFrom TEXT,
      periodTo TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS training_courses (
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

  CREATE TABLE IF NOT EXISTS service_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      unitName TEXT,
      jobTitle TEXT,
      periodFrom TEXT,
      periodTo TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS medals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS brothers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      address TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sisters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      address TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS mechanisms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      personnel_id INTEGER NOT NULL,
      name TEXT,
      periodFrom TEXT,
      periodTo TEXT,
      FOREIGN KEY (personnel_id) REFERENCES personnel (id) ON DELETE CASCADE
  );

  -- Attachments Table
  CREATE TABLE IF NOT EXISTS attachments (
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
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      lastLogin TEXT,
      status TEXT NOT NULL
  );

  -- Roles Table
  CREATE TABLE IF NOT EXISTS roles (
      name TEXT PRIMARY KEY,
      description TEXT,
      permissions TEXT NOT NULL -- Stored as JSON
  );
  
  -- Activity Log Table
  CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      timestamp TEXT NOT NULL
  );
  
  -- Settings Table (Key-Value Store)
  CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
  );
`;

// --- Initialization ---
function initializeDatabase() {
  db.exec(schema);

  // Migration: Check if users table has password column, if not, add it.
  try {
    const columns = db.pragma('table_info(users)');
    const hasPasswordColumn = columns.some((col: any) => col.name === 'password');

    if (!hasPasswordColumn) {
        console.log("Migrating users table: Adding password column.");
        db.exec('ALTER TABLE users ADD COLUMN password TEXT');
    }
    
  } catch(e) {
    // This might fail if the users table doesn't exist yet, which is fine.
    // The schema execution above will handle creating it.
  }

  // Seed initial user if not present
  try {
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, name, password, role, lastLogin, status) 
      VALUES (1, 'manager', ?, 'مدير', 'لم يسجل دخول بعد', 'نشط')
    `);
    // NOTE: In a real app, hash this password. For this project, it's plaintext.
    insertUser.run('manager123'); 
  } catch (error: any) {
    console.error('Failed to seed default user:', error);
  }

  // Seed default role if not present
  try {
    const defaultPermissions = JSON.stringify([
        { id: 'p1', name: 'عرض لوحة التحكم', enabled: true },
        { id: 'p2', name: 'إدارة الضباط', enabled: true },
        { id: 'p3', name: 'إنشاء التقارير', enabled: true },
        { id: 'p4', name: 'إدارة المستخدمين والصلاحيات', enabled: true },
        { id: 'p5', name: 'الوصول للإعدادات المتقدمة', enabled: true },
    ]);
    const insertRole = db.prepare(`
      INSERT OR IGNORE INTO roles (name, description, permissions) 
      VALUES ('مدير', 'يمتلك جميع صلاحيات الوصول للنظام.', ?)
    `);
    insertRole.run(defaultPermissions);
  } catch (error: any) {
      console.error('Failed to seed default role:', error);
  }
}

// Run initialization logic only if the DB file was just created
if (!dbFileExists) {
    console.log("Database file not found, initializing...");
    initializeDatabase();
}


export default db;
