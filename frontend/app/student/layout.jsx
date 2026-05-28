"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export default function StudentLayout({ children }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "student")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          width: '100%'
        }}>
          <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}></div>
        </div>
      </div>
    )
  }

  // Don't render if not student
  if (!user || user.role !== "student") {
    return null
  }

  return (
    <div className="dashboard-layout">
      <SidebarNav role="student" />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}
