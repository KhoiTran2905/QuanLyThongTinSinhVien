
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { registrationService } from "@/lib/services/studentService"
import {
  BookOpen, Search, Filter, Plus,
  Trash2, Clock, Users, CheckCircle,
  AlertCircle, Info
} from "lucide-react"

export default function RegistrationPage() {
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const { data: regInfo, loading: infoLoading } = useApi(
    registrationService.getInfo,
    [],
    { defaultData: {} }
  )

  const { data: availableData, loading: availLoading, refetch: refetchAvail } = useApi(
    function () {
      return registrationService.getAvailable(
        searchTerm ? { search: searchTerm } : {}
      )
    },
    [searchTerm],
    { defaultData: [] }
  )

  const {
    data: registeredData,
    loading: regLoading,
    refetch: refetchReg,
  } = useApi(
    registrationService.getRegistered,
    [],
    { defaultData: { courses: [], summary: {} } }
  )

  const { mutate: registerCourse, loading: registering } = useMutation(
    registrationService.register,
    {
      onSuccess: function () {
        setSuccessMsg("Đăng ký môn học thành công")
        refetchReg()
        refetchAvail()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi đăng ký")
        setTimeout(function () { setErrorMsg("") }, 4000)
      },
    }
  )

  const { mutate: cancelCourse, loading: canceling } = useMutation(
    registrationService.cancel,
    {
      onSuccess: function () {
        setSuccessMsg("Hủy đăng ký thành công")
        refetchReg()
        refetchAvail()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi hủy đăng ký")
        setTimeout(function () { setErrorMsg("") }, 4000)
      },
    }
  )

  const { mutate: confirmReg, loading: confirming } = useMutation(
    registrationService.confirm,
    {
      onSuccess: function () {
        setSuccessMsg("Xác nhận đăng ký thành công!")
        refetchReg()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi xác nhận")
        setTimeout(function () { setErrorMsg("") }, 4000)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearchTerm(searchInput)
  }

  var availList = Array.isArray(availableData) ? availableData : []
  var regCourses = registeredData && Array.isArray(registeredData.courses)
    ? registeredData.courses
    : []
  var summary = registeredData && registeredData.summary
    ? registeredData.summary
    : {}

  var totalCredits = summary.totalCredits || 0
  var maxCredits = (regInfo && regInfo.maxCredits) || 24
  var minCredits = (regInfo && regInfo.minCredits) || 14
  var isOpen = regInfo && regInfo.isOpen

  function isRegistered(courseId) {
    return regCourses.some(function (c) { return c.course_id === courseId })
  }

  function getRegisteredCourseId(courseId) {
    var found = regCourses.find(function (c) { return c.course_id === courseId })
    return found ? found.course_id : null
  }

  return (
    <div className="dashboard-content">
      <Header title="Đăng ký môn học" />

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

        {/* Registration Info Banner */}
        {infoLoading ? (
          <div style={{ padding: "1rem", color: "var(--muted-foreground)" }}>
            Đang tải thông tin đăng ký...
          </div>
        ) : (
          <div className="registration-info-banner">
            <div className="registration-info-content">
              <div className="registration-info-icon">
                <Info />
              </div>
              <div className="registration-info-text">
                {isOpen ? (
                  <>
                    <h3>
                      Đang mở đăng ký:{" "}
                      {regInfo.semester && regInfo.semester.name}
                    </h3>
                    <p>
                      Thời hạn:{" "}
                      {regInfo.registrationEnd
                        ? new Date(regInfo.registrationEnd).toLocaleDateString("vi-VN")
                        : "—"}
                      . Tối thiểu {minCredits} TC, tối đa {maxCredits} TC.
                    </p>
                  </>
                ) : (
                  <>
                    <h3>Chưa có đợt đăng ký</h3>
                    <p>
                      {regInfo.message || "Hiện không có đợt đăng ký môn học nào đang mở."}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="registration-credits-info">
              <div className="credits-counter">
                <span className="credits-number">{totalCredits}</span>
                <span className="credits-max">/{maxCredits}</span>
              </div>
              <span className="credits-label">Tín chỉ đăng ký</span>
            </div>
          </div>
        )}

        <div className="registration-grid">
          {/* Available Courses */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <BookOpen /> Danh sách môn học mở
              </h2>
            </div>
            <div className="card-content">
              <form onSubmit={handleSearch} className="search-filter-bar">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm môn học..."
                    value={searchInput}
                    onChange={function (e) { setSearchInput(e.target.value) }}
                    className="search-input"
                  />
                </div>
                <button type="submit" className="btn btn-outline btn-sm">
                  Tìm
                </button>
              </form>

              {availLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                  Đang tải...
                </div>
              ) : availList.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                  Không có môn học nào
                </div>
              ) : (
                <div className="course-list">
                  {availList.map(function (course) {
                    var isFull = course.current_students >= course.max_students
                    var alreadyReg = isRegistered(course.id)
                    var slots = course.max_students - course.current_students

                    return (
                      <div
                        key={course.id}
                        className={"course-item " + (isFull && !alreadyReg ? "disabled" : "")}
                      >
                        <div className="course-main">
                          <div className="course-header">
                            <span className="course-code">{course.course_code}</span>
                            <span className={"badge " + (isFull ? "badge-danger" : "badge-success")}>
                              {isFull ? "Đã đầy" : slots + " chỗ còn"}
                            </span>
                          </div>
                          <h4 className="course-name">{course.name}</h4>
                          <div className="course-details">
                            {course.day_of_week && (
                              <span className="course-detail">
                                <Clock size={12} />
                                {course.day_of_week}{" "}
                                {course.start_time ? course.start_time.slice(0, 5) : ""}-
                                {course.end_time ? course.end_time.slice(0, 5) : ""}
                              </span>
                            )}
                            <span className="course-detail">
                              <Users size={12} />
                              {course.current_students}/{course.max_students}
                            </span>
                            <span className="course-detail">
                              {course.credits} TC
                            </span>
                            {course.type && (
                              <span className="course-detail">{course.type}</span>
                            )}
                          </div>
                          <p className="course-teacher">
                            {course.instructor_name || "Chưa phân công"}
                            {course.room ? " - " + course.room : ""}
                          </p>
                        </div>
                        <div className="course-action">
                          {alreadyReg ? (
                            <button className="btn btn-outline btn-sm" disabled>
                              <CheckCircle size={14} /> Đã đăng ký
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={function () { registerCourse(course.id) }}
                              disabled={isFull || registering || !isOpen}
                            >
                              <Plus size={14} />
                              {registering ? "..." : "Đăng ký"}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Registered Courses */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <CheckCircle /> Môn học đã đăng ký ({regCourses.length})
              </h2>
            </div>
            <div className="card-content">
              {regLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                  Đang tải...
                </div>
              ) : regCourses.length === 0 ? (
                <div className="empty-state">
                  <AlertCircle />
                  <p>Chưa có môn học nào được đăng ký</p>
                </div>
              ) : (
                <div className="registered-list">
                  {regCourses.map(function (course) {
                    return (
                      <div key={course.registration_id || course.course_id} className="registered-item">
                        <div className="registered-info">
                          <div className="registered-header">
                            <span className="course-code">{course.course_code}</span>
                            <span className="course-credits">{course.credits} TC</span>
                          </div>
                          <h4 className="course-name">{course.course_name}</h4>
                          <p className="course-schedule">
                            {course.day_of_week}{" "}
                            {course.start_time ? course.start_time.slice(0, 5) : ""}-
                            {course.end_time ? course.end_time.slice(0, 5) : ""}
                            {course.room ? " - " + course.room : ""}
                          </p>
                        </div>
                        {isOpen && (
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={function () { cancelCourse(course.course_id) }}
                            disabled={canceling}
                            title="Hủy đăng ký"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Summary */}
              <div className="registration-summary">
                <div className="summary-row">
                  <span>Tổng số môn:</span>
                  <span className="font-semibold">{regCourses.length} môn</span>
                </div>
                <div className="summary-row">
                  <span>Tổng tín chỉ:</span>
                  <span className="font-semibold">{totalCredits} tín chỉ</span>
                </div>
                <div className="summary-row">
                  <span>Học phí dự kiến:</span>
                  <span className="font-semibold text-primary">
                    {(totalCredits * 450000).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {isOpen && regCourses.length > 0 && (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                  onClick={function () { confirmReg() }}
                  disabled={confirming || totalCredits < minCredits}
                >
                  {confirming ? "Đang xác nhận..." : "Xác nhận đăng ký"}
                </button>
              )}

              {totalCredits > 0 && totalCredits < minCredits && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "0.5rem", textAlign: "center" }}>
                  Cần ít nhất {minCredits} tín chỉ để xác nhận
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
