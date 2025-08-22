const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'ams.db');
    this.db = null;
    this.init();
  }

  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('✅ Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const createApplicantsTable = `
      CREATE TABLE IF NOT EXISTS applicants (
        id TEXT PRIMARY KEY,
        reference_number TEXT UNIQUE NOT NULL,
        parent_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        grade TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'new',
        created_at TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createApplicantsTable, (err) => {
      if (err) {
        console.error('Error creating applicants table:', err);
      } else {
        console.log('✅ Applicants table ready');
      }
    });
  }

  saveApplicant(applicant) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO applicants (
          id, reference_number, parent_name, email, phone, city, grade, message, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        applicant.id,
        applicant.reference_number,
        applicant.parent_name,
        applicant.email,
        applicant.phone,
        applicant.city,
        applicant.grade,
        applicant.message,
        applicant.status,
        applicant.created_at
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Database save error:', err);
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, id: this.lastID });
        }
      });
    });
  }

  getApplicantById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applicants WHERE id = ?';
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, applicant: row });
        }
      });
    });
  }

  getApplicantByReference(referenceNumber) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM applicants WHERE reference_number = ?';
      
      this.db.get(sql, [referenceNumber], (err, row) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, applicant: row });
        }
      });
    });
  }

  getAllApplicants(limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM applicants 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      this.db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, applicants: rows });
        }
      });
    });
  }

  updateApplicantStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE applicants 
        SET status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      this.db.run(sql, [status, id], function(err) {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, changes: this.changes });
        }
      });
    });
  }

  getEnrollmentStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_applications,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_applications,
          COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
          COUNT(CASE WHEN status = 'enrolled' THEN 1 END) as enrolled,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
          COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today_applications,
          COUNT(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 END) as this_week_applications
        FROM applicants
      `;
      
      this.db.get(sql, [], (err, row) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, stats: row });
        }
      });
    });
  }

  getApplicantsByGrade() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT grade, COUNT(*) as count 
        FROM applicants 
        GROUP BY grade 
        ORDER BY grade
      `;
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, gradeStats: rows });
        }
      });
    });
  }

  searchApplicants(query, limit = 50) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM applicants 
        WHERE parent_name LIKE ? OR email LIKE ? OR phone LIKE ? OR reference_number LIKE ?
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      
      const searchTerm = `%${query}%`;
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, limit];
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          resolve({ success: false, error: err.message });
        } else {
          resolve({ success: true, applicants: rows });
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

// Export singleton instance
module.exports = new DatabaseService();
