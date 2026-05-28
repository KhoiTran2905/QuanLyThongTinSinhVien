"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Megaphone,
  GraduationCap,
  CreditCard,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  Check
} from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "announcement",
    title: "Thông báo lịch thi học kỳ 2 năm học 2024-2025",
    content: "Phòng Đào tạo thông báo lịch thi kết thúc học phần học kỳ 2 năm học 2024-2025. Sinh viên xem chi tiết lịch thi trên hệ thống và chuẩn bị đầy đủ thẻ sinh viên khi đến phòng thi.",
    date: "20/01/2025",
    time: "09:30",
    unread: true,
    priority: "high"
  },
  {
    id: 2,
    type: "registration",
    title: "Nhắc nhở đăng ký môn học",
    content: "Thời gian đăng ký môn học học kỳ 2 sẽ kết thúc vào ngày 20/01/2025. Sinh viên chưa đăng ký vui lòng hoàn thành trước thời hạn.",
    date: "18/01/2025",
    time: "14:00",
    unread: true,
    priority: "high"
  },
  {
    id: 3,
    type: "tuition",
    title: "Thông báo nộp học phí",
    content: "Học phí học kỳ 2 năm học 2024-2025 đã được cập nhật. Hạn nộp học phí: 31/01/2025. Sinh viên vui lòng thanh toán đúng hạn để tránh bị khóa tài khoản.",
    date: "15/01/2025",
    time: "08:00",
    unread: false,
    priority: "medium"
  },
  {
    id: 4,
    type: "grade",
    title: "Điểm môn Lập trình Java đã được công bố",
    content: "Điểm thi kết thúc học phần môn Lập trình Java (IT4060) đã được cập nhật trên hệ thống. Sinh viên kiểm tra và phản hồi trong vòng 7 ngày nếu có thắc mắc.",
    date: "12/01/2025",
    time: "16:45",
    unread: false,
    priority: "normal"
  },
  {
    id: 5,
    type: "announcement",
    title: "Lịch nghỉ Tết Nguyên đán 2025",
    content: "Học viện thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ ngày 25/01/2025 đến hết ngày 02/02/2025. Sinh viên quay lại học tập từ ngày 03/02/2025.",
    date: "10/01/2025",
    time: "10:00",
    unread: false,
    priority: "normal"
  },
  {
    id: 6,
    type: "event",
    title: "Hội thảo: Cơ hội nghề nghiệp trong ngành CNTT",
    content: "Phòng Công tác sinh viên phối hợp với các doanh nghiệp tổ chức Hội thảo Cơ hội nghề nghiệp. Thời gian: 14:00 ngày 08/01/2025. Địa điểm: Hội trường A1.",
    date: "05/01/2025",
    time: "11:30",
    unread: false,
    priority: "normal"
  },
]

const filterTypes = [
  { id: "all", label: "Tất cả", icon: Bell },
  { id: "announcement", label: "Thông báo chung", icon: Megaphone },
  { id: "registration", label: "Đăng ký học", icon: FileText },
  { id: "tuition", label: "Học phí", icon: CreditCard },
  { id: "grade", label: "Điểm số", icon: GraduationCap },
  { id: "event", label: "Sự kiện", icon: Calendar },
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationList, setNotificationList] = useState(notifications)

  const filteredNotifications = notificationList.filter(n => {
    const matchesFilter = filter === "all" || n.type === filter
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const unreadCount = notificationList.filter(n => n.unread).length

  const markAsRead = (id) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const deleteNotification = (id) => {
    setNotificationList(prev => prev.filter(n => n.id !== id))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "announcement": return <Megaphone />
      case "registration": return <FileText />
      case "tuition": return <CreditCard />
      case "grade": return <GraduationCap />
      case "event": return <Calendar />
      default: return <Bell />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "announcement": return "blue"
      case "registration": return "purple"
      case "tuition": return "green"
      case "grade": return "orange"
      case "event": return "teal"
      default: return "gray"
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high": return <span className="badge badge-danger">Quan trọng</span>
      case "medium": return <span className="badge badge-warning">Lưu ý</span>
      default: return null
    }
  }

  return (
    <div className="dashboard-content">
      <Header title="Thông báo" />
      
      <div className="dashboard-body">
        {/* Header Stats */}
        <div className="notification-header-stats">
          <div className="notification-stat-card">
            <div className="notification-stat-icon">
              <Bell />
            </div>
            <div>
              <span className="notification-stat-value">{notificationList.length}</span>
              <span className="notification-stat-label">Tổng thông báo</span>
            </div>
          </div>
          <div className="notification-stat-card highlight">
            <div className="notification-stat-icon unread">
              <AlertCircle />
            </div>
            <div>
              <span className="notification-stat-value">{unreadCount}</span>
              <span className="notification-stat-label">Chưa đọc</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="notification-controls">
          <div className="notification-filters">
            {filterTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  className={`notification-filter-btn ${filter === type.id ? "active" : ""}`}
                  onClick={() => setFilter(type.id)}
                >
                  <Icon />
                  {type.label}
                </button>
              )
            })}
          </div>
          <div className="notification-actions">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
              <Check /> Đánh dấu đã đọc tất cả
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="card">
          <div className="card-content" style={{ padding: 0 }}>
            {filteredNotifications.length === 0 ? (
              <div className="empty-state" style={{ padding: "3rem" }}>
                <Bell />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              <div className="notification-list">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-list-item ${notification.unread ? "unread" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={`notification-type-icon ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-main">
                      <div className="notification-header">
                        <h4 className="notification-title-text">{notification.title}</h4>
                        {getPriorityBadge(notification.priority)}
                        {notification.unread && <span className="unread-dot" />}
                      </div>
                      <p className="notification-content-text">{notification.content}</p>
                      <div className="notification-meta">
                        <span className="notification-date">
                          <Calendar /> {notification.date}
                        </span>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-actions-menu">
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
