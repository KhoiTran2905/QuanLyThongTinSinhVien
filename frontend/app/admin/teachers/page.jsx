"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, HorizontalBarChart } from "@/components/dashboard/charts"
import {
  GraduationCap,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Building,
  Clock
} from "lucide-react"

const teachers = [
  { id: "GV001", name: "PGS.TS. Nguyen Van Minh", department: "Khoa CNTT", email: "minhnv@ptit.edu.vn", phone: "0912345678", subjects: ["Lap trinh Java", "Co so du lieu"], status: "active", classes: 5, students: 180 },
  { id: "GV002", name: "TS. Tran Thi Huong", department: "Khoa CNTT", email: "huongtt@ptit.edu.vn", phone: "0923456789", subjects: ["Mang may tinh", "An ninh mang"], status: "active", classes: 4, students: 150 },
  { id: "GV003", name: "ThS. Le Hoang Nam", department: "Khoa Vien thong", email: "namlh@ptit.edu.vn", phone: "0934567890", subjects: ["Xu ly tin hieu", "Thong tin vo tuyen"], status: "active", classes: 3, students: 95 },
  { id: "GV004", name: "PGS.TS. Pham Van Duc", department: "Khoa Dien tu", email: "ducpv@ptit.edu.vn", phone: "0945678901", subjects: ["Dien tu so", "Vi xu ly"], status: "active", classes: 4, students: 140 },
  { id: "GV005", name: "TS. Hoang Thi Lan", department: "Khoa CNTT", email: "lanht@ptit.edu.vn", phone: "0956789012", subjects: ["Tri tue nhan tao", "Machine Learning"], status: "leave", classes: 2, students: 80 },
  { id: "GV006", name: "ThS. Ngo Van Hai", department: "Khoa ATTT", email: "haingv@ptit.edu.vn", phone: "0967890123", subjects: ["Mat ma hoc", "Bao mat he thong"], status: "active", classes: 3, students: 120 },
]

const departmentData = [
  { name: "Khoa CNTT", teachers: 285, color: "#b91c1c" },
  { name: "Khoa Vien thong", teachers: 156, color: "#2563eb" },
  { name: "Khoa ATTT", teachers: 124, color: "#16a34a" },
  { name: "Khoa Dien tu", teachers: 118, color: "#f59e0b" },
  { name: "Khoa QTKD", teachers: 82, color: "#8b5cf6" },
  { name: "Khac", teachers: 58, color: "#6b7280" },
]

const degreeData = [
  { name: "GS/PGS", value: 25, color: "#b91c1c" },
  { name: "Tien si", value: 285, color: "#dc2626" },
  { name: "Thac si", value: 456, color: "#f59e0b" },
  { name: "Cu nhan", value: 57, color: "#6b7280" },
]

const workloadData = [
  { name: "TS. Nguyen Van A", hours: 320 },
  { name: "PGS. Tran Thi B", hours: 280 },
  { name: "ThS. Le Van C", hours: 260 },
  { name: "TS. Pham Thi D", hours: 240 },
  { name: "ThS. Hoang Van E", hours: 220 },
]

const topTeachers = [
  { name: "PGS.TS. Nguyen Van Minh", department: "Khoa CNTT", rating: 4.9, students: 180 },
  { name: "TS. Tran Thi Huong", department: "Khoa CNTT", rating: 4.8, students: 150 },
  { name: "PGS.TS. Pham Van Duc", department: "Khoa Dien tu", rating: 4.7, students: 140 },
  { name: "ThS. Ngo Van Hai", department: "Khoa ATTT", rating: 4.6, students: 120 },
  { name: "ThS. Le Hoang Nam", department: "Khoa Vien thong", rating: 4.5, students: 95 },
]

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredTeachers = teachers.filter(teacher => {
    const matchSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       teacher.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchDept = departmentFilter === "all" || teacher.department.toLowerCase().includes(departmentFilter)
    return matchSearch && matchDept
  })

  return (
    <div className="dashboard-content">
      <Header title="Quản lý giảng viên" />
      
      <div className="dashboard-body">
        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <GraduationCap size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +5%
              </div>
            </div>
            <div className="summary-item-value">823</div>
            <div className="summary-item-label">Tổng giảng viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <Users size={20} />
              </div>
            </div>
            <div className="summary-item-value">756</div>
            <div className="summary-item-label">Đang giảng dạy</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">42</div>
            <div className="summary-item-label">Nghỉ phép</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Award size={20} />
              </div>
            </div>
            <div className="summary-item-value">25</div>
            <div className="summary-item-label">GS/PGS</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* Department Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Building />
                Phân bố giảng viên theo khoa
              </h3>
            </div>
            <div className="chart-card-body">
              <SimpleBarChart 
                data={departmentData} 
                dataKey="teachers"
                xKey="name"
                color="#b91c1c"
                height={280}
              />
            </div>
          </div>

          {/* Degree Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <GraduationCap />
                Trình độ học vị
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={degreeData} 
                height={200}
                centerText="823"
                centerSubtext="Tổng GV"
              />
              <div className="chart-legend">
                {degreeData.map((item, index) => (
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
          {/* Workload Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Clock />
                Top 5 — Số giờ giảng dạy
              </h3>
            </div>
            <div className="chart-card-body">
              <HorizontalBarChart 
                data={workloadData} 
                dataKey="hours"
                xKey="name"
                color="#2563eb"
                height={220}
              />
            </div>
          </div>

          {/* Top Rated Teachers */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award />
                Top giảng viên được đánh giá cao
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {topTeachers.map((teacher, index) => (
                  <div key={index} className="ranking-item">
                    <div className={`ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'normal'}`}>
                      {index + 1}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">{teacher.name}</div>
                      <div className="ranking-meta">{teacher.department} | {teacher.students} SV</div>
                    </div>
                    <div className="ranking-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Award size={16} style={{ color: "#f59e0b" }} />
                      {teacher.rating}
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
                    placeholder="Tìm kiếm giảng viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">Tất cả khoa</option>
                  <option value="cntt">Khoa CNTT</option>
                  <option value="vien thong">Khoa Viễn thông</option>
                  <option value="dien tu">Khoa Điện tử</option>
                  <option value="attt">Khoa ATTT</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Download />
                  Xuất
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                  Thêm giảng viên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <GraduationCap />
              Danh sách giảng viên
            </h3>
            <span className="badge badge-primary">{filteredTeachers.length} giảng viên</span>
          </div>
          <div style={{ padding: "0" }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}><input type="checkbox" /></th>
                    <th>Giảng viên</th>
                    <th>Mã GV</th>
                    <th>Khoa</th>
                    <th>Môn giảng dạy</th>
                    <th>Số lớp</th>
                    <th>Số SV</th>
                    <th>Trạng thái</th>
                    <th style={{ width: "120px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="student-cell">
                          <div className="avatar avatar-sm">
                            {teacher.name.split(" ").pop()?.charAt(0)}
                          </div>
                          <div>
                            <p className="student-name">{teacher.name}</p>
                            <p className="student-email">{teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-code">{teacher.id}</span></td>
                      <td>{teacher.department}</td>
                      <td>
                        <div className="tags-cell">
                          {teacher.subjects.slice(0, 2).map((subject, index) => (
                            <span key={index} className="tag">{subject}</span>
                          ))}
                          {teacher.subjects.length > 2 && (
                            <span className="tag tag-secondary">+{teacher.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-outline">{teacher.classes} lớp</span>
                      </td>
                      <td className="text-center">
                        <strong>{teacher.students}</strong> <span className="text-muted">SV</span>
                      </td>
                      <td>
                        <span className={`badge ${teacher.status === "active" ? "badge-success" : "badge-warning"}`}>
                          {teacher.status === "active" ? "Đang dạy" : "Nghỉ phép"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-ghost btn-icon btn-sm"><Eye /></button>
                          <button className="btn btn-ghost btn-icon btn-sm"><Edit /></button>
                          <button className="btn btn-ghost btn-icon btn-sm text-danger"><Trash2 /></button>
                        </div>
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
