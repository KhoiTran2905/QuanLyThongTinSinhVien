// src/controllers/admin/scheduleController.js
const { query, queryOne, insert } = require('../../config/database');
const ApiResponse = require('../../utils/apiResponse');
const { getWeekDateRange } = require('../../utils/helpers');

// @desc    Get schedules (by week, class, instructor)
// @route   GET /api/admin/schedules
const getSchedules = async (req, res) => {
  try {
    const { week_start, week_end, class_id, instructor_id, semester } = req.query;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (week_start && week_end) {
      whereClause += ' AND s.week_start <= ? AND s.week_end >= ?';
      params.push(week_end, week_start);
    }

    if (class_id) {
      whereClause += ' AND s.class_id = ?';
      params.push(class_id);
    }

    if (instructor_id) {
      whereClause += ' AND s.instructor_id = ?';
      params.push(instructor_id);
    }

    if (semester) {
      whereClause += ' AND s.semester = ?';
      params.push(semester);
    }

    const schedules = await query(
      `SELECT s.*,
              c.course_code, c.name as course_name, c.credits,
              i.full_name as instructor_name, i.academic_rank, i.degree,
              cl.class_code, cl.name as class_name
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       LEFT JOIN instructors i ON s.instructor_id = i.id
       LEFT JOIN classes cl ON s.class_id = cl.id
       ${whereClause}
       ORDER BY FIELD(s.day_of_week, 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'),
                s.period_start ASC`,
      params
    );

    return ApiResponse.success(res, schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thời khóa biểu');
  }
};

// @desc    Get schedule by week number
// @route   GET /api/admin/schedules/week/:year/:weekNum
const getScheduleByWeek = async (req, res) => {
  try {
    const { year, weekNum } = req.params;
    const { class_id } = req.query;

    const { startOfWeek, endOfWeek } = getWeekDateRange(parseInt(year), parseInt(weekNum));

    let whereClause = 'WHERE s.week_start <= ? AND s.week_end >= ?';
    let params = [endOfWeek.toISOString().split('T')[0], startOfWeek.toISOString().split('T')[0]];

    if (class_id) {
      whereClause += ' AND s.class_id = ?';
      params.push(class_id);
    }

    const schedules = await query(
      `SELECT s.*,
              c.course_code, c.name as course_name, c.credits,
              i.full_name as instructor_name, i.degree,
              cl.class_code, cl.name as class_name
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       LEFT JOIN instructors i ON s.instructor_id = i.id
       LEFT JOIN classes cl ON s.class_id = cl.id
       ${whereClause}
       ORDER BY FIELD(s.day_of_week, 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'),
                s.period_start ASC`,
      params
    );

    return ApiResponse.success(res, {
      week: parseInt(weekNum),
      year: parseInt(year),
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      schedules
    });
  } catch (error) {
    console.error('Get schedule by week error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy TKB theo tuần');
  }
};

// @desc    Create schedule
// @route   POST /api/admin/schedules
const createSchedule = async (req, res) => {
  try {
    const {
      course_id, instructor_id, class_id, room,
      day_of_week, period_start, period_end,
      start_time, end_time, type,
      week_start, week_end, semester, group_number
    } = req.body;

    // Check for conflicts (same room, same time, same day)
    const conflict = await queryOne(
      `SELECT s.id, c.name as course_name 
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.room = ? AND s.day_of_week = ? 
       AND s.period_start = ? AND s.semester = ?
       AND s.week_start <= ? AND s.week_end >= ?`,
      [room, day_of_week, period_start, semester, week_end, week_start]
    );

    if (conflict) {
      return ApiResponse.badRequest(res, 
        `Phòng ${room} đã được sử dụng cho "${conflict.course_name}" vào ${day_of_week}, tiết ${period_start}`
      );
    }

    // Check instructor conflict
    const instructorConflict = await queryOne(
      `SELECT s.id, c.name as course_name
       FROM schedules s
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.instructor_id = ? AND s.day_of_week = ?
       AND s.period_start = ? AND s.semester = ?
       AND s.week_start <= ? AND s.week_end >= ?`,
      [instructor_id, day_of_week, period_start, semester, week_end, week_start]
    );

    if (instructorConflict) {
      return ApiResponse.badRequest(res, 
        `Giảng viên đã có lịch dạy "${instructorConflict.course_name}" vào ${day_of_week}, tiết ${period_start}`
      );
    }

    const result = await insert(
      `INSERT INTO schedules (
        course_id, instructor_id, class_id, room,
        day_of_week, period_start, period_end,
        start_time, end_time, type,
        week_start, week_end, semester, group_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id, instructor_id, class_id || null, room,
        day_of_week, period_start, period_end,
        start_time || null, end_time || null, type || 'Lý thuyết',
        week_start || null, week_end || null, semester || null, group_number || 1
      ]
    );

    return ApiResponse.created(res, { id: result.insertId }, 'Thêm lịch học thành công');

  } catch (error) {
    console.error('Create schedule error:', error);
    return ApiResponse.error(res, 'Lỗi khi thêm lịch học');
  }
};

// @desc    Update schedule
// @route   PUT /api/admin/schedules/:id
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await queryOne('SELECT * FROM schedules WHERE id = ?', [id]);
    if (!schedule) {
      return ApiResponse.notFound(res, 'Không tìm thấy lịch học');
    }

    const allowedFields = [
      'course_id', 'instructor_id', 'class_id', 'room',
      'day_of_week', 'period_start', 'period_end',
      'start_time', 'end_time', 'type',
      'week_start', 'week_end', 'semester', 'group_number'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }

    if (updates.length === 0) {
      return ApiResponse.badRequest(res, 'Không có dữ liệu để cập nhật');
    }

    values.push(id);
    await insert(`UPDATE schedules SET ${updates.join(', ')} WHERE id = ?`, values);

    return ApiResponse.success(res, null, 'Cập nhật lịch học thành công');
  } catch (error) {
    console.error('Update schedule error:', error);
    return ApiResponse.error(res, 'Lỗi khi cập nhật lịch học');
  }
};

// @desc    Delete schedule
// @route   DELETE /api/admin/schedules/:id
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await queryOne('SELECT * FROM schedules WHERE id = ?', [id]);
    if (!schedule) {
      return ApiResponse.notFound(res, 'Không tìm thấy lịch học');
    }

    await insert('DELETE FROM schedules WHERE id = ?', [id]);

    return ApiResponse.success(res, null, 'Xóa lịch học thành công');
  } catch (error) {
    console.error('Delete schedule error:', error);
    return ApiResponse.error(res, 'Lỗi khi xóa lịch học');
  }
};

// @desc    Get schedule statistics
// @route   GET /api/admin/schedules/stats
const getScheduleStats = async (req, res) => {
  try {
    const totalClassesThisWeek = await queryOne(
      `SELECT COUNT(*) as count FROM schedules 
       WHERE week_start <= CURDATE() AND week_end >= CURDATE()`
    );

    const totalInstructors = await queryOne(
      `SELECT COUNT(DISTINCT instructor_id) as count FROM schedules
       WHERE week_start <= CURDATE() AND week_end >= CURDATE()`
    );

    const totalRooms = await queryOne(
      `SELECT COUNT(DISTINCT room) as count FROM schedules
       WHERE week_start <= CURDATE() AND week_end >= CURDATE()`
    );

    return ApiResponse.success(res, {
      classesThisWeek: totalClassesThisWeek.count,
      instructors: totalInstructors.count,
      rooms: totalRooms.count
    });
  } catch (error) {
    console.error('Schedule stats error:', error);
    return ApiResponse.error(res, 'Lỗi khi lấy thống kê TKB');
  }
};

module.exports = {
  getSchedules,
  getScheduleByWeek,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getScheduleStats
};