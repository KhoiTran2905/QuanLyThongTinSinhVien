// src/controllers/admin/departmentController.js
const { query, queryOne, insert } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');

const getAllDepartments = async (req, res) => {
  try {
    const departments = await query('SELECT * FROM departments ORDER BY code ASC');
    return ApiResponse.success(res, departments);
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi lấy danh sách khoa');
  }
};

const createDepartment = async (req, res) => {
  try {
    const { code, name, description } = req.body;
    if (!code || !name) return ApiResponse.badRequest(res, 'Mã và tên khoa là bắt buộc');
    
    // Check duplicate code
    const existing = await queryOne('SELECT id FROM departments WHERE code = ?', [code]);
    if (existing) return ApiResponse.badRequest(res, 'Mã khoa đã tồn tại');

    const result = await insert(
      'INSERT INTO departments (code, name, description) VALUES (?, ?, ?)',
      [code, name, description]
    );
    return ApiResponse.created(res, { id: result.insertId }, 'Thêm khoa thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi thêm khoa');
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;

    const existing = await queryOne('SELECT id FROM departments WHERE code = ? AND id != ?', [code, id]);
    if (existing) return ApiResponse.badRequest(res, 'Mã khoa đã tồn tại ở bản ghi khác');

    await insert(
      'UPDATE departments SET code = ?, name = ?, description = ? WHERE id = ?',
      [code, name, description, id]
    );
    return ApiResponse.success(res, null, 'Cập nhật khoa thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi cập nhật khoa');
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if there are majors dependent on this
    const checkMajors = await queryOne('SELECT id FROM majors WHERE department_id = ? LIMIT 1', [id]);
    if (checkMajors) {
      return ApiResponse.badRequest(res, 'Không thể xóa khoa đang có ngành học trực thuộc');
    }
    
    await insert('DELETE FROM departments WHERE id = ?', [id]);
    return ApiResponse.success(res, null, 'Xóa khoa thành công');
  } catch (error) {
    return ApiResponse.error(res, 'Lỗi khi xóa khoa');
  }
};

module.exports = { getAllDepartments, createDepartment, updateDepartment, deleteDepartment };
