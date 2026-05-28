
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { SimpleBarChart, DonutChart, SimpleAreaChart } from "@/components/dashboard/charts"
import { useApi, usePaginatedApi, useMutation } from "@/hooks/use-api"
import { adminStudentService } from "@/lib/services/adminService"
import {
  Users, Search, Filter, Plus, Download, Upload,
  Eye, Edit, Trash2, ChevronLeft, ChevronRight,
  TrendingUp, GraduationCap, UserCheck, Clock, Award
} from "lucide-react"

const STATUS_COLORS = {
  "Đang học": "#16a34a",
  "Chờ duyệt": "#f59e0b",
  "Bảo lưu": "#dc2626",
  "Tạm nghỉ": "#6b7280",
  "Đã tốt nghiệp": "#2563eb",
  "Bị đuổi": "#991b1b",
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const {
    data: students,
    pagination,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refetch,
  } = usePaginatedApi(adminStudentService.getAll, {
    page: 1,
    limit: 10,
    status: "all",
  })

  const { mutate: deleteStudent, loading: deleting } = useMutation(
    adminStudentService.delete,
    {
      onSuccess: function () {
        setSuccessMsg("Xóa sinh viên thành công")
        setConfirmDelete(null)
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi xóa sinh viên")
        setConfirmDelete(null)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  function handleStatusChange(e) {
    var val = e.target.value
    setStatusFilter(val)
    updateParams({ status: val })
  }

  function handleDeleteConfirm() {
    if (confirmDelete) {
      deleteStudent(confirmDelete.id)
    }
  }

  var studentList = Array.isArray(students) ? students : []

  var totalCount = pagination ? pagination.totalItems : 0
  var currentPage = pagination ? pagination.currentPage : 1
  var totalPages = pagination ? pagination.totalPages : 1
  var pageSize = pagination ? pagination.pageSize : 10

  var startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  var endItem = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="dashboard-content">
      <Header title="Quản lý sinh viên" />

      <div className="dashboard-body">
        {/* Messages */}
        {successMsg && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "#dcfce7",
            border: "1px solid #16a34a",
            borderRadius: "0.5rem",
            color: "#166534",
            fontSize: "0.875rem",
          }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "#fee2e2",
            border: "1px solid #dc2626",
            borderRadius: "0.5rem",
            color: "#991b1b",
            fontSize: "0.875rem",
          }}>
            {errorMsg}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <Users size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {loading ? "..." : totalCount.toLocaleString()}
            </div>
            <div className="summary-item-label">Tổng sinh viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <UserCheck size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {loading ? "..." : studentList.filter(function (s) {
                return s.status === "Đang học"
              }).length}
            </div>
            <div className="summary-item-label">Đang học (trang này)</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {loading ? "..." : studentList.filter(function (s) {
                return s.status === "Chờ duyệt"
              }).length}
            </div>
            <div className="summary-item-label">Chờ duyệt (trang này)</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Award size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {loading ? "..." : (function () {
                var validGpa = studentList.filter(function (s) {
                  return s.gpa && parseFloat(s.gpa) > 0
                })
                if (validGpa.length === 0) return "—"
                var avg = validGpa.reduce(function (sum, s) {
                  return sum + parseFloat(s.gpa)
                }, 0) / validGpa.length
                return avg.toFixed(2)
              })()}
            </div>
            <div className="summary-item-label">GPA trung bình</div>
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
                      placeholder="Tìm theo tên, mã SV..."
                      value={searchInput}
                      onChange={function (e) { setSearchInput(e.target.value) }}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">
                    Tìm
                  </button>
                </form>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Đang học">Đang học</option>
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Tạm nghỉ">Tạm nghỉ</option>
                  <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                  <option value="Bị đuổi">Bị đuổi</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Download /> Export
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus /> Thêm sinh viên
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
            <span className="badge badge-primary">
              {totalCount.toLocaleString()} sinh viên
            </span>
          </div>

          {error && (
            <div style={{
              padding: "1rem 1.5rem",
              color: "#dc2626",
              fontSize: "0.875rem",
            }}>
              Lỗi: {error}
            </div>
          )}

          <div style={{ padding: 0 }}>
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "var(--muted-foreground)",
                      }}>
                        Đang tải...
                      </td>
                    </tr>
                  ) : studentList.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "var(--muted-foreground)",
                      }}>
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    studentList.map(function (student) {
                      var gpaVal = student.gpa ? parseFloat(student.gpa) : 0
                      var gpaBadge = gpaVal >= 3.5
                        ? "excellent"
                        : gpaVal >= 3.0
                        ? "good"
                        : "average"

                      var statusBadge = "badge-secondary"
                      if (student.status === "Đang học") statusBadge = "badge-success"
                      else if (student.status === "Chờ duyệt") statusBadge = "badge-warning"
                      else if (student.status === "Bảo lưu") statusBadge = "badge-danger"

                      return (
                        <tr key={student.id}>
                          <td><input type="checkbox" /></td>
                          <td>
                            <div className="student-cell">
                              <div className="avatar avatar-sm">
                                {student.full_name
                                  ? student.full_name.split(" ").pop().charAt(0)
                                  : "?"}
                              </div>
                              <div>
                                <p className="student-name">{student.full_name}</p>
                                <p className="student-email">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-code">{student.student_code}</span>
                          </td>
                          <td>{student.class_code || "—"}</td>
                          <td className="text-muted">{student.major_name || "—"}</td>
                          <td>
                            <div className="progress-cell">
                              <span className={"gpa-badge " + gpaBadge}>
                                {gpaVal > 0 ? gpaVal.toFixed(2) : "—"}
                              </span>
                              <div className="progress-bar-mini">
                                <div
                                  className={"progress-bar-mini-fill " + gpaBadge}
                                  style={{ width: ((gpaVal / 4) * 100) + "%" }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={"badge " + statusBadge}>
                              {student.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                title="Xem chi tiết"
                              >
                                <Eye />
                              </button>
                              <button
                                className="btn btn-ghost btn-icon btn-sm"
                                title="Chỉnh sửa"
                              >
                                <Edit />
                              </button>
                              <button
                                className="btn btn-ghost btn-icon btn-sm text-danger"
                                title="Xóa"
                                onClick={function () {
                                  setConfirmDelete(student)
                                }}
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
              <div
                className="table-pagination"
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="pagination-info">
                  Hiển thị {startItem}–{endItem} trong tổng số{" "}
                  {totalCount.toLocaleString()} sinh viên
                </p>
                <div className="pagination-controls">
                  <button
                    className="btn btn-outline btn-sm btn-icon"
                    onClick={function () { goToPage(currentPage - 1) }}
                    disabled={!pagination || !pagination.hasPrevPage}
                  >
                    <ChevronLeft />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, function (_, i) {
                    var page = i + 1
                    return (
                      <button
                        key={page}
                        className={"btn btn-sm " + (page === currentPage ? "btn-primary" : "btn-outline")}
                        onClick={function () { goToPage(page) }}
                      >
                        {page}
                      </button>
                    )
                  })}
                  {totalPages > 5 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
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

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}>
            <div style={{
              background: "var(--card)",
              borderRadius: "0.75rem",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Xác nhận xóa
              </h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
                Bạn có chắc muốn xóa sinh viên{" "}
                <strong>{confirmDelete.full_name}</strong> (
                {confirmDelete.student_code})? Thao tác này không thể hoàn tác.
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
                  onClick={handleDeleteConfirm}
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
