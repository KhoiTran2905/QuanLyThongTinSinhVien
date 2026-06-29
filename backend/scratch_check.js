require('dotenv').config();
const { query, connectDatabase } = require('./src/config/database');

async function main() {
  try {
    await connectDatabase();
    const courses = await query('SELECT id, course_code, semester FROM courses');
    console.log(`Total courses: ${courses.length}`);
    const emptyCourses = courses.filter(c => !c.semester);
    console.log(`Courses without semester: ${emptyCourses.length}`);
    
    const grades = await query('SELECT id, course_id, semester FROM grades');
    console.log(`Total grades: ${grades.length}`);
    const emptyGrades = grades.filter(g => !g.semester);
    console.log(`Grades without semester: ${emptyGrades.length}`);

    // Let's also check what semesters exist in the database
    const sysSemesters = await query('SELECT * FROM semesters');
    console.log('System semesters:', sysSemesters);
    
    const settings = await query('SELECT * FROM settings WHERE setting_key = "current_semester"');
    console.log('Current semester in settings:', settings);
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

main();
