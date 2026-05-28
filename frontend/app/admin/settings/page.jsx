"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Save,
  Key,
  Users,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Server,
  HardDrive,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  AlertTriangle,
  Zap,
  Lock,
  Palette,
  Languages
} from "lucide-react"

export default function SettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="dashboard-content">
      <Header title="Cài đặt hệ thống" />
      
      <div className="dashboard-body">
        {/* Quick Status Overview */}
        <div className="summary-grid" style={{ marginBottom: "24px" }}>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <Server size={20} />
              </div>
            </div>
            <div className="summary-item-value">99.9%</div>
            <div className="summary-item-label">Uptime hệ thống</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <HardDrive size={20} />
              </div>
            </div>
            <div className="summary-item-value">2.4 GB</div>
            <div className="summary-item-label">Dung lượng sử dụng</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <Users size={20} />
              </div>
            </div>
            <div className="summary-item-value">124</div>
            <div className="summary-item-label">Người dùng hoạt động</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="summary-item-value">v2.5.1</div>
            <div className="summary-item-label">Phiên bản hệ thống</div>
          </div>
        </div>

        <div className="settings-grid">
          {/* Sidebar Navigation */}
          <div className="settings-sidebar" style={{ padding: "16px" }}>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Quản lý cài đặt</p>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* General Settings Nav Item */}
              <a href="#general" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, rgba(185, 28, 28, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)",
                border: "1px solid rgba(185, 28, 28, 0.2)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(185, 28, 28, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Settings size={20} style={{ color: "#b91c1c" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Cài đặt chung</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Ngôn ngữ, múi giờ, học kỳ</p>
                </div>
                <CheckCircle size={16} style={{ color: "#16a34a" }} />
              </a>

              {/* Account Nav Item */}
              <a href="#account" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(37, 99, 235, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <User size={20} style={{ color: "#2563eb" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Tài khoản</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Thông tin cá nhân</p>
                </div>
              </a>

              {/* Notifications Nav Item */}
              <a href="#notifications" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Bell size={20} style={{ color: "#f59e0b" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Thông báo</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Email, cảnh báo hệ thống</p>
                </div>
                <span style={{ 
                  background: "#f59e0b", 
                  color: "white", 
                  fontSize: "10px", 
                  fontWeight: "600",
                  padding: "2px 6px", 
                  borderRadius: "10px" 
                }}>3</span>
              </a>

              {/* Security Nav Item */}
              <a href="#security" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(22, 163, 74, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Shield size={20} style={{ color: "#16a34a" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Bảo mật</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Mật khẩu, 2FA, phiên</p>
                </div>
                <CheckCircle size={16} style={{ color: "#16a34a" }} />
              </a>

              {/* Database Nav Item */}
              <a href="#database" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(139, 92, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Database size={20} style={{ color: "#8b5cf6" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Cơ sở dữ liệu</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>Sao lưu, tối ưu hóa</p>
                </div>
                <span style={{ 
                  background: "var(--accent)", 
                  color: "var(--muted-foreground)", 
                  fontSize: "10px", 
                  fontWeight: "600",
                  padding: "2px 6px", 
                  borderRadius: "10px" 
                }}>24%</span>
              </a>

              {/* Email Nav Item */}
              <a href="#email" style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "var(--card)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(6, 182, 212, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Mail size={20} style={{ color: "#06b6d4" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "2px" }}>Email</p>
                  <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>SMTP, mẫu email</p>
                </div>
              </a>
            </nav>

            {/* System Info Card */}
            <div style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
              border: "1px solid rgba(37, 99, 235, 0.15)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Server size={16} style={{ color: "#2563eb" }} />
                <p style={{ fontSize: "12px", fontWeight: "600", color: "#2563eb" }}>Trạng thái hệ thống</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Phiên bản</span>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>v2.5.1</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Uptime</span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>99.9%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Cập nhật</span>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>15/01/2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {/* General Settings */}
            <div className="card" id="general">
              <div className="card-header">
                <h2 className="card-title">
                  <Globe size={20} />
                  Cài đặt chung
                </h2>
                <span className="badge badge-success">Hoạt động</span>
              </div>
              <div className="card-content">
                <div className="settings-form">
                  <div className="form-group">
                    <label className="form-label">Tên hệ thống</label>
                    <input type="text" className="form-input" defaultValue="Hệ thống quản lý thông tin sinh viên PTIT" />
                    <p className="form-help">Tên này sẽ hiển thị trên trang đăng nhập và trong các email</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Học kỳ hiện tại</label>
                    <select className="form-select">
                      <option value="hk2-2024">Học kỳ II — Năm học 2024–2025</option>
                      <option value="hk1-2024">Học kỳ I — Năm học 2024–2025</option>
                    </select>
                    <p className="form-help">Cập nhật học kỳ để đúng thời gian học</p>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ngôn ngữ</label>
                      <select className="form-select">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Múi giờ</label>
                      <select className="form-select">
                        <option value="asia-ho_chi_minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Quick Settings Toggle Cards */}
                  <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                    <div style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: darkMode ? "rgba(37, 99, 235, 0.1)" : "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer"
                    }} onClick={() => setDarkMode(!darkMode)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Palette size={20} style={{ color: darkMode ? "#2563eb" : "var(--muted-foreground)" }} />
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: "500" }}>Giao diện tối</p>
                          <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{darkMode ? "Đang bật" : "Đang tắt"}</p>
                        </div>
                      </div>
                      {darkMode ? <ToggleRight size={24} style={{ color: "#2563eb" }} /> : <ToggleLeft size={24} />}
                    </div>
                    
                    <div style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Languages size={20} style={{ color: "var(--muted-foreground)" }} />
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: "500" }}>Ngôn ngữ</p>
                          <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Tiếng Việt</p>
                        </div>
                      </div>
                      <span className="badge badge-outline">VI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="card" id="account">
              <div className="card-header">
                <h2 className="card-title">
                  <User size={20} />
                  Thông tin tài khoản
                </h2>
                <span className="badge badge-info">Quản trị viên</span>
              </div>
              <div className="card-content">
                <div className="account-profile" style={{ 
                  display: "flex", 
                  gap: "20px", 
                  marginBottom: "24px", 
                  padding: "20px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(185, 28, 28, 0.05) 0%, rgba(185, 28, 28, 0.02) 100%)",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "28px", 
                    fontWeight: "bold" 
                  }}>A</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>Admin PTIT</h3>
                    <p style={{ fontSize: "14px", color: "var(--muted-foreground)", marginBottom: "8px" }}>admin@ptit.edu.vn</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span className="badge badge-success">Quản trị viên</span>
                      <span className="badge badge-outline">Tham gia: 15/01/2024</span>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">Đổi ảnh</button>
                </div>
                <div className="settings-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Họ và tên</label>
                      <input type="text" className="form-input" defaultValue="Admin PTIT" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" defaultValue="admin@ptit.edu.vn" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input type="tel" className="form-input" defaultValue="024.3456.7890" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Chức vụ</label>
                      <input type="text" className="form-input" defaultValue="Quản trị viên hệ thống" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card" id="notifications">
              <div className="card-header">
                <h2 className="card-title">
                  <Bell size={20} />
                  Thông báo
                </h2>
              </div>
              <div className="card-content">
                <div style={{ display: "grid", gap: "12px" }}>
                  {/* Email Notification Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: emailNotifications ? "1px solid rgba(22, 163, 74, 0.3)" : "1px solid var(--border)",
                    background: emailNotifications ? "rgba(22, 163, 74, 0.05)" : "var(--card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: emailNotifications ? "rgba(22, 163, 74, 0.1)" : "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Mail size={22} style={{ color: emailNotifications ? "#16a34a" : "var(--muted-foreground)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Email thông báo</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Nhận thông báo hệ thống qua email</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      {emailNotifications ? <ToggleRight size={32} style={{ color: "#16a34a" }} /> : <ToggleLeft size={32} style={{ color: "var(--muted-foreground)" }} />}
                    </button>
                  </div>

                  {/* System Alert Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: systemAlerts ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid var(--border)",
                    background: systemAlerts ? "rgba(245, 158, 11, 0.05)" : "var(--card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: systemAlerts ? "rgba(245, 158, 11, 0.1)" : "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <AlertTriangle size={22} style={{ color: systemAlerts ? "#f59e0b" : "var(--muted-foreground)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Cảnh báo hệ thống</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Thông báo khi hệ thống có vấn đề hoặc bảo trì</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSystemAlerts(!systemAlerts)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      {systemAlerts ? <ToggleRight size={32} style={{ color: "#f59e0b" }} /> : <ToggleLeft size={32} style={{ color: "var(--muted-foreground)" }} />}
                    </button>
                  </div>

                  {/* Auto Backup Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: autoBackup ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid var(--border)",
                    background: autoBackup ? "rgba(37, 99, 235, 0.05)" : "var(--card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: autoBackup ? "rgba(37, 99, 235, 0.1)" : "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <RefreshCw size={22} style={{ color: autoBackup ? "#2563eb" : "var(--muted-foreground)" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Tự động sao lưu</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Sao lưu dữ liệu tự động hàng ngày lúc 02:00</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAutoBackup(!autoBackup)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      {autoBackup ? <ToggleRight size={32} style={{ color: "#2563eb" }} /> : <ToggleLeft size={32} style={{ color: "var(--muted-foreground)" }} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="card" id="security">
              <div className="card-header">
                <h2 className="card-title">
                  <Shield size={20} />
                  Bảo mật
                </h2>
                <span className="badge badge-success">Đã xác minh</span>
              </div>
              <div className="card-content">
                <div style={{ display: "grid", gap: "12px" }}>
                  {/* Password Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: "rgba(220, 38, 38, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Key size={22} style={{ color: "#dc2626" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Đổi mật khẩu</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Cập nhật mật khẩu đăng nhập của bạn</p>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Đổi mật khẩu</button>
                  </div>

                  {/* 2FA Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: twoFactorEnabled ? "1px solid rgba(22, 163, 74, 0.3)" : "1px solid var(--border)",
                    background: twoFactorEnabled ? "rgba(22, 163, 74, 0.05)" : "var(--card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: twoFactorEnabled ? "rgba(22, 163, 74, 0.1)" : "rgba(37, 99, 235, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Lock size={22} style={{ color: twoFactorEnabled ? "#16a34a" : "#2563eb" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Xác thực 2 lớp (2FA)</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Thêm bảo mật cho tài khoản với xác thực 2 yếu tố</p>
                      </div>
                    </div>
                    <button 
                      className={`btn ${twoFactorEnabled ? "btn-success" : "btn-primary"} btn-sm`}
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    >
                      {twoFactorEnabled ? "Đã bật" : "Kích hoạt"}
                    </button>
                  </div>

                  {/* Sessions Card */}
                  <div style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: "rgba(22, 163, 74, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Monitor size={22} style={{ color: "#16a34a" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: "600", marginBottom: "2px" }}>Phiên đăng nhập</p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>Quản lý các thiết bị đang đăng nhập — 1 phiên hoạt động</p>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Xem tất cả</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Settings */}
            <div className="card" id="database">
              <div className="card-header">
                <h2 className="card-title">
                  <Database size={20} />
                  Cơ sở dữ liệu
                </h2>
                <span className="badge badge-success">Bình thường</span>
              </div>
              <div className="card-content">
                {/* Database Stats Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ 
                    padding: "20px", 
                    borderRadius: "12px", 
                    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)",
                    border: "1px solid rgba(37, 99, 235, 0.2)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <HardDrive size={20} style={{ color: "#2563eb" }} />
                      <span style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: "600" }}>Dung lượng</span>
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#2563eb" }}>2.4 GB</p>
                    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>của 10 GB (24%)</p>
                    <div style={{ marginTop: "12px", height: "6px", borderRadius: "3px", background: "rgba(37, 99, 235, 0.2)" }}>
                      <div style={{ width: "24%", height: "100%", borderRadius: "3px", background: "#2563eb" }}></div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: "20px", 
                    borderRadius: "12px", 
                    background: "linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
                    border: "1px solid rgba(22, 163, 74, 0.2)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Clock size={20} style={{ color: "#16a34a" }} />
                      <span style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: "600" }}>Sao lưu gần nhất</span>
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a" }}>15/01</p>
                    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>lúc 14:30 AM</p>
                  </div>
                  
                  <div style={{ 
                    padding: "20px", 
                    borderRadius: "12px", 
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.2)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <Zap size={20} style={{ color: "#8b5cf6" }} />
                      <span style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: "600" }}>Hiệu suất</span>
                    </div>
                    <p style={{ fontSize: "24px", fontWeight: "700", color: "#8b5cf6" }}>98.5%</p>
                    <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>Tối ưu</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button className="btn btn-primary btn-sm">
                    <Download size={16} />
                    Sao lưu ngay
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Upload size={16} />
                    Khôi phục
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <RefreshCw size={16} />
                    Tối ưu hóa
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Eye size={16} />
                    Xem nhật ký
                  </button>
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="settings-footer">
              <button className="btn btn-outline">Hủy thay đổi</button>
              <button className="btn btn-primary">
                <Save size={16} />
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
