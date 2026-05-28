// src/controllers/student/scheduleController.js
const { query, queryOne } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');
const { getWeekDateRange } = require('../../utils/helpers');

// Helper
const getStudentId = async (userId) => {
  const student = await queryOne('SELECT id, class_id FROM students WHERE user_id = ?', [userId]);
  return student;
};

// @desc    Get student's weekly schedule
// @route   GET /api/student/schedule
const getSchedule = async (req, res) => {
  try {
    const student = await getStudentId(req.user.id);
    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy thông tin sinh viên');
    }

    const { week_start, week_end } = req.query;

    // Default: current week
    const today = new Date();
    const startDate = week_start || (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - d.getDay() + 1); // Monday
      return d.toISOString().split('T')[0];
    })();
    const endDate = week_end || (() => {
      const d = new Date(today);
      d.setDate(d.getDate() - d.getDay() + 7); // Sunday
      return d.toISOString().split('T')[0];
    })();

    const schedules = await query(
      `SELECT s.*,
              c.course_code, c.name as course_name, c.credits,
              i.full_name as instructor_name, i.degree, i.academic_rank
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       LEFT JOIN instructors i ON s.instructor_id = i.id
       WHERE s.class_id = ?
       AND s.week_start <= ? AND s.week_end >= ?
       ORDER BY FIELD(s.day_of_week, 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'),
                s.period_start ASC`,
      [student.class_id, endDate, startDate]
    );

    return ApiResponse.success(res, {
      weekStart: startDate,
      weekEnd: endDate,
      schedules
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thời khóa biểu');
  }
};

// @desc    Get schedule by specific week
// @route   GET /api/student/schedule/week/:year/:weekNum
const getScheduleByWeek = async (req, res) => {
  try {
    const student = await getStudentId(req.user.id);
    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy thông tin sinh viên');
    }

    const { year, weekNum } = req.params;
    const { startOfWeek, endOfWeek } = getWeekDateRange(parseInt(year), parseInt(weekNum));

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    const schedules = await query(
      `SELECT s.*,
              c.course_code, c.name as course_name, c.credits,
              i.full_name as instructor_name, i.degree
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       LEFT JOIN instructors i ON s.instructor_id = i.id
       WHERE s.class_id = ?
       AND s.week_start <= ? AND s.week_end >= ?
       ORDER BY FIELD(s.day_of_week, 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'),
                s.period_start ASC`,
      [student.class_id, endDate, startDate]
    );

    return ApiResponse.success(res, {
      week: parseInt(weekNum),
      year: parseInt(year),
      weekStart: startDate,
      weekEnd: endDate,
      schedules
    });
  } catch (error) {
    console.error('Get schedule by week error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy TKB theo tuần');
  }
};

// @desc    Get schedule stats
// @route   GET /api/student/schedule/stats
const getScheduleStats = async (req, res) => {
  try {
    const student = await getStudentId(req.user.id);
    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy thông tin sinh viên');
    }

    const today = new Date().toISOString().split('T')[0];

    const totalCourses = await queryOne(
      `SELECT COUNT(DISTINCT course_id) as count FROM schedules
       WHERE class_id = ? AND week_start <= ? AND week_end >= ?`,
      [student.class_id, today, today]
    );

    const totalCredits = await queryOne(
      `SELECT COALESCE(SUM(DISTINCT c.credits), 0) as total
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.class_id = ? AND s.week_start <= ? AND s.week_end >= ?`,
      [student.class_id, today, today]
    );

    const sessionsPerWeek = await queryOne(
      `SELECT COUNT(*) as count FROM schedules
       WHERE class_id = ? AND week_start <= ? AND week_end >= ?`,
      [student.class_id, today, today]
    );

    return ApiResponse.success(res, {
      courses: totalCourses.count,
      credits: totalCredits.total,
      sessionsPerWeek: sessionsPerWeek.count
    });
  } catch (error) {
    console.error('Schedule stats error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thống kê TKB');
  }
};

module.exports = {
  getSchedule,
  getScheduleByWeek,
  getScheduleStats
};