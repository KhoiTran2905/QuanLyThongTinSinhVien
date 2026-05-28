"use client"

import { Header } from "@/components/dashboard/header"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Clock,
  MapPin,
  Users
} from "lucide-react"

const scheduleData = [
  { time: "Tiết 1-3", timeRange: "7:00 - 9:35", days: [
    { class: "INT1340 - Lập trình Java", room: "D5-301", teacher: "Nguyễn Văn Minh", type: "theory" },
    null,
    { class: "INT1341 - Cơ sở dữ liệu", room: "D5-302", teacher: "Trần Thị Hương", type: "theory" },
    null,
    { class: "INT1340 - Lập trình Java", room: "LAB-A1", teacher: "Nguyễn Văn Minh", type: "practice" },
    null
  ]},
  { time: "Tiết 4-6", timeRange: "9:45 - 12:20", days: [
    null,
    { class: "INT1342 - Mạng máy tính", room: "D5-401", teacher: "Lê Hoàng Nam", type: "theory" },
    null,
    { class: "INT1343 - Trí tuệ nhân tạo", room: "D5-501", teacher: "Hoàng Thị Lan", type: "theory" },
    null,
    { class: "INT1341 - Cơ sở dữ liệu", room: "LAB-B2", teacher: "Trần Thị Hương", type: "practice" }
  ]},
  { time: "Tiết 7-9", timeRange: "12:30 - 15:05", days: [
    { class: "TEL2201 - Xử lý tín hiệu", room: "D3-201", teacher: "Phạm Văn Đức", type: "theory" },
    null,
    { class: "SEC3101 - An ninh mạng", room: "D4-101", teacher: "Ngô Văn Hải", type: "theory" },
    null,
    null,
    null
  ]},
  { time: "Tiết 10-12", timeRange: "15:15 - 17:50", days: [
    null,
    { class: "INT1342 - Mạng máy tính", room: "LAB-C1", teacher: "Lê Hoàng Nam", type: "practice" },
    null,
    { class: "INT1343 - Trí tuệ nhân tạo", room: "LAB-D2", teacher: "Hoàng Thị Lan", type: "practice" },
    null,
    null
  ]}
]

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

export default function AdminSchedulePage() {
  return (
    <div className="dashboard-content">
      <Header title="Thời khóa biểu" />
      
      <div className="dashboard-body">
        {/* Controls */}
        <div className="card">
          <div className="card-content">
            <div className="schedule-controls">
              <div className="schedule-nav">
                <button className="btn btn-outline btn-sm btn-icon">
                  <ChevronLeft />
                </button>
                <div className="schedule-week">
                  <Calendar className="schedule-week-icon" />
                  <span>Tuần 12: 20/01 - 25/01/2025</span>
                </div>
                <button className="btn btn-outline btn-sm btn-icon">
                  <ChevronRight />
                </button>
              </div>
              <div className="schedule-actions">
                <select className="filter-select">
                  <option value="all">Tất cả lớp</option>
                  <option value="d21cqcn01">D21CQCN01-B</option>
                  <option value="d21cqcn02">D21CQCN02-B</option>
                  <option value="d21cqat01">D21CQAT01-B</option>
                </select>
                <button className="btn btn-outline btn-sm">
                  <Download />
                  Xuất TKB
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus />
                  Thêm lịch học
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="card">
          <div className="card-content">
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="schedule-time-header">Thời gian</th>
                    {days.map((day, index) => (
                      <th key={index} className="schedule-day-header">
                        <span className="schedule-day-name">{day}</span>
                        <span className="schedule-day-date">{20 + index}/01</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="schedule-time-cell">
                        <span className="schedule-time-label">{row.time}</span>
                        <span className="schedule-time-range">{row.timeRange}</span>
                      </td>
                      {row.days.map((cell, cellIndex) => (
                        <td key={cellIndex} className="schedule-cell">
                          {cell && (
                            <div className={`schedule-class schedule-class-${
                              cellIndex === 0 ? 'red' : 
                              cellIndex === 1 ? 'blue' : 
                              cellIndex === 2 ? 'green' : 
                              cellIndex === 3 ? 'purple' : 
                              cellIndex === 4 ? 'orange' : 'teal'
                            }`}>
                              <span className="schedule-class-name">{cell.class.split(' - ')[1]}</span>
                              <span className="schedule-class-info">
                                <MapPin /> {cell.room}
                              </span>
                              <span className="schedule-class-info">
                                <Users /> {cell.teacher}
                              </span>
                              <span className={`schedule-class-type ${cell.type}`}>
                                {cell.type === 'theory' ? 'Lý thuyết' : 'Thực hành'}
                              </span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Legend and Summary */}
        <div className="schedule-footer-grid">
          <div className="schedule-legend">
            <span className="legend-title">Chú thích:</span>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot theory"></span>
                <span>Lý thuyết</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot practice"></span>
                <span>Thực hành</span>
              </div>
            </div>
          </div>
          <div className="schedule-summary-grid">
            <div className="summary-card">
              <div className="summary-card-icon red">
                <Clock />
              </div>
              <div>
                <p className="summary-card-value">156</p>
                <p className="summary-card-label">Lớp học tuần này</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-card-icon blue">
                <Users />
              </div>
              <div>
                <p className="summary-card-value">82</p>
                <p className="summary-card-label">Giảng viên</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-card-icon green">
                <MapPin />
              </div>
              <div>
                <p className="summary-card-value">45</p>
                <p className="summary-card-label">Phòng học</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
