require('dotenv').config();
const { query, connectDatabase } = require('./src/config/database');

async function main() {
  try {
    await connectDatabase();
    
    // Update courses
    const res = await query("UPDATE courses SET semester = 'HK1 (2024-2025)' WHERE semester = 'Học kỳ 1'");
    console.log('Updated courses Học kỳ 1:', res.affectedRows);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

main();
