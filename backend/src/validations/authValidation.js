// src/validations/authValidation.js
const { body } = require('express-validator');

const loginValidation = [
  body('username')
    .notEmpty().withMessage('Tên đăng nhập không được để trống')
    .trim(),
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),
  body('newPassword')
    .notEmpty().withMessage('Mật khẩu mới không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
  body('confirmPassword')
    .notEmpty().withMessage('Xác nhận mật khẩu không được để trống')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    })
];

module.exports = { loginValidation, changePasswordValidation };