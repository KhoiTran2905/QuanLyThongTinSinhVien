"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { DonutChart, SimpleAreaChart } from "@/components/dashboard/charts"
import { useApi, usePaginatedApi, useMutation } from "@/hooks/use-api"
import { adminGradeService } from "@/lib/services/adminService"
import {
  FileText, Search, Download, Upload,
  Eye, Edit, CheckCircle, XCircle, Clock,
  TrendingUp, Award, Users, BookOpen, BarChart3
} from "lucide-react"

export default function AdminGradesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const {
    data: grades,
    pagination,
    loading,
    error,
    updateParams,
    goToPage,
    refetch,
  } = usePaginatedApi(adminGradeService.getAll, { page: 1, limit: 15 })

  const { data: stats, loading: statsLoading } = useApi(
    adminGradeService.getStats, [], { defaultData: {} }
  )

  const { data: distribution, loading: distLoading } = useApi(
    adminGradeService.getDistribution, [], { defaultData: [] }
  )

  const { data: gpaTrends, loading: trendsLoading } = useApi(
    adminGradeService.getGPATrends, [], { defaultData: [] }
  )

  const { mutate: approveGrade, loading: approving } = useMutation(
    adminGradeService.approve,
    {
      onSuccess: function () {
        setSuccessMsg("Duyệt điểm thành công")
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  const { mutate: rejectGrade, loading: rejecting } = useMutation(
    adminGradeService.reject,
    {
      onSuccess: function () {
        setSuccessMsg("Đã từ chối điểm")
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  const { mutate: approveAllGrades, loading: approvingAll } = useMutation(
    adminGradeService.approveAll,
    {
      onSuccess: function (data) {
        var count = data && data.approvedCount ? data.approvedCount : 0
        setSuccessMsg("Đã duyệt " + count + " bảng điểm")
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  var gradeList = Array.isArray(grades) ? grades : []
  var totalCount = pagination ? pagination.totalItems : 0
  var currentPage = pagination ? pagination.currentPage : 1
  var totalPages = pagination ? pagination.totalPages : 1

  var approvalData = [
    { name: "Đã duyệt", value: (stats && stats.approved) || 0, color: "#16a34a" },
    { name: "Chờ duyệt", value: (stats && stats.pending) || 0, color: "#f59e0b" },
    { name: "Từ chối", value: (stats && stats.rejected) || 0, color: "#dc2626" },
  ]

  var trendData = Array.isArray(gpaTrends)
    ? gpaTrends.map(function (t) {
        return { name: t.semester, gpa: parseFloat(t.avg_gpa).toFixed(2) }
      })
    : []

  var distList = Array.isArray(distribution) ? distribution : []

  return (
    <div className="dashboard-content">
      <Header title="Quản lý điểm số" />

      <div className="dashboard-body">
        {successMsg && (
          <div style={{ padding: "0.75rem 1rem", background: "#dcfce7", border: "1px solid #16a34a", borderRadius: "0.5rem", color: "#166534", fontSize: "0.875rem" }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", border: "1px solid #dc2626", borderRadius: "0.5rem", color: "#991b1b", fontSize: "0.875rem" }}>
            {errorMsg}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary"><FileText size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.total) || 0}
            </div>
            <div className="summary-item-label">Tổng bảng điểm</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success"><CheckCircle size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.approved) || 0}
            </div>
            <div className="summary-item-label">Đã duyệt</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning"><Clock size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.pending) || 0}
            </div>
            <div className="summary-item-label">Chờ duyệt</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info"><Award size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.avgGPA) || "—"}
            </div>
            <div className="summary-item-label">GPA Trung bình</div>
          </div>
        </div>

        {/* Charts */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title"><TrendingUp /> Xu hướng GPA</h3>
            </div>
            <div className="chart-card-body">
              {trendsLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>Đang tải...</div>
              ) : trendData.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>Chưa có dữ liệu</div>
              ) : (
                <SimpleAreaChart data={trendData} dataKey="gpa" xKey="name" color="#16a34a" height={220} />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title"><CheckCircle /> Trạng thái duyệt</h3>
            </div>
            <div className="chart-card-body">
              {statsLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>Đang tải...</div>
              ) : (
                <>
                  <DonutChart
                    data={approvalData}
                    height={180}
                    centerText={String((stats && stats.total) || 0)}
                    centerSubtext="Bang diem"
                  />
                  <div className="chart-legend">
                    {approvalData.map(function (item, idx) {
                      return (
                        <div key={idx} className="chart-legend-item">
                          <span className="chart-legend-dot" style={{ backgroundColor: item.color }} />
                          <span>{item.name}: {item.value}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        {distList.length > 0 && (
          <div className="chart-card" style={{ marginTop: "24px" }}>
            <div className="chart-card-header">
              <h3 className="chart-card-title"><BarChart3 /> Phân bố điểm số</h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {distList.map(function (item, idx) {
                  var maxCount = Math.max.apply(null, distList.map(function (d) { return d.count }))
                  var pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                  var color = item.letter_grade && item.letter_grade.startsWith("A")
                    ? "#16a34a"
                    : item.letter_grade && item.letter_grade.startsWith("B")
                    ? "#2563eb"
                    : item.letter_grade && item.letter_grade.startsWith("C")
                    ? "#f59e0b"
                    : "#dc2626"
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
                      <span style={{ width: "40px", fontSize: "13px", fontWeight: 700, color: color }}>
                        {item.letter_grade}
                      </span>
                      <div className="progress-bar-mini" style={{ flex: 1 }}>
                        <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: "3px" }} />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, width: "60px", textAlign: "right" }}>
                        {item.count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
                  <div className="search-box">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Tìm sinh viên..."
                      value={searchInput}
                      onChange={function (e) { setSearchInput(e.target.value) }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">Tìm</button>
                </form>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={function (e) {
                    setStatusFilter(e.target.value)
                    updateParams({ status: e.target.value })
                  }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đã duyệt">Đã duyệt</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Từ chối">Từ chối</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm"><Download /> Export</button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={function () {
                    approveAllGrades({ semester: semesterFilter || undefined })
                  }}
                  disabled={approvingAll}
                >
                  <CheckCircle />
                  {approvingAll ? "Đang duyệt..." : "Duyệt tất cả"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title"><FileText /> Bảng điểm</h3>
            <span className="badge badge-primary">{totalCount} bản ghi</span>
          </div>

          {error && (
            <div style={{ padding: "1rem 1.5rem", color: "#dc2626", fontSize: "0.875rem" }}>
              Lỗi: {error}
            </div>
          )}

          <div style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}><input type="checkbox" /></th>
                    <th>Sinh viên</th>
                    <th>Môn học</th>
                    <th>Học kỳ</th>
                    <th className="text-center">Giữa kỳ</th>
                    <th className="text-center">Cuối kỳ</th>
                    <th className="text-center">Tổng kết</th>
                    <th className="text-center">Xếp loại</th>
                    <th>Trạng thái</th>
                    <th style={{ width: "140px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Đang tải...
                      </td>
                    </tr>
                  ) : gradeList.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    gradeList.map(function (grade) {
                      var avg = grade.average_score ? parseFloat(grade.average_score) : null
                      var avgColor = avg === null ? "var(--foreground)"
                        : avg >= 8 ? "#16a34a"
                        : avg >= 6.5 ? "#2563eb"
                        : avg >= 5 ? "#f59e0b"
                        : "#dc2626"

                      var letterGrade = grade.letter_grade || ""
                      var letterBg = letterGrade.startsWith("A") ? "rgba(22,163,74,0.1)"
                        : letterGrade.startsWith("B") ? "rgba(37,99,235,0.1)"
                        : letterGrade.startsWith("C") ? "rgba(245,158,11,0.1)"
                        : "rgba(220,38,38,0.1)"
                      var letterColor = letterGrade.startsWith("A") ? "#16a34a"
                        : letterGrade.startsWith("B") ? "#2563eb"
                        : letterGrade.startsWith("C") ? "#f59e0b"
                        : "#dc2626"

                      var statusBadge = grade.status === "Đã duyệt" ? "badge-success"
                        : grade.status === "Chờ duyệt" ? "badge-warning"
                        : "badge-danger"

                      return (
                        <tr key={grade.id}>
                          <td><input type="checkbox" /></td>
                          <td>
                            <div className="student-cell">
                              <div className="avatar avatar-sm">
                                {grade.student_name
                                  ? grade.student_name.split(" ").pop().charAt(0)
                                  : "?"}
                              </div>
                              <div>
                                <p className="student-name">{grade.student_name}</p>
                                <p className="student-email">{grade.student_code}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p style={{ fontWeight: 500 }}>{grade.course_name}</p>
                            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                              {grade.course_code}
                            </p>
                          </td>
                          <td style={{ fontSize: "13px" }}>{grade.semester}</td>
                          <td className="text-center">
                            {grade.midterm_score != null ? grade.midterm_score : "—"}
                          </td>
                          <td className="text-center">
                            {grade.final_score != null ? grade.final_score : "—"}
                          </td>
                          <td className="text-center">
                            <span style={{ fontSize: "16px", fontWeight: 700, color: avgColor }}>
                              {avg != null ? avg.toFixed(1) : "—"}
                            </span>
                          </td>
                          <td className="text-center">
                            {letterGrade ? (
                              <span style={{
                                display: "inline-block", padding: "4px 10px", borderRadius: "20px",
                                fontSize: "13px", fontWeight: 700,
                                background: letterBg, color: letterColor,
                              }}>
                                {letterGrade}
                              </span>
                            ) : "—"}
                          </td>
                          <td>
                            <span className={"badge " + statusBadge}>{grade.status}</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-ghost btn-icon btn-sm"><Eye /></button>
                              <button className="btn btn-ghost btn-icon btn-sm"><Edit /></button>
                              {grade.status === "Chờ duyệt" && (
                                <>
                                  <button
                                    className="btn btn-ghost btn-icon btn-sm text-success"
                                    onClick={function () { approveGrade(grade.id) }}
                                    disabled={approving}
                                    title="Duyệt"
                                  >
                                    <CheckCircle />
                                  </button>
                                  <button
                                    className="btn btn-ghost btn-icon btn-sm text-danger"
                                    onClick={function () { rejectGrade(grade.id) }}
                                    disabled={rejecting}
                                    title="Từ chối"
                                  >
                                    <XCircle />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Trang {currentPage} / {totalPages} — {totalCount} bản ghi
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={function () { goToPage(currentPage - 1) }}
                    disabled={!pagination || !pagination.hasPrevPage}
                  >
                    Trước
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={function () { goToPage(currentPage + 1) }}
                    disabled={!pagination || !pagination.hasNextPage}
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
