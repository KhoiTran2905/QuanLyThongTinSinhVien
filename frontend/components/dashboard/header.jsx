"use client"

import { Menu } from "lucide-react"

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

      </div>
    </header>
  )
}
