"use client"

import { Bell, Search, Menu } from "lucide-react"

export function Header({ title }) {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="btn btn-ghost btn-icon lg-hidden">
          <Menu />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      
      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <Search className="header-search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="header-search-input"
          />
        </div>

        {/* Notifications */}
        <button className="notification-btn">
          <Bell />
          <span className="notification-badge">3</span>
        </button>
      </div>
    </header>
  )
}
