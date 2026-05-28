
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { DonutChart, SimpleAreaChart } from "@/components/dashboard/charts"
import { useApi, usePaginatedApi, useMutation } from "@/hooks/use-api"
import { courseService } from "@/lib/services/adminService"
import {
  BookOpen, Search, Plus, Download, Eye, Edit,
  Clock, Users, TrendingUp, Award, Layers, CheckCircle
} from "lucide-react"

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const {
    data: courses,
    pagination,
    loading,
    error,
    updateParams,
    goToPage,
    refetch,
  } = usePaginatedApi(courseService.getAll, { page: 1, limit: 12 })

  const { data: stats, loading: statsLoading } = useApi(
    courseService.getStats, [], { defaultData: {} }
  )

  const { data: topEnrolled, loading: topLoading } = useApi(
    courseService.getTopEnrolled, [], { defaultData: [] }
  )

  const { mutate: deleteCourse, loading: deleting } = useMutation(
    courseService.delete,
    {
      onSuccess: function () {
        setSuccessMsg("Xóa môn học thành công")
        setConfirmDelete(null)
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi xóa môn học")
        setConfirmDelete(null)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  var courseList = Array.isArray(courses) ? courses : []
  var totalCount = pagination ? pagination.totalItems : 0
  var currentPage = pagination ? pagination.currentPage : 1
  var totalPages = pagination ? pagination.totalPages : 1

  var typeData = Array.isArray(stats && stats.typeDistribution)
    ? stats.typeDistribution.map(function (t, i) {
        var colors = ["#b91c1c", "#2563eb", "#16a34a"]
        return { name: t.type, value: t.count, color: colors[i % colors.length] }
      })
    : []

  var topList = Array.isArray(topEnrolled) ? topEnrolled : []

  return (
    <div className="dashboard-content">
      <Header title="Quản lý môn học" />

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
              <div className="summary-item-icon primary"><BookOpen size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.total) || 0}
            </div>
            <div className="summary-item-label">Tổng môn học</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success"><CheckCircle size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.open) || 0}
            </div>
            <div className="summary-item-label">Đang mở</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning"><Clock size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.totalCredits) || 0}
            </div>
            <div className="summary-item-label">Tổng tín chỉ</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info"><Users size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.totalRegistrations) || 0}
            </div>
            <div className="summary-item-label">Lượt đăng ký</div>
          </div>
        </div>

        {/* Charts */}
        <div className="data-grid-2" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title"><Layers /> Phân loại môn học</h3>
            </div>
            <div className="chart-card-body">
              {statsLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>Đang tải...</div>
              ) : (
                <>
                  <DonutChart
                    data={typeData}
                    height={200}
                    centerText={String((stats && stats.total) || 0)}
                    centerSubtext="Mon hoc"
                  />
                  <div className="chart-legend">
                    {typeData.map(function (item, idx) {
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

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title"><Award /> Môn học được đăng ký nhiều</h3>
            </div>
            <div className="chart-card-body">
              {topLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>Đang tải...</div>
              ) : (
                <div className="ranking-list">
                  {topList.map(function (course, index) {
                    var posClass = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "normal"
                    var pct = course.max_students > 0
                      ? Math.round((course.current_students / course.max_students) * 100)
                      : 0
                    return (
                      <div key={course.id || index} className="ranking-item">
                        <div className={"ranking-position " + posClass}>{index + 1}</div>
                        <div className="ranking-info">
                          <div className="ranking-name">{course.name}</div>
                          <div className="ranking-meta">{course.course_code}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="ranking-value">{course.current_students}</div>
                          <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                  {topList.length === 0 && (
                    <p style={{ color: "var(--muted-foreground)", textAlign: "center" }}>Chưa có dữ liệu</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

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
                      placeholder="Tìm kiếm môn học..."
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
                  <option value="Đang mở">Đang mở</option>
                  <option value="Đã đóng">Đã đóng</option>
                </select>
                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={function (e) {
                    setTypeFilter(e.target.value)
                    updateParams({ type: e.target.value })
                  }}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Bắt buộc">Bắt buộc</option>
                  <option value="Tự chọn">Tự chọn</option>
                  <option value="Thể chất/QP">Thể chất/QP</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm"><Download /> Xuất</button>
                <button className="btn btn-primary btn-sm"><Plus /> Thêm môn học</button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title"><BookOpen /> Danh sách môn học</h3>
            <span className="badge badge-primary">{totalCount} môn học</span>
          </div>
          <div className="chart-card-body" style={{ padding: "20px" }}>
            {error && (
              <div style={{ color: "#dc2626", marginBottom: "1rem" }}>Lỗi: {error}</div>
            )}
            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
                Đang tải...
              </div>
            ) : courseList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
                Không có dữ liệu
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {courseList.map(function (course) {
                  var isOpen = course.status === "Đang mở"
                  var pct = course.max_students > 0
                    ? Math.round((course.current_students / course.max_students) * 100)
                    : 0
                  var barColor = pct >= 90 ? "#16a34a" : pct >= 60 ? "#2563eb" : "#f59e0b"

                  return (
                    <div
                      key={course.id}
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        border: isOpen ? "1px solid rgba(22,163,74,0.2)" : "1px solid var(--border)",
                        background: isOpen
                          ? "linear-gradient(135deg, rgba(22,163,74,0.05) 0%, rgba(22,163,74,0.02) 100%)"
                          : "var(--card)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "10px",
                          background: isOpen ? "rgba(22,163,74,0.1)" : "rgba(107,114,128,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <BookOpen size={22} style={{ color: isOpen ? "#16a34a" : "#6b7280" }} />
                        </div>
                        <span className={"badge " + (isOpen ? "badge-success" : "badge-secondary")}>
                          {course.status}
                        </span>
                      </div>

                      <p style={{ fontSize: "12px", color: "var(--muted-foreground)", fontWeight: 600, marginBottom: "4px" }}>
                        {course.course_code}
                      </p>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                        {course.name}
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--muted-foreground)", marginBottom: "12px" }}>
                        {course.instructor_name || "Chưa phân công"}
                      </p>

                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Đăng ký</span>
                          <span style={{ fontSize: "12px", fontWeight: 600 }}>
                            {course.current_students}/{course.max_students} SV
                          </span>
                        </div>
                        <div style={{ height: "6px", borderRadius: "3px", background: "var(--accent)" }}>
                          <div style={{ width: pct + "%", height: "100%", borderRadius: "3px", background: barColor }} />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: "rgba(185,28,28,0.1)", color: "#b91c1c" }}>
                          {course.credits} TC
                        </span>
                        <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
                          {course.type}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                          <Eye size={14} /> Xem
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                          <Edit size={14} /> Sửa
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: "#dc2626" }}
                          onClick={function () { setConfirmDelete(course) }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={function () { goToPage(currentPage - 1) }}
                  disabled={!pagination || !pagination.hasPrevPage}
                >
                  Trước
                </button>
                <span style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={function () { goToPage(currentPage + 1) }}
                  disabled={!pagination || !pagination.hasNextPage}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Delete */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", borderRadius: "0.75rem", padding: "2rem", maxWidth: "400px", width: "90%" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Xác nhận xóa</h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
                Bạn có chắc muốn xóa môn học <strong>{confirmDelete.name}</strong>?
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button className="btn btn-outline" onClick={function () { setConfirmDelete(null) }} disabled={deleting}>Hủy</button>
                <button className="btn btn-primary" style={{ background: "#dc2626" }} onClick={function () { deleteCourse(confirmDelete.id) }} disabled={deleting}>
                  {deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
