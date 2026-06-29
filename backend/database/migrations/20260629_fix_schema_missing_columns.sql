-- Migration: 20260629_fix_schema_missing_columns.sql
-- Fix: Đồng bộ schema với code thực tế đang chạy
-- Bao gồm: user_id cho instructors, cohort_id cho students,
--           bảng cohorts, users.role ENUM thêm instructor

-- =============================================
-- FIX 1: users.role ENUM thêm 'instructor'
-- =============================================
ALTER TABLE users
  MODIFY COLUMN role ENUM('admin', 'student', 'instructor') NOT NULL;

-- =============================================
-- FIX 2: Tạo bảng cohorts nếu chưa có
-- =============================================
CREATE TABLE IF NOT EXISTS cohorts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) NOT NULL UNIQUE COMMENT 'VD: K2021, K2022',
  name VARCHAR(100) NOT NULL COMMENT 'VD: Khóa 2021-2025',
  start_year INT NOT NULL,
  end_year INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- FIX 3: Thêm cohort_id vào students
-- =============================================
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS cohort_id INT AFTER class_id;

-- Thêm FK nếu chưa có (dùng PROCEDURE để tránh lỗi duplicate)
SET @fk_exists = (
  SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'students'
    AND CONSTRAINT_NAME = 'fk_students_cohort'
);

SET @sql = IF(@fk_exists = 0,
  'ALTER TABLE students ADD CONSTRAINT fk_students_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- FIX 4: Thêm user_id vào instructors
-- =============================================
ALTER TABLE instructors
  ADD COLUMN IF NOT EXISTS user_id INT UNIQUE AFTER id;

SET @fk_exists2 = (
  SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'instructors'
    AND CONSTRAINT_NAME = 'fk_instructors_user'
);

SET @sql2 = IF(@fk_exists2 = 0,
  'ALTER TABLE instructors ADD CONSTRAINT fk_instructors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- =============================================
-- FIX 5: Thêm major_id, class_id vào courses nếu thiếu
-- (một số môi trường chỉ dùng schema gốc)
-- =============================================
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS major_id INT AFTER department_id,
  ADD COLUMN IF NOT EXISTS class_id INT AFTER major_id;
