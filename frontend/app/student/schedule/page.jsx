"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  GraduationCap,
  Download,
  Printer
} from "lucide-react"

const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]
const timeSlots = [
  { id: 1, label: "Tiết 1-3", time: "7:00 - 9:30" },
  { id: 2, label: "Tiết 4-6", time: "9:45 - 12:15" },
  { id: 3, label: "Tiết 7-9", time: "13:30 - 16:00" },
  { id: 4, label: "Tiết 10-12", time: "16:15 - 18:45" },
]

const scheduleData = {
  "Thứ 2": [
    { slot: 1, subject: "Phát triển ứng dụng Web", room: "A2-301", teacher: "TS. Nguyễn Văn Hùng", type: "Lý thuyết", color: "red" },
    { slot: 3, subject: "Điện toán đám mây", room: "A3-201", teacher: "ThS. Vũ Văn Tùng", type: "Thực hành", color: "blue" },
  ],
  "Thứ 3": [
    { slot: 2, subject: "Cơ sở dữ liệu nâng cao", room: "A3-402", teacher: "ThS. Trần Thị Mai", type: "Thực hành", color: "green" },
  ],
  "Thứ 4": [
    { slot: 3, subject: "Trí tuệ nhân tạo", room: "A1-201", teacher: "PGS.TS. Lê Hoàng Nam", type: "Lý thuyết", color: "purple" },
  ],
  "Thứ 5": [
    { slot: 1, subject: "Học máy", room: "A2-302", teacher: "TS. Phạm Thị Hà", type: "Lý thuyết", color: "orange" },
    { slot: 4, subject: "An toàn bảo mật", room: "A1-301", teacher: "TS. Nguyễn Minh Đức", type: "Lý thuyết", color: "teal" },
  ],
  "Thứ 6": [
    { slot: 2, subject: "Phát triển ứng dụng Web", room: "A4-Lab2", teacher: "TS. Nguyễn Văn Hùng", type: "Thực hành", color: "red" },
  ],
  "Thứ 7": [],
  "CN": [],
}

const currentWeekDates = [
  { day: "Thứ 2", date: "20/01" },
  { day: "Thứ 3", date: "21/01" },
  { day: "Thứ 4", date: "22/01" },
  { day: "Thứ 5", date: "23/01" },
  { day: "Thứ 6", date: "24/01" },
  { day: "Thứ 7", date: "25/01" },
  { day: "CN", date: "26/01" },
]

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState("20/01 - 26/01/2025")

  return (
    <div className="dashboard-content">
      <Header title="Thời khóa biểu" />
      
      <div className="dashboard-body">
        {/* Header Controls */}
        <div className="schedule-controls">
          <div className="schedule-nav">
            <button className="btn btn-outline btn-icon">
              <ChevronLeft />
            </button>
            <div className="schedule-week">
              <Calendar className="schedule-week-icon" />
              <span>Tuần: {currentWeek}</span>
            </div>
            <button className="btn btn-outline btn-icon">
              <ChevronRight />
            </button>
          </div>
          <div className="schedule-actions">
            <button className="btn btn-outline btn-sm">
              <Download /> Tải xuống
            </button>
            <button className="btn btn-outline btn-sm">
              <Printer /> In lịch
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="card">
          <div className="card-content" style={{ padding: 0 }}>
            <div className="schedule-table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="schedule-time-header">Ca học</th>
                    {currentWeekDates.map((item) => (
                      <th key={item.day} className="schedule-day-header">
                        <span className="schedule-day-name">{item.day}</span>
                        <span className="schedule-day-date">{item.date}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.id}>
                      <td className="schedule-time-cell">
                        <span className="schedule-time-label">{slot.label}</span>
                        <span className="schedule-time-range">{slot.time}</span>
                      </td>
                      {weekDays.map((day) => {
                        const classItem = scheduleData[day]?.find(c => c.slot === slot.id)
                        return (
                          <td key={day} className="schedule-cell">
                            {classItem && (
                              <div className={`schedule-class schedule-class-${classItem.color}`}>
                                <span className="schedule-class-name">{classItem.subject}</span>
                                <span className="schedule-class-info">
                                  <MapPin /> {classItem.room}
                                </span>
                                <span className="schedule-class-info">
                                  <GraduationCap /> {classItem.teacher}
                                </span>
                                <span className={`schedule-class-type ${classItem.type === "Thực hành" ? "practice" : "theory"}`}>
                                  {classItem.type}
                                </span>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="schedule-legend">
          <div className="legend-title">Chú thích:</div>
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

        {/* Summary */}
        <div className="schedule-summary-grid">
          <div className="summary-card">
            <div className="summary-card-icon red">
              <Calendar />
            </div>
            <div>
              <p className="summary-card-value">6</p>
              <p className="summary-card-label">Môn học</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-icon blue">
              <Clock />
            </div>
            <div>
              <p className="summary-card-value">18</p>
              <p className="summary-card-label">Tín chỉ</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-icon green">
              <GraduationCap />
            </div>
            <div>
              <p className="summary-card-value">8</p>
              <p className="summary-card-label">Buổi học/tuần</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
