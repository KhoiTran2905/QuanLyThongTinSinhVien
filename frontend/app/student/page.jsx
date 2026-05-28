"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/dashboard/header"
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  CreditCard,
  Bell,
  FileText,
  ChevronRight,
  MapPin
} from "lucide-react"

const studentInfo = {
  name: "Nguyễn Văn An",
  studentId: "B21DCCN001",
  class: "D21CQCN01-B",
  major: "Công nghệ thông tin",
  faculty: "Công nghệ thông tin 1",
  year: "Năm 3",
  gpa: 3.45,
  credits: 98,
  totalCredits: 145
}

const todaySchedule = [
  { time: "7:00 - 9:30", subject: "Lập trình Web", room: "A2-301", teacher: "TS. Nguyễn Văn Hùng", type: "Lý thuyết" },
  { time: "9:45 - 12:15", subject: "Cơ sở dữ liệu", room: "A3-402", teacher: "ThS. Trần Thị Mai", type: "Thực hành" },
  { time: "13:30 - 16:00", subject: "Trí tuệ nhân tạo", room: "A1-201", teacher: "PGS.TS. Lê Hoàng Nam", type: "Lý thuyết" },
]

const recentGrades = [
  { subject: "Phát triển ứng dụng di động", credits: 3, midterm: 8.5, final: 8.0, gpa: 8.2 },
  { subject: "Mạng máy tính", credits: 3, midterm: 7.5, final: 8.5, gpa: 8.1 },
  { subject: "Kiến trúc máy tính", credits: 3, midterm: 9.0, final: 8.5, gpa: 8.7 },
  { subject: "Xác suất thống kê", credits: 3, midterm: 7.0, final: 7.5, gpa: 7.3 },
]

const notifications = [
  { title: "Lịch thi học kỳ 2", content: "Đã cập nhật lịch thi học kỳ 2 năm học 2024-2025", time: "2 giờ trước", unread: true },
  { title: "Đăng ký môn học", content: "Thời gian đăng ký môn học từ 15/01 - 20/01", time: "1 ngày trước", unread: true },
  { title: "Học phí học kỳ mới", content: "Hạn nộp học phí đến 31/01/2025", time: "2 ngày trước", unread: false },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const progressPercent = (studentInfo.credits / studentInfo.totalCredits) * 100
  
  // Use logged in user name if available
  const displayName = user?.name || studentInfo.name
  const displayId = user?.studentId || studentInfo.studentId

  return (
    <div className="dashboard-content">
      <Header title="Tổng quan" />
      
      <div className="dashboard-body">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-top">
              <div className="welcome-user">
                <div className="welcome-avatar">{displayName.split(" ").pop()?.charAt(0) || "N"}</div>
                <div>
                  <h2 className="welcome-greeting">Xin chào, {displayName}!</h2>
                  <p className="welcome-info">
                    {displayId} • {studentInfo.class} • {studentInfo.major}
                  </p>
                </div>
              </div>
              <div className="welcome-stats">
                <div className="welcome-stat">
                  <p className="welcome-stat-value">{studentInfo.gpa}</p>
                  <p className="welcome-stat-label">GPA tích lũy</p>
                </div>
                <div className="welcome-stat">
                  <p className="welcome-stat-value">{studentInfo.credits}</p>
                  <p className="welcome-stat-label">Tín chỉ đã hoàn thành</p>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="welcome-progress">
              <div className="welcome-progress-header">
                <span>Tiến độ học tập</span>
                <span>{studentInfo.credits}/{studentInfo.totalCredits} tín chỉ ({progressPercent.toFixed(0)}%)</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
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
              <span className="badge badge-outline">Thứ 2, 20/01/2025</span>
            </div>
            <div className="card-content">
              {todaySchedule.map((item, index) => (
                <div key={index} className="schedule-item" style={{ marginBottom: index < todaySchedule.length - 1 ? '1rem' : 0 }}>
                  <div className="schedule-icon">
                    <Clock />
                  </div>
                  <div className="schedule-info">
                    <div className="schedule-header">
                      <h4 className="schedule-subject">{item.subject}</h4>
                      <span className={`badge ${item.type === "Lý thuyết" ? "badge-primary" : "badge-secondary"}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="schedule-meta">
                      <span className="schedule-meta-item">
                        <Clock />
                        {item.time}
                      </span>
                      <span className="schedule-meta-item">
                        <MapPin />
                        {item.room}
                      </span>
                      <span className="schedule-meta-item">
                        <GraduationCap />
                        {item.teacher}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost text-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Xem thời khóa biểu đầy đủ <ChevronRight />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Bell />
                Thông báo mới
              </h2>
              <span className="badge badge-primary">3</span>
            </div>
            <div className="card-content">
              {notifications.map((item, index) => (
                <div key={index} className="notification-item" style={{ marginBottom: index < notifications.length - 1 ? '1rem' : 0 }}>
                  <div className={`notification-dot ${item.unread ? 'unread' : 'read'}`} />
                  <div className="notification-content">
                    <p className={`notification-title ${!item.unread ? 'read' : ''}`}>{item.title}</p>
                    <p className="notification-text">{item.content}</p>
                    <p className="notification-time">{item.time}</p>
                  </div>
                </div>
              ))}
              <button className="btn btn-ghost text-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Xem tất cả thông báo <ChevronRight />
              </button>
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
              <p className="quick-stat-value">6</p>
              <p className="quick-stat-label">Môn học kỳ này</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon green">
              <FileText />
            </div>
            <div>
              <p className="quick-stat-value">18</p>
              <p className="quick-stat-label">Tín chỉ đăng ký</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon yellow">
              <Calendar />
            </div>
            <div>
              <p className="quick-stat-value">3</p>
              <p className="quick-stat-label">Bài kiểm tra sắp tới</p>
            </div>
          </div>
          <div className="quick-stat-card">
            <div className="quick-stat-icon blue">
              <CreditCard />
            </div>
            <div>
              <p className="quick-stat-value success">Đã nộp</p>
              <p className="quick-stat-label">Học phí HK này</p>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Điểm học kỳ gần nhất
            </h2>
            <button className="btn btn-ghost btn-sm text-primary">
              Xem tất cả <ChevronRight />
            </button>
          </div>
          <div className="card-content">
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
                  {recentGrades.map((grade, index) => (
                    <tr key={index}>
                      <td className="font-medium">{grade.subject}</td>
                      <td className="text-center">{grade.credits}</td>
                      <td className="text-center">{grade.midterm}</td>
                      <td className="text-center">{grade.final}</td>
                      <td className="text-center font-semibold">{grade.gpa}</td>
                      <td className="text-center">
                        <span className={`badge ${
                          grade.gpa >= 8.5 ? "badge-primary" :
                          grade.gpa >= 7 ? "badge-info" : "badge-outline"
                        }`}>
                          {grade.gpa >= 8.5 ? "Giỏi" : grade.gpa >= 7 ? "Khá" : "TB"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
