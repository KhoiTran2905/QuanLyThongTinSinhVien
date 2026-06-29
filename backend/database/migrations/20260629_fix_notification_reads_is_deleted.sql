-- Migration: 20260629_fix_notification_reads_is_deleted.sql
-- Fix: Thêm cột is_deleted vào bảng notification_reads
-- Lý do: student/notificationController.js và dashboardController.js dùng cột này
--         nhưng schema gốc không có → crash SQL ER_BAD_FIELD_ERROR

ALTER TABLE notification_reads
  ADD COLUMN IF NOT EXISTS is_deleted TINYINT(1) NOT NULL DEFAULT 0
    COMMENT '0 = visible, 1 = hidden (soft delete cho user)';

CREATE INDEX IF NOT EXISTS idx_nr_is_deleted
  ON notification_reads(notification_id, user_id, is_deleted);
