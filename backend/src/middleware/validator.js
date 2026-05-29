const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.badRequest(res, errors.array()[0].msg);
  }
  next();
};

const studentValidationRules = [
  body('student_code').notEmpty().withMessage('Mã sinh viên không được để trống'),
  body('full_name').notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không đúng định dạng'),
  body('gender').optional().isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ')
];

const studentUpdateValidationRules = [
  body('full_name').optional().notEmpty().withMessage('Họ tên không được để trống'),
  body('email').optional().isEmail().withMessage('Email không đúng định dạng'),
  body('gender').optional().isIn(['Nam', 'Nữ', 'Khác']).withMessage('Giới tính không hợp lệ')
];

const gradeValidationRules = [
  body('student_id').notEmpty().withMessage('ID sinh viên không được để trống'),
  body('course_id').notEmpty().withMessage('ID môn học không được để trống'),
  body('semester').notEmpty().withMessage('Học kỳ không được để trống'),
  body('midterm_score').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 10 }).withMessage('Điểm giữa kỳ phải từ 0 đến 10'),
  body('final_score').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 10 }).withMessage('Điểm cuối kỳ phải từ 0 đến 10')
];

const gradeUpdateValidationRules = [
  body('midterm_score').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 10 }).withMessage('Điểm giữa kỳ phải từ 0 đến 10'),
  body('final_score').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 10 }).withMessage('Điểm cuối kỳ phải từ 0 đến 10')
];

module.exports = {
  validateResult,
  studentValidationRules,
  studentUpdateValidationRules,
  gradeValidationRules,
  gradeUpdateValidationRules
};
