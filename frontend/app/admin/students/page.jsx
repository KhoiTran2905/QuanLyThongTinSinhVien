"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, SimpleAreaChart } from "@/components/dashboard/charts"
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  UserCheck,
  UserX,
  Clock,
  Award
} from "lucide-react"

const students = [
  { id: "B21DCCN001", name: "Nguyễn Văn An", class: "D21CQCN01-B", major: "Công nghệ thông tin", email: "b21dccn001@ptit.edu.vn", phone: "0912345678", status: "active", gpa: 3.45 },
  { id: "B21DCCN002", name: "Trần Thị Bình", class: "D21CQCN02-B", major: "Công nghệ thông tin", email: "b21dccn002@ptit.edu.vn", phone: "0923456789", status: "active", gpa: 3.72 },
  { id: "B21DCAT003", name: "Lê Hoàng Cường", class: "D21CQAT01-B", major: "An toàn thông tin", email: "b21dcat003@ptit.edu.vn", phone: "0934567890", status: "pending", gpa: 3.15 },
  { id: "B21DCVT004", name: "Phạm Minh Đức", class: "D21CQVT01-B", major: "Viễn thông", email: "b21dcvt004@ptit.edu.vn", phone: "0945678901", status: "active", gpa: 3.28 },
  { id: "B21DCDT005", name: "Hoàng Thị Hà", class: "D21CQDT01-B", major: "Điện tử", email: "b21dcdt005@ptit.edu.vn", phone: "0956789012", status: "active", gpa: 3.85 },
  { id: "B21DCCN006", name: "Ngô Văn Hùng", class: "D21CQCN03-B", major: "Công nghệ thông tin", email: "b21dccn006@ptit.edu.vn", phone: "0967890123", status: "inactive", gpa: 2.95 },
  { id: "B21DCAT007", name: "Đỗ Thị Kim", class: "D21CQAT02-B", major: "An toàn thông tin", email: "b21dcat007@ptit.edu.vn", phone: "0978901234", status: "active", gpa: 3.55 },
  { id: "B21DCVT008", name: "Vũ Minh Long", class: "D21CQVT02-B", major: "Viễn thông", email: "b21dcvt008@ptit.edu.vn", phone: "0989012345", status: "active", gpa: 3.12 },
]

const statusData = [
  { name: "Đang học", value: 14856, color: "#16a34a" },
  { name: "Chờ duyệt", value: 342, color: "#f59e0b" },
  { name: "Bảo lưu", value: 222, color: "#dc2626" },
]

const majorData = [
  { name: "CNTT", students: 5420 },
  { name: "ATTT", students: 2100 },
  { name: "Viễn thông", students: 3200 },
  { name: "Điện tử", students: 2500 },
  { name: "Đa phương tiện", students: 2200 },
]

const gpaDistribution = [
  { name: "Xuất sắc", value: 2315, color: "#16a34a" },
  { name: "Giỏi", value: 4626, color: "#2563eb" },
  { name: "Khá", value: 5397, color: "#f59e0b" },
  { name: "Trung bình", value: 2313, color: "#ea580c" },
  { name: "Yếu", value: 769, color: "#dc2626" },
]

const enrollmentData = [
  { name: "T1", value: 320 },
  { name: "T2", value: 450 },
  { name: "T3", value: 380 },
  { name: "T4", value: 520 },
  { name: "T5", value: 680 },
  { name: "T6", value: 420 },
  { name: "T7", value: 350 },
  { name: "T8", value: 890 },
  { name: "T9", value: 1250 },
  { name: "T10", value: 380 },
  { name: "T11", value: 290 },
  { name: "T12", value: 210 },
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredStudents = students.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || student.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="dashboard-content">
      <Header title="Quản lý sinh viên" />
      
      <div className="dashboard-body">
        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <Users size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +12%
              </div>
            </div>
            <div className="summary-item-value">15,420</div>
            <div className="summary-item-label">Tổng sinh viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <UserCheck size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +8%
              </div>
            </div>
            <div className="summary-item-value">14,856</div>
            <div className="summary-item-label">Đang học</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">342</div>
            <div className="summary-item-label">Chờ duyệt</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Award size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +0.05
              </div>
            </div>
            <div className="summary-item-value">3.24</div>
            <div className="summary-item-label">GPA trung bình</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* Enrollment Trend */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <TrendingUp />
                Xu hướng nhập học theo tháng
              </h3>
              <select className="filter-select-sm">
                <option>Nam 2025</option>
                <option>Nam 2024</option>
              </select>
            </div>
            <div className="chart-card-body">
              <SimpleAreaChart 
                data={enrollmentData} 
                dataKey="value" 
                xKey="name"
                color="#b91c1c"
                height={250}
              />
            </div>
          </div>

          {/* Status Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Users />
                Trạng thái sinh viên
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={statusData} 
                height={200}
                centerText="15,420"
                centerSubtext="Tong so"
              />
              <div className="chart-legend">
                {statusData.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}: {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* Major Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <GraduationCap />
                Phân bố theo ngành
              </h3>
            </div>
            <div className="chart-card-body">
              <SimpleBarChart 
                data={majorData} 
                dataKey="students"
                xKey="name"
                color="#b91c1c"
                height={220}
              />
            </div>
          </div>

          {/* GPA Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award />
                Phân bố học lực
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {gpaDistribution.map((item, index) => (
                  <div key={index} className="ranking-item">
                    <div 
                      className="ranking-position"
                      style={{ background: item.color, color: "white" }}
                    >
                      {index + 1}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">{item.name}</div>
                      <div className="progress-cell" style={{ marginTop: "4px" }}>
                        <div className="progress-bar-mini" style={{ flex: 1 }}>
                          <div 
                            className="progress-bar-mini-fill"
                            style={{ 
                              width: `${(item.value / 15420) * 100}%`,
                              background: item.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ranking-value">{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm theo tên, mã SV..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang học</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="inactive">Bảo lưu</option>
                </select>
                <button className="btn btn-outline btn-sm">
                  <Filter />
                  Lọc nâng cao
                </button>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Upload />
                  Import
                </button>
                <button className="btn btn-outline btn-sm">
                  <Download />
                  Export
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                  Thêm sinh viên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Users />
              Danh sách sinh viên
            </h3>
            <span className="badge badge-primary">{filteredStudents.length} sinh viên</span>
          </div>
          <div style={{ padding: "0" }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
                      <input type="checkbox" />
                    </th>
                    <th>Sinh viên</th>
                    <th>Mã SV</th>
                    <th>Lớp</th>
                    <th>Ngành</th>
                    <th>GPA</th>
                    <th>Trạng thái</th>
                    <th style={{ width: "120px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <div className="student-cell">
                          <div className="avatar avatar-sm">
                            {student.name.split(" ").pop()?.charAt(0)}
                          </div>
                          <div>
                            <p className="student-name">{student.name}</p>
                            <p className="student-email">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-code">{student.id}</span></td>
                      <td>{student.class}</td>
                      <td className="text-muted">{student.major}</td>
                      <td>
                        <div className="progress-cell">
                          <span className={`gpa-badge ${student.gpa >= 3.5 ? 'excellent' : student.gpa >= 3.0 ? 'good' : 'average'}`}>
                            {student.gpa.toFixed(2)}
                          </span>
                          <div className="progress-bar-mini">
                            <div 
                              className={`progress-bar-mini-fill ${student.gpa >= 3.5 ? 'excellent' : student.gpa >= 3.0 ? 'good' : student.gpa >= 2.5 ? 'average' : 'poor'}`}
                              style={{ width: `${(student.gpa / 4) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          student.status === "active" ? "badge-success" : 
                          student.status === "pending" ? "badge-warning" : "badge-secondary"
                        }`}>
                          {student.status === "active" ? "Đang học" : 
                           student.status === "pending" ? "Chờ duyệt" : "Bảo lưu"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-ghost btn-icon btn-sm" title="Xem chi tiết">
                            <Eye />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Chỉnh sửa">
                            <Edit />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm text-danger" title="Xóa">
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="table-pagination" style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
              <p className="pagination-info">
                Hiển thị 1–8 trong tổng số 15,420 sinh viên
              </p>
              <div className="pagination-controls">
                <button className="btn btn-outline btn-sm btn-icon">
                  <ChevronLeft />
                </button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-outline btn-sm">2</button>
                <button className="btn btn-outline btn-sm">3</button>
                <span className="pagination-ellipsis">...</span>
                <button className="btn btn-outline btn-sm">1928</button>
                <button className="btn btn-outline btn-sm btn-icon">
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
