
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, HorizontalBarChart } from "@/components/dashboard/charts"
import { useApi, usePaginatedApi, useMutation } from "@/hooks/use-api"
import { instructorService } from "@/lib/services/adminService"
import {
  GraduationCap, Search, Plus, Download,
  Eye, Edit, Trash2, TrendingUp, Users,
  BookOpen, Award, Building, Clock
} from "lucide-react"

export default function TeachersPage() {
  const [searchInput, setSearchInput] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const {
    data: teachers,
    pagination,
    loading,
    error,
    updateParams,
    goToPage,
    refetch,
  } = usePaginatedApi(instructorService.getAll, { page: 1, limit: 10 })

  const { data: stats, loading: statsLoading } = useApi(
    instructorService.getStats,
    [],
    { defaultData: {} }
  )

  const { data: topRated, loading: topLoading } = useApi(
    instructorService.getTopRated,
    [],
    { defaultData: [] }
  )

  const { mutate: deleteInstructor, loading: deleting } = useMutation(
    instructorService.delete,
    {
      onSuccess: function () {
        setSuccessMsg("Xóa giảng viên thành công")
        setConfirmDelete(null)
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi xóa giảng viên")
        setConfirmDelete(null)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  function handleDeptChange(e) {
    var val = e.target.value
    setDepartmentFilter(val)
    updateParams({ department_id: val === "all" ? undefined : val })
  }

  var teacherList = Array.isArray(teachers) ? teachers : []
  var totalCount = pagination ? pagination.totalItems : 0
  var currentPage = pagination ? pagination.currentPage : 1
  var totalPages = pagination ? pagination.totalPages : 1

  var degreeData = Array.isArray(stats && stats.degreeDistribution)
    ? stats.degreeDistribution.map(function (d) {
        return { name: d.degree, value: d.count, color: "#b91c1c" }
      })
    : []

  var deptData = Array.isArray(stats && stats.departmentDistribution)
    ? stats.departmentDistribution.map(function (d) {
        return { name: d.department_name, teachers: d.count }
      })
    : []

  var topRatedList = Array.isArray(topRated) ? topRated : []

  return (
    <div className="dashboard-content">
      <Header title="Quản lý giảng viên" />

      <div className="dashboard-body">
        {successMsg && (
          <div style={{
            padding: "0.75rem 1rem", background: "#dcfce7",
            border: "1px solid #16a34a", borderRadius: "0.5rem",
            color: "#166534", fontSize: "0.875rem",
          }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{
            padding: "0.75rem 1rem", background: "#fee2e2",
            border: "1px solid #dc2626", borderRadius: "0.5rem",
            color: "#991b1b", fontSize: "0.875rem",
          }}>
            {errorMsg}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <GraduationCap size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.total) || 0}
            </div>
            <div className="summary-item-label">Tổng giảng viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <Users size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.active) || 0}
            </div>
            <div className="summary-item-label">Đang giảng dạy</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.onLeave) || 0}
            </div>
            <div className="summary-item-label">Nghỉ phép</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Award size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.professors) || 0}
            </div>
            <div className="summary-item-label">GS/PGS</div>
          </div>
        </div>

        {/* Charts */}
        <div className="data-grid-responsive" style={{ marginTop: "24px" }}>
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Building /> Phân bố theo khoa
              </h3>
            </div>
            <div className="chart-card-body">
              {statsLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : (
                <SimpleBarChart
                  data={deptData}
                  dataKey="teachers"
                  xKey="name"
                  color="#b91c1c"
                  height={280}
                />
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <GraduationCap /> Trình độ học vị
              </h3>
            </div>
            <div className="chart-card-body">
              {statsLoading ? (
                <div style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "2rem" }}>
                  Đang tải...
                </div>
              ) : (
                <>
                  <DonutChart
                    data={degreeData}
                    height={200}
                    centerText={String((stats && stats.total) || 0)}
                    centerSubtext="Tổng GV"
                  />
                  <div className="chart-legend">
                    {degreeData.map(function (item, idx) {
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

        {/* Top Rated */}
        {topRatedList.length > 0 && (
          <div className="chart-card" style={{ marginTop: "24px" }}>
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Award /> Top giảng viên được đánh giá cao
              </h3>
            </div>
            <div className="chart-card-body">
              <div className="ranking-list">
                {topRatedList.map(function (teacher, index) {
                  var posClass = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "normal"
                  return (
                    <div key={teacher.id || index} className="ranking-item">
                      <div className={"ranking-position " + posClass}>{index + 1}</div>
                      <div className="ranking-info">
                        <div className="ranking-name">{teacher.full_name}</div>
                        <div className="ranking-meta">
                          {teacher.department_name} | {teacher.total_students || 0} SV
                        </div>
                      </div>
                      <div className="ranking-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Award size={16} style={{ color: "#f59e0b" }} />
                        {teacher.rating}
                      </div>
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
                      placeholder="Tìm kiếm giảng viên..."
                      value={searchInput}
                      onChange={function (e) { setSearchInput(e.target.value) }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">Tìm</button>
                </form>
                <select
                  className="filter-select"
                  value={departmentFilter}
                  onChange={handleDeptChange}
                >
                  <option value="all">Tất cả khoa</option>
                  {deptData.map(function (d, i) {
                    return (
                      <option key={i} value={d.name}>{d.name}</option>
                    )
                  })}
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Download /> Xuất
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus /> Thêm giảng viên
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="chart-card" style={{ marginTop: "16px" }}>
          <div className="chart-card-header">
            <h3 className="chart-card-title">
              <GraduationCap /> Danh sách giảng viên
            </h3>
            <span className="badge badge-primary">
              {totalCount} giảng viên
            </span>
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
                    <th>Giảng viên</th>
                    <th>Mã GV</th>
                    <th>Khoa</th>
                    <th>Học vị</th>
                    <th>Trạng thái</th>
                    <th className="text-center">Đánh giá</th>
                    <th style={{ width: "120px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Đang tải...
                      </td>
                    </tr>
                  ) : teacherList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    teacherList.map(function (teacher) {
                      var statusBadge = teacher.status === "Đang dạy"
                        ? "badge-success"
                        : teacher.status === "Nghỉ phép"
                        ? "badge-warning"
                        : "badge-secondary"

                      return (
                        <tr key={teacher.id}>
                          <td><input type="checkbox" /></td>
                          <td>
                            <div className="student-cell">
                              <div className="avatar avatar-sm">
                                {teacher.full_name
                                  ? teacher.full_name.split(" ").pop().charAt(0)
                                  : "?"}
                              </div>
                              <div>
                                <p className="student-name">{teacher.full_name}</p>
                                <p className="student-email">{teacher.email}</p>
                              </div>
                            </div>
                          </td>
                          <td><span className="text-code">{teacher.instructor_code}</span></td>
                          <td>{teacher.department_name || "—"}</td>
                          <td>{teacher.degree || "—"}</td>
                          <td>
                            <span className={"badge " + statusBadge}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="text-center">
                            {teacher.rating > 0
                              ? teacher.rating.toFixed(1)
                              : "—"}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-ghost btn-icon btn-sm">
                                <Eye />
                              </button>
                              <button className="btn btn-ghost btn-icon btn-sm">
                                <Edit />
                              </button>
                              <button
                                className="btn btn-ghost btn-icon btn-sm text-danger"
                                onClick={function () { setConfirmDelete(teacher) }}
                              >
                                <Trash2 />
                              </button>
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
              <div style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Trang {currentPage} / {totalPages}
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    onClick={function () { goToPage(currentPage - 1) }}
                    disabled={!pagination || !pagination.hasPrevPage}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    onClick={function () { goToPage(currentPage + 1) }}
                    disabled={!pagination || !pagination.hasNextPage}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Delete */}
        {confirmDelete && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}>
            <div style={{
              background: "var(--card)", borderRadius: "0.75rem", padding: "2rem",
              maxWidth: "400px", width: "90%",
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Xác nhận xóa</h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
                Bạn có chắc muốn xóa giảng viên <strong>{confirmDelete.full_name}</strong>?
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  className="btn btn-outline"
                  onClick={function () { setConfirmDelete(null) }}
                  disabled={deleting}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: "#dc2626" }}
                  onClick={function () { deleteInstructor(confirmDelete.id) }}
                  disabled={deleting}
                >
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
