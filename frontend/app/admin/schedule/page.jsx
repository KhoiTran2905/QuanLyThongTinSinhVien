
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { adminScheduleService } from "@/lib/services/adminService"
import {
  Calendar, ChevronLeft, ChevronRight,
  Clock, MapPin, GraduationCap, Plus,
  Download, Printer, Search, Trash2
} from "lucide-react"

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]

const TIME_SLOTS = [
  { id: 1, label: "Tiết 1-3", time: "7:00 - 9:30" },
  { id: 2, label: "Tiết 4-6", time: "9:45 - 12:15" },
  { id: 3, label: "Tiết 7-9", time: "13:30 - 16:00" },
  { id: 4, label: "Tiết 10-12", time: "16:15 - 18:45" },
]

const SLOT_COLORS = [
  "red", "blue", "green", "purple",
  "orange", "teal", "red", "blue",
]

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

  var label =
    monday.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) +
    " - " +
    sunday.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

  return {
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
    weekDates,
    label,
  }
}

function getSlotIndex(periodStart) {
  if (periodStart <= 3) return 1
  if (periodStart <= 6) return 2
  if (periodStart <= 9) return 3
  return 4
}

export default function AdminSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [classFilter, setClassFilter] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)

  var weekInfo = getWeekInfo(weekOffset)

  var queryParams = {
    week_start: weekInfo.weekStart,
    week_end: weekInfo.weekEnd,
  }
  if (classFilter) {
    queryParams.class_id = classFilter
  }

  const { data: schedules, loading, error, refetch } = useApi(
    function () {
      return adminScheduleService.getAll(queryParams)
    },
    [weekOffset, classFilter],
    { defaultData: [] }
  )

  const { data: stats, loading: statsLoading } = useApi(
    adminScheduleService.getStats,
    [],
    { defaultData: {} }
  )

  const { mutate: deleteSchedule, loading: deleting } = useMutation(
    adminScheduleService.delete,
    {
      onSuccess: function () {
        setSuccessMsg("Xóa lịch học thành công")
        setConfirmDelete(null)
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi xóa lịch học")
        setConfirmDelete(null)
        setTimeout(function () { setErrorMsg("") }, 3000)
      },
    }
  )

  var scheduleList = Array.isArray(schedules) ? schedules : []

  // Build schedule grid: { "Thứ 2": { 1: [...], 2: [...] } }
  var scheduleGrid = {}
  DAYS.forEach(function (day) {
    scheduleGrid[day] = {}
    TIME_SLOTS.forEach(function (slot) {
      scheduleGrid[day][slot.id] = []
    })
  })

  scheduleList.forEach(function (item, idx) {
    var day = item.day_of_week
    var slotId = getSlotIndex(item.period_start)
    if (scheduleGrid[day] && scheduleGrid[day][slotId] !== undefined) {
      scheduleGrid[day][slotId].push(
        Object.assign({}, item, {
          colorIndex: idx % SLOT_COLORS.length,
        })
      )
    }
  })

  return (
    <div className="dashboard-content">
      <Header title="Thời khóa biểu" />

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

        {/* Stats */}
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon primary">
                <Calendar size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.classesThisWeek) || 0}
            </div>
            <div className="summary-item-label">Lịch tuần này</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon success">
                <GraduationCap size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.instructors) || 0}
            </div>
            <div className="summary-item-label">Giảng viên</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon warning">
                <MapPin size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {statsLoading ? "..." : (stats && stats.rooms) || 0}
            </div>
            <div className="summary-item-label">Phòng học</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-header">
              <div className="summary-item-icon info">
                <Clock size={20} />
              </div>
            </div>
            <div className="summary-item-value">
              {loading ? "..." : scheduleList.length}
            </div>
            <div className="summary-item-label">Lịch tuần này (filter)</div>
          </div>
        </div>

        {/* Controls */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-content">
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
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
              </div>
              <div className="admin-toolbar-right">
                <button className="btn btn-outline btn-sm">
                  <Download /> Xuất
                </button>
                <button className="btn btn-outline btn-sm">
                  <Printer /> In
                </button>
                <button className="btn btn-primary btn-sm">
                  <Plus /> Thêm lịch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="card" style={{ marginTop: "16px" }}>
          <div className="card-content" style={{ padding: 0 }}>
            {error && (
              <div style={{ padding: "1rem", color: "#dc2626" }}>
                Lỗi: {error}
              </div>
            )}
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Đang tải...
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
                            var items = scheduleGrid[day][slot.id] || []
                            return (
                              <td key={day} className="schedule-cell">
                                {items.map(function (item) {
                                  var colorClass = "schedule-class-" + SLOT_COLORS[item.colorIndex]
                                  return (
                                    <div
                                      key={item.id}
                                      className={"schedule-class " + colorClass}
                                      style={{ position: "relative", marginBottom: items.length > 1 ? "4px" : 0 }}
                                    >
                                      <span className="schedule-class-name">
                                        {item.course_name}
                                      </span>
                                      <span className="schedule-class-info">
                                        <MapPin size={10} />
                                        {item.room}
                                      </span>
                                      <span className="schedule-class-info">
                                        <GraduationCap size={10} />
                                        {item.instructor_name}
                                      </span>
                                      {item.class_code && (
                                        <span className="schedule-class-info">
                                          <Calendar size={10} />
                                          {item.class_code}
                                        </span>
                                      )}
                                      <span
                                        className={"schedule-class-type " + (item.type === "Thực hành" ? "practice" : "theory")}
                                      >
                                        {item.type}
                                      </span>
                                      <button
                                        onClick={function () { setConfirmDelete(item) }}
                                        style={{
                                          position: "absolute", top: "4px", right: "4px",
                                          background: "none", border: "none",
                                          cursor: "pointer", padding: "2px",
                                          opacity: 0.6,
                                        }}
                                        title="Xóa lịch"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  )
                                })}
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
          <div style={{ marginLeft: "auto", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Tuần {weekInfo.weekStart} — {weekInfo.weekEnd}
          </div>
        </div>

        {/* List View */}
        {scheduleList.length > 0 && (
          <div className="chart-card" style={{ marginTop: "24px" }}>
            <div className="chart-card-header">
              <h3 className="chart-card-title">
                <Calendar /> Danh sách lịch học tuần này
              </h3>
              <span className="badge badge-primary">
                {scheduleList.length} lịch
              </span>
            </div>
            <div style={{ padding: 0 }}>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Môn học</th>
                      <th>Lớp</th>
                      <th>Giảng viên</th>
                      <th>Thứ</th>
                      <th>Tiết</th>
                      <th>Phòng</th>
                      <th>Loại</th>
                      <th style={{ width: "80px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleList.map(function (item) {
                      return (
                        <tr key={item.id}>
                          <td>
                            <p style={{ fontWeight: 500 }}>{item.course_name}</p>
                            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
                              {item.course_code}
                            </p>
                          </td>
                          <td>{item.class_code || "—"}</td>
                          <td>{item.instructor_name}</td>
                          <td>{item.day_of_week}</td>
                          <td>
                            {item.period_start} - {item.period_end}
                          </td>
                          <td>{item.room}</td>
                          <td>
                            <span
                              className={"badge " + (item.type === "Thực hành" ? "badge-success" : "badge-info")}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-ghost btn-icon btn-sm text-danger"
                                onClick={function () { setConfirmDelete(item) }}
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete */}
        {confirmDelete && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 100,
          }}>
            <div style={{
              background: "var(--card)", borderRadius: "0.75rem",
              padding: "2rem", maxWidth: "400px", width: "90%",
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                Xác nhận xóa
              </h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
                Bạn có chắc muốn xóa lịch học{" "}
                <strong>{confirmDelete.course_name}</strong> vào{" "}
                {confirmDelete.day_of_week}, tiết{" "}
                {confirmDelete.period_start}-{confirmDelete.period_end}?
              </p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  className="btn btn-outline"
                  onClick={function () { setConfirmDelete(null) }}
                  disabled={deleting}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: "#dc2626" }}
                  onClick={function () { deleteSchedule(confirmDelete.id) }}
                  disabled={deleting}
                >
                  {deleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
