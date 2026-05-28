"use client"

import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  ArrowRight,
  UserPlus,
  FileText,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building
} from "lucide-react"

const recentStudents = [
  { id: "B21DCCN001", name: "Nguyễn Văn An", class: "D21CQCN01-B", major: "Công nghệ thông tin", status: "active", date: "15/01/2025" },
  { id: "B21DCCN002", name: "Trần Thị Bình", class: "D21CQCN02-B", major: "Công nghệ thông tin", status: "active", date: "14/01/2025" },
  { id: "B21DCAT003", name: "Lê Hoàng Cường", class: "D21CQAT01-B", major: "An toàn thông tin", status: "pending", date: "13/01/2025" },
  { id: "B21DCVT004", name: "Phạm Minh Đức", class: "D21CQVT01-B", major: "Viễn thông", status: "active", date: "12/01/2025" },
  { id: "B21DCDT005", name: "Hoàng Thị Hà", class: "D21CQDT01-B", major: "Điện tử", status: "inactive", date: "11/01/2025" },
]

const upcomingEvents = [
  { title: "Khai giảng học kỳ II", date: "15/01/2025", type: "event" },
  { title: "Đăng ký môn học", date: "20/01/2025", type: "deadline" },
  { title: "Thi giữa kỳ", date: "10/03/2025", type: "exam" },
  { title: "Hạn nộp học phí", date: "31/01/2025", type: "deadline" },
]

const pendingRequests = [
  { id: 1, title: "Xin nghỉ học tạm thời", student: "Nguyễn Văn An", type: "leave", date: "14/01/2025" },
  { id: 2, title: "Xác nhận sinh viên", student: "Trần Thị Bình", type: "confirm", date: "13/01/2025" },
  { id: 3, title: "Chuyển ngành học", student: "Lê Hoàng Cường", type: "transfer", date: "12/01/2025" },
]

const facultyStats = [
  { name: "CNTT", students: 5420, color: "#b91c1c" },
  { name: "ATTT", students: 2100, color: "#dc2626" },
  { name: "Viễn thông", students: 3200, color: "#ef4444" },
  { name: "Điện tử", students: 2500, color: "#f87171" },
  { name: "Đa phương tiện", students: 2200, color: "#fca5a5" },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const totalStudents = facultyStats.reduce((sum, f) => sum + f.students, 0)

  return (
    <div className="dashboard-content">
      <Header title="Tổng quan hệ thống" />
      
      <div className="dashboard-body">
        {/* Welcome Banner */}
        <div className="admin-welcome-banner">
          <div className="admin-welcome-content">
            <div className="admin-welcome-text">
              <h1>Chào mừng trở lại, {user?.name || "Admin"}!</h1>
              <p>Hệ thống quản lý sinh viên PTIT — Cập nhật lần cuối: 15/01/2025</p>
            </div>
            <div className="admin-welcome-stats">
              <div className="admin-welcome-stat">
                <span className="admin-welcome-stat-value">98.5%</span>
                <span className="admin-welcome-stat-label">Uptime</span>
              </div>
              <div className="admin-welcome-stat">
                <span className="admin-welcome-stat-value">1,234</span>
                <span className="admin-welcome-stat-label">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            title="Tổng sinh viên"
            value="15,420"
            description="Đang theo học"
            icon={Users}
            trend={{ value: 12, label: "so với năm trước" }}
            variant="primary"
          />
          <StatCard
            title="Giảng viên"
            value="823"
            description="Đang giảng dạy"
            icon={GraduationCap}
            trend={{ value: 5, label: "so với năm trước" }}
          />
          <StatCard
            title="Môn học"
            value="428"
            description="Học kỳ này"
            icon={BookOpen}
          />
          <StatCard
            title="Tỷ lệ tốt nghiệp"
            value="94.5%"
            description="Năm 2024"
            icon={TrendingUp}
            trend={{ value: 2.3, label: "so với 2023" }}
          />
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Students */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Users className="card-title-icon" />
                Sinh viên mới đăng ký
              </h2>
              <button className="btn btn-ghost btn-sm text-primary">
                Xem tất cả <ArrowRight size={16} />
              </button>
            </div>
            <div className="card-content">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sinh viên</th>
                      <th>Mã SV</th>
                      <th>Lớp</th>
                      <th>Ngành</th>
                      <th>Trạng thái</th>
                      <th>Ngày ĐK</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="student-cell">
                            <div className="avatar avatar-sm">
                              {student.name.split(" ").pop()?.charAt(0)}
                            </div>
                            <span className="student-name">{student.name}</span>
                          </div>
                        </td>
                        <td><span className="text-code">{student.id}</span></td>
                        <td>{student.class}</td>
                        <td className="text-muted">{student.major}</td>
                        <td>
                          <span className={`badge ${
                            student.status === "active" ? "badge-success" : 
                            student.status === "pending" ? "badge-warning" : "badge-danger"
                          }`}>
                            {student.status === "active" ? "Đang học" : 
                             student.status === "pending" ? "Chờ duyệt" : "Tạm nghỉ"}
                          </span>
                        </td>
                        <td className="text-muted">{student.date}</td>
                        <td>
                          <button className="btn btn-ghost btn-icon btn-sm">
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="admin-right-column">
            {/* Upcoming Events */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Calendar className="card-title-icon" />
                  Sự kiện sắp tới
                </h2>
              </div>
              <div className="card-content">
                <div className="events-list">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="event-item">
                      <div className={`event-icon ${
                        event.type === "exam" ? "event-icon-danger" :
                        event.type === "deadline" ? "event-icon-warning" : "event-icon-info"
                      }`}>
                        <Calendar size={16} />
                      </div>
                      <div className="event-info">
                        <p className="event-title">{event.title}</p>
                        <p className="event-date">{event.date}</p>
                      </div>
                      <span className={`badge ${
                        event.type === "exam" ? "badge-danger" :
                        event.type === "deadline" ? "badge-warning" : "badge-info"
                      }`}>
                        {event.type === "exam" ? "Thi" : event.type === "deadline" ? "Deadline" : "Sự kiện"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Clock className="card-title-icon" />
                  Yêu cầu chờ xử lý
                </h2>
                <span className="badge badge-primary">{pendingRequests.length}</span>
              </div>
              <div className="card-content">
                <div className="requests-list">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="request-item">
                      <div className="request-info">
                        <p className="request-title">{request.title}</p>
                        <p className="request-meta">{request.student} • {request.date}</p>
                      </div>
                      <div className="request-actions">
                        <button className="btn btn-sm btn-success">
                          <CheckCircle size={14} />
                        </button>
                        <button className="btn btn-sm btn-outline">
                          <AlertTriangle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Stats & Quick Actions */}
        <div className="admin-bottom-grid">
          {/* Faculty Distribution */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Building className="card-title-icon" />
                Phân bố sinh viên theo khoa
              </h2>
            </div>
            <div className="card-content">
              <div className="faculty-chart">
                {facultyStats.map((faculty, index) => (
                  <div key={index} className="faculty-item">
                    <div className="faculty-info">
                      <span className="faculty-name">{faculty.name}</span>
                      <span className="faculty-count">{faculty.students.toLocaleString()} SV</span>
                    </div>
                    <div className="faculty-bar-container">
                      <div 
                        className="faculty-bar" 
                        style={{ 
                          width: `${(faculty.students / totalStudents) * 100}%`,
                          backgroundColor: faculty.color 
                        }}
                      ></div>
                    </div>
                    <span className="faculty-percent">
                      {((faculty.students / totalStudents) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Settings className="card-title-icon" />
                Thao tác nhanh
              </h2>
            </div>
            <div className="card-content">
              <div className="quick-actions-grid">
                <button className="quick-action-btn quick-action-primary">
                  <UserPlus size={24} />
                  <span>Thêm sinh viên</span>
                </button>
                <button className="quick-action-btn">
                  <GraduationCap size={24} />
                  <span>Thêm giảng viên</span>
                </button>
                <button className="quick-action-btn">
                  <BookOpen size={24} />
                  <span>Tạo môn học</span>
                </button>
                <button className="quick-action-btn">
                  <Calendar size={24} />
                  <span>Thời khóa biểu</span>
                </button>
                <button className="quick-action-btn">
                  <FileText size={24} />
                  <span>Báo cáo</span>
                </button>
                <button className="quick-action-btn">
                  <Bell size={24} />
                  <span>Thông báo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
