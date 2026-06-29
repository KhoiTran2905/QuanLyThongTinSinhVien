require('dotenv').config();
const { query, connectDatabase } = require('./src/config/database');

async function main() {
  try {
    await connectDatabase();
    const semesters = await query('SELECT DISTINCT semester FROM grades');
    console.log('Distinct semesters in grades:', semesters);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

main();
