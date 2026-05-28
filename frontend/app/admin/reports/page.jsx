"use client"

import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, SimpleAreaChart, MultiBarChart, MultiLineChart, HorizontalBarChart } from "@/components/dashboard/charts"
import {
  BarChart3,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  PieChart,
  Activity,
  Award,
  Building,
  FileText,
  Target
} from "lucide-react"

const performanceDistribution = [
  { name: "Xuat sac (>= 3.6)", value: 2315, percent: 15, color: "#16a34a" },
  { name: "Gioi (3.2 - 3.59)", value: 4626, percent: 30, color: "#2563eb" },
  { name: "Kha (2.5 - 3.19)", value: 5397, percent: 35, color: "#f59e0b" },
  { name: "Trung binh (2.0 - 2.49)", value: 2313, percent: 15, color: "#ea580c" },
  { name: "Yeu (< 2.0)", value: 769, percent: 5, color: "#dc2626" },
]

const departmentStats = [
  { name: "Khoa CNTT", students: 5240, teachers: 285, gpa: 3.25 },
  { name: "Khoa Vien thong", students: 3120, teachers: 156, gpa: 3.18 },
  { name: "Khoa ATTT", students: 2450, teachers: 124, gpa: 3.32 },
  { name: "Khoa Dien tu", students: 2180, teachers: 118, gpa: 3.15 },
  { name: "Khoa Da phuong tien", students: 1580, teachers: 82, gpa: 3.22 },
  { name: "Khoa QTKD", students: 850, teachers: 58, gpa: 3.28 },
]

const enrollmentTrend = [
  { name: "2019", newStudents: 2800, graduated: 2100 },
  { name: "2020", newStudents: 3200, graduated: 2450 },
  { name: "2021", newStudents: 3500, graduated: 2800 },
  { name: "2022", newStudents: 3800, graduated: 3100 },
  { name: "2023", newStudents: 4200, graduated: 3500 },
  { name: "2024", newStudents: 4500, graduated: 3800 },
]

const gpaTrend = [
  { name: "HK1/22", CNTT: 3.12, ATTT: 3.18, VT: 3.08 },
  { name: "HK2/22", CNTT: 3.18, ATTT: 3.22, VT: 3.12 },
  { name: "HK1/23", CNTT: 3.22, ATTT: 3.28, VT: 3.15 },
  { name: "HK2/23", CNTT: 3.25, ATTT: 3.32, VT: 3.18 },
  { name: "HK1/24", CNTT: 3.28, ATTT: 3.35, VT: 3.20 },
  { name: "HK2/24", CNTT: 3.32, ATTT: 3.38, VT: 3.22 },
]

const genderDistribution = [
  { name: "Nam", value: 10294, color: "#2563eb" },
  { name: "Nu", value: 5126, color: "#ec4899" },
]

const topMajors = [
  { name: "Cong nghe thong tin", students: 5420 },
  { name: "Vien thong", students: 3200 },
  { name: "An toan thong tin", students: 2450 },
  { name: "Dien tu", students: 2180 },
  { name: "Da phuong tien", students: 1580 },
]

const graduationRate = [
  { name: "2020", rate: 91.5 },
  { name: "2021", rate: 92.8 },
  { name: "2022", rate: 93.5 },
  { name: "2023", rate: 94.2 },
  { name: "2024", rate: 94.5 },
]

export default function ReportsPage() {
  return (
    <div className="dashboard-content">
      <Header title="Báo cáo thống kê" />
      
      <div className="dashboard-body">
        {/* Summary Stats with Comparison */}
        <div className="stat-comparison">
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">15,420</div>
            <div className="stat-comparison-label">Tổng sinh viên</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">823</div>
            <div className="stat-comparison-label">Giảng viên</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">428</div>
            <div className="stat-comparison-label">Môn học</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">3.24</div>
            <div className="stat-comparison-label">GPA TB</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">94.5%</div>
            <div className="stat-comparison-label">Tỷ lệ tốt nghiệp</div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="summary-grid" style={{ marginTop: "24px" }}>
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
                <GraduationCap size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +5%
              </div>
            </div>
            <div className="summary-item-value">823</div>
            <div className="summary-item-label">Giảng viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Activity size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +0.05
              </div>
            </div>
            <div className="summary-item-value">3.24</div>
            <div className="summary-item-label">GPA trung bình</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Target size={20} />
              </div>
              <div className="summary-item-trend positive">
                <TrendingUp size={14} />
                +2.3%
              </div>
            </div>
            <div className="summary-item-value">94.5%</div>
            <div className="summary-item-label">Tỷ lệ tốt nghiệp</div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          {/* Enrollment Trend */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <TrendingUp />
                Xu hướng tuyển sinh và tốt nghiệp
              </h3>
              <button className="btn btn-ghost btn-sm">
                <Download size={16} />
              </button>
            </div>
            <div className="chart-card-body">
              <MultiBarChart 
                data={enrollmentTrend} 
                dataKeys={["newStudents", "graduated"]}
                xKey="name"
                colors={["#b91c1c", "#16a34a"]}
                height={280}
              />
              <div className="chart-legend">
                <div className="chart-legend-item">
                  <span className="chart-legend-dot" style={{ backgroundColor: "#b91c1c" }}></span>
                  <span>Sinh vien moi</span>
                </div>
                <div className="chart-legend-item">
                  <span className="chart-legend-dot" style={{ backgroundColor: "#16a34a" }}></span>
                  <span>Tot nghiep</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award />
                Phân bố xếp loại học lực
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={performanceDistribution} 
                height={200}
                centerText="15,420"
                centerSubtext="Sinh vien"
              />
              <div className="chart-legend" style={{ flexWrap: "wrap", justifyContent: "flex-start", gap: "8px 16px" }}>
                {performanceDistribution.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span style={{ fontSize: "12px" }}>{item.name}: {item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* GPA Trend by Department */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Activity />
                Xu hướng GPA theo khoa
              </h3>
              <select className="filter-select-sm">
                <option>2 nam gan nhat</option>
                <option>3 nam gan nhat</option>
              </select>
            </div>
            <div className="chart-card-body">
              <MultiLineChart 
                data={gpaTrend} 
                dataKeys={["CNTT", "ATTT", "VT"]}
                xKey="name"
                colors={["#b91c1c", "#2563eb", "#16a34a"]}
                height={250}
              />
            </div>
          </div>

          {/* Graduation Rate */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Target />
                Tỷ lệ tốt nghiệp qua các năm
              </h3>
            </div>
            <div className="chart-card-body">
              <SimpleAreaChart 
                data={graduationRate} 
                dataKey="rate"
                xKey="name"
                color="#16a34a"
                height={250}
              />
            </div>
          </div>
        </div>

        {/* Charts Row 3 */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          {/* Top Majors */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BookOpen />
                Top ngành học theo số sinh viên
              </h3>
            </div>
            <div className="chart-card-body">
              <HorizontalBarChart 
                data={topMajors} 
                dataKey="students"
                xKey="name"
                color="#b91c1c"
                height={250}
              />
            </div>
          </div>

          {/* Gender Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Users />
                Phân bố giới tính
              </h3>
            </div>
            <div className="chart-card-body">
              <DonutChart 
                data={genderDistribution} 
                height={180}
                centerText="66.8%"
                centerSubtext="Nam"
              />
              <div className="chart-legend">
                {genderDistribution.map((item, index) => (
                  <div key={index} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}: {item.value.toLocaleString()} ({((item.value / 15420) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Stats Table */}
        <div className="chart-card" style={{ marginTop: "24px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Building />
              Thống kê chi tiết theo khoa
            </h3>
            <button className="btn btn-outline btn-sm">
              <Download size={16} />
              Export
            </button>
          </div>
          <div style={{ padding: "0" }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khoa</th>
                    <th className="text-right">Sinh viên</th>
                    <th className="text-right">Giảng viên</th>
                    <th className="text-right">Tỷ lệ SV/GV</th>
                    <th className="text-right">GPA TB</th>
                    <th>Hiệu suất</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={index}>
                      <td className="font-medium">{dept.name}</td>
                      <td className="text-right">{dept.students.toLocaleString()}</td>
                      <td className="text-right">{dept.teachers}</td>
                      <td className="text-right">{(dept.students / dept.teachers).toFixed(1)}</td>
                      <td className="text-right">
                        <span className={`gpa-badge ${dept.gpa >= 3.25 ? 'excellent' : dept.gpa >= 3.15 ? 'good' : 'average'}`}>
                          {dept.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div className="progress-cell">
                          <div className="progress-bar-mini" style={{ width: "100px" }}>
                            <div 
                              className={`progress-bar-mini-fill ${dept.gpa >= 3.25 ? 'excellent' : dept.gpa >= 3.15 ? 'good' : 'average'}`}
                              style={{ width: `${(dept.gpa / 4) * 100}%` }}
                            ></div>
                          </div>
                          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                            {((dept.gpa / 4) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Reports Section */}
        <div className="chart-card" style={{ marginTop: "24px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <FileText />
              Xuất báo cáo nhanh
            </h3>
            <span className="badge badge-info">6 mẫu báo cáo</span>
          </div>
          <div className="chart-card-body" style={{ padding: "20px" }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "16px" 
            }}>
              {/* Student List Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(185, 28, 28, 0.05) 0%, rgba(185, 28, 28, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(185, 28, 28, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Users size={24} style={{ color: "#b91c1c" }} />
                  </div>
                  <span className="badge badge-outline">Excel/PDF</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Danh sách sinh viên</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Xuất danh sách đầy đủ thông tin sinh viên theo khoa, lớp hoặc khóa học</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Teacher List Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(37, 99, 235, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <GraduationCap size={24} style={{ color: "#2563eb" }} />
                  </div>
                  <span className="badge badge-outline">Excel/PDF</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Danh sách giảng viên</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Xuất thông tin giảng viên, số giờ giảng dạy và đánh giá</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Grade Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, rgba(22, 163, 74, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(22, 163, 74, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <BookOpen size={24} style={{ color: "#16a34a" }} />
                  </div>
                  <span className="badge badge-outline">Excel/PDF</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Báo cáo điểm số</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Bảng điểm chi tiết theo môn học, lớp và học kỳ</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Schedule Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(245, 158, 11, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Calendar size={24} style={{ color: "#f59e0b" }} />
                  </div>
                  <span className="badge badge-outline">Excel/PDF</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Thời khóa biểu</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Lịch học theo lớp, giảng viên hoặc phòng học</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Academic Stats Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(139, 92, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <BarChart3 size={24} style={{ color: "#8b5cf6" }} />
                  </div>
                  <span className="badge badge-outline">Excel/PDF</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Thống kê học lực</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Phân tích xếp loại học lực và xu hướng theo thời gian</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>

              {/* Summary Report */}
              <div style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(6, 182, 212, 0.02) 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(6, 182, 212, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <TrendingUp size={24} style={{ color: "#06b6d4" }} />
                  </div>
                  <span className="badge badge-success">Phổ biến</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>Báo cáo tổng hợp</h4>
                  <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Tổng quan toàn diện về hoạt động đào tạo của trường</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Download size={14} />
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
