
"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/dashboard/header"
import { useApi } from "@/hooks/use-api"
import {
  studentDashboardService,
} from "@/lib/services/studentService"
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  CreditCard,
  Bell,
  FileText,
  ChevronRight,
  MapPin,
} from "lucide-react"

export default function StudentDashboard() {
  const { user } = useAuth()

  const { data: dashboard, loading: dashLoading } = useApi(
    studentDashboardService.getDashboard,
    [],
    { defaultData: {} }
  )

  const { data: todayData, loading: scheduleLoading } = useApi(
    studentDashboardService.getTodaySchedule,
    [],
    { defaultData: { schedules: [] } }
  )

  const { data: notifData, loading: notifLoading } = useApi(
    studentDashboardService.getNotifications,
    [],
    { defaultData: [] }
  )

  const { data: recentGrades, loading: gradesLoading } = useApi(
    studentDashboardService.getRecentGrades,
    [],
    { defaultData: [] }
  )

  const { data: dashStats, loading: statsLoading } = useApi(
    studentDashboardService.getStats,
    [],
    { defaultData: {} }
  )

  // Derived values
  var displayName = dashboard && dashboard.full_name
    ? dashboard.full_name
    : user && user.name
    ? user.name
    : "..."

  var avatarChar = displayName.split(" ").pop().charAt(0) || "N"

  var studentCode = dashboard && dashboard.student_code
    ? dashboard.student_code
    : user && user.studentId
    ? user.studentId
    : ""

  var classCode = (dashboard && dashboard.class_code) || ""
  var majorName = (dashboard && dashboard.major_name) || ""
  var gpa = dashboard && dashboard.gpa != null ? dashboard.gpa : null
  var totalCredits = dashboard && dashboard.total_credits != null
    ? dashboard.total_credits
    : null
  var requiredCredits = dashboard && dashboard.required_credits != null
    ? dashboard.required_credits
    : 145

  var progressPercent = requiredCredits > 0 && totalCredits != null
    ? Math.round((totalCredits / requiredCredits) * 100)
    : 0

  var todaySchedules = todayData && Array.isArray(todayData.schedules)
    ? todayData.schedules
    : []

  var notifications = Array.isArray(notifData)
    ? notifData
    : notifData && Array.isArray(notifData.notifications)
    ? notifData.notifications
    : []

  var gradesArray = Array.isArray(recentGrades) ? recentGrades : []

  var tuitionStatus = dashStats && dashStats.tuitionStatus
    ? dashStats.tuitionStatus
    : null

  // Today label
  var dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
  var todayObj = new Date()
  var todayLabel = dayNames[todayObj.getDay()] + ", " + todayObj.toLocaleDateString("vi-VN")

  return (
    <div className="dashboard-content">
      <Header title="Tổng quan" />

      <div className="dashboard-body">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-top">
              <div className="welcome-user">
                <div className="welcome-avatar">{avatarChar}</div>
                <div>
                  <h2 className="welcome-greeting">
                    Xin chào, {displayName}!
                  </h2>
                  <p className="welcome-info">
                    {studentCode}
                    {classCode ? " • " + classCode : ""}
                    {majorName ? " • " + majorName : ""}
                  </p>
                </div>
              </div>
              <div className="welcome-stats">
                <div className="welcome-stat">
                  <p className="welcome-stat-value">
                    {dashLoading ? "..." : gpa != null ? gpa : "—"}
                  </p>
                  <p className="welcome-stat-label">GPA tích lũy</p>
                </div>
                <div className="welcome-stat">
                  <p className="welcome-stat-value">
                    {dashLoading ? "..." : totalCredits != null ? totalCredits : "—"}
                  </p>
                  <p className="welcome-stat-label">Tín chỉ hoàn thành</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="welcome-progress">
              <div className="welcome-progress-header">
                <span>Tiến độ học tập</span>
                <span>
                  {totalCredits != null ? totalCredits : 0}/{requiredCredits} tín chỉ ({progressPercent}%)
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: progressPercent + "%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Today Schedule */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Calendar />
                Lịch học hôm nay
              </h2>
              <span className="badge badge-outline">{todayLabel}</span>
            </div>
            <div className="card-content">
              {scheduleLoading ? (
                <div style={{ padding: "1rem", color: "var(--muted-foreground)" }}>
                  Đang tải...
                </div>
              ) : todaySchedules.length === 0 ? (
                <div style={{
                  padding: "2rem", textAlign: "center",
                  color: "var(--muted-foreground)",
                }}>
                  Hôm nay không có lịch học
                </div>
              ) : (
                todaySchedules.map(function (item, index) {
                  var isLast = index === todaySchedules.length - 1
                  var startTime = item.start_time ? item.start_time.slice(0, 5) : ""
                  var endTime = item.end_time ? item.end_time.slice(0, 5) : ""
                  var typeBadge = item.type === "Lý thuyết" ? "badge-primary" : "badge-secondary"

                  return (
                    <div
                      key={item.id || index}
                      className="schedule-item"
                      style={{ marginBottom: isLast ? 0 : "1rem" }}
                    >
                      <div className="schedule-icon">
                        <Clock />
                      </div>
                      <div className="schedule-info">
                        <div className="schedule-header">
                          <h4 className="schedule-subject">
                            {item.course_name}
                          </h4>
                          <span className={"badge " + typeBadge}>
                            {item.type || "Lý thuyết"}
                          </span>
                        </div>
                        <div className="schedule-meta">
                          {startTime && endTime && (
                            <span className="schedule-meta-item">
                              <Clock size={14} />
                              {startTime} - {endTime}
                            </span>
                          )}
                          {item.room && (
                            <span className="schedule-meta-item">
                              <MapPin size={14} />
                              {item.room}
                            </span>
                          )}
                          {item.instructor_name && (
                            <span className="schedule-meta-item">
                              <GraduationCap size={14} />
                              {item.instructor_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Bell />
                Thông báo mới
              </h2>
              {notifications.length > 0 && (
                <span className="badge badge-primary">
                  {notifications.filter(function (n) { return !n.is_read }).length}
                </span>
              )}
            </div>
            <div className="card-content">
              {notifLoading ? (
                <div style={{ padding: "1rem", color: "var(--muted-foreground)" }}>
                  Đang tải...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{
                  padding: "2rem", textAlign: "center",
                  color: "var(--muted-foreground)",
                }}>
                  Không có thông báo mới
                </div>
              ) : (
                notifications.slice(0, 3).map(function (item, index) {
                  var isLast = index === 2
                  var dotClass = item.is_read ? "read" : "unread"
                  var titleClass = "notification-title" + (item.is_read ? " read" : "")
                  var dateStr = item.created_at
                    ? new Date(item.created_at).toLocaleDateString("vi-VN")
                    : ""

                  return (
                    <div
                      key={item.id || index}
                      className="notification-item"
                      style={{ marginBottom: isLast ? 0 : "1rem" }}
                    >
                      <div className={"notification-dot " + dotClass} />
                      <div className="notification-content">
                        <p className={titleClass}>{item.title}</p>
                        <p className="notification-text">{item.content}</p>
                        <p className="notification-time">{dateStr}</p>
                      </div>
                    </div>
                  )
                })
              )}
              {notifications.length > 0 && (
                <button
                  className="btn btn-ghost text-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Xem tất cả thông báo <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-grid">
          <div className="quick-stat-card">
            <div className="quick-stat-icon primary">
              <BookOpen />
            </div>
            <div>
              <p className="quick-stat-value">
                {statsLoading ? "..." : dashStats && dashStats.courses != null
                  ? dashStats.courses
                  : "—"}
              </p>
              <p className="quick-stat-label">Môn học kỳ này</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon green">
              <FileText />
            </div>
            <div>
              <p className="quick-stat-value">
                {statsLoading ? "..." : dashStats && dashStats.credits != null
                  ? dashStats.credits
                  : "—"}
              </p>
              <p className="quick-stat-label">Tín chỉ đăng ký</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon yellow">
              <Calendar />
            </div>
            <div>
              <p className="quick-stat-value">
                {statsLoading ? "..." : dashStats && dashStats.upcomingExams != null
                  ? dashStats.upcomingExams
                  : "—"}
              </p>
              <p className="quick-stat-label">Bài kiểm tra sắp tới</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon blue">
              <CreditCard />
            </div>
            <div>
              <p className={"quick-stat-value" + (tuitionStatus === "Đã thanh toán" ? " success" : "")}>
                {statsLoading ? "..." : tuitionStatus != null ? tuitionStatus : "—"}
              </p>
              <p className="quick-stat-label">Học phí HK này</p>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Điểm gần nhất
            </h2>
            <button className="btn btn-ghost btn-sm text-primary">
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="card-content">
            {gradesLoading ? (
              <div style={{ padding: "1rem", color: "var(--muted-foreground)" }}>
                Đang tải...
              </div>
            ) : gradesArray.length === 0 ? (
              <div style={{
                padding: "2rem", textAlign: "center",
                color: "var(--muted-foreground)",
              }}>
                Chưa có điểm
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Môn học</th>
                      <th className="text-center">Số TC</th>
                      <th className="text-center">Giữa kỳ</th>
                      <th className="text-center">Cuối kỳ</th>
                      <th className="text-center">Điểm TB</th>
                      <th className="text-center">Xếp loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradesArray.map(function (grade, index) {
                      var letter = grade.letter_grade || ""
                      var badgeClass = letter.startsWith("A")
                        ? "badge-primary"
                        : letter.startsWith("B")
                        ? "badge-info"
                        : "badge-outline"

                      return (
                        <tr key={grade.id || index}>
                          <td className="font-medium">{grade.course_name}</td>
                          <td className="text-center">{grade.credits || "—"}</td>
                          <td className="text-center">
                            {grade.midterm_score != null ? grade.midterm_score : "—"}
                          </td>
                          <td className="text-center">
                            {grade.final_score != null ? grade.final_score : "—"}
                          </td>
                          <td className="text-center font-semibold">
                            {grade.average_score != null ? grade.average_score : "—"}
                          </td>
                          <td className="text-center">
                            <span className={"badge " + badgeClass}>
                              {letter || "—"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
