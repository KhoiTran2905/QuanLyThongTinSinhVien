require('dotenv').config();
const { connectDatabase, getPool } = require('../src/config/database');

async function normalize() {
  try {
    await connectDatabase();
    const pool = getPool();
    
    console.log('1. Fetching all cohorts...');
    const [cohorts] = await pool.query('SELECT * FROM cohorts');
    
    // Create standard names like K19, K20... if they don't exist
    const standardYears = [19, 20, 21, 22, 23, 24];
    for (const yy of standardYears) {
      const code = `K${yy}`;
      const name = `Khóa K${yy}`;
      const start_year = 2000 + yy;
      const end_year = start_year + 4;
      
      const exists = cohorts.find(c => c.code === code);
      if (!exists) {
        console.log(`Inserting standard cohort ${code}...`);
        await pool.query(
          'INSERT INTO cohorts (code, name, start_year, end_year) VALUES (?, ?, ?, ?)',
          [code, name, start_year, end_year]
        );
      }
    }
    
    // Refresh cohorts list after insertion
    const [updatedCohorts] = await pool.query('SELECT * FROM cohorts');

    console.log('2. Normalizing non-standard cohorts...');
    for (const cohort of updatedCohorts) {
      let code = cohort.code;
      // Extract number part
      const numMatch = code.match(/\d+/);
      if (numMatch) {
        let num = parseInt(numMatch[0]);
        // e.g. 2021 -> 21
        let shortYear = num;
        if (num >= 2000) {
          shortYear = num - 2000;
        }
        
        let expectedCode = `K${shortYear}`;
        
        if (code !== expectedCode) {
          console.log(`Normalizing ${code} to ${expectedCode}...`);
          // Find the standard cohort
          const standardCohort = updatedCohorts.find(c => c.code === expectedCode);
          if (standardCohort) {
            // Update students to point to standardCohort
            console.log(`Moving students from ${code} (ID: ${cohort.id}) to ${expectedCode} (ID: ${standardCohort.id})`);
            await pool.query('UPDATE students SET cohort_id = ? WHERE cohort_id = ?', [standardCohort.id, cohort.id]);
            
            // Delete the old non-standard cohort
            console.log(`Deleting non-standard cohort ${code} (ID: ${cohort.id})`);
            await pool.query('DELETE FROM cohorts WHERE id = ?', [cohort.id]);
          }
        }
      }
    }
    
    console.log('Normalization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error normalizing:', error);
    process.exit(1);
  }
}

normalize();
