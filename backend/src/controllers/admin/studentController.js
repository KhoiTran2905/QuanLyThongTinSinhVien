// src/controllers/admin/studentController.js
const { query, queryOne, insert, transaction } = require('../../config/database');
const bcrypt = require('bcryptjs');
const ApiResponse = require('../../utils/apiResponse');
const { getPagination, getPagingData } = require('../../utils/pagination');

// @desc    Get all students with pagination, search, filter
// @route   GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const { page, limit, search, status, department_id, major_id, class_id } = req.query;
    const { currentPage, pageSize, offset } = getPagination(page, limit);

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Search
    if (search) {
      whereClause += ' AND (s.full_name LIKE ? OR s.student_code LIKE ? OR s.email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filter by status
    if (status && status !== 'all') {
      whereClause += ' AND s.status = ?';
      params.push(status);
    }

    // Filter by department
    if (department_id) {
      whereClause += ' AND s.department_id = ?';
      params.push(department_id);
    }

    // Filter by major
    if (major_id) {
      whereClause += ' AND s.major_id = ?';
      params.push(major_id);
    }

    // Filter by class
    if (class_id) {
      whereClause += ' AND s.class_id = ?';
      params.push(class_id);
    }

    // Count total
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM students s ${whereClause}`,
      params
    );

    // Get students
    const students = await query(
      `SELECT s.id, s.student_code, s.full_name, s.email, s.phone, s.avatar,
              s.gender, s.date_of_birth, s.gpa, s.total_credits, s.status,
              s.enrollment_date, s.created_at,
              d.name as department_name,
              m.name as major_name,
              c.class_code, c.name as class_name
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN majors m ON s.major_id = m.id
       LEFT JOIN classes c ON s.class_id = c.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const pagination = getPagingData(countResult.total, currentPage, pageSize);

    return ApiResponse.paginated(res, students, pagination);
  } catch (error) {
    console.error('Get all students error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách sinh viên');
  }
};

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await queryOne(
      `SELECT s.*,
              d.name as department_name, d.code as department_code,
              m.name as major_name, m.code as major_code,
              c.class_code, c.name as class_name
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN majors m ON s.major_id = m.id
       LEFT JOIN classes c ON s.class_id = c.id
       WHERE s.id = ?`,
      [id]
    );

    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy sinh viên');
    }

    return ApiResponse.success(res, student);
  } catch (error) {
    console.error('Get student by ID error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thông tin sinh viên');
  }
};

// @desc    Create new student
// @route   POST /api/admin/students
const createStudent = async (req, res) => {
  try {
    const {
      student_code, full_name, date_of_birth, gender, ethnicity, religion,
      id_number, id_issue_date, id_issue_place,
      email, personal_email, phone, permanent_address, current_address,
      department_id, major_id, class_id, academic_year, enrollment_date,
      training_system, status,
      father_name, father_phone, father_occupation,
      mother_name, mother_phone, mother_occupation
    } = req.body;

    // Check if student code already exists
    const existing = await queryOne(
      'SELECT id FROM students WHERE student_code = ?',
      [student_code]
    );

    if (existing) {
      return ApiResponse.badRequest(res, 'Mã sinh viên đã tồn tại');
    }

    const result = await transaction(async (connection) => {
      // Create user account for student
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt); // Default password

      const [userResult] = await connection.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [student_code, hashedPassword, 'student']
      );

      const userId = userResult.insertId;

      // Create student record
      const studentEmail = email || `${student_code.toLowerCase()}@ptit.edu.vn`;

      const [studentResult] = await connection.execute(
        `INSERT INTO students (
          user_id, student_code, full_name, date_of_birth, gender, ethnicity, religion,
          id_number, id_issue_date, id_issue_place,
          email, personal_email, phone, permanent_address, current_address,
          department_id, major_id, class_id, academic_year, enrollment_date,
          training_system, status,
          father_name, father_phone, father_occupation,
          mother_name, mother_phone, mother_occupation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, student_code, full_name, date_of_birth || null, gender || 'Nam',
          ethnicity || 'Kinh', religion || 'Không',
          id_number || null, id_issue_date || null, id_issue_place || null,
          studentEmail, personal_email || null, phone || null,
          permanent_address || null, current_address || null,
          department_id || null, major_id || null, class_id || null,
          academic_year || null, enrollment_date || new Date(),
          training_system || 'Chính quy', status || 'Chờ duyệt',
          father_name || null, father_phone || null, father_occupation || null,
          mother_name || null, mother_phone || null, mother_occupation || null
        ]
      );

      // Update class student count
      if (class_id) {
        await connection.execute(
          'UPDATE classes SET total_students = total_students + 1 WHERE id = ?',
          [class_id]
        );
      }

      return { userId, studentId: studentResult.insertId };
    });

    return ApiResponse.created(res, {
      id: result.studentId,
      student_code,
      full_name
    }, 'Thêm sinh viên thành công');

  } catch (error) {
    console.error('Create student error:', error);
    return ApiResponse.error(res, 'Lỗi khi thêm sinh viên');
  }
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if student exists
    const student = await queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy sinh viên');
    }

    // Build dynamic update query
    const allowedFields = [
      'full_name', 'date_of_birth', 'gender', 'ethnicity', 'religion',
      'id_number', 'id_issue_date', 'id_issue_place',
      'email', 'personal_email', 'phone', 'permanent_address', 'current_address',
      'department_id', 'major_id', 'class_id', 'academic_year',
      'training_system', 'status', 'gpa', 'total_credits',
      'father_name', 'father_phone', 'father_occupation',
      'mother_name', 'mother_phone', 'mother_occupation'
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

    await insert(
      `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return ApiResponse.success(res, null, 'Cập nhật sinh viên thành công');
  } catch (error) {
    console.error('Update student error:', error);
    return ApiResponse.error(res, 'Lỗi khi cập nhật sinh viên');
  }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await queryOne('SELECT * FROM students WHERE id = ?', [id]);
    if (!student) {
      return ApiResponse.notFound(res, 'Không tìm thấy sinh viên');
    }

    await transaction(async (connection) => {
      // Delete user account
      if (student.user_id) {
        await connection.execute('DELETE FROM users WHERE id = ?', [student.user_id]);
      }

      // Delete related records
      await connection.execute('DELETE FROM grades WHERE student_id = ?', [id]);
      await connection.execute('DELETE FROM registrations WHERE student_id = ?', [id]);
      await connection.execute('DELETE FROM tuitions WHERE student_id = ?', [id]);
      await connection.execute('DELETE FROM requests WHERE student_id = ?', [id]);

      // Delete student
      await connection.execute('DELETE FROM students WHERE id = ?', [id]);

      // Update class count
      if (student.class_id) {
        await connection.execute(
          'UPDATE classes SET total_students = GREATEST(total_students - 1, 0) WHERE id = ?',
          [student.class_id]
        );
      }
    });

    return ApiResponse.success(res, null, 'Xóa sinh viên thành công');
  } catch (error) {
    console.error('Delete student error:', error);
    return ApiResponse.error(res, 'Lỗi khi xóa sinh viên');
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};