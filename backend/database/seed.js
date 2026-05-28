// database/seed.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seed = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ptit_student_management',
      multipleStatements: true
    });

    console.log('📦 Connected to database');

    // Generate proper bcrypt hashes
    console.log('🔐 Generating password hashes...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const studentHash = await bcrypt.hash('123456', 10);

    // Read seed file
    const seedPath = path.join(__dirname, 'seeders', 'seed_data.sql');
    let seedSQL = fs.readFileSync(seedPath, 'utf8');

    // Replace placeholder hashes with real ones
    seedSQL = seedSQL.replace(/\$2a\$10\$8KzQJK1RQhF8xVbKqGZRXODq\.FqXsN5q5LrKxJZ7Q9YQ5WzZ5Y5Iq/g, adminHash);
    seedSQL = seedSQL.replace(/\$2a\$10\$92IXUNpkjO0rOQ5byMi\.Ye4oKoEa3Ro9llC\/\.og\/at2\.uheWG\/igi/g, studentHash);

    console.log('🌱 Seeding data...');
    await connection.query(seedSQL);
    console.log('✅ Seed completed successfully!');
    console.log('');
    console.log('📋 Demo accounts:');
    console.log('   Admin:   admin / admin123');
    console.log('   Student: B21DCCN001 / 123456');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    if (error.sqlMessage) {
      console.error('   SQL Error:', error.sqlMessage);
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
};

seed();
