"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, LockKeyhole } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/student")
      }
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(username, password)
      if (!result.success) {
        setError(result.message)
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-form-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      {/* Left Banner */}
      <div className="login-branding">
        <div className="login-branding-content">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-text">PTIT</div>
            <div className="login-logo-subtitle">
              <span>Học viện Công nghệ Bưu chính Viễn thông</span>
              <span>Posts & Telecommunications Institute of Technology</span>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <div className="login-badge">
              <span className="login-badge-dot"></span>
              HỆ THỐNG QUẢN LÝ THÔNG TIN SINH VIÊN
            </div>
            
            <h1 className="login-title">
              Cổng thông tin<br />học vụ
            </h1>
            
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
        </div>

        {/* Footer */}
        <div className="login-branding-footer">
          © 2025 Học viện Công nghệ Bưu chính Viễn thông — ptit.edu.vn
        </div>
      </div>

      {/* Right Form */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <h2 className="login-form-title">Đăng nhập</h2>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Username */}
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

            {/* Password */}
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

            {/* Options Row */}
            <div className="form-options">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="form-link">Quên mật khẩu?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-loading">
                  <span className="spinner"></span>
                  Đang đăng nhập...
                </span>
              ) : (
                <>
                  Đăng nhập hệ thống
                  <ArrowRight />
                </>
              )}
            </button>

            {/* Security Info */}
            <div className="login-security">
              <span className="login-security-item">
                <Shield />
                Kết nối bảo mật SSL
              </span>
              <span className="login-security-divider">•</span>
              <span className="login-security-item">
                <LockKeyhole />
                Dữ liệu mã hoá
              </span>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="demo-accounts">
            <p className="demo-accounts-title">Tài khoản demo</p>
            <div className="demo-accounts-list">
              <p className="demo-account">
                <span className="demo-account-role">Admin:</span> admin / admin123
              </p>
              <p className="demo-account">
                <span className="demo-account-role">Sinh viên:</span> B21DCCN001 / 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
