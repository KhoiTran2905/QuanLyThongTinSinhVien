"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, SimpleAreaChart } from "@/components/dashboard/charts"
import {
  BookOpen,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Layers,
  CheckCircle,
  XCircle
} from "lucide-react"

const courses = [
  { id: "INT1340", name: "Lập trình Java", credits: 3, department: "Khoa CNTT", teacher: "PGS.TS. Nguyễn Văn Minh", students: 120, semester: "HK2 2024-2025", type: "Bắt buộc", status: "active" },
  { id: "INT1341", name: "Cơ sở dữ liệu", credits: 3, department: "Khoa CNTT", teacher: "TS. Trần Thị Hương", students: 150, semester: "HK2 2024-2025", type: "Bắt buộc", status: "active" },
  { id: "INT1342", name: "Mạng máy tính", credits: 3, department: "Khoa CNTT", teacher: "ThS. Lê Hoàng Nam", students: 95, semester: "HK2 2024-2025", type: "Bắt buộc", status: "active" },
  { id: "INT1343", name: "Trí tuệ nhân tạo", credits: 3, department: "Khoa CNTT", teacher: "TS. Hoàng Thị Lan", students: 80, semester: "HK2 2024-2025", type: "Tự chọn", status: "active" },
  { id: "TEL2201", name: "Xử lý tín hiệu số", credits: 3, department: "Khoa Viễn thông", teacher: "PGS.TS. Phạm Văn Đức", students: 65, semester: "HK2 2024-2025", type: "Bắt buộc", status: "active" },
  { id: "SEC3101", name: "An ninh mạng", credits: 3, department: "Khoa ATTT", teacher: "ThS. Ngô Văn Hải", students: 45, semester: "HK2 2024-2025", type: "Bắt buộc", status: "inactive" },
]

const courseTypeData = [
  { name: "Bắt buộc", value: 285, color: "#b91c1c" },
  { name: "Tự chọn", value: 98, color: "#2563eb" },
  { name: "Thể chất/QP", value: 45, color: "#16a34a" },
]

const enrollmentTrend = [
  { name: "T1", value: 8500 },
  { name: "T2", value: 9200 },
  { name: "T3", value: 8800 },
  { name: "T4", value: 7500 },
  { name: "T5", value: 6200 },
  { name: "T6", value: 4500 },
  { name: "T7", value: 3200 },
  { name: "T8", value: 5800 },
  { name: "T9", value: 12450 },
  { name: "T10", value: 8900 },
  { name: "T11", value: 7800 },
  { name: "T12", value: 6500 },
]

const departmentCourses = [
  { name: "CNTT", courses: 156 },
  { name: "ATTT", courses: 68 },
  { name: "Viễn thông", courses: 85 },
  { name: "Điện tử", courses: 72 },
  { name: "Đa phương tiện", courses: 47 },
]

const popularCourses = [
  { name: "Lập trình Java", code: "INT1340", students: 850, trend: "+15%" },
  { name: "Cơ sở dữ liệu", code: "INT1341", students: 780, trend: "+12%" },
  { name: "Mạng máy tính", code: "INT1342", students: 650, trend: "+8%" },
  { name: "Trí tuệ nhân tạo", code: "INT1343", students: 520, trend: "+25%" },
  { name: "An ninh mạng", code: "SEC3101", students: 480, trend: "+18%" },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       course.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = typeFilter === "all" || course.type.toLowerCase().includes(typeFilter)
    return matchSearch && matchType
  })

  return (
    <div className="dashboard-content">
      <Header title="Quản lý môn học" />
      
      <div className="dashboard-body">
        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <BookOpen size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +8%
              </div>
            </div>
            <div className="summary-item-value">428</div>
            <div className="summary-item-label">Tổng môn học</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="summary-item-value">156</div>
            <div className="summary-item-label">Đang mở</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">1,850</div>
            <div className="summary-item-label">Tổng tín chỉ</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Users size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +12%
              </div>
            </div>
            <div className="summary-item-value">12,450</div>
            <div className="summary-item-label">Lượt đăng ký</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* Enrollment Trend */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <TrendingUp />
                Xu hướng đăng ký môn học
              </h3>
              <select className="filter-select-sm">
                <option>Nam 2025</option>
                <option>Nam 2024</option>
              </select>
            </div>
            <div className="chart-card-body">
              <SimpleAreaChart 
                data={enrollmentTrend} 
                dataKey="value"
                xKey="name"
                color="#b91c1c"
                height={280}
              />
            </div>
          </div>

          {/* Course Type Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Layers />
                Phân loại môn học
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={courseTypeData} 
                height={200}
                centerText="428"
                centerSubtext="Mon hoc"
              />
              <div className="chart-legend">
                {courseTypeData.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* Department Courses */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BookOpen />
                Số môn học theo khoa
              </h3>
            </div>
            <div className="chart-card-body">
              <SimpleBarChart 
                data={departmentCourses} 
                dataKey="courses"
                xKey="name"
                color="#2563eb"
                height={220}
              />
            </div>
          </div>

          {/* Popular Courses */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award />
                Môn học được đăng ký nhiều
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {popularCourses.map((course, index) => (
                  <div key={index} className="ranking-item">
                    <div className={`ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'normal'}`}>
                      {index + 1}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">{course.name}</div>
                      <div className="ranking-meta">{course.code}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <div className="ranking-value">{course.students}</div>
                      <span className="summary-item-trend positive" style={{ fontSize: "11px" }}>
                        <TrendingUp size={12} />
                        {course.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm môn học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select className="filter-select">
                  <option value="all">Tất cả khoa</option>
                  <option value="cntt">Khoa CNTT</option>
                  <option value="vt">Khoa Viễn thông</option>
                  <option value="attt">Khoa ATTT</option>
                </select>
                <select 
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="bắt buộc">Bắt buộc</option>
                  <option value="tự chọn">Tự chọn</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Download />
                  Xuất
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                  Thêm môn học
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid - Enhanced Visual Cards */}
        <div style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BookOpen />
                Danh sách môn học
              </h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="badge badge-success">{courses.filter(c => c.status === "active").length} đang mở</span>
                <span className="badge badge-secondary">{courses.filter(c => c.status === "inactive").length} đã đóng</span>
              </div>
            </div>
            <div className="chart-card-body" style={{ padding: "20px" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
                gap: "16px" 
              }}>
                {filteredCourses.map((course) => (
                  <div key={course.id} style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: course.status === "active" ? "1px solid rgba(22, 163, 74, 0.2)" : "1px solid var(--border)",
                    background: course.status === "active" 
                      ? "linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)" 
                      : "var(--card)",
                    transition: "all 0.2s",
                  }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: course.status === "active" ? "rgba(22, 163, 74, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <BookOpen size={24} style={{ color: course.status === "active" ? "#16a34a" : "#6b7280" }} />
                      </div>
                      <span className={`badge ${course.status === "active" ? "badge-success" : "badge-secondary"}`}>
                        {course.status === "active" ? "Đang mở" : "Đã đóng"}
                      </span>
                    </div>

                    {/* Course Info */}
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: "600", marginBottom: "4px" }}>{course.id}</p>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{course.name}</h3>
                      <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{course.teacher}</p>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Đăng ký</span>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>{course.students}/150 SV</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "var(--accent)" }}>
                        <div style={{ 
                          width: `${(course.students / 150) * 100}%`, 
                          height: "100%", 
                          borderRadius: "3px",
                          background: course.students >= 120 ? "#16a34a" : course.students >= 80 ? "#2563eb" : "#f59e0b"
                        }}></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1fr 1fr", 
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "var(--accent)",
                      marginBottom: "16px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Clock size={14} style={{ color: "var(--muted-foreground)" }} />
                        <span style={{ fontSize: "13px" }}>{course.credits} tín chỉ</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={14} style={{ color: "var(--muted-foreground)" }} />
                        <span style={{ fontSize: "13px" }}>{course.students} SV</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: "rgba(185, 28, 28, 0.1)",
                        color: "#b91c1c"
                      }}>{course.department}</span>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: course.type === "Bắt buộc" ? "rgba(37, 99, 235, 0.1)" : "rgba(139, 92, 246, 0.1)",
                        color: course.type === "Bắt buộc" ? "#2563eb" : "#8b5cf6"
                      }}>{course.type}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                        <Eye size={14} />
                        Xem
                      </button>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                        <Edit size={14} />
                        Sửa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
