
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi } from "@/hooks/use-api"
import { scheduleService } from "@/lib/services/studentService"
import {
  Calendar, ChevronLeft, ChevronRight,
  Clock, MapPin, GraduationCap,
  Download, Printer
} from "lucide-react"

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]

const TIME_SLOTS = [
  { id: 1, label: "Tiết 1-3", time: "7:00 - 9:30" },
  { id: 2, label: "Tiết 4-6", time: "9:45 - 12:15" },
  { id: 3, label: "Tiết 7-9", time: "13:30 - 16:00" },
  { id: 4, label: "Tiết 10-12", time: "16:15 - 18:45" },
]

const COLORS = ["red", "blue", "green", "purple", "orange", "teal"]

function getWeekInfo(offsetWeeks) {
  var now = new Date()
  var day = now.getDay()
  var diff = day === 0 ? -6 : 1 - day
  var monday = new Date(now)
  monday.setDate(now.getDate() + diff + offsetWeeks * 7)
  var sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  var weekDates = []
  for (var i = 0; i < 7; i++) {
    var d = new Date(monday)
    d.setDate(monday.getDate() + i)
    weekDates.push({
      day: DAYS[i],
      date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      fullDate: d.toISOString().split("T")[0],
    })
  }

  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
    weekDates,
    label:
      monday.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) +
      " - " +
      sunday.toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
      }),
  }
}

function getSlotIndex(periodStart) {
  if (periodStart <= 3) return 1
  if (periodStart <= 6) return 2
  if (periodStart <= 9) return 3
  return 4
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)

  var weekInfo = getWeekInfo(weekOffset)

  const { data: scheduleData, loading, error } = useApi(
    function () {
      return scheduleService.getSchedule({
        week_start: weekInfo.weekStart,
        week_end: weekInfo.weekEnd,
      })
    },
    [weekOffset],
    { defaultData: { schedules: [] } }
  )

  const { data: stats, loading: statsLoading } = useApi(
    scheduleService.getStats,
    [],
    { defaultData: {} }
  )

  var scheduleList = scheduleData && Array.isArray(scheduleData.schedules)
    ? scheduleData.schedules
    : []

  // Build course color map for consistency
  var courseColorMap = {}
  var colorIdx = 0
  scheduleList.forEach(function (item) {
    if (!courseColorMap[item.course_id]) {
      courseColorMap[item.course_id] = COLORS[colorIdx % COLORS.length]
      colorIdx++
    }
  })

  // Build grid
  var scheduleGrid = {}
  DAYS.forEach(function (day) {
    scheduleGrid[day] = {}
    TIME_SLOTS.forEach(function (slot) {
      scheduleGrid[day][slot.id] = null
    })
  })

  scheduleList.forEach(function (item) {
    var day = item.day_of_week
    var slotId = getSlotIndex(item.period_start)
    if (scheduleGrid[day] && scheduleGrid[day][slotId] === null) {
      scheduleGrid[day][slotId] = item
    }
  })

  var totalCourses = Object.keys(courseColorMap).length
  var totalCredits = (stats && stats.credits) || 0
  var sessionsPerWeek = scheduleList.length

  return (
    <div className="dashboard-content">
      <Header title="Thời khóa biểu" />

      <div className="dashboard-body">
        {/* Controls */}
        <div className="schedule-controls">
          <div className="schedule-nav">
            <button
              className="btn btn-outline btn-icon"
              onClick={function () { setWeekOffset(weekOffset - 1) }}
            >
              <ChevronLeft />
            </button>
            <div className="schedule-week">
              <Calendar className="schedule-week-icon" />
              <span>Tuần: {weekInfo.label}</span>
            </div>
            <button
              className="btn btn-outline btn-icon"
              onClick={function () { setWeekOffset(weekOffset + 1) }}
            >
              <ChevronRight />
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={function () { setWeekOffset(0) }}
            >
              Hôm nay
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
            {error && (
              <div style={{ padding: "1rem", color: "#dc2626" }}>
                Lỗi tải thời khóa biểu: {error}
              </div>
            )}
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Đang tải thời khóa biểu...
              </div>
            ) : (
              <div className="schedule-table-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th className="schedule-time-header">Ca học</th>
                      {weekInfo.weekDates.map(function (item) {
                        return (
                          <th key={item.day} className="schedule-day-header">
                            <span className="schedule-day-name">{item.day}</span>
                            <span className="schedule-day-date">{item.date}</span>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {TIME_SLOTS.map(function (slot) {
                      return (
                        <tr key={slot.id}>
                          <td className="schedule-time-cell">
                            <span className="schedule-time-label">{slot.label}</span>
                            <span className="schedule-time-range">{slot.time}</span>
                          </td>
                          {DAYS.map(function (day) {
                            var classItem = scheduleGrid[day][slot.id]
                            if (!classItem) {
                              return <td key={day} className="schedule-cell" />
                            }
                            var colorClass = "schedule-class-" + (courseColorMap[classItem.course_id] || "red")
                            var typeClass = classItem.type === "Thực hành" ? "practice" : "theory"
                            var startTime = classItem.start_time
                              ? classItem.start_time.slice(0, 5)
                              : ""
                            var endTime = classItem.end_time
                              ? classItem.end_time.slice(0, 5)
                              : ""

                            return (
                              <td key={day} className="schedule-cell">
                                <div className={"schedule-class " + colorClass}>
                                  <span className="schedule-class-name">
                                    {classItem.course_name}
                                  </span>
                                  {startTime && endTime && (
                                    <span className="schedule-class-info">
                                      <Clock size={10} />
                                      {startTime} - {endTime}
                                    </span>
                                  )}
                                  <span className="schedule-class-info">
                                    <MapPin size={10} />
                                    {classItem.room}
                                  </span>
                                  <span className="schedule-class-info">
                                    <GraduationCap size={10} />
                                    {classItem.instructor_name}
                                  </span>
                                  <span className={"schedule-class-type " + typeClass}>
                                    {classItem.type}
                                  </span>
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty state */}
            {!loading && scheduleList.length === 0 && (
              <div style={{
                padding: "3rem", textAlign: "center",
                color: "var(--muted-foreground)",
              }}>
                Không có lịch học trong tuần này
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="schedule-legend">
          <div className="legend-title">Chú thích:</div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot theory" />
              <span>Lý thuyết</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot practice" />
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
              <p className="summary-card-value">
                {statsLoading ? "..." : totalCourses}
              </p>
              <p className="summary-card-label">Môn học</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-icon blue">
              <Clock />
            </div>
            <div>
              <p className="summary-card-value">
                {statsLoading ? "..." : totalCredits || totalCourses * 3}
              </p>
              <p className="summary-card-label">Tín chỉ</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-icon green">
              <GraduationCap />
            </div>
            <div>
              <p className="summary-card-value">
                {loading ? "..." : sessionsPerWeek}
              </p>
              <p className="summary-card-label">Buổi học/tuần</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
