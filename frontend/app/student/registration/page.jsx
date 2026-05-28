"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

const availableCourses = [
  { id: "IT4062", name: "Phát triển ứng dụng Web", credits: 3, group: "01", teacher: "TS. Nguyễn Văn Hùng", schedule: "Thứ 2, 7:00-9:30", room: "A2-301", slots: 45, registered: 38, status: "available" },
  { id: "IT4063", name: "Phát triển ứng dụng Di động", credits: 3, group: "01", teacher: "ThS. Trần Văn Nam", schedule: "Thứ 3, 9:45-12:15", room: "A3-402", slots: 40, registered: 40, status: "full" },
  { id: "IT4064", name: "Trí tuệ nhân tạo", credits: 3, group: "02", teacher: "PGS.TS. Lê Hoàng Nam", schedule: "Thứ 4, 13:30-16:00", room: "A1-201", slots: 50, registered: 42, status: "available" },
  { id: "IT4065", name: "Học máy", credits: 3, group: "01", teacher: "TS. Phạm Thị Hà", schedule: "Thứ 5, 7:00-9:30", room: "A2-302", slots: 45, registered: 30, status: "available" },
  { id: "IT4066", name: "An toàn và bảo mật thông tin", credits: 3, group: "01", teacher: "TS. Nguyễn Minh Đức", schedule: "Thứ 6, 9:45-12:15", room: "A1-301", slots: 50, registered: 45, status: "available" },
  { id: "IT4067", name: "Điện toán đám mây", credits: 3, group: "01", teacher: "ThS. Vũ Văn Tùng", schedule: "Thứ 2, 13:30-16:00", room: "A3-201", slots: 40, registered: 35, status: "available" },
]

const registeredCourses = [
  { id: "IT4062", name: "Phát triển ứng dụng Web", credits: 3, group: "01", teacher: "TS. Nguyễn Văn Hùng", schedule: "Thứ 2, 7:00-9:30", room: "A2-301" },
  { id: "IT4064", name: "Trí tuệ nhân tạo", credits: 3, group: "02", teacher: "PGS.TS. Lê Hoàng Nam", schedule: "Thứ 4, 13:30-16:00", room: "A1-201" },
  { id: "IT4065", name: "Học máy", credits: 3, group: "01", teacher: "TS. Phạm Thị Hà", schedule: "Thứ 5, 7:00-9:30", room: "A2-302" },
]

export default function RegistrationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [registered, setRegistered] = useState(registeredCourses)
  
  const totalCredits = registered.reduce((sum, course) => sum + course.credits, 0)
  const maxCredits = 24
  const minCredits = 14

  const filteredCourses = availableCourses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isRegistered = (courseId) => registered.some(c => c.id === courseId)

  const handleRegister = (course) => {
    if (!isRegistered(course.id) && course.status !== "full") {
      setRegistered([...registered, course])
    }
  }

  const handleRemove = (courseId) => {
    setRegistered(registered.filter(c => c.id !== courseId))
  }

  return (
    <div className="dashboard-content">
      <Header title="Đăng ký môn học" />
      
      <div className="dashboard-body">
        {/* Registration Info */}
        <div className="registration-info-banner">
          <div className="registration-info-content">
            <div className="registration-info-icon">
              <Info />
            </div>
            <div className="registration-info-text">
              <h3>Thời gian đăng ký: 15/01/2025 - 20/01/2025</h3>
              <p>Học kỳ 2 năm học 2024-2025. Sinh viên cần đăng ký tối thiểu {minCredits} tín chỉ và tối đa {maxCredits} tín chỉ.</p>
            </div>
          </div>
          <div className="registration-credits-info">
            <div className="credits-counter">
              <span className="credits-number">{totalCredits}</span>
              <span className="credits-max">/{maxCredits}</span>
            </div>
            <span className="credits-label">Tín chỉ đăng ký</span>
          </div>
        </div>

        <div className="registration-grid">
          {/* Available Courses */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <BookOpen />
                Danh sách môn học mở
              </h2>
            </div>
            <div className="card-content">
              {/* Search */}
              <div className="search-filter-bar">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <button className="btn btn-outline btn-sm">
                  <Filter /> Bộ lọc
                </button>
              </div>

              {/* Course List */}
              <div className="course-list">
                {filteredCourses.map((course) => (
                  <div key={`${course.id}-${course.group}`} className={`course-item ${course.status === "full" ? "disabled" : ""}`}>
                    <div className="course-main">
                      <div className="course-header">
                        <span className="course-code">{course.id}</span>
                        <span className={`badge ${course.status === "full" ? "badge-danger" : "badge-success"}`}>
                          {course.status === "full" ? "Đã đầy" : "Còn chỗ"}
                        </span>
                      </div>
                      <h4 className="course-name">{course.name}</h4>
                      <div className="course-details">
                        <span className="course-detail">
                          <Clock /> {course.schedule}
                        </span>
                        <span className="course-detail">
                          <Users /> {course.registered}/{course.slots}
                        </span>
                        <span className="course-detail">Nhóm {course.group}</span>
                        <span className="course-detail">{course.credits} TC</span>
                      </div>
                      <p className="course-teacher">{course.teacher} - {course.room}</p>
                    </div>
                    <div className="course-action">
                      {isRegistered(course.id) ? (
                        <button className="btn btn-outline btn-sm" disabled>
                          <CheckCircle /> Đã đăng ký
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleRegister(course)}
                          disabled={course.status === "full"}
                        >
                          <Plus /> Đăng ký
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registered Courses */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <CheckCircle />
                Môn học đã đăng ký ({registered.length})
              </h2>
            </div>
            <div className="card-content">
              {registered.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle />
                  <p>Chưa có môn học nào được đăng ký</p>
                </div>
              ) : (
                <div className="registered-list">
                  {registered.map((course) => (
                    <div key={course.id} className="registered-item">
                      <div className="registered-info">
                        <div className="registered-header">
                          <span className="course-code">{course.id}</span>
                          <span className="course-credits">{course.credits} TC</span>
                        </div>
                        <h4 className="course-name">{course.name}</h4>
                        <p className="course-schedule">{course.schedule} - {course.room}</p>
                      </div>
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleRemove(course.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div className="registration-summary">
                <div className="summary-row">
                  <span>Tổng số môn:</span>
                  <span className="font-semibold">{registered.length} môn</span>
                </div>
                <div className="summary-row">
                  <span>Tổng tín chỉ:</span>
                  <span className="font-semibold">{totalCredits} tín chỉ</span>
                </div>
                <div className="summary-row">
                  <span>Học phí dự kiến:</span>
                  <span className="font-semibold text-primary">{(totalCredits * 450000).toLocaleString()}đ</span>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
