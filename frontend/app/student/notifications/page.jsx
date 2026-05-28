
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { notificationService } from "@/lib/services/studentService"
import {
  Bell, BookOpen, CreditCard, Award,
  Calendar, Info, CheckCircle, Trash2,
  Clock
} from "lucide-react"

var TYPE_ICONS = {
  "Thông báo chung": Info,
  "Đăng ký học": BookOpen,
  "Học phí": CreditCard,
  "Điểm số": Award,
  "Sự kiện": Calendar,
}

var TYPE_COLORS = {
  "Thông báo chung": "blue",
  "Đăng ký học": "purple",
  "Học phí": "orange",
  "Điểm số": "green",
  "Sự kiện": "teal",
}

var FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Thông báo chung", value: "Thông báo chung" },
  { label: "Đăng ký học", value: "Đăng ký học" },
  { label: "Học phí", value: "Học phí" },
  { label: "Điểm số", value: "Điểm số" },
  { label: "Sự kiện", value: "Sự kiện" },
]

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  var queryParams = activeFilter !== "all" ? { type: activeFilter } : {}

  const {
    data: notifData,
    loading,
    error,
    refetch,
  } = useApi(
    function () { return notificationService.getAll(queryParams) },
    [activeFilter],
    { defaultData: { notifications: [], total: 0, unread: 0 } }
  )

  useEffect(function () {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  const { mutate: markRead } = useMutation(notificationService.markAsRead, {
    onSuccess: function () { refetch() },
  })

  const { mutate: markAllRead, loading: markingAll } = useMutation(
    notificationService.markAllAsRead,
    { onSuccess: function () { refetch() } }
  )

  const { mutate: deleteNotif } = useMutation(notificationService.delete, {
    onSuccess: function () { refetch() },
  })

  var notifications = notifData && Array.isArray(notifData.notifications)
    ? notifData.notifications
    : Array.isArray(notifData)
    ? notifData
    : []

  var unreadCount = (notifData && notifData.unread) || 0
  var totalCount = (notifData && notifData.total) || notifications.length

  return (
    <div className="dashboard-content">
      <Header title="Thông báo" />

      <div className="dashboard-body">
        {/* Header Stats */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div className="notification-stat-card highlight">
            <div className="notification-stat-icon unread">
              <Bell />
            </div>
            <div>
              <p className="notification-stat-value">{unreadCount}</p>
              <p className="notification-stat-label">Chưa đọc</p>
            </div>
          </div>
          <div className="notification-stat-card">
            <div className="notification-stat-icon">
              <CheckCircle />
            </div>
            <div>
              <p className="notification-stat-value">{totalCount - unreadCount}</p>
              <p className="notification-stat-label">Đã đọc</p>
            </div>
          </div>
          <div className="notification-stat-card">
            <div className="notification-stat-icon">
              <Bell />
            </div>
            <div>
              <p className="notification-stat-value">{totalCount}</p>
              <p className="notification-stat-label">Tổng cộng</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="notification-controls" style={{ marginTop: "16px" }}>
          <div className="notification-filters">
            {FILTERS.map(function (f) {
              return (
                <button
                  key={f.value}
                  className={"notification-filter-btn " + (activeFilter === f.value ? "active" : "")}
                  onClick={function () { setActiveFilter(f.value) }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
          <div className="notification-actions">
            {unreadCount > 0 && (
              <button
                className="btn btn-outline btn-sm"
                onClick={function () { markAllRead() }}
                disabled={markingAll}
              >
                <CheckCircle size={16} />
                {markingAll ? "Đang xử lý..." : "Đánh dấu tất cả đã đọc"}
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="card" style={{ marginTop: "16px" }}>
          {error && (
            <div style={{ padding: "1rem", color: "#dc2626" }}>
              Lỗi: {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
              <Bell size={40} style={{ marginBottom: "12px", opacity: 0.4 }} />
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(function (notif) {
                var IconComp = TYPE_ICONS[notif.type] || Bell
                var colorClass = "notification-type-icon " + (TYPE_COLORS[notif.type] || "gray")
                var isUnread = !notif.is_read
                var dateStr = notif.created_at
                  ? new Date(notif.created_at).toLocaleDateString("vi-VN", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })
                  : ""
                var priorityBadge = notif.priority === "Quan trọng"
                  ? "badge-danger"
                  : notif.priority === "Lưu ý"
                  ? "badge-warning"
                  : "badge-outline"

                return (
                  <div
                    key={notif.id}
                    className={"notification-list-item " + (isUnread ? "unread" : "")}
                    onClick={function () {
                      if (isUnread) markRead(notif.id)
                    }}
                  >
                    <div className={colorClass}>
                      <IconComp />
                    </div>
                    <div className="notification-main">
                      <div className="notification-header">
                        <p className="notification-title-text">{notif.title}</p>
                        {isUnread && <span className="unread-dot" />}
                        <span className={"badge " + priorityBadge} style={{ marginLeft: "auto" }}>
                          {notif.priority}
                        </span>
                      </div>
                      <p className="notification-content-text">{notif.content}</p>
                      <div className="notification-meta">
                        <span className="notification-date">
                          <Clock size={12} />
                          {dateStr}
                        </span>
                        <span className="badge badge-outline" style={{ fontSize: "10px" }}>
                          {notif.type}
                        </span>
                      </div>
                    </div>
                    <div className="notification-actions-menu">
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={function (e) {
                          e.stopPropagation()
                          setDeleteConfirmId(notif.id)
                        }}
                        title="Xóa thông báo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div 
          onClick={function() { setDeleteConfirmId(null) }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div 
            onClick={function(e) { e.stopPropagation() }}
            style={{
              background: "var(--card)",
              padding: "2rem",
              borderRadius: "0.75rem",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}
          >
            <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600", color: "var(--danger)" }}>Xác nhận xóa</h3>
            <p style={{ marginBottom: "1.5rem" }}>Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button 
                onClick={function() { setDeleteConfirmId(null) }}
                style={{
                  padding: "8px 16px", borderRadius: "6px", border: "1px solid #d1d5db", 
                  background: "white", color: "#374151", cursor: "pointer", fontWeight: "500"
                }}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={function() {
                  deleteNotif(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
                style={{
                  padding: "8px 16px", borderRadius: "6px", border: "none", 
                  background: "#ef4444", color: "white", cursor: "pointer", fontWeight: "500"
                }}
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
