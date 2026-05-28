
"use client"

import { Header } from "@/components/dashboard/header"
import {
  SimpleBarChart, DonutChart, SimpleAreaChart,
  MultiBarChart, MultiLineChart, HorizontalBarChart
} from "@/components/dashboard/charts"
import { useApi } from "@/hooks/use-api"
import { reportService } from "@/lib/services/adminService"
import {
  BarChart3, Users, GraduationCap, BookOpen,
  TrendingUp, Download, Activity, Award,
  Building, FileText, Target
} from "lucide-react"

export default function ReportsPage() {
  const { data: overview, loading: overviewLoading } = useApi(
    reportService.getOverview, [], { defaultData: {} }
  )

  const { data: enrollmentTrends, loading: enrollLoading } = useApi(
    reportService.getEnrollmentTrends, [], { defaultData: {} }
  )

  const { data: academicRanking, loading: rankingLoading } = useApi(
    reportService.getAcademicRanking, [], { defaultData: [] }
  )

  const { data: gpaDept, loading: gpaLoading } = useApi(
    reportService.getGPAByDepartment, [], { defaultData: [] }
  )

  const { data: graduationRate, loading: gradLoading } = useApi(
    reportService.getGraduationRate, [], { defaultData: [] }
  )

  const { data: topDepartments, loading: topDeptLoading } = useApi(
    reportService.getTopDepartments, [], { defaultData: [] }
  )

  const { data: genderDist, loading: genderLoading } = useApi(
    reportService.getGenderDistribution, [], { defaultData: [] }
  )

  const { data: deptDetails, loading: deptLoading } = useApi(
    reportService.getDepartmentDetails, [], { defaultData: [] }
  )

  // Format data for charts
  var enrollNew = Array.isArray(enrollmentTrends && enrollmentTrends.newStudents)
    ? enrollmentTrends.newStudents.map(function (d) {
        return { name: String(d.year), newStudents: d.count }
      })
    : []

  var enrollGrad = Array.isArray(enrollmentTrends && enrollmentTrends.graduated)
    ? enrollmentTrends.graduated
    : []

  // Merge enrollment data
  var enrollData = enrollNew.map(function (item) {
    var grad = enrollGrad.find(function (g) { return String(g.year) === item.name })
    return {
      name: item.name,
      newStudents: item.newStudents,
      graduated: grad ? grad.count : 0,
    }
  })

  var rankingList = Array.isArray(academicRanking) ? academicRanking : []
  var rankingDonut = rankingList.map(function (r, i) {
    var colors = ["#16a34a", "#2563eb", "#f59e0b", "#ea580c", "#dc2626"]
    return { name: r.classification, value: r.count, color: colors[i % colors.length] }
  })

  var gradData = Array.isArray(graduationRate)
    ? graduationRate.map(function (d) {
        return { name: d.academic_year, rate: parseFloat(d.rate) || 0 }
      })
    : []

  var topDeptData = Array.isArray(topDepartments)
    ? topDepartments.map(function (d) {
        return { name: d.department_name || d.code, students: d.student_count }
      })
    : []

  var genderData = Array.isArray(genderDist)
    ? genderDist.map(function (g, i) {
        return {
          name: g.gender,
          value: g.count,
          color: i === 0 ? "#2563eb" : "#ec4899",
        }
      })
    : []

  var deptDetailList = Array.isArray(deptDetails) ? deptDetails : []

  // GPA by dept - build multi-line data
  var gpaDeptList = Array.isArray(gpaDept) ? gpaDept : []
  var deptNames = []
  gpaDeptList.forEach(function (d) {
    if (!deptNames.includes(d.department_name)) {
      deptNames.push(d.department_name)
    }
  })
  var semesters = []
  gpaDeptList.forEach(function (d) {
    if (!semesters.includes(d.semester)) {
      semesters.push(d.semester)
    }
  })
  var gpaLineData = semesters.map(function (sem) {
    var row = { name: sem }
    deptNames.slice(0, 3).forEach(function (dept) {
      var found = gpaDeptList.find(function (d) {
        return d.semester === sem && d.department_name === dept
      })
      row[dept] = found ? parseFloat(found.avg_gpa).toFixed(2) : null
    })
    return row
  })

  var reportTypes = [
    {
      icon: Users, color: "#b91c1c", bg: "rgba(185,28,28,0.1)",
      title: "Danh sách sinh viên",
      desc: "Xuất danh sách đầy đủ theo khoa, lớp hoặc khóa học",
    },
    {
      icon: GraduationCap, color: "#2563eb", bg: "rgba(37,99,235,0.1)",
      title: "Danh sách giảng viên",
      desc: "Thông tin giảng viên, giờ giảng và đánh giá",
    },
    {
      icon: BookOpen, color: "#16a34a", bg: "rgba(22,163,74,0.1)",
      title: "Báo cáo điểm số",
      desc: "Bảng điểm chi tiết theo môn học và học kỳ",
    },
    {
      icon: BarChart3, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",
      title: "Thống kê học lực",
      desc: "Phân tích xếp loại học lực theo thời gian",
    },
    {
      icon: TrendingUp, color: "#06b6d4", bg: "rgba(6,182,212,0.1)",
      title: "Báo cáo tổng hợp",
      desc: "Tổng quan toàn diện về hoạt động đào tạo",
      badge: "Phổ biến",
    },
  ]

  return (
    <div className="dashboard-content">
      <Header title="Báo cáo thống kê" />

      <div className="dashboard-body">
        {/* Overview Stats */}
        <div className="stat-comparison">
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">
              {overviewLoading ? "..." : (overview && overview.totalStudents) || 0}
            </div>
            <div className="stat-comparison-label">Tổng sinh viên</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">
              {overviewLoading ? "..." : (overview && overview.totalInstructors) || 0}
            </div>
            <div className="stat-comparison-label">Giảng viên</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">
              {overviewLoading ? "..." : (overview && overview.totalCourses) || 0}
            </div>
            <div className="stat-comparison-label">Môn học</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">
              {overviewLoading ? "..." : (overview && overview.avgGPA) || "—"}
            </div>
            <div className="stat-comparison-label">GPA TB</div>
          </div>
          <div className="stat-comparison-item">
            <div className="stat-comparison-value">
              {overviewLoading ? "..." : (overview && overview.graduationRate)
                ? overview.graduationRate + "%"
                : "—"}
            </div>
            <div className="stat-comparison-label">Tỷ lệ tốt nghiệp</div>
          </div>
        </div>

        {/* Row 1: Enrollment + Ranking */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <TrendingUp /> Xu hướng tuyển sinh và tốt nghiệp
              </h3>
              <button className="btn btn-ghost btn-sm">
                <Download size={16} />
              </button>
            </div>
            <div className="chart-card-body">
              {enrollLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "3rem" }}>
                  Đang tải...
                </div>
              ) : enrollData.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "3rem" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                <>
                  <MultiBarChart
                    data={enrollData}
                    dataKeys={["newStudents", "graduated"]}
                    xKey="name"
                    colors={["#b91c1c", "#16a34a"]}
                    height={260}
                  />
                  <div className="chart-legend">
                    <div className="chart-legend-item">
                      <span className="chart-legend-dot" style={{ backgroundColor: "#b91c1c" }} />
                      <span>Sinh viên mới</span>
                    </div>
                    <div className="chart-legend-item">
                      <span className="chart-legend-dot" style={{ backgroundColor: "#16a34a" }} />
                      <span>Tốt nghiệp</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award /> Phân bố xếp loại học lực
              </h3>
            </div>
            <div className="chart-card-body">
              {rankingLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "3rem" }}>
                  Đang tải...
                </div>
              ) : rankingDonut.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "3rem" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                <>
                  <DonutChart
                    data={rankingDonut}
                    height={200}
                    centerText={String((overview && overview.totalStudents) || 0)}
                    centerSubtext="Sinh vien"
                  />
                  <div className="chart-legend" style={{ flexWrap: "wrap", gap: "8px 16px" }}>
                    {rankingList.map(function (item, idx) {
                      return (
                        <div key={idx} className="chart-legend-item">
                          <span
                            className="chart-legend-dot"
                            style={{ backgroundColor: rankingDonut[idx] && rankingDonut[idx].color }}
                          />
                          <span style={{ fontSize: "12px" }}>
                            {item.classification}: {item.percentage}%
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: GPA Trend + Graduation Rate */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Activity /> Xu hướng GPA theo khoa
              </h3>
            </div>
            <div className="chart-card-body">
              {gpaLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : gpaLineData.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                <MultiLineChart
                  data={gpaLineData}
                  dataKeys={deptNames.slice(0, 3)}
                  xKey="name"
                  colors={["#b91c1c", "#2563eb", "#16a34a"]}
                  height={250}
                />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Target /> Tỷ lệ tốt nghiệp qua các năm
              </h3>
            </div>
            <div className="chart-card-body">
              {gradLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : gradData.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                <SimpleAreaChart
                  data={gradData}
                  dataKey="rate"
                  xKey="name"
                  color="#16a34a"
                  height={250}
                />
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Top Departments + Gender */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <BookOpen /> Top ngành theo số sinh viên
              </h3>
            </div>
            <div className="chart-card-body">
              {topDeptLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : (
                <HorizontalBarChart
                  data={topDeptData}
                  dataKey="students"
                  xKey="name"
                  color="#b91c1c"
                  height={250}
                />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Users /> Phân bố giới tính
              </h3>
            </div>
            <div className="chart-card-body">
              {genderLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : genderData.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Chưa có dữ liệu
                </div>
              ) : (
                <>
                  <DonutChart
                    data={genderData}
                    height={180}
                    centerText={genderData.length > 0
                      ? (function () {
                          var total = genderData.reduce(function (s, g) { return s + g.value }, 0)
                          var nam = genderData.find(function (g) { return g.name === "Nam" })
                          return nam && total > 0
                            ? ((nam.value / total) * 100).toFixed(0) + "%"
                            : "—"
                        })()
                      : "—"}
                    centerSubtext="Nam"
                  />
                  <div className="chart-legend">
                    {genderData.map(function (item, idx) {
                      var total = genderData.reduce(function (s, g) { return s + g.value }, 0)
                      var pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
                      return (
                        <div key={idx} className="chart-legend-item">
                          <span className="chart-legend-dot" style={{ backgroundColor: item.color }} />
                          <span>
                            {item.name}: {item.value.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Department Details Table */}
        <div className="chart-card" style={{ marginTop: "24px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <Building /> Thống kê chi tiết theo khoa
            </h3>
            <button className="btn btn-outline btn-sm">
              <Download size={16} /> Export
            </button>
          </div>
          <div style={{ padding: 0 }}>
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
                  {deptLoading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Đang tải...
                      </td>
                    </tr>
                  ) : deptDetailList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    deptDetailList.map(function (dept, idx) {
                      var gpa = parseFloat(dept.avg_gpa) || 0
                      var gpaBadge = gpa >= 3.25 ? "excellent" : gpa >= 3.15 ? "good" : "average"
                      var barPct = (gpa / 4) * 100

                      return (
                        <tr key={idx}>
                          <td className="font-medium">{dept.department_name}</td>
                          <td className="text-right">
                            {(dept.student_count || 0).toLocaleString()}
                          </td>
                          <td className="text-right">{dept.instructor_count || 0}</td>
                          <td className="text-right">
                            {dept.sv_gv_ratio || "—"}
                          </td>
                          <td className="text-right">
                            <span className={"gpa-badge " + gpaBadge}>
                              {gpa > 0 ? gpa.toFixed(2) : "—"}
                            </span>
                          </td>
                          <td>
                            <div className="progress-cell">
                              <div className="progress-bar-mini" style={{ width: "100px" }}>
                                <div
                                  className={"progress-bar-mini-fill " + gpaBadge}
                                  style={{ width: barPct + "%" }}
                                />
                              </div>
                              <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                                {barPct.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Export Reports */}
        <div className="chart-card" style={{ marginTop: "24px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <FileText /> Xuất báo cáo nhanh
            </h3>
          </div>
          <div className="chart-card-body" style={{ padding: "20px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}>
              {reportTypes.map(function (rpt, idx) {
                var IconComp = rpt.icon
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "20px", borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      display: "flex", flexDirection: "column", gap: "12px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px",
                        background: rpt.bg, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <IconComp size={24} style={{ color: rpt.color }} />
                      </div>
                      {rpt.badge ? (
                        <span className="badge badge-success">{rpt.badge}</span>
                      ) : (
                        <span className="badge badge-outline">Excel/PDF</span>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
                        {rpt.title}
                      </h4>
                      <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                        {rpt.desc}
                      </p>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: "auto" }}>
                      <Download size={14} /> Tải xuống
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
