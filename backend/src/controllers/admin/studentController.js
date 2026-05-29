// src/controllers/admin/studentController.js
const fs = require('fs');
const { query, queryOne, insert, transaction } = require('../../config/database');
const bcrypt = require('bcryptjs');
const ApiResponse = require('../../utils/apiResponse');
const { getPagination, getPagingData } = require('../../utils/pagination');

// @desc    Get all students with pagination, search, filter
// @route   GET /api/admin/students
const getAllStudents = async (req, res) => {
  try {
    const { page, limit, search, status, department_id, major_id, class_id, cohort_id, gender, training_system } = req.query;
    const { currentPage, pageSize, offset } = getPagination(page, limit);

    let whereClause = 'WHERE 1=1';
    let params = [];

    // Search
    if (search) {
      whereClause += ' AND (s.full_name LIKE ? OR s.student_code LIKE ? OR c.class_code LIKE ? OR c.name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
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

    // Filter by cohort_id (Khóa)
    if (cohort_id) {
      whereClause += ' AND s.cohort_id = ?';
      params.push(cohort_id);
    }

    // Filter by gender
    if (gender && gender !== 'all') {
      whereClause += ' AND s.gender = ?';
      params.push(gender);
    }

    // Filter by training_system
    if (training_system && training_system !== 'all') {
      whereClause += ' AND s.training_system = ?';
      params.push(training_system);
    }

    // Count total
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM students s LEFT JOIN classes c ON s.class_id = c.id ${whereClause}`,
      params
    );

    // Get students
    const students = await query(
      `SELECT s.id, s.student_code, s.full_name, s.email, s.phone, s.avatar,
              s.gender, s.date_of_birth, s.gpa, s.total_credits, s.status,
              s.enrollment_date, s.created_at,
              d.name as department_name,
              m.name as major_name,
              c.class_code, c.name as class_name,
              ch.name as cohort_name, ch.code as cohort_code
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN majors m ON s.major_id = m.id
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN cohorts ch ON s.cohort_id = ch.id
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const pagination = getPagingData(countResult.total, currentPage, pageSize);

    return ApiResponse.paginated(res, students, pagination);
  } catch (error) {
    console.error('Get all students error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách sinh viên: ' + error.message);
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
              c.class_code, c.name as class_name,
              ch.name as cohort_name, ch.code as cohort_code
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.id
       LEFT JOIN majors m ON s.major_id = m.id
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN cohorts ch ON s.cohort_id = ch.id
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
      department_id, major_id, class_id, cohort_id, enrollment_date,
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
          department_id, major_id, class_id, cohort_id, enrollment_date,
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
          cohort_id || null, enrollment_date || new Date(),
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

    // Check unique email constraint
    if (updateData.email && updateData.email !== student.email) {
      const emailExists = await queryOne('SELECT id FROM students WHERE email = ? AND id != ?', [updateData.email, id]);
      if (emailExists) {
        return ApiResponse.badRequest(res, 'Email này đã được sử dụng bởi sinh viên khác');
      }
    }

    // Build dynamic update query
    const allowedFields = [
      'full_name', 'date_of_birth', 'gender', 'ethnicity', 'religion',
      'id_number', 'id_issue_date', 'id_issue_place',
      'email', 'personal_email', 'phone', 'permanent_address', 'current_address',
      'department_id', 'major_id', 'class_id', 'cohort_id',
      'training_system', 'status', 'gpa', 'total_credits',
      'father_name', 'father_phone', 'father_occupation',
      'mother_name', 'mother_phone', 'mother_occupation'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        let val = updateData[field];
        if (val === "" && ['department_id', 'major_id', 'class_id', 'cohort_id'].includes(field)) {
          val = null;
        }
        values.push(val);
      }
    }

    if (updates.length === 0) {
      return ApiResponse.badRequest(res, 'Không có dữ liệu để cập nhật');
    }

    values.push(id);

    await transaction(async (connection) => {
      await connection.execute(
        `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Handle class_id change
      if (updateData.class_id !== undefined) {
        const newClassId = updateData.class_id === "" ? null : updateData.class_id;
        const oldClassId = student.class_id;

        if (String(newClassId) !== String(oldClassId)) {
          if (oldClassId) {
            await connection.execute(
              'UPDATE classes SET total_students = GREATEST(total_students - 1, 0) WHERE id = ?',
              [oldClassId]
            );
          }
          if (newClassId) {
            await connection.execute(
              'UPDATE classes SET total_students = total_students + 1 WHERE id = ?',
              [newClassId]
            );
          }
        }
      }
    });

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
        await connection.execute('DELETE FROM notification_reads WHERE user_id = ?', [student.user_id]);
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

// @desc    Import students from Excel
// @route   POST /api/admin/students/import
const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'Vui lòng tải lên một file Excel');
    }

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.worksheets[0]; // Get the first worksheet
    if (!worksheet) {
      return ApiResponse.badRequest(res, 'File Excel không có dữ liệu');
    }

    // Map headers to column indices (assume row 1 is header)
    const headerRow = worksheet.getRow(1);
    const headers = {};
    headerRow.eachCell((cell, colNumber) => {
      headers[cell.value.toString().trim().toLowerCase()] = colNumber;
    });

    const getColIndex = (names) => {
      for (const name of names) {
        if (headers[name]) return headers[name];
      }
      return null;
    };

    const colCode = getColIndex(['mã sv', 'mã sinh viên', 'student code', 'student_code']);
    const colName = getColIndex(['họ tên', 'họ và tên', 'full name', 'tên']);
    const colEmail = getColIndex(['email']);
    const colGender = getColIndex(['giới tính', 'gender']);
    const colDob = getColIndex(['ngày sinh', 'dob', 'date of birth']);
    const colPhone = getColIndex(['sđt', 'số điện thoại', 'phone']);
    const colClass = getColIndex(['mã lớp', 'lớp', 'class code', 'class']);
    const colMajor = getColIndex(['mã ngành', 'ngành', 'major code', 'major']);
    const colDept = getColIndex(['mã khoa', 'khoa', 'department code', 'department']);
    const colSystem = getColIndex(['hệ đào tạo', 'hệ']);
    const colCohort = getColIndex(['khóa', 'academic year', 'cohort']);

    if (!colCode || !colName || !colEmail) {
      return ApiResponse.badRequest(res, 'File Excel thiếu các cột bắt buộc: Mã SV, Họ tên, Email');
    }

    let successCount = 0;
    const errors = [];

    // Pre-fetch reference data and build dictionaries (O(1) lookup)
    const departments = await query('SELECT id, code, name FROM departments');
    const majors = await query('SELECT id, code, name FROM majors');
    const classes = await query('SELECT id, class_code, name FROM classes');
    const cohorts = await query('SELECT id, code, name FROM cohorts');

    const deptMap = {};
    departments.forEach(d => {
      if(d.code) deptMap[d.code.toLowerCase()] = d.id;
      if(d.name) deptMap[d.name.toLowerCase()] = d.id;
    });

    const majorMap = {};
    majors.forEach(m => {
      if(m.code) majorMap[m.code.toLowerCase()] = m.id;
      if(m.name) majorMap[m.name.toLowerCase()] = m.id;
    });

    const classMap = {};
    classes.forEach(c => {
      if(c.class_code) classMap[c.class_code.toLowerCase()] = c.id;
      if(c.name) classMap[c.name.toLowerCase()] = c.id;
    });

    const cohortMap = {};
    cohorts.forEach(c => {
      if(c.code) cohortMap[c.code.toLowerCase()] = c.id;
      if(c.name) cohortMap[c.name.toLowerCase()] = c.id;
    });

    const parseDate = (val) => {
      if (!val) return null;
      if (val instanceof Date) return val;
      const parts = val.toString().split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[2].length === 4) {
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        if (parts[0].length === 4) {
          return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
        }
      }
      return null;
    };

    // Iterate through rows starting from row 2
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      
      const student_code = row.getCell(colCode).value?.toString().trim();
      const full_name = row.getCell(colName).value?.toString().trim();
      const email = row.getCell(colEmail).value?.toString().trim();

      if (!student_code || !full_name || !email) {
        if (!student_code && !full_name && !email) continue;
        errors.push(`Dòng ${rowNumber}: Thiếu thông tin bắt buộc`);
        continue;
      }

      // Check existence
      const existing = await queryOne('SELECT id FROM students WHERE student_code = ?', [student_code]);
      if (existing) {
        errors.push(`Dòng ${rowNumber}: Sinh viên ${student_code} đã tồn tại (Bỏ qua)`);
        continue;
      }

      const gender = colGender ? (row.getCell(colGender).value?.toString().trim() || 'Nam') : 'Nam';
      const date_of_birth = colDob ? parseDate(row.getCell(colDob).value) : null;
      const phone = colPhone ? row.getCell(colPhone).value?.toString().trim() : null;
      
      const classVal = colClass ? row.getCell(colClass).value?.toString().trim().toLowerCase() : null;
      const class_id = classVal ? classMap[classVal] : null;

      const majorVal = colMajor ? row.getCell(colMajor).value?.toString().trim().toLowerCase() : null;
      const major_id = majorVal ? majorMap[majorVal] : null;

      const deptVal = colDept ? row.getCell(colDept).value?.toString().trim().toLowerCase() : null;
      const department_id = deptVal ? deptMap[deptVal] : null;

      const training_system = colSystem ? (row.getCell(colSystem).value?.toString().trim() || 'Chính quy') : 'Chính quy';
      
      const cohortVal = colCohort ? row.getCell(colCohort).value?.toString().trim().toLowerCase() : null;
      const cohort_id = cohortVal ? cohortMap[cohortVal] : null;

      try {
        await transaction(async (connection) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('123456', salt);

          const [userResult] = await connection.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [student_code, hashedPassword, 'student']
          );

          await connection.execute(
            `INSERT INTO students (
              user_id, student_code, full_name, date_of_birth, gender, email, phone,
              department_id, major_id, class_id, cohort_id, training_system, status, enrollment_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userResult.insertId, student_code, full_name, date_of_birth, gender, email, phone,
              department_id, major_id, class_id, cohort_id, training_system, 'Đang học', new Date()
            ]
          );

          if (class_id) {
            await connection.execute('UPDATE classes SET total_students = total_students + 1 WHERE id = ?', [class_id]);
          }
        });

        successCount++;
      } catch (err) {
        errors.push(`Dòng ${rowNumber}: Lỗi khi lưu vào CSDL - ${err.message}`);
      }
    }

    return ApiResponse.success(res, { successCount, errors }, `Nhập thành công ${successCount} sinh viên`);
  } catch (error) {
    console.error('Import students error:', error);
    return ApiResponse.error(res, 'Lỗi khi import file Excel: ' + error.message);
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Failed to delete temp file:', e);
      }
    }
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents
};