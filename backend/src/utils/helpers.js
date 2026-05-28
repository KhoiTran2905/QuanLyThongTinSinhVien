// src/utils/helpers.js
const { GRADE_SCALE } = require('./constants');

// Calculate letter grade from score
const getLetterGrade = (score) => {
  for (const grade of GRADE_SCALE) {
    if (score >= grade.min && score <= grade.max) {
      return { letter: grade.letter, gpa: grade.gpa };
    }
  }
  return { letter: 'F', gpa: 0 };
};

// Calculate average score (30% midterm + 70% final)
const calculateAverage = (midterm, final) => {
  return Math.round((midterm * 0.3 + final * 0.7) * 100) / 100;
};

// Calculate GPA from grades array
const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;

  let totalWeightedGPA = 0;
  let totalCredits = 0;

  grades.forEach(grade => {
    if (grade.gpa_score !== null && grade.credits) {
      totalWeightedGPA += grade.gpa_score * grade.credits;
      totalCredits += grade.credits;
    }
  });

  return totalCredits > 0 ? Math.round((totalWeightedGPA / totalCredits) * 100) / 100 : 0;
};

// Get academic classification from GPA
const getAcademicClassification = (gpa) => {
  if (gpa >= 3.6) return 'Xuất sắc';
  if (gpa >= 3.2) return 'Giỏi';
  if (gpa >= 2.5) return 'Khá';
  if (gpa >= 2.0) return 'Trung bình';
  return 'Yếu';
};

// Get current semester string
const getCurrentSemester = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 8) {
    return `HK1 (${year}-${year + 1})`;
  } else if (month >= 1) {
    return `HK2 (${year - 1}-${year})`;
  }
};

// Get week number
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Get week date range
const getWeekDateRange = (year, weekNum) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNum - 1) * 7;
  const startOfWeek = new Date(firstDayOfYear);
  startOfWeek.setDate(firstDayOfYear.getDate() + daysOffset - firstDayOfYear.getDay() + 1);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return { startOfWeek, endOfWeek };
};

// Format date to Vietnamese
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

module.exports = {
  getLetterGrade,
  calculateAverage,
  calculateGPA,
  getAcademicClassification,
  getCurrentSemester,
  getWeekNumber,
  getWeekDateRange,
  formatDate,
  formatCurrency
};
