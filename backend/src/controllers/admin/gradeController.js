// src/controllers/admin/gradeController.js
const { query, queryOne, insert, transaction } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { getLetterGrade, calculateAverage } = require('../../utils/helpers');

// @desc    Get all grades with filters
// @route   GET /api/admin/grades
const getAllGrades = async (req, res) => {
  try {
    const { page, limit, search, course_id, class_id, semester, status } = req.query;
    const { currentPage, pageSize, offset } = getPagination(page, limit);

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (s.full_name LIKE ? OR s.student_code LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (course_id) {
      whereClause += ' AND g.course_id = ?';
      params.push(course_id);
    }

    if (class_id) {
      whereClause += ' AND s.class_id = ?';
      params.push(class_id);
    }

    if (semester) {
      whereClause += ' AND g.semester = ?';
      params.push(semester);
    }

    if (status && status !== 'all') {
      whereClause += ' AND g.status = ?';
      params.push(status);
    }

    const countResult = await queryOne(
      `SELECT COUNT(*) as total 
       FROM grades g
       LEFT JOIN students s ON g.student_id = s.id
       ${whereClause}`,
      params
    );

    const grades = await query(
      `SELECT g.*,
              s.student_code, s.full_name as student_name,
              c.course_code, c.name as course_name, c.credits,
              cl.class_code
       FROM grades g
       LEFT JOIN students s ON g.student_id = s.id
       LEFT JOIN courses c ON g.course_id = c.id
       LEFT JOIN classes cl ON s.class_id = cl.id
       ${whereClause}
       ORDER BY g.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const pagination = getPagingData(countResult.total, currentPage, pageSize);

    return ApiResponse.paginated(res, grades, pagination);
  } catch (error) {
    console.error('Get all grades error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy bảng điểm');
  }
};

// @desc    Get grade by ID
// @route   GET /api/admin/grades/:id
const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await queryOne(
      `SELECT g.*,
              s.student_code, s.full_name as student_name, s.email,
              c.course_code, c.name as course_name, c.credits,
              cl.class_code, cl.name as class_name
       FROM grades g
       LEFT JOIN students s ON g.student_id = s.id
       LEFT JOIN courses c ON g.course_id = c.id
       LEFT JOIN classes cl ON s.class_id = cl.id
       WHERE g.id = ?`,
      [id]
    );

    if (!grade) {
      return ApiResponse.notFound(res, 'Không tìm thấy bảng điểm');
    }

    return ApiResponse.success(res, grade);
  } catch (error) {
    console.error('Get grade by ID error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy chi tiết điểm');
  }
};

// @desc    Create/Input grade
// @route   POST /api/admin/grades
const createGrade = async (req, res) => {
  try {
    const { student_id, course_id, semester, attendance_score, midterm_score, final_score } = req.body;

    // Check if grade already exists
    const existing = await queryOne(
      'SELECT id FROM grades WHERE student_id = ? AND course_id = ? AND semester = ?',
      [student_id, course_id, semester]
    );

    if (existing) {
      return ApiResponse.badRequest(res, 'Điểm cho sinh viên này trong môn học và học kỳ này đã tồn tại');
    }

    // Calculate average and letter grade
    let average_score = null;
    let letter_grade = null;
    let gpa_score = null;

    if (midterm_score !== null && final_score !== null) {
      average_score = calculateAverage(midterm_score, final_score);
      const gradeInfo = getLetterGrade(average_score);
      letter_grade = gradeInfo.letter;
      gpa_score = gradeInfo.gpa;
    }

    const result = await insert(
      `INSERT INTO grades (
        student_id, course_id, semester, attendance_score,
        midterm_score, final_score, average_score,
        letter_grade, gpa_score, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id, course_id, semester,
        attendance_score || null,
        midterm_score || null,
        final_score || null,
        average_score,
        letter_grade,
        gpa_score,
        'Chờ duyệt'
      ]
    );

    return ApiResponse.created(res, { id: result.insertId }, 'Nhập điểm thành công');

  } catch (error) {
    console.error('Create grade error:', error);
    return ApiResponse.error(res, 'Lỗi khi nhập điểm');
  }
};

// @desc    Update grade
// @route   PUT /api/admin/grades/:id
const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance_score, midterm_score, final_score } = req.body;

    const grade = await queryOne('SELECT * FROM grades WHERE id = ?', [id]);
    if (!grade) {
      return ApiResponse.notFound(res, 'Không tìm thấy bảng điểm');
    }

    // Recalculate
    const mid = midterm_score !== undefined ? midterm_score : grade.midterm_score;
    const fin = final_score !== undefined ? final_score : grade.final_score;

    let average_score = grade.average_score;
    let letter_grade = grade.letter_grade;
    let gpa_score = grade.gpa_score;

    if (mid !== null && fin !== null) {
      average_score = calculateAverage(mid, fin);
      const gradeInfo = getLetterGrade(average_score);
      letter_grade = gradeInfo.letter;
      gpa_score = gradeInfo.gpa;
    }

    await insert(
      `UPDATE grades SET 
        attendance_score = ?, midterm_score = ?, final_score = ?,
        average_score = ?, letter_grade = ?, gpa_score = ?,
        status = 'Chờ duyệt'
       WHERE id = ?`,
      [
        attendance_score !== undefined ? attendance_score : grade.attendance_score,
        mid, fin, average_score, letter_grade, gpa_score, id
      ]
    );

    return ApiResponse.success(res, null, 'Cập nhật điểm thành công');
  } catch (error) {
    console.error('Update grade error:', error);
    return ApiResponse.error(res, 'Lỗi khi cập nhật điểm');
  }
};

// @desc    Approve grade
// @route   PUT /api/admin/grades/:id/approve
const approveGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await queryOne('SELECT * FROM grades WHERE id = ?', [id]);
    if (!grade) {
      return ApiResponse.notFound(res, 'Không tìm thấy bảng điểm');
    }

    await insert(
      `UPDATE grades SET status = 'Đã duyệt', approved_by = ?, approved_at = NOW() WHERE id = ?`,
      [req.user.id, id]
    );

    // Update student GPA
    await updateStudentGPA(grade.student_id);

    return ApiResponse.success(res, null, 'Duyệt điểm thành công');
  } catch (error) {
    console.error('Approve grade error:', error);
    return ApiResponse.error(res, 'Lỗi khi duyệt điểm');
  }
};

// @desc    Reject grade
// @route   PUT /api/admin/grades/:id/reject
const rejectGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await queryOne('SELECT * FROM grades WHERE id = ?', [id]);
    if (!grade) {
      return ApiResponse.notFound(res, 'Không tìm thấy bảng điểm');
    }

    await insert(
      `UPDATE grades SET status = 'Từ chối', approved_by = ?, approved_at = NOW() WHERE id = ?`,
      [req.user.id, id]
    );

    return ApiResponse.success(res, null, 'Từ chối điểm thành công');
  } catch (error) {
    console.error('Reject grade error:', error);
    return ApiResponse.error(res, 'Lỗi khi từ chối điểm');
  }
};

// @desc    Approve all pending grades for a course/semester
// @route   PUT /api/admin/grades/approve-all
const approveAll = async (req, res) => {
  try {
    const { course_id, semester } = req.body;

    let whereClause = "WHERE status = 'Chờ duyệt'";
    let params = [];

    if (course_id) {
      whereClause += ' AND course_id = ?';
      params.push(course_id);
    }

    if (semester) {
      whereClause += ' AND semester = ?';
      params.push(semester);
    }

    const result = await insert(
      `UPDATE grades SET status = 'Đã duyệt', approved_by = ?, approved_at = NOW() ${whereClause}`,
      [req.user.id, ...params]
    );

    // Update GPA for affected students
    const affectedStudents = await query(
      `SELECT DISTINCT student_id FROM grades ${whereClause.replace("status = 'Chờ duyệt'", "status = 'Đã duyệt' AND approved_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)")}`,
      params
    );

    for (const student of affectedStudents) {
      await updateStudentGPA(student.student_id);
    }

    return ApiResponse.success(res, {
      approvedCount: result.affectedRows
    }, `Đã duyệt ${result.affectedRows} bảng điểm`);
  } catch (error) {
    console.error('Approve all error:', error);
    return ApiResponse.error(res, 'Lỗi khi duyệt tất cả điểm');
  }
};

// @desc    Get grade statistics
// @route   GET /api/admin/grades/stats
const getGradeStats = async (req, res) => {
  try {
    const total = await queryOne('SELECT COUNT(*) as count FROM grades');
    const approved = await queryOne("SELECT COUNT(*) as count FROM grades WHERE status = 'Đã duyệt'");
    const pending = await queryOne("SELECT COUNT(*) as count FROM grades WHERE status = 'Chờ duyệt'");
    const rejected = await queryOne("SELECT COUNT(*) as count FROM grades WHERE status = 'Từ chối'");

    const avgGPA = await queryOne(
      "SELECT AVG(gpa_score) as avg_gpa FROM grades WHERE status = 'Đã duyệt' AND gpa_score > 0"
    );

    return ApiResponse.success(res, {
      total: total.count,
      approved: approved.count,
      pending: pending.count,
      rejected: rejected.count,
      avgGPA: avgGPA.avg_gpa ? parseFloat(avgGPA.avg_gpa).toFixed(2) : '0.00'
    });
  } catch (error) {
    console.error('Grade stats error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thống kê điểm');
  }
};

// @desc    Get grade distribution
// @route   GET /api/admin/grades/distribution
const getGradeDistribution = async (req, res) => {
  try {
    const distribution = await query(
      `SELECT letter_grade, COUNT(*) as count
       FROM grades
       WHERE status = 'Đã duyệt' AND letter_grade IS NOT NULL
       GROUP BY letter_grade
       ORDER BY FIELD(letter_grade, 'A+', 'A', 'B+', 'B', 'C+', 'D', 'F')`
    );

    return ApiResponse.success(res, distribution);
  } catch (error) {
    console.error('Grade distribution error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy phân bố điểm');
  }
};

// @desc    Get GPA trends over semesters
// @route   GET /api/admin/grades/gpa-trends
const getGPATrends = async (req, res) => {
  try {
    const trends = await query(
      `SELECT semester, AVG(gpa_score) as avg_gpa, COUNT(*) as total_grades
       FROM grades
       WHERE status = 'Đã duyệt' AND gpa_score > 0
       GROUP BY semester
       ORDER BY semester ASC`
    );

    return ApiResponse.success(res, trends);
  } catch (error) {
    console.error('GPA trends error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy xu hướng GPA');
  }
};

// Helper: Update student's cumulative GPA
const updateStudentGPA = async (studentId) => {
  try {
    const result = await queryOne(
      `SELECT AVG(g.gpa_score) as avg_gpa, SUM(c.credits) as total_credits
       FROM grades g
       LEFT JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = ? AND g.status = 'Đã duyệt' AND g.gpa_score > 0`,
      [studentId]
    );

    if (result) {
      await insert(
        'UPDATE students SET gpa = ?, total_credits = ? WHERE id = ?',
        [
          result.avg_gpa ? parseFloat(result.avg_gpa).toFixed(2) : 0,
          result.total_credits || 0,
          studentId
        ]
      );
    }
  } catch (error) {
    console.error('Update student GPA error:', error);
  }
};

module.exports = {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  approveGrade,
  rejectGrade,
  approveAll,
  getGradeStats,
  getGradeDistribution,
  getGPATrends
};