"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, MultiBarChart } from "@/components/dashboard/charts"
import {
  ClipboardList,
  Search,
  Plus,
  Eye,
  Edit,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Building,
  GraduationCap
} from "lucide-react"

const classes = [
  { id: "D21CQCN01-B", name: "CNTT K21 - Nhóm 1", major: "Công nghệ thông tin", students: 45, advisor: "PGS.TS. Nguyễn Văn Minh", year: 2021, status: "active", gpa: 3.25 },
  { id: "D21CQCN02-B", name: "CNTT K21 - Nhóm 2", major: "Công nghệ thông tin", students: 42, advisor: "TS. Trần Thị Hương", year: 2021, status: "active", gpa: 3.18 },
  { id: "D21CQAT01-B", name: "ATTT K21 - Nhóm 1", major: "An toàn thông tin", students: 38, advisor: "ThS. Ngô Văn Hải", year: 2021, status: "active", gpa: 3.32 },
  { id: "D21CQVT01-B", name: "Viễn thông K21", major: "Viễn thông", students: 35, advisor: "ThS. Lê Hoàng Nam", year: 2021, status: "active", gpa: 3.15 },
  { id: "D22CQCN01-B", name: "CNTT K22 - Nhóm 1", major: "Công nghệ thông tin", students: 48, advisor: "TS. Hoàng Thị Lan", year: 2022, status: "active", gpa: 3.28 },
  { id: "D20CQCN01-B", name: "CNTT K20 - Nhóm 1", major: "Công nghệ thông tin", students: 40, advisor: "PGS.TS. Phạm Văn Đức", year: 2020, status: "graduated", gpa: 3.42 },
]

const majorDistribution = [
  { name: "CNTT", value: 5420, color: "#b91c1c" },
  { name: "ATTT", value: 2100, color: "#2563eb" },
  { name: "Viễn thông", value: 3200, color: "#16a34a" },
  { name: "Điện tử", value: 2500, color: "#f59e0b" },
  { name: "Đa phương tiện", value: 2200, color: "#8b5cf6" },
]

const yearlyData = [
  { name: "K2020", CNTT: 42, ATTT: 15, VT: 20, DT: 18 },
  { name: "K2021", CNTT: 48, ATTT: 18, VT: 22, DT: 20 },
  { name: "K2022", CNTT: 52, ATTT: 20, VT: 24, DT: 22 },
  { name: "K2023", CNTT: 55, ATTT: 22, VT: 25, DT: 23 },
  { name: "K2024", CNTT: 58, ATTT: 24, VT: 26, DT: 24 },
]

const classPerformance = [
  { name: "D21CQCN01-B", gpa: 3.45 },
  { name: "D21CQAT01-B", gpa: 3.38 },
  { name: "D22CQCN01-B", gpa: 3.32 },
  { name: "D21CQCN02-B", gpa: 3.28 },
  { name: "D21CQVT01-B", gpa: 3.22 },
]

const topClasses = [
  { name: "D21CQCN01-B", major: "CNTT K21", gpa: 3.45, students: 45 },
  { name: "D21CQAT01-B", major: "ATTT K21", gpa: 3.38, students: 38 },
  { name: "D22CQCN01-B", major: "CNTT K22", gpa: 3.32, students: 48 },
  { name: "D21CQCN02-B", major: "CNTT K21", gpa: 3.28, students: 42 },
  { name: "D21CQVT01-B", major: "VT K21", gpa: 3.22, students: 35 },
]

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [majorFilter, setMajorFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  const filteredClasses = classes.filter(cls => {
    const matchSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cls.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchMajor = majorFilter === "all" || cls.major.toLowerCase().includes(majorFilter)
    const matchYear = yearFilter === "all" || cls.year.toString() === yearFilter
    return matchSearch && matchMajor && matchYear
  })

  return (
    <div className="dashboard-content">
      <Header title="Quản lý lớp học" />
      
      <div className="dashboard-body">
        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <ClipboardList size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +8%
              </div>
            </div>
            <div className="summary-item-value">245</div>
            <div className="summary-item-label">Tổng số lớp</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
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
              <div className="summary-item-icon warning">
                <BookOpen size={20} />
              </div>
            </div>
            <div className="summary-item-value">8</div>
            <div className="summary-item-label">Ngành học</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Calendar size={20} />
              </div>
            </div>
            <div className="summary-item-value">5</div>
            <div className="summary-item-label">Khóa đang học</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* Classes by Year */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Calendar />
                Số lớp theo khóa nhập học
              </h3>
            </div>
            <div className="chart-card-body">
              <MultiBarChart 
                data={yearlyData} 
                dataKeys={["CNTT", "ATTT", "VT", "DT"]}
                xKey="name"
                colors={["#b91c1c", "#2563eb", "#16a34a", "#f59e0b"]}
                height={280}
              />
            </div>
          </div>

          {/* Major Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Building />
                Phân bố theo ngành
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={majorDistribution} 
                height={200}
                centerText="245"
                centerSubtext="Lop"
              />
              <div className="chart-legend">
                {majorDistribution.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* Class Performance */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award />
                GPA trung bình theo lớp
              </h3>
            </div>
            <div className="chart-card-body">
              <SimpleBarChart 
                data={classPerformance} 
                dataKey="gpa"
                xKey="name"
                color="#16a34a"
                height={220}
              />
            </div>
          </div>

          {/* Top Classes */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <GraduationCap />
                Top lớp học xuất sắc
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {topClasses.map((cls, index) => (
                  <div key={index} className="ranking-item">
                    <div className={`ranking-position ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'normal'}`}>
                      {index + 1}
                    </div>
                    <div className="ranking-info">
                      <div className="ranking-name">{cls.name}</div>
                      <div className="ranking-meta">{cls.major} | {cls.students} SV</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <div className="ranking-value">{cls.gpa.toFixed(2)}</div>
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>GPA</span>
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
                    placeholder="Tìm kiếm lớp học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-select"
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                >
                  <option value="all">Tất cả ngành</option>
                  <option value="cong nghe thong tin">Công nghệ thông tin</option>
                  <option value="an toan thong tin">An toàn thông tin</option>
                  <option value="vien thong">Viễn thông</option>
                </select>
                <select 
                  className="filter-select"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="all">Tất cả khóa</option>
                  <option value="2024">K2024</option>
                  <option value="2023">K2023</option>
                  <option value="2022">K2022</option>
                  <option value="2021">K2021</option>
                  <option value="2020">K2020</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-primary btn-sm">
                  <Plus />
                  Thêm lớp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid - Enhanced Visual Cards */}
        <div style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <ClipboardList />
                Danh sách lớp học
              </h3>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="badge badge-success">{classes.filter(c => c.status === "active").length} đang học</span>
                <span className="badge badge-info">{classes.filter(c => c.status === "graduated").length} đã tốt nghiệp</span>
              </div>
            </div>
            <div className="chart-card-body" style={{ padding: "20px" }}>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
                gap: "16px" 
              }}>
                {filteredClasses.map((cls) => (
                  <div key={cls.id} style={{
                    padding: "20px",
                    borderRadius: "12px",
                    border: cls.status === "active" ? "1px solid rgba(37, 99, 235, 0.2)" : "1px solid rgba(139, 92, 246, 0.2)",
                    background: cls.status === "active" 
                      ? "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)" 
                      : "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
                    transition: "all 0.2s",
                  }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: cls.status === "active" ? "rgba(37, 99, 235, 0.1)" : "rgba(139, 92, 246, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <GraduationCap size={24} style={{ color: cls.status === "active" ? "#2563eb" : "#8b5cf6" }} />
                      </div>
                      <span className={`badge ${cls.status === "active" ? "badge-success" : "badge-info"}`}>
                        {cls.status === "active" ? "Đang học" : "Đã tốt nghiệp"}
                      </span>
                    </div>

                    {/* Class Info */}
                    <div style={{ marginBottom: "16px" }}>
                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: "600", marginBottom: "4px" }}>{cls.id}</p>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{cls.name}</h3>
                      <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>{cls.major}</p>
                    </div>

                    {/* Info Grid */}
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1fr 1fr", 
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      background: "var(--accent)",
                      marginBottom: "16px"
                    }}>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "2px" }}>CVHT</p>
                        <p style={{ fontSize: "12px", fontWeight: "600" }}>{cls.advisor.split('. ').pop()}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "2px" }}>Khóa</p>
                        <p style={{ fontSize: "12px", fontWeight: "600" }}>K{cls.year}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "2px" }}>Sĩ số</p>
                        <p style={{ fontSize: "12px", fontWeight: "600" }}>{cls.students} sinh viên</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "11px", color: "var(--muted-foreground)", marginBottom: "2px" }}>GPA TB</p>
                        <p style={{ 
                          fontSize: "12px", 
                          fontWeight: "700",
                          color: cls.gpa >= 3.5 ? "#16a34a" : cls.gpa >= 3.0 ? "#2563eb" : "#f59e0b"
                        }}>{cls.gpa.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* GPA Progress Bar */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Điểm trung bình lớp</span>
                        <span style={{ 
                          fontSize: "12px", 
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: cls.gpa >= 3.5 ? "rgba(22, 163, 74, 0.1)" : cls.gpa >= 3.0 ? "rgba(37, 99, 235, 0.1)" : "rgba(245, 158, 11, 0.1)",
                          color: cls.gpa >= 3.5 ? "#16a34a" : cls.gpa >= 3.0 ? "#2563eb" : "#f59e0b"
                        }}>
                          {cls.gpa >= 3.5 ? "Xuất sắc" : cls.gpa >= 3.0 ? "Giỏi" : "Khá"}
                        </span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "var(--accent)" }}>
                        <div style={{ 
                          width: `${(cls.gpa / 4) * 100}%`, 
                          height: "100%", 
                          borderRadius: "3px",
                          background: cls.gpa >= 3.5 ? "#16a34a" : cls.gpa >= 3.0 ? "#2563eb" : "#f59e0b"
                        }}></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                        <Eye size={14} />
                        Chi tiết
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
