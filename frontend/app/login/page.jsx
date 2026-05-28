"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, ShieldCheck } from "lucide-react"
import "@/styles/login.css"

// Demo accounts
const users = {
  admin: { password: "admin123", role: "admin", name: "Admin PTIT" },
  "B21DCCN001": { password: "123456", role: "student", name: "Nguyễn Văn A" },
  "B21DCCN002": { password: "123456", role: "student", name: "Trần Thị B" },
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const user = users[username]
    
    if (!user) {
      setError("Tài khoản không tồn tại")
      setLoading(false)
      return
    }

    if (user.password !== password) {
      setError("Mật khẩu không chính xác")
      setLoading(false)
      return
    }

    // Store user info in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify({
        username,
        role: user.role,
        name: user.name
      }))
    }

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/student")
    }
  }

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-branding">
        <div className="login-branding-content">
          {/* Logo */}
          <div className="login-logo">
            <span className="login-logo-text">PTIT</span>
            <div className="login-logo-subtitle">
              <span>Học viện Công nghệ Bưu chính Viễn thông</span>
              <span>Posts & Telecommunications Institute of Technology</span>
            </div>
          </div>

          {/* Badge */}
          <div className="login-badge">
            <span className="login-badge-dot"></span>
            Hệ thống quản lý thông tin sinh viên
          </div>

          {/* Main Title */}
          <h1 className="login-title">Cổng thông tin học vụ</h1>
          
          <p className="login-description">
            Nền tảng quản lý học vụ tập trung dành cho sinh viên, giảng viên và cán bộ quản lý của Học viện Công nghệ Bưu chính Viễn thông.
          </p>

          {/* Stats */}
          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-value">15,000+</span>
              <span className="login-stat-label">Sinh viên</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">800+</span>
              <span className="login-stat-label">Giảng viên</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">420+</span>
              <span className="login-stat-label">Môn học</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-branding-footer">
          <p>© 2025 Học viện Công nghệ Bưu chính Viễn thông — ptit.edu.vn</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <h2 className="login-form-title">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nhập tên đăng nhập..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <div className="form-input-wrapper">
                <Lock className="form-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="form-link">Quên mật khẩu?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-loading">Đang đăng nhập...</span>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight />
                </>
              )}
            </button>

            {/* Security Info */}
            <div className="login-security">
              <div className="login-security-item">
                <Shield />
                <span>Kết nối bảo mật SSL</span>
              </div>
              <span className="login-security-divider">•</span>
              <div className="login-security-item">
                <ShieldCheck />
                <span>Dữ liệu mã hoá</span>
              </div>
            </div>
          </form>

          {/* Demo Accounts Info */}
          <div className="demo-accounts">
            <p className="demo-accounts-title">Tài khoản demo:</p>
            <div className="demo-accounts-list">
              <div className="demo-account">
                <span className="demo-account-role">Admin:</span>
                <span>admin / admin123</span>
              </div>
              <div className="demo-account">
                <span className="demo-account-role">Sinh viên:</span>
                <span>B21DCCN001 / 123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
