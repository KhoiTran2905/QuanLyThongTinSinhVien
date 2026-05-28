// src/controllers/admin/courseController.js
const { query, queryOne, insert } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');
const { getPagination, getPagingData } = require('../../utils/pagination');

// @desc    Get all courses
// @route   GET /api/admin/courses
const getAllCourses = async (req, res) => {
  try {
    const { page, limit, search, status, department_id, type } = req.query;
    const { currentPage, pageSize, offset } = getPagination(page, limit);

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (c.name LIKE ? OR c.course_code LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (status && status !== 'all') {
      whereClause += ' AND c.status = ?';
      params.push(status);
    }

    if (department_id) {
      whereClause += ' AND c.department_id = ?';
      params.push(department_id);
    }

    if (type && type !== 'all') {
      whereClause += ' AND c.type = ?';
      params.push(type);
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM courses c ${whereClause}`,
      params
    );

    const courses = await query(
      `SELECT c.*,
              d.name as department_name, d.code as department_code,
              i.full_name as instructor_name, i.academic_rank, i.degree
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN instructors i ON c.instructor_id = i.id
       ${whereClause}
       ORDER BY c.status ASC, c.name ASC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const pagination = getPagingData(countResult.total, currentPage, pageSize);

    return ApiResponse.paginated(res, courses, pagination);
  } catch (error) {
    console.error('Get all courses error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách môn học');
  }
};

// @desc    Get course by ID
// @route   GET /api/admin/courses/:id
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await queryOne(
      `SELECT c.*,
              d.name as department_name,
              i.full_name as instructor_name, i.email as instructor_email
       FROM courses c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN instructors i ON c.instructor_id = i.id
       WHERE c.id = ?`,
      [id]
    );

    if (!course) {
      return ApiResponse.notFound(res, 'Không tìm thấy môn học');
    }

    // Get schedules for this course
    const schedules = await query(
      `SELECT s.*, i.full_name as instructor_name
       FROM schedules s
       LEFT JOIN instructors i ON s.instructor_id = i.id
       WHERE s.course_id = ?`,
      [id]
    );

    course.schedules = schedules;

    return ApiResponse.success(res, course);
  } catch (error) {
    console.error('Get course by ID error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thông tin môn học');
  }
};

// @desc    Create course
// @route   POST /api/admin/courses
const createCourse = async (req, res) => {
  try {
    const {
      course_code, name, credits, department_id, instructor_id,
      description, type, max_students, status, semester
    } = req.body;

    const existing = await queryOne(
      'SELECT id FROM courses WHERE course_code = ?',
      [course_code]
    );

    if (existing) {
      return ApiResponse.badRequest(res, 'Mã môn học đã tồn tại');
    }

    const result = await insert(
      `INSERT INTO courses (
        course_code, name, credits, department_id, instructor_id,
        description, type, max_students, status, semester
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_code, name, credits || 3,
        department_id || null, instructor_id || null,
        description || null, type || 'Bắt buộc',
        max_students || 150, status || 'Đang mở',
        semester || null
      ]
    );

    return ApiResponse.created(res, {
      id: result.insertId,
      course_code,
      name
    }, 'Thêm môn học thành công');

  } catch (error) {
    console.error('Create course error:', error);
    return ApiResponse.error(res, 'Lỗi khi thêm môn học');
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const course = await queryOne('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return ApiResponse.notFound(res, 'Không tìm thấy môn học');
    }

    const allowedFields = [
      'name', 'credits', 'department_id', 'instructor_id',
      'description', 'type', 'max_students', 'current_students',
      'status', 'semester'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }

    if (updates.length === 0) {
      return ApiResponse.badRequest(res, 'Không có dữ liệu để cập nhật');
    }

    values.push(id);
    await insert(`UPDATE courses SET ${updates.join(', ')} WHERE id = ?`, values);

    return ApiResponse.success(res, null, 'Cập nhật môn học thành công');
  } catch (error) {
    console.error('Update course error:', error);
    return ApiResponse.error(res, 'Lỗi khi cập nhật môn học');
  }
};

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await queryOne('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) {
      return ApiResponse.notFound(res, 'Không tìm thấy môn học');
    }

    // Check if course has registrations
    const registrations = await queryOne(
      "SELECT COUNT(*) as count FROM registrations WHERE course_id = ? AND status != 'Đã hủy'",
      [id]
    );

    if (registrations.count > 0) {
      return ApiResponse.badRequest(res, 'Không thể xóa môn học đang có sinh viên đăng ký');
    }

    await insert('DELETE FROM courses WHERE id = ?', [id]);

    return ApiResponse.success(res, null, 'Xóa môn học thành công');
  } catch (error) {
    console.error('Delete course error:', error);
    return ApiResponse.error(res, 'Lỗi khi xóa môn học');
  }
};

// @desc    Get course statistics
// @route   GET /api/admin/courses/stats
const getCourseStats = async (req, res) => {
  try {
    const total = await queryOne('SELECT COUNT(*) as count FROM courses');
    const open = await queryOne("SELECT COUNT(*) as count FROM courses WHERE status = 'Đang mở'");
    const totalCredits = await queryOne('SELECT SUM(credits) as total FROM courses');
    const totalRegistrations = await queryOne(
      "SELECT COUNT(*) as count FROM registrations WHERE status != 'Đã hủy'"
    );

    // Type distribution
    const typeDistribution = await query(
      'SELECT type, COUNT(*) as count FROM courses GROUP BY type'
    );

    // Department distribution
    const departmentDistribution = await query(
      `SELECT d.name as department_name, COUNT(c.id) as count
       FROM departments d
       LEFT JOIN courses c ON c.department_id = d.id
       GROUP BY d.id, d.name
       ORDER BY count DESC`
    );

    return ApiResponse.success(res, {
      total: total.count,
      open: open.count,
      totalCredits: totalCredits.total || 0,
      totalRegistrations: totalRegistrations.count,
      typeDistribution,
      departmentDistribution
    });
  } catch (error) {
    console.error('Course stats error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thống kê môn học');
  }
};

// @desc    Get top enrolled courses
// @route   GET /api/admin/courses/top-enrolled
const getTopEnrolled = async (req, res) => {
  try {
    const topCourses = await query(
      `SELECT c.id, c.course_code, c.name, c.current_students, c.max_students
       FROM courses c
       WHERE c.status = 'Đang mở'
       ORDER BY c.current_students DESC
       LIMIT 5`
    );

    return ApiResponse.success(res, topCourses);
  } catch (error) {
    console.error('Top enrolled error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy top môn học');
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getTopEnrolled
};