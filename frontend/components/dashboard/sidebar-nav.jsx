"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  Bell,
  GraduationCap,
  ClipboardList,
  BarChart3,
  CreditCard,
  User,
  LogOut
} from "lucide-react"

const adminNavItems = [
  { title: "Tổng quan", href: "/admin", icon: Home },
  { title: "Quản lý sinh viên", href: "/admin/students", icon: Users },
  { title: "Quản lý giảng viên", href: "/admin/teachers", icon: GraduationCap },
  { title: "Quản lý môn học", href: "/admin/courses", icon: BookOpen },
  { title: "Quản lý lớp học", href: "/admin/classes", icon: ClipboardList },
  { title: "Thời khóa biểu", href: "/admin/schedule", icon: Calendar },
  { title: "Điểm số", href: "/admin/grades", icon: FileText },
  { title: "Báo cáo thống kê", href: "/admin/reports", icon: BarChart3 },
  { title: "Cài đặt", href: "/admin/settings", icon: Settings },
]

const studentNavItems = [
  { title: "Tổng quan", href: "/student", icon: Home },
  { title: "Thông tin cá nhân", href: "/student/profile", icon: User },
  { title: "Đăng ký môn học", href: "/student/registration", icon: BookOpen },
  { title: "Thời khóa biểu", href: "/student/schedule", icon: Calendar },
  { title: "Kết quả học tập", href: "/student/grades", icon: FileText },
  { title: "Học phí", href: "/student/tuition", icon: CreditCard },
  { title: "Thông báo", href: "/student/notifications", icon: Bell },
]

export function SidebarNav({ role }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const navItems = role === "admin" ? adminNavItems : studentNavItems
  
  const userInfo = user 
    ? { 
        name: user.name, 
        email: user.email || (role === "admin" ? "admin@ptit.edu.vn" : `${user.studentId?.toLowerCase()}@ptit.edu.vn`),
        avatar: user.name.split(" ").pop()?.charAt(0).toUpperCase() || "U"
      }
    : role === "admin" 
      ? { name: "Admin PTIT", email: "admin@ptit.edu.vn", avatar: "AD" }
      : { name: "Nguyễn Văn A", email: "b21dccn001@ptit.edu.vn", avatar: "NA" }

  const handleLogout = () => {
    logout()
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">PTIT</div>
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">PTIT</span>
          <span className="sidebar-brand-desc">Hệ thống quản lý</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {item.title}
            </Link>
          )
        })}
        
        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="sidebar-nav-item"
          style={{ marginTop: 'auto', border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut />
          Đăng xuất
        </button>
      </nav>

      {/* User section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{userInfo.avatar}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userInfo.name}</span>
            <span className="sidebar-user-email">{userInfo.email}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
