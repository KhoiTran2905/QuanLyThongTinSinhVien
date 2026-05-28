// src/controllers/admin/majorController.js
const { query, queryOne, insert } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');

const getAllMajors = async (req, res) => {
  try {
    const majors = await query(`
      SELECT m.*, d.name as department_name 
      FROM majors m 
      LEFT JOIN departments d ON m.department_id = d.id 
      ORDER BY m.code ASC
    `);
    return ApiResponse.success(res, majors);
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách ngành học');
  }
};

const createMajor = async (req, res) => {
  try {
    const { code, name, department_id, total_credits, duration_years } = req.body;
    if (!code || !name || !department_id) {
      return ApiResponse.badRequest(res, 'Mã ngành, tên ngành và khoa là bắt buộc');
    }

    const existing = await queryOne('SELECT id FROM majors WHERE code = ?', [code]);
    if (existing) return ApiResponse.badRequest(res, 'Mã ngành đã tồn tại');

    const result = await insert(
      'INSERT INTO majors (code, name, department_id, total_credits, duration_years) VALUES (?, ?, ?, ?, ?)',
      [code, name, department_id, total_credits || 150, duration_years || 4.0]
    );
    return ApiResponse.created(res, { id: result.insertId }, 'Thêm ngành học thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi thêm ngành học');
  }
};

const updateMajor = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, department_id, total_credits, duration_years } = req.body;

    const existing = await queryOne('SELECT id FROM majors WHERE code = ? AND id != ?', [code, id]);
    if (existing) return ApiResponse.badRequest(res, 'Mã ngành đã tồn tại ở bản ghi khác');

    await insert(
      'UPDATE majors SET code = ?, name = ?, department_id = ?, total_credits = ?, duration_years = ? WHERE id = ?',
      [code, name, department_id, total_credits, duration_years, id]
    );
    return ApiResponse.success(res, null, 'Cập nhật ngành học thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi cập nhật ngành học');
  }
};

const deleteMajor = async (req, res) => {
  try {
    const { id } = req.params;
    const checkStudents = await queryOne('SELECT id FROM students WHERE major_id = ? LIMIT 1', [id]);
    if (checkStudents) {
      return ApiResponse.badRequest(res, 'Không thể xóa ngành học đang có sinh viên');
    }
    
    await insert('DELETE FROM majors WHERE id = ?', [id]);
    return ApiResponse.success(res, null, 'Xóa ngành học thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi xóa ngành học');
  }
};

module.exports = { getAllMajors, createMajor, updateMajor, deleteMajor };
