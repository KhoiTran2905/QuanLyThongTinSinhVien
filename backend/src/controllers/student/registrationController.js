// src/controllers/student/registrationController.js
const { query, queryOne, insert, transaction } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');

// Helper
const getStudentId = async (userId) => {
  const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  return student ? student.id : null;
};

// @desc    Get registration info (period, rules)
// @route   GET /api/student/registration/info
const getRegistrationInfo = async (req, res) => {
  try {
    const currentSemester = await queryOne(
      'SELECT * FROM semesters WHERE is_current = true'
    );

    if (!currentSemester) {
      return ApiResponse.success(res, {
        isOpen: false,
        message: 'Chưa có đợt đăng ký nào đang mở'
      });
    }

    const now = new Date();
    const regStart = new Date(currentSemester.registration_start);
    const regEnd = new Date(currentSemester.registration_end);
    const isOpen = now >= regStart && now <= regEnd;

    const studentId = await getStudentId(req.user.id);
    const registered = await queryOne(
      `SELECT COALESCE(SUM(c.credits), 0) as total_credits, COUNT(*) as total_courses
       FROM registrations r
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.student_id = ? AND r.semester = ? AND r.status != 'Đã hủy'`,
      [studentId, currentSemester.code]
    );

    return ApiResponse.success(res, {
      isOpen,
      semester: currentSemester,
      registrationStart: currentSemester.registration_start,
      registrationEnd: currentSemester.registration_end,
      minCredits: 14,
      maxCredits: 24,
      registeredCredits: registered.total_credits || 0,
      registeredCourses: registered.total_courses || 0
    });
  } catch (error) {
    console.error('Registration info error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thông tin đăng ký');
  }
};

// @desc    Get available courses for registration
// @route   GET /api/student/registration/available
const getAvailableCourses = async (req, res) => {
  try {
    const { search, department_id } = req.query;
    const studentId = await getStudentId(req.user.id);

    let whereClause = "WHERE c.status = 'Đang mở'";
    let params = [];

    if (search) {
      whereClause += ' AND (c.name LIKE ? OR c.course_code LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (department_id) {
      whereClause += ' AND c.department_id = ?';
      params.push(department_id);
    }

    const courses = await query(
      `SELECT c.*,
              d.name as department_name,
              i.full_name as instructor_name, i.degree,
              s.day_of_week, s.period_start, s.period_end, s.start_time, s.end_time,
              s.room, s.group_number,
              CASE WHEN r.id IS NOT NULL AND r.status != 'Đã hủy' THEN 1 ELSE 0 END as is_registered
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN instructors i ON c.instructor_id = i.id
       LEFT JOIN schedules s ON s.course_id = c.id
       LEFT JOIN registrations r ON r.course_id = c.id AND r.student_id = ? AND r.status != 'Đã hủy'
       ${whereClause}
       ORDER BY c.department_id, c.course_code`,
      [studentId, ...params]
    );

    return ApiResponse.success(res, courses);
  } catch (error) {
    console.error('Available courses error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách môn học');
  }
};

// @desc    Get registered courses
// @route   GET /api/student/registration/registered
const getRegisteredCourses = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);

    const currentSemester = await queryOne('SELECT code FROM semesters WHERE is_current = true');
    const semesterCode = currentSemester ? currentSemester.code : null;

    const courses = await query(
      `SELECT r.id as registration_id, r.registered_at, r.status as reg_status,
              c.id as course_id, c.course_code, c.name as course_name, c.credits,
              s.day_of_week, s.start_time, s.end_time, s.room,
              i.full_name as instructor_name
       FROM registrations r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN schedules s ON s.course_id = c.id
       LEFT JOIN instructors i ON c.instructor_id = i.id
       WHERE r.student_id = ? AND r.semester = ? AND r.status != 'Đã hủy'
       ORDER BY r.registered_at DESC`,
      [studentId, semesterCode]
    );

    // Calculate totals
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
    const estimatedFee = totalCredits * 450000; // 450,000đ per credit

    return ApiResponse.success(res, {
      courses,
      summary: {
        totalCourses: courses.length,
        totalCredits,
        estimatedFee
      }
    });
  } catch (error) {
    console.error('Registered courses error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy môn đã đăng ký');
  }
};

// @desc    Register a course
// @route   POST /api/student/registration/register
const registerCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    const studentId = await getStudentId(req.user.id);

    // Check if registration is open
    const currentSemester = await queryOne('SELECT * FROM semesters WHERE is_current = true');
    if (!currentSemester) {
      return ApiResponse.badRequest(res, 'Không có đợt đăng ký nào đang mở');
    }

    const now = new Date();
    const regEnd = new Date(currentSemester.registration_end);
    if (now > regEnd) {
      return ApiResponse.badRequest(res, 'Đã hết thời gian đăng ký');
    }

    // Check if course exists and is open
    const course = await queryOne(
      "SELECT * FROM courses WHERE id = ? AND status = 'Đang mở'",
      [course_id]
    );

    if (!course) {
      return ApiResponse.notFound(res, 'Môn học không tồn tại hoặc đã đóng');
    }

    // Check if course is full
    if (course.current_students >= course.max_students) {
      return ApiResponse.badRequest(res, 'Môn học đã đầy');
    }

    // Check if already registered
    const existing = await queryOne(
      "SELECT id FROM registrations WHERE student_id = ? AND course_id = ? AND semester = ? AND status != 'Đã hủy'",
      [studentId, course_id, currentSemester.code]
    );

    if (existing) {
      return ApiResponse.badRequest(res, 'Bạn đã đăng ký môn học này');
    }

    // Check max credits
    const registered = await queryOne(
      `SELECT COALESCE(SUM(c.credits), 0) as total
       FROM registrations r
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.student_id = ? AND r.semester = ? AND r.status != 'Đã hủy'`,
      [studentId, currentSemester.code]
    );

    if ((registered.total || 0) + course.credits > 24) {
      return ApiResponse.badRequest(res, 'Vượt quá số tín chỉ tối đa cho phép (24 tín chỉ)');
    }

    // Check schedule conflict
    const newSchedule = await queryOne(
      'SELECT * FROM schedules WHERE course_id = ?',
      [course_id]
    );

    if (newSchedule) {
      const conflict = await queryOne(
        `SELECT c.name as course_name
         FROM registrations r
         LEFT JOIN schedules s ON s.course_id = r.course_id
         LEFT JOIN courses c ON r.course_id = c.id
         WHERE r.student_id = ? AND r.semester = ? AND r.status != 'Đã hủy'
         AND s.day_of_week = ? AND s.period_start = ?`,
        [studentId, currentSemester.code, newSchedule.day_of_week, newSchedule.period_start]
      );

      if (conflict) {
        return ApiResponse.badRequest(res, 
          `Trùng lịch với môn "${conflict.course_name}" vào ${newSchedule.day_of_week}, tiết ${newSchedule.period_start}`
        );
      }
    }

    // Register
    await transaction(async (connection) => {
      // Get schedule_id
      const [scheduleResult] = await connection.execute(
        'SELECT id FROM schedules WHERE course_id = ? LIMIT 1',
        [course_id]
      );
      const scheduleId = scheduleResult.length > 0 ? scheduleResult[0].id : null;

      await connection.execute(
        `INSERT INTO registrations (student_id, course_id, schedule_id, semester, status)
         VALUES (?, ?, ?, ?, 'Đã đăng ký')`,
        [studentId, course_id, scheduleId, currentSemester.code]
      );

      // Update course current_students
      await connection.execute(
        'UPDATE courses SET current_students = current_students + 1 WHERE id = ?',
        [course_id]
      );
    });

    return ApiResponse.created(res, null, 'Đăng ký môn học thành công');

  } catch (error) {
    console.error('Register course error:', error);
    return ApiResponse.error(res, 'Lỗi khi đăng ký môn học');
  }
};

// @desc    Cancel registration
// @route   DELETE /api/student/registration/:courseId
const cancelRegistration = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = await getStudentId(req.user.id);

    const currentSemester = await queryOne('SELECT * FROM semesters WHERE is_current = true');

    const registration = await queryOne(
      "SELECT * FROM registrations WHERE student_id = ? AND course_id = ? AND semester = ? AND status = 'Đã đăng ký'",
      [studentId, courseId, currentSemester.code]
    );

    if (!registration) {
      return ApiResponse.notFound(res, 'Không tìm thấy đăng ký này');
    }

    await transaction(async (connection) => {
      await connection.execute(
        "UPDATE registrations SET status = 'Đã hủy' WHERE id = ?",
        [registration.id]
      );

      await connection.execute(
        'UPDATE courses SET current_students = GREATEST(current_students - 1, 0) WHERE id = ?',
        [courseId]
      );
    });

    return ApiResponse.success(res, null, 'Hủy đăng ký thành công');
  } catch (error) {
    console.error('Cancel registration error:', error);
    return ApiResponse.error(res, 'Lỗi khi hủy đăng ký');
  }
};

// @desc    Confirm all registrations
// @route   POST /api/student/registration/confirm
const confirmRegistration = async (req, res) => {
  try {
    const studentId = await getStudentId(req.user.id);
    const currentSemester = await queryOne('SELECT * FROM semesters WHERE is_current = true');

    // Check minimum credits
    const registered = await queryOne(
      `SELECT COALESCE(SUM(c.credits), 0) as total
       FROM registrations r
       LEFT JOIN courses c ON r.course_id = c.id
       WHERE r.student_id = ? AND r.semester = ? AND r.status = 'Đã đăng ký'`,
      [studentId, currentSemester.code]
    );

    if ((registered.total || 0) < 14) {
      return ApiResponse.badRequest(res, 'Cần đăng ký tối thiểu 14 tín chỉ');
    }

    // Update all to confirmed
    await insert(
      `UPDATE registrations SET status = 'Đã xác nhận' 
       WHERE student_id = ? AND semester = ? AND status = 'Đã đăng ký'`,
      [studentId, currentSemester.code]
    );

    return ApiResponse.success(res, null, 'Xác nhận đăng ký thành công');
  } catch (error) {
    console.error('Confirm registration error:', error);
    return ApiResponse.error(res, 'Lỗi khi xác nhận đăng ký');
  }
};

module.exports = {
  getRegistrationInfo,
  getAvailableCourses,
  getRegisteredCourses,
  registerCourse,
  cancelRegistration,
  confirmRegistration
};