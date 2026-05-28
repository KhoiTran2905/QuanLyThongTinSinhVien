// src/controllers/admin/reportController.js
const { query, queryOne } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');

// @desc    Get overview report
// @route   GET /api/admin/reports/overview
const getOverview = async (req, res) => {
  try {
    const totalStudents = await queryOne("SELECT COUNT(*) as count FROM students WHERE status = 'Đang học'");
    const totalInstructors = await queryOne("SELECT COUNT(*) as count FROM instructors WHERE status = 'Đang dạy'");
    const totalCourses = await queryOne("SELECT COUNT(*) as count FROM courses");
    const avgGPA = await queryOne("SELECT AVG(gpa) as avg FROM students WHERE status = 'Đang học' AND gpa > 0");
    
    const graduated = await queryOne("SELECT COUNT(*) as count FROM students WHERE status = 'Đã tốt nghiệp'");
    const totalEver = await queryOne("SELECT COUNT(*) as count FROM students WHERE status IN ('Đang học', 'Đã tốt nghiệp')");

    const graduationRate = totalEver.count > 0
      ? ((graduated.count / totalEver.count) * 100).toFixed(1)
      : 0;

    return ApiResponse.success(res, {
      totalStudents: totalStudents.count,
      totalInstructors: totalInstructors.count,
      totalCourses: totalCourses.count,
      avgGPA: avgGPA.avg ? parseFloat(avgGPA.avg).toFixed(2) : '0.00',
      graduationRate: parseFloat(graduationRate)
    });
  } catch (error) {
    console.error('Report overview error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy báo cáo tổng quan');
  }
};

// @desc    Get enrollment trends (tuyển sinh & tốt nghiệp)
// @route   GET /api/admin/reports/enrollment-trends
const getEnrollmentTrends = async (req, res) => {
  try {
    const newStudents = await query(
      `SELECT YEAR(enrollment_date) as year, COUNT(*) as count
       FROM students
       WHERE enrollment_date IS NOT NULL
       GROUP BY YEAR(enrollment_date)
       ORDER BY year ASC`
    );

    const graduated = await query(
      `SELECT YEAR(updated_at) as year, COUNT(*) as count
       FROM students
       WHERE status = 'Đã tốt nghiệp'
       GROUP BY YEAR(updated_at)
       ORDER BY year ASC`
    );

    return ApiResponse.success(res, { newStudents, graduated });
  } catch (error) {
    console.error('Enrollment trends error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy xu hướng tuyển sinh');
  }
};

// @desc    Get academic ranking distribution
// @route   GET /api/admin/reports/academic-ranking
const getAcademicRanking = async (req, res) => {
  try {
    const distribution = await query(
      `SELECT 
        CASE
          WHEN gpa >= 3.6 THEN 'Xuất sắc'
          WHEN gpa >= 3.2 THEN 'Giỏi'
          WHEN gpa >= 2.5 THEN 'Khá'
          WHEN gpa >= 2.0 THEN 'Trung bình'
          ELSE 'Yếu'
        END as classification,
        COUNT(*) as count
       FROM students
       WHERE status = 'Đang học' AND gpa > 0
       GROUP BY classification
       ORDER BY FIELD(classification, 'Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', 'Yếu')`
    );

    const total = distribution.reduce((sum, d) => sum + d.count, 0);
    const result = distribution.map(d => ({
      ...d,
      percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : 0
    }));

    return ApiResponse.success(res, result);
  } catch (error) {
    console.error('Academic ranking error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy phân bố học lực');
  }
};

// @desc    Get GPA by department over semesters
// @route   GET /api/admin/reports/gpa-by-department
const getGPAByDepartment = async (req, res) => {
  try {
    const { period } = req.query; // '2_years', '1_year'

    const data = await query(
      `SELECT d.name as department_name, d.code as department_code,
              g.semester,
              AVG(g.gpa_score) as avg_gpa
       FROM grades g
       LEFT JOIN students s ON g.student_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE g.status = 'Đã duyệt' AND g.gpa_score > 0 AND d.id IS NOT NULL
       GROUP BY d.id, d.name, d.code, g.semester
       ORDER BY g.semester ASC, d.name ASC`
    );

    return ApiResponse.success(res, data);
  } catch (error) {
    console.error('GPA by department error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy GPA theo khoa');
  }
};

// @desc    Get graduation rate over years
// @route   GET /api/admin/reports/graduation-rate
const getGraduationRate = async (req, res) => {
  try {
    const data = await query(
      `SELECT 
        academic_year,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Đã tốt nghiệp' THEN 1 ELSE 0 END) as graduated,
        ROUND(SUM(CASE WHEN status = 'Đã tốt nghiệp' THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as rate
       FROM students
       WHERE academic_year IS NOT NULL
       GROUP BY academic_year
       ORDER BY academic_year ASC`
    );

    return ApiResponse.success(res, data);
  } catch (error) {
    console.error('Graduation rate error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy tỷ lệ tốt nghiệp');
  }
};

// @desc    Get top departments by students
// @route   GET /api/admin/reports/top-departments
const getTopDepartments = async (req, res) => {
  try {
    const data = await query(
      `SELECT d.name as department_name, d.code,
              COUNT(s.id) as student_count
       FROM departments d
       LEFT JOIN students s ON s.department_id = d.id AND s.status = 'Đang học'
       GROUP BY d.id, d.name, d.code
       ORDER BY student_count DESC`
    );

    return ApiResponse.success(res, data);
  } catch (error) {
    console.error('Top departments error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy top ngành học');
  }
};

// @desc    Get gender distribution
// @route   GET /api/admin/reports/gender-distribution
const getGenderDistribution = async (req, res) => {
  try {
    const data = await query(
      `SELECT gender, COUNT(*) as count
       FROM students
       WHERE status = 'Đang học'
       GROUP BY gender`
    );

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const result = data.map(d => ({
      ...d,
      percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : 0
    }));

    return ApiResponse.success(res, result);
  } catch (error) {
    console.error('Gender distribution error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy phân bố giới tính');
  }
};

// @desc    Get department details table
// @route   GET /api/admin/reports/department-details
const getDepartmentDetails = async (req, res) => {
  try {
    const data = await query(
      `SELECT 
        d.name as department_name,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(DISTINCT i.id) as instructor_count,
        ROUND(COUNT(DISTINCT s.id) / NULLIF(COUNT(DISTINCT i.id), 0), 1) as sv_gv_ratio,
        ROUND(AVG(s.gpa), 2) as avg_gpa
       FROM departments d
       LEFT JOIN students s ON s.department_id = d.id AND s.status = 'Đang học'
       LEFT JOIN instructors i ON i.department_id = d.id AND i.status = 'Đang dạy'
       GROUP BY d.id, d.name
       ORDER BY student_count DESC`
    );

    return ApiResponse.success(res, data);
  } catch (error) {
    console.error('Department details error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thống kê khoa');
  }
};

module.exports = {
  getOverview,
  getEnrollmentTrends,
  getAcademicRanking,
  getGPAByDepartment,
  getGraduationRate,
  getTopDepartments,
  getGenderDistribution,
  getDepartmentDetails
};