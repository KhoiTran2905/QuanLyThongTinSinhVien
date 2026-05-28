"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, SimpleAreaChart, HorizontalBarChart } from "@/components/dashboard/charts"
import {
  FileText,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  BookOpen,
  BarChart3
} from "lucide-react"

const gradesData = [
  { id: "B21DCCN001", name: "Nguyen Van An", class: "D21CQCN01-B", midterm: 8.5, final: 9.0, total: 8.8, grade: "A", status: "approved" },
  { id: "B21DCCN002", name: "Tran Thi Binh", class: "D21CQCN01-B", midterm: 7.0, final: 8.0, total: 7.6, grade: "B+", status: "approved" },
  { id: "B21DCCN003", name: "Le Hoang Cuong", class: "D21CQCN01-B", midterm: 6.5, final: 7.5, total: 7.1, grade: "B", status: "pending" },
  { id: "B21DCCN004", name: "Pham Minh Duc", class: "D21CQCN01-B", midterm: 9.0, final: 9.5, total: 9.3, grade: "A+", status: "approved" },
  { id: "B21DCCN005", name: "Hoang Thi Ha", class: "D21CQCN01-B", midterm: 5.0, final: 6.0, total: 5.6, grade: "C+", status: "pending" },
  { id: "B21DCCN006", name: "Ngo Van Hung", class: "D21CQCN01-B", midterm: 4.0, final: 4.5, total: 4.3, grade: "D", status: "rejected" },
]

const gradeDistribution = [
  { name: "A+ (>= 9.0)", value: 1850, color: "#16a34a" },
  { name: "A (8.5-8.9)", value: 2450, color: "#22c55e" },
  { name: "B+ (8.0-8.4)", value: 3200, color: "#2563eb" },
  { name: "B (7.0-7.9)", value: 2800, color: "#3b82f6" },
  { name: "C+ (6.5-6.9)", value: 1200, color: "#f59e0b" },
  { name: "C (5.5-6.4)", value: 650, color: "#ea580c" },
  { name: "D/F (< 5.5)", value: 300, color: "#dc2626" },
]

const semesterTrend = [
  { name: "HK1/22", gpa: 3.12 },
  { name: "HK2/22", gpa: 3.18 },
  { name: "HK1/23", gpa: 3.22 },
  { name: "HK2/23", gpa: 3.28 },
  { name: "HK1/24", gpa: 3.32 },
  { name: "HK2/24", gpa: 3.35 },
]

const subjectPerformance = [
  { name: "Lap trinh Java", avg: 7.8 },
  { name: "Co so du lieu", avg: 7.5 },
  { name: "Mang may tinh", avg: 7.2 },
  { name: "Tri tue nhan tao", avg: 8.1 },
  { name: "An ninh mang", avg: 7.6 },
]

const approvalStatus = [
  { name: "Da duyet", value: 10234, color: "#16a34a" },
  { name: "Cho duyet", value: 1856, color: "#f59e0b" },
  { name: "Tu choi", value: 360, color: "#dc2626" },
]

export default function AdminGradesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("INT1340")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredGrades = gradesData.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "all" || student.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="dashboard-content">
      <Header title="Quản lý điểm số" />
      
      <div className="dashboard-body">
        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <FileText size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +8%
              </div>
            </div>
            <div className="summary-item-value">12,450</div>
            <div className="summary-item-label">Tổng bảng điểm</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="summary-item-value">10,234</div>
            <div className="summary-item-label">Da duyet</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">1,856</div>
            <div className="summary-item-label">Cho duyet</div>
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
            <div className="summary-item-value">3.35</div>
            <div className="summary-item-label">GPA Trung binh</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* GPA Trend */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <TrendingUp />
                Xu huong GPA qua cac ky
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="chart-mini-stats">
                <div className="chart-mini-stat">
                  <div className="chart-mini-stat-value">3.35</div>
                  <div className="chart-mini-stat-label">GPA hien tai</div>
                  <div className="chart-mini-stat-trend positive">
                    <TrendingUp size={12} />
                    +0.03
                  </div>
                </div>
                <div className="chart-mini-stat">
                  <div className="chart-mini-stat-value">3.12</div>
                  <div className="chart-mini-stat-label">GPA thap nhat</div>
                </div>
                <div className="chart-mini-stat">
                  <div className="chart-mini-stat-value">3.35</div>
                  <div className="chart-mini-stat-label">GPA cao nhat</div>
                </div>
              </div>
              <SimpleAreaChart 
                data={semesterTrend} 
                dataKey="gpa"
                xKey="name"
                color="#16a34a"
                height={200}
              />
            </div>
          </div>

          {/* Approval Status */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <CheckCircle />
                Trang thái duyệt điểm
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={approvalStatus} 
                height={200}
                centerText="12,450"
                centerSubtext="Bang diem"
              />
              <div className="chart-legend">
                {approvalStatus.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}: {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* Grade Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BarChart3 />
                Phân bố điểm số
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {gradeDistribution.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
                    <span style={{ 
                      width: "90px", 
                      fontSize: "13px", 
                      fontWeight: "500",
                      color: item.color 
                    }}>{item.name}</span>
                    <div className="progress-bar-mini" style={{ flex: 1 }}>
                      <div 
                        style={{ 
                          height: "100%",
                          width: `${(item.value / 3200) * 100}%`,
                          background: item.color,
                          borderRadius: "3px"
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "600", width: "60px", textAlign: "right" }}>
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BookOpen />
                Điểm trung bình theo môn
              </h3>
            </div>
            <div className="chart-card-body">
              <HorizontalBarChart 
                data={subjectPerformance} 
                dataKey="avg"
                xKey="name"
                color="#2563eb"
                height={220}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <select 
                  className="filter-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="INT1340">INT1340 - Lap trinh Java</option>
                  <option value="INT1341">INT1341 - Co so du lieu</option>
                  <option value="INT1342">INT1342 - Mang may tinh</option>
                </select>
                <select className="filter-select">
                  <option value="all">Tat ca lop</option>
                  <option value="d21cqcn01">D21CQCN01-B</option>
                  <option value="d21cqcn02">D21CQCN02-B</option>
                </select>
                <select 
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tat ca trang thai</option>
                  <option value="approved">Da duyet</option>
                  <option value="pending">Cho duyet</option>
                  <option value="rejected">Tu choi</option>
                </select>
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Tim sinh vien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Upload />
                  Import diem
                </button>
                <button className="btn btn-outline btn-sm">
                  <Download />
                  Export
                </button>
                <button className="btn btn-primary btn-sm">
                  <CheckCircle />
                  Duyet tat ca
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <FileText />
              Bảng điểm: {selectedCourse} — Học kỳ II (2024–2025)
            </h3>
            <span className="badge badge-primary">{filteredGrades.length} sinh vien</span>
          </div>
          <div style={{ padding: "0" }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}><input type="checkbox" /></th>
                    <th>Sinh vien</th>
                    <th>Ma SV</th>
                    <th>Lop</th>
                    <th className="text-center">Giua ky (30%)</th>
                    <th className="text-center">Cuoi ky (70%)</th>
                    <th className="text-center">Tong ket</th>
                    <th className="text-center">Xep loai</th>
                    <th>Trang thai</th>
                    <th style={{ width: "140px" }}>Thao tac</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((student) => (
                    <tr key={student.id}>
                      <td><input type="checkbox" /></td>
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
                      <td className="text-center">
                        <span className={`gpa-badge ${student.midterm >= 8 ? 'excellent' : student.midterm >= 6.5 ? 'good' : 'average'}`}>
                          {student.midterm.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`gpa-badge ${student.final >= 8 ? 'excellent' : student.final >= 6.5 ? 'good' : 'average'}`}>
                          {student.final.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span style={{ 
                          fontSize: "16px", 
                          fontWeight: "700",
                          color: student.total >= 8 ? "#16a34a" : student.total >= 6.5 ? "#2563eb" : student.total >= 5 ? "#f59e0b" : "#dc2626"
                        }}>
                          {student.total.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "700",
                          background: student.grade.startsWith('A') ? "rgba(22, 163, 74, 0.1)" : 
                                     student.grade.startsWith('B') ? "rgba(37, 99, 235, 0.1)" : 
                                     student.grade.startsWith('C') ? "rgba(245, 158, 11, 0.1)" : "rgba(220, 38, 38, 0.1)",
                          color: student.grade.startsWith('A') ? "#16a34a" : 
                                student.grade.startsWith('B') ? "#2563eb" : 
                                student.grade.startsWith('C') ? "#f59e0b" : "#dc2626"
                        }}>
                          {student.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          student.status === "approved" ? "badge-success" : 
                          student.status === "pending" ? "badge-warning" : "badge-danger"
                        }`}>
                          {student.status === "approved" ? "Da duyet" : 
                           student.status === "pending" ? "Cho duyet" : "Tu choi"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-ghost btn-icon btn-sm"><Eye /></button>
                          <button className="btn btn-ghost btn-icon btn-sm"><Edit /></button>
                          {student.status === "pending" && (
                            <>
                              <button className="btn btn-ghost btn-icon btn-sm text-success"><CheckCircle /></button>
                              <button className="btn btn-ghost btn-icon btn-sm text-danger"><XCircle /></button>
                            </>
                          )}
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
