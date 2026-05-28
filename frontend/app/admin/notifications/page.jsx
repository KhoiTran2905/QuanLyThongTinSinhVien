"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, usePaginatedApi, useMutation } from "@/hooks/use-api"
import { adminNotificationService } from "@/lib/services/adminService"
import {
  Bell, Search, ChevronLeft, ChevronRight, AlertTriangle, Plus, Trash2, Mail, Edit
} from "lucide-react"

export default function AdminNotificationPage() {
  const [searchInput, setSearchInput] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [newNotif, setNewNotif] = useState({ title: "", content: "", type: "Thông báo chung", priority: "Thường", target_role: "all" })

  const {
    data: notifications,
    pagination,
    loading,
    error,
    updateParams,
    goToPage,
    refetch,
  } = usePaginatedApi(adminNotificationService.getAll, { page: 1, limit: 10 })

  const { data: stats, loading: statsLoading } = useApi(
    adminNotificationService.getStats,
    [],
    { defaultData: {} }
  )

  const { mutate: saveNotification, loading: saving } = useMutation(
    editingId ? function(data) { return adminNotificationService.update(editingId, data) } : adminNotificationService.create,
    {
      onSuccess: function () {
        setSuccessMsg(editingId ? "Cập nhật thông báo thành công" : "Tạo thông báo thành công")
        setShowCreateModal(false)
        setNewNotif({ title: "", content: "", type: "Thông báo chung", priority: "Thường", target_role: "all" })
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi lưu thông báo")
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  const { mutate: deleteNotification, loading: deleting } = useMutation(
    adminNotificationService.delete,
    {
      onSuccess: function () {
        setSuccessMsg("Xóa thông báo thành công")
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi xóa thông báo")
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    updateParams({ search: searchInput })
  }

  function handleCreate(e) {
    e.preventDefault()
    saveNotification(newNotif)
  }

  function openCreate() {
    setEditingId(null)
    setNewNotif({ title: "", content: "", type: "Thông báo chung", priority: "Thường", target_role: "all" })
    setShowCreateModal(true)
  }

  function openEdit(n) {
    setEditingId(n.id)
    setNewNotif({ title: n.title, content: n.content, type: n.type, priority: n.priority, target_role: n.target_role })
    setShowCreateModal(true)
  }

  var notifList = Array.isArray(notifications) ? notifications : []
  var totalCount = pagination ? pagination.totalItems : 0
  var currentPage = pagination ? pagination.currentPage : 1
  var totalPages = pagination ? pagination.totalPages : 1

  return (
    <div className="dashboard-content">
      <Header title="Quản lý thông báo" />

      <div className="dashboard-body">
        {successMsg && (
          <div style={{ padding: "0.75rem 1rem", background: "#dcfce7", border: "1px solid #16a34a", borderRadius: "0.5rem", color: "#166534", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", border: "1px solid #dc2626", borderRadius: "0.5rem", color: "#991b1b", fontSize: "0.875rem", marginBottom: "1rem" }}>
            {errorMsg}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary"><Bell size={20} /></div>
            </div>
            <div className="summary-item-value">{statsLoading ? "..." : (stats?.total || 0)}</div>
            <div className="summary-item-label">Tổng số thông báo</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning"><AlertTriangle size={20} /></div>
            </div>
            <div className="summary-item-value">{statsLoading ? "..." : (stats?.important || 0)}</div>
            <div className="summary-item-label">Quan trọng</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar" style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="admin-toolbar-left" style={{ flexWrap: "wrap", display: "flex", gap: "8px" }}>
                <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
                  <div className="search-box">
                    <Search className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Tìm tiêu đề..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-outline btn-sm">Tìm</button>
                </form>
                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value)
                    updateParams({ type: e.target.value })
                  }}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Thông báo chung">Thông báo chung</option>
                  <option value="Đăng ký học">Đăng ký học</option>
                  <option value="Học phí">Học phí</option>
                  <option value="Điểm số">Điểm số</option>
                  <option value="Sự kiện">Sự kiện</option>
                </select>
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={openCreate}>
                  <Plus size={16} style={{ marginRight: "4px" }}/> Tạo thông báo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="card" style={{ marginTop: "16px" }}>
          <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={18} /> Danh sách thông báo
            </h3>
            <span className="badge badge-primary">{totalCount} bản ghi</span>
          </div>
          
          <div className="card-body" style={{ padding: "20px" }}>
            {error ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>Lỗi: {error}</div>
            ) : loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>Đang tải...</div>
            ) : notifList.length === 0 ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>Không có dữ liệu</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {notifList.map(n => (
                  <div key={n.id} style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "16px", background: "var(--card)", display: "flex", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span className={`badge ${n.priority === 'Quan trọng' ? 'badge-danger' : 'badge-info'}`}>{n.priority}</span>
                        <span className="badge badge-outline">{n.type}</span>
                        <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                          {new Date(n.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}>{n.title}</h4>
                      <p style={{ fontSize: "14px", color: "var(--muted-foreground)", marginBottom: "8px" }}>{n.content}</p>
                      <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                        Người gửi: {n.created_by_name} | Đối tượng: {n.target_role === 'all' ? 'Tất cả' : n.target_role} | Đã đọc: {n.read_count}
                      </div>
                    </div>
                    <div>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => openEdit(n)}
                        title="Chỉnh sửa"
                        style={{ marginRight: "8px" }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ color: "#dc2626" }}
                        onClick={() => setConfirmDelete(n)}
                        disabled={deleting}
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                <button className="btn btn-outline btn-sm btn-icon" onClick={() => goToPage(currentPage - 1)} disabled={!pagination?.hasPrevPage}><ChevronLeft /></button>
                <span style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}>{currentPage} / {totalPages}</span>
                <button className="btn btn-outline btn-sm btn-icon" onClick={() => goToPage(currentPage + 1)} disabled={!pagination?.hasNextPage}><ChevronRight /></button>
              </div>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", borderRadius: "0.75rem", padding: "2rem", maxWidth: "500px", width: "90%" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "18px" }}>{editingId ? "Cập nhật thông báo" : "Tạo thông báo mới"}</h3>
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>Tiêu đề *</label>
                  <input type="text" className="form-input" required value={newNotif.title} onChange={e => setNewNotif({...newNotif, title: e.target.value})} />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>Nội dung *</label>
                  <textarea className="form-input" rows={4} required value={newNotif.content} onChange={e => setNewNotif({...newNotif, content: e.target.value})}></textarea>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>Loại thông báo</label>
                    <select className="form-input" value={newNotif.type} onChange={e => setNewNotif({...newNotif, type: e.target.value})}>
                      <option value="Thông báo chung">Thông báo chung</option>
                      <option value="Đăng ký học">Đăng ký học</option>
                      <option value="Học phí">Học phí</option>
                      <option value="Điểm số">Điểm số</option>
                      <option value="Sự kiện">Sự kiện</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "14px", fontWeight: 500 }}>Mức độ ưu tiên</label>
                    <select className="form-input" value={newNotif.priority} onChange={e => setNewNotif({...newNotif, priority: e.target.value})}>
                      <option value="Thường">Thường</option>
                      <option value="Lưu ý">Lưu ý</option>
                      <option value="Quan trọng">Quan trọng</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)} disabled={saving}>Hủy</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Đang lưu..." : (editingId ? "Cập nhật" : "Tạo thông báo")}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "0.75rem", width: 450, maxWidth: "90%" }}>
              <h3 style={{ fontWeight: 700, margin: "0 0 1rem 0", fontSize: "18px" }}>Xác nhận xóa</h3>
              <p style={{ margin: "0 0 1.5rem 0", color: "var(--muted-foreground)", lineHeight: "1.5" }}>
                Bạn có chắc chắn muốn xóa thông báo <strong>"{confirmDelete.title}"</strong> không? Hành động này không thể hoàn tác.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button className="btn btn-outline" onClick={() => setConfirmDelete(null)} disabled={deleting}>Hủy</button>
                <button 
                  className="btn btn-primary" 
                  style={{ background: "#dc2626", border: "none" }}
                  onClick={() => {
                    deleteNotification(confirmDelete.id);
                    setConfirmDelete(null);
                  }}
                  disabled={deleting}
                >
                  {deleting ? "Đang xóa..." : "Xóa thông báo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
