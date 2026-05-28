// src/routes/student/profileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const profileController = require('../../controllers/student/profileController');

// Multer config for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
  }
});

router.get('/', profileController.getProfile);
router.put('/personal', profileController.updatePersonal);
router.put('/contact', profileController.updateContact);
router.put('/family', profileController.updateFamily);
router.put('/avatar', upload.single('avatar'), profileController.updateAvatar);

module.exports = router;