
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { settingService } from "@/lib/services/adminService"
import {
  Settings, User, Bell, Shield, Database,
  Globe, Save, Key, Users, CheckCircle,
  ToggleLeft, ToggleRight, Server, HardDrive,
  Clock, RefreshCw, Download, Upload, Eye,
  AlertTriangle, Zap, Lock, Palette, Languages
} from "lucide-react"

export default function SettingsPage() {
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Toggle states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Form states
  const [generalForm, setGeneralForm] = useState({
    system_name: "",
    current_semester: "",
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
  })
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  })

  // Fetch settings
  const { data: settings, loading: settingsLoading } = useApi(
    settingService.getAll, [], { defaultData: {} }
  )

  const { data: systemStatus, loading: statusLoading } = useApi(
    settingService.getSystemStatus, [], { defaultData: {} }
  )

  // Populate forms when settings loaded
  useEffect(function () {
    if (settings && Object.keys(settings).length > 0) {
      setGeneralForm({
        system_name: settings.system_name || "",
        current_semester: settings.current_semester || "",
        language: settings.language || "vi",
        timezone: settings.timezone || "Asia/Ho_Chi_Minh",
      })
      setProfileForm({
        full_name: settings.admin_name || "",
        email: settings.admin_email || "",
        phone: settings.admin_phone || "",
      })
      setEmailNotifications(settings.email_notifications === "true")
      setSystemAlerts(settings.system_alerts === "true")
      setAutoBackup(settings.auto_backup === "true")
    }
  }, [settings])

  // Mutations
  const { mutate: saveGeneral, loading: savingGeneral } = useMutation(
    settingService.updateGeneral,
    {
      onSuccess: function () {
        showSuccess("Lưu cài đặt chung thành công")
      },
      onError: function (err) {
        showError(err.message)
      },
    }
  )

  const { mutate: saveProfile, loading: savingProfile } = useMutation(
    settingService.updateProfile,
    {
      onSuccess: function () {
        showSuccess("Lưu thông tin tài khoản thành công")
      },
      onError: function (err) {
        showError(err.message)
      },
    }
  )

  const { mutate: saveNotifications, loading: savingNotif } = useMutation(
    settingService.updateNotifications,
    {
      onSuccess: function () {
        showSuccess("Lưu cài đặt thông báo thành công")
      },
      onError: function (err) {
        showError(err.message)
      },
    }
  )

  const { mutate: doBackup, loading: backingUp } = useMutation(
    settingService.backupDatabase,
    {
      onSuccess: function () {
        showSuccess("Sao lưu database thành công")
      },
      onError: function (err) {
        showError(err.message)
      },
    }
  )

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setErrorMsg("")
    setTimeout(function () { setSuccessMsg("") }, 3000)
  }

  function showError(msg) {
    setErrorMsg(msg)
    setTimeout(function () { setErrorMsg("") }, 4000)
  }

  function handleSaveGeneral(e) {
    e.preventDefault()
    saveGeneral(generalForm)
  }

  function handleSaveProfile(e) {
    e.preventDefault()
    saveProfile(profileForm)
  }

  function handleSaveNotifications() {
    saveNotifications({
      email_notifications: emailNotifications,
      system_alerts: systemAlerts,
      auto_backup: autoBackup,
    })
  }

  return (
    <div className="dashboard-content">
      <Header title="Cài đặt hệ thống" />

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

        {/* System Status Cards */}
        <div className="summary-grid" style={{ marginBottom: "24px" }}>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success"><Server size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statusLoading ? "..." : (systemStatus && systemStatus.uptime) || "—"}
            </div>
            <div className="summary-item-label">Uptime</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info"><HardDrive size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statusLoading ? "..." : (systemStatus && systemStatus.storage) || "—"}
            </div>
            <div className="summary-item-label">Dung lượng</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning"><Users size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statusLoading ? "..." : (systemStatus && systemStatus.activeUsers) || 0}
            </div>
            <div className="summary-item-label">Người dùng hoạt động</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success"><CheckCircle size={20} /></div>
            </div>
            <div className="summary-item-value">
              {statusLoading ? "..." : (systemStatus && systemStatus.version) || "—"}
            </div>
            <div className="summary-item-label">Phiên bản</div>
          </div>
        </div>

        <div className="settings-grid">
          {/* Sidebar */}
          <div className="settings-sidebar" style={{ padding: "16px" }}>
            <p style={{
              fontSize: "11px", fontWeight: 700,
              color: "var(--muted-foreground)", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: "12px",
            }}>
              Quản lý cài đặt
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: Settings, label: "Cài đặt chung", sub: "Ngôn ngữ, múi giờ", href: "#general", color: "#b91c1c", active: true },
                { icon: User, label: "Tài khoản", sub: "Thông tin cá nhân", href: "#account", color: "#2563eb" },
                { icon: Bell, label: "Thông báo", sub: "Email, cảnh báo", href: "#notifications", color: "#f59e0b" },
                { icon: Shield, label: "Bảo mật", sub: "Mật khẩu, 2FA", href: "#security", color: "#16a34a" },
                { icon: Database, label: "Cơ sở dữ liệu", sub: "Sao lưu, tối ưu", href: "#database", color: "#8b5cf6" },
              ].map(function (item, idx) {
                var IconComp = item.icon
                return (
                  <a
                    key={idx}
                    href={item.href}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", borderRadius: "12px",
                      background: item.active
                        ? "linear-gradient(135deg, rgba(185,28,28,0.1) 0%, rgba(185,28,28,0.05) 100%)"
                        : "var(--card)",
                      border: item.active
                        ? "1px solid rgba(185,28,28,0.2)"
                        : "1px solid var(--border)",
                      textDecoration: "none", color: "inherit",
                    }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: "rgba(" + (item.color === "#b91c1c" ? "185,28,28" : item.color === "#2563eb" ? "37,99,235" : item.color === "#f59e0b" ? "245,158,11" : item.color === "#16a34a" ? "22,163,74" : "139,92,246") + ",0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconComp size={20} style={{ color: item.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                        {item.sub}
                      </p>
                    </div>
                  </a>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="settings-content">
            {/* General Settings */}
            <div className="card" id="general">
              <div className="card-header">
                <h2 className="card-title"><Globe size={20} /> Cài đặt chung</h2>
              </div>
              <div className="card-content">
                {settingsLoading ? (
                  <div style={{ color: "var(--muted-foreground)", padding: "1rem" }}>Đang tải...</div>
                ) : (
                  <form onSubmit={handleSaveGeneral} className="settings-form">
                    <div className="form-group">
                      <label className="form-label">Tên hệ thống</label>
                      <input
                        type="text"
                        className="form-input"
                        value={generalForm.system_name}
                        onChange={function (e) {
                          setGeneralForm(function (prev) {
                            return Object.assign({}, prev, { system_name: e.target.value })
                          })
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Học kỳ hiện tại</label>
                      <input
                        type="text"
                        className="form-input"
                        value={generalForm.current_semester}
                        onChange={function (e) {
                          setGeneralForm(function (prev) {
                            return Object.assign({}, prev, { current_semester: e.target.value })
                          })
                        }}
                        placeholder="VD: HK2 (2024-2025)"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Ngôn ngữ</label>
                        <select
                          className="form-select"
                          value={generalForm.language}
                          onChange={function (e) {
                            setGeneralForm(function (prev) {
                              return Object.assign({}, prev, { language: e.target.value })
                            })
                          }}
                        >
                          <option value="vi">Tiếng Việt</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Múi giờ</label>
                        <select
                          className="form-select"
                          value={generalForm.timezone}
                          onChange={function (e) {
                            setGeneralForm(function (prev) {
                              return Object.assign({}, prev, { timezone: e.target.value })
                            })
                          }}
                        >
                          <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={savingGeneral}
                      >
                        <Save size={16} />
                        {savingGeneral ? "Đang lưu..." : "Lưu cài đặt"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="card" id="account">
              <div className="card-header">
                <h2 className="card-title"><User size={20} /> Thông tin tài khoản</h2>
              </div>
              <div className="card-content">
                {settingsLoading ? (
                  <div style={{ color: "var(--muted-foreground)", padding: "1rem" }}>Đang tải...</div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="settings-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Họ và tên</label>
                        <input
                          type="text"
                          className="form-input"
                          value={profileForm.full_name}
                          onChange={function (e) {
                            setProfileForm(function (prev) {
                              return Object.assign({}, prev, { full_name: e.target.value })
                            })
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          value={profileForm.email}
                          onChange={function (e) {
                            setProfileForm(function (prev) {
                              return Object.assign({}, prev, { email: e.target.value })
                            })
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={profileForm.phone}
                        onChange={function (e) {
                          setProfileForm(function (prev) {
                            return Object.assign({}, prev, { phone: e.target.value })
                          })
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={savingProfile}
                      >
                        <Save size={16} />
                        {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="card" id="notifications">
              <div className="card-header">
                <h2 className="card-title"><Bell size={20} /> Thông báo</h2>
              </div>
              <div className="card-content">
                <div style={{ display: "grid", gap: "12px" }}>
                  {[
                    {
                      icon: Bell, label: "Email thông báo",
                      sub: "Nhận thông báo hệ thống qua email",
                      value: emailNotifications,
                      setter: setEmailNotifications,
                      activeColor: "#16a34a",
                    },
                    {
                      icon: AlertTriangle, label: "Cảnh báo hệ thống",
                      sub: "Thông báo khi hệ thống có vấn đề",
                      value: systemAlerts,
                      setter: setSystemAlerts,
                      activeColor: "#f59e0b",
                    },
                    {
                      icon: RefreshCw, label: "Tự động sao lưu",
                      sub: "Sao lưu dữ liệu tự động hàng ngày lúc 02:00",
                      value: autoBackup,
                      setter: setAutoBackup,
                      activeColor: "#2563eb",
                    },
                  ].map(function (toggle, idx) {
                    var IconComp = toggle.icon
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: "16px 20px", borderRadius: "12px",
                          border: toggle.value
                            ? "1px solid rgba(" + (toggle.activeColor === "#16a34a" ? "22,163,74" : toggle.activeColor === "#f59e0b" ? "245,158,11" : "37,99,235") + ",0.3)"
                            : "1px solid var(--border)",
                          background: toggle.value ? "rgba(22,163,74,0.03)" : "var(--card)",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{
                            width: "44px", height: "44px", borderRadius: "10px",
                            background: toggle.value ? "rgba(22,163,74,0.1)" : "var(--accent)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <IconComp size={22} style={{ color: toggle.value ? toggle.activeColor : "var(--muted-foreground)" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                              {toggle.label}
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                              {toggle.sub}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={function () { toggle.setter(!toggle.value) }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                        >
                          {toggle.value
                            ? <ToggleRight size={32} style={{ color: toggle.activeColor }} />
                            : <ToggleLeft size={32} style={{ color: "var(--muted-foreground)" }} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveNotifications}
                    disabled={savingNotif}
                  >
                    <Save size={16} />
                    {savingNotif ? "Đang lưu..." : "Lưu thông báo"}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="card" id="security">
              <div className="card-header">
                <h2 className="card-title"><Shield size={20} /> Bảo mật</h2>
              </div>
              <div className="card-content">
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{
                    padding: "16px 20px", borderRadius: "12px",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "10px",
                        background: "rgba(220,38,38,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Key size={22} style={{ color: "#dc2626" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                          Đổi mật khẩu
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                          Cập nhật mật khẩu đăng nhập
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Đổi mật khẩu</button>
                  </div>

                  <div style={{
                    padding: "16px 20px", borderRadius: "12px",
                    border: twoFactorEnabled ? "1px solid rgba(22,163,74,0.3)" : "1px solid var(--border)",
                    background: twoFactorEnabled ? "rgba(22,163,74,0.03)" : "var(--card)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "10px",
                        background: twoFactorEnabled ? "rgba(22,163,74,0.1)" : "rgba(37,99,235,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Lock size={22} style={{ color: twoFactorEnabled ? "#16a34a" : "#2563eb" }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "2px" }}>
                          Xác thực 2 lớp (2FA)
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>
                          Thêm bảo mật với xác thực 2 yếu tố
                        </p>
                      </div>
                    </div>
                    <button
                      className={"btn btn-sm " + (twoFactorEnabled ? "btn-success" : "btn-primary")}
                      onClick={function () { setTwoFactorEnabled(!twoFactorEnabled) }}
                    >
                      {twoFactorEnabled ? "Đã bật" : "Kích hoạt"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Settings */}
            <div className="card" id="database">
              <div className="card-header">
                <h2 className="card-title"><Database size={20} /> Cơ sở dữ liệu</h2>
              </div>
              <div className="card-content">
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px", marginBottom: "20px",
                }}>
                  <div style={{
                    padding: "20px", borderRadius: "12px",
                    background: "rgba(37,99,235,0.05)",
                    border: "1px solid rgba(37,99,235,0.2)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <HardDrive size={18} style={{ color: "#2563eb" }} />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 600 }}>
                        Dung lượng
                      </span>
                    </div>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#2563eb" }}>
                      {statusLoading ? "..." : (systemStatus && systemStatus.storage) || "—"}
                    </p>
                  </div>

                  <div style={{
                    padding: "20px", borderRadius: "12px",
                    background: "rgba(22,163,74,0.05)",
                    border: "1px solid rgba(22,163,74,0.2)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <Clock size={18} style={{ color: "#16a34a" }} />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 600 }}>
                        Sao lưu
                      </span>
                    </div>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#16a34a" }}>
                      {settings && settings.last_backup
                        ? new Date(settings.last_backup).toLocaleDateString("vi-VN")
                        : "—"}
                    </p>
                  </div>

                  <div style={{
                    padding: "20px", borderRadius: "12px",
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <Zap size={18} style={{ color: "#8b5cf6" }} />
                      <span style={{ fontSize: "11px", color: "var(--muted-foreground)", textTransform: "uppercase", fontWeight: 600 }}>
                        Hiệu suất
                      </span>
                    </div>
                    <p style={{ fontSize: "22px", fontWeight: 700, color: "#8b5cf6" }}>
                      {statusLoading ? "..." : (systemStatus && systemStatus.uptime) || "—"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={function () { doBackup() }}
                    disabled={backingUp}
                  >
                    <Download size={16} />
                    {backingUp ? "Đang sao lưu..." : "Sao lưu ngay"}
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Upload size={16} /> Khôi phục
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <RefreshCw size={16} /> Tối ưu hóa
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Eye size={16} /> Xem nhật ký
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
