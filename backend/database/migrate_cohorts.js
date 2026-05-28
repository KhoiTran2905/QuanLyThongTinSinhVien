require('dotenv').config();
const { connectDatabase, getPool } = require('../src/config/database');

async function migrate() {
  try {
    await connectDatabase();
    const pool = getPool();
    
    console.log('1. Creating cohorts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cohorts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        start_year INT,
        end_year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('2. Adding cohort_id to students...');
    // check if cohort_id already exists
    const [cols] = await pool.query("SHOW COLUMNS FROM students LIKE 'cohort_id'");
    if (cols.length === 0) {
      await pool.query('ALTER TABLE students ADD COLUMN cohort_id INT DEFAULT NULL');
      // Foreign key constraint might fail if there's no data, let's add it
      await pool.query('ALTER TABLE students ADD CONSTRAINT fk_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL');
    }

    console.log('3. Migrating existing data...');
    // check if academic_year exists
    const [oldCols] = await pool.query("SHOW COLUMNS FROM students LIKE 'academic_year'");
    if (oldCols.length > 0) {
      const [distinctYears] = await pool.query('SELECT DISTINCT academic_year FROM students WHERE academic_year IS NOT NULL');
      
      for (const row of distinctYears) {
        const yearStr = row.academic_year;
        
        // Insert into cohorts if not exists
        let code = yearStr.toUpperCase();
        let name = 'Khóa ' + code;
        
        // try to extract year
        let start_year = null;
        let end_year = null;
        
        const numMatch = code.match(/\d+/);
        if (numMatch) {
            let num = parseInt(numMatch[0]);
            if (num < 100) {
                num += 2000;
            }
            start_year = num;
            end_year = num + 4;
        }

        try {
            await pool.query(
                'INSERT IGNORE INTO cohorts (code, name, start_year, end_year) VALUES (?, ?, ?, ?)',
                [code, name, start_year, end_year]
            );
            
            // Update students
            await pool.query(
                'UPDATE students SET cohort_id = (SELECT id FROM cohorts WHERE code = ?) WHERE academic_year = ?',
                [code, yearStr]
            );
        } catch (e) {
            console.error('Error migrating year', yearStr, e);
        }
      }

      console.log('4. Dropping academic_year column...');
      await pool.query('ALTER TABLE students DROP COLUMN academic_year');
    } else {
        console.log('academic_year column not found. Already migrated?');
    }
    
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
