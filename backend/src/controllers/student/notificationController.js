// src/controllers/student/notificationController.js
const { query, queryOne, insert } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');

// @desc    Get all notifications for student
// @route   GET /api/student/notifications
const getNotifications = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE n.target_role IN ('all', 'student')";
    let params = [];

    if (type && type !== 'all') {
      whereClause += ' AND n.type = ?';
      params.push(type);
    }

    // Count total
    const countResult = await queryOne(
      `SELECT COUNT(*) as total FROM notifications n ${whereClause}`,
      params
    );

    // Get notifications with read status
    const notifications = await query(
      `SELECT n.*,
              CASE WHEN nr.id IS NOT NULL THEN 1 ELSE 0 END as is_read,
              nr.read_at
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       ${whereClause}
       ORDER BY n.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, ...params, parseInt(limit), parseInt(offset)]
    );

    // Count unread
    const unread = await queryOne(
      `SELECT COUNT(*) as count
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       WHERE n.target_role IN ('all', 'student') AND nr.id IS NULL`,
      [req.user.id]
    );

    return ApiResponse.success(res, {
      notifications,
      total: countResult.total,
      unread: unread.count
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thông báo');
  }
};

// @desc    Mark notification as read
// @route   PUT /api/student/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification exists
    const notification = await queryOne('SELECT id FROM notifications WHERE id = ?', [id]);
    if (!notification) {
      return ApiResponse.notFound(res, 'Không tìm thấy thông báo');
    }

    // Insert read record (ignore if already exists)
    await insert(
      `INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)`,
      [id, req.user.id]
    );

    return ApiResponse.success(res, null, 'Đã đánh dấu đã đọc');
  } catch (error) {
    console.error('Mark as read error:', error);
    return ApiResponse.error(res, 'Lỗi khi đánh dấu đã đọc');
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/student/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    // Get all unread notification IDs
    const unreadNotifications = await query(
      `SELECT n.id
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       WHERE n.target_role IN ('all', 'student') AND nr.id IS NULL`,
      [req.user.id]
    );

    if (unreadNotifications.length > 0) {
      const values = unreadNotifications.map(n => `(${n.id}, ${req.user.id})`).join(',');
      await insert(
        `INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES ${values}`
      );
    }

    return ApiResponse.success(res, null, 'Đã đánh dấu tất cả đã đọc');
  } catch (error) {
    console.error('Mark all as read error:', error);
    return ApiResponse.error(res, 'Lỗi khi đánh dấu tất cả đã đọc');
  }
};

// @desc    Delete notification (hide for user)
// @route   DELETE /api/student/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // We don't actually delete the notification, just mark it as read
    // In a more complex system, we'd have a "hidden" table
    await insert(
      `INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)`,
      [id, req.user.id]
    );

    return ApiResponse.success(res, null, 'Đã xóa thông báo');
  } catch (error) {
    console.error('Delete notification error:', error);
    return ApiResponse.error(res, 'Lỗi khi xóa thông báo');
  }
};

// @desc    Get unread count
// @route   GET /api/student/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const result = await queryOne(
      `SELECT COUNT(*) as count
       FROM notifications n
       LEFT JOIN notification_reads nr ON nr.notification_id = n.id AND nr.user_id = ?
       WHERE n.target_role IN ('all', 'student') AND nr.id IS NULL`,
      [req.user.id]
    );

    return ApiResponse.success(res, { count: result.count });
  } catch (error) {
    console.error('Unread count error:', error);
    return ApiResponse.error(res, 'Lỗi khi đếm thông báo chưa đọc');
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};