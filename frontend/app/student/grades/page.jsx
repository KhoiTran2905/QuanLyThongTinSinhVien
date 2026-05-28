
"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi } from "@/hooks/use-api"
import { gradeService } from "@/lib/services/studentService"
import {
  FileText, Download, ChevronDown,
  TrendingUp, Award, BookOpen, BarChart3
} from "lucide-react"

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState("")

  const { data: overview, loading: overviewLoading } = useApi(
    gradeService.getOverview,
    [],
    { defaultData: {} }
  )

  // Set default semester khi overview load xong
  useEffect(function () {
    if (overview && Array.isArray(overview.semesters) && overview.semesters.length > 0) {
      if (!selectedSemester) {
        setSelectedSemester(overview.semesters[overview.semesters.length - 1])
      }
    }
  }, [overview])

  var semesters = overview && Array.isArray(overview.semesters)
    ? overview.semesters
    : []

  const { data: semesterData, loading: semLoading } = useApi(
    function () {
      if (!selectedSemester) return Promise.resolve({ data: { grades: [], summary: {} } })
      return gradeService.getBySemester(selectedSemester)
    },
    [selectedSemester],
    { defaultData: { grades: [], summary: {} } }
  )

  var grades = semesterData && Array.isArray(semesterData.grades)
    ? semesterData.grades
    : []
  var summary = semesterData && semesterData.summary
    ? semesterData.summary
    : {}

  var cumulativeGPA = overview && overview.cumulativeGPA != null
    ? overview.cumulativeGPA
    : null
  var totalCreditsAccum = overview && overview.totalCredits != null
    ? overview.totalCredits
    : null
  var classification = (overview && overview.classification) || "—"
  var currentGPA = overview && overview.currentSemesterGPA != null
    ? overview.currentSemesterGPA
    : null

  function getGradeBadge(average) {
    if (average == null) return "badge-outline"
    var val = parseFloat(average)
    if (val >= 8.5) return "badge-primary"
    if (val >= 7.0) return "badge-info"
    if (val >= 5.5) return "badge-warning"
    return "badge-danger"
  }

  var GRADE_SCALE = [
    { label: "A+ (9.0-10)", badge: "badge-primary", gpa: "4.0" },
    { label: "A (8.5-8.9)", badge: "badge-primary", gpa: "3.7" },
    { label: "B+ (7.0-8.4)", badge: "badge-info", gpa: "3.3" },
    { label: "B (6.5-6.9)", badge: "badge-info", gpa: "3.0" },
    { label: "C+ (5.5-6.4)", badge: "badge-warning", gpa: "2.3" },
    { label: "D (4.0-5.4)", badge: "badge-danger", gpa: "1.0" },
    { label: "F (< 4.0)", badge: "badge-danger", gpa: "0" },
  ]

  return (
    <div className="dashboard-content">
      <Header title="Kết quả học tập" />

      <div className="dashboard-body">
        {/* Cumulative Stats */}
        <div className="grades-stats-grid">
          <div className="grades-stat-card primary">
            <div className="grades-stat-icon">
              <TrendingUp />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">
                {overviewLoading ? "..." : cumulativeGPA != null ? cumulativeGPA : "—"}
              </span>
              <span className="grades-stat-label">GPA Tích lũy (Hệ 4)</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon blue">
              <BookOpen />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">
                {overviewLoading ? "..." : totalCreditsAccum != null ? totalCreditsAccum : "—"}
              </span>
              <span className="grades-stat-label">Tín chỉ tích lũy</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon green">
              <Award />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">
                {overviewLoading ? "..." : classification}
              </span>
              <span className="grades-stat-label">Xếp loại học lực</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon orange">
              <BarChart3 />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">
                {overviewLoading ? "..." : currentGPA != null ? currentGPA : "—"}
              </span>
              <span className="grades-stat-label">GPA Học kỳ hiện tại</span>
            </div>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="grades-controls">
          <div className="semester-select-wrapper">
            <select
              className="semester-select"
              value={selectedSemester}
              onChange={function (e) { setSelectedSemester(e.target.value) }}
              disabled={overviewLoading || semesters.length === 0}
            >
              {semesters.length === 0 && (
                <option value="">Chưa có học kỳ nào</option>
              )}
              {semesters.map(function (sem) {
                return (
                  <option key={sem} value={sem}>{sem}</option>
                )
              })}
            </select>
            <ChevronDown className="semester-select-icon" />
          </div>
          <button className="btn btn-outline btn-sm">
            <Download size={16} /> Xuất bảng điểm
          </button>
        </div>

        {/* Grades Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Bảng điểm chi tiết
              {selectedSemester && " — " + selectedSemester}
            </h2>
            {summary.totalCredits > 0 && (
              <span className="badge badge-outline">
                {summary.totalCredits} tín chỉ
              </span>
            )}
          </div>
          <div className="card-content">
            {semLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Đang tải...
              </div>
            ) : grades.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Chưa có điểm cho học kỳ này
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table grades-table">
                  <thead>
                    <tr>
                      <th>Mã môn</th>
                      <th>Tên môn học</th>
                      <th className="text-center">TC</th>
                      <th className="text-center">Chuyên cần</th>
                      <th className="text-center">Giữa kỳ</th>
                      <th className="text-center">Cuối kỳ</th>
                      <th className="text-center">TB Môn</th>
                      <th className="text-center">Điểm chữ</th>
                      <th className="text-center">Điểm 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map(function (grade) {
                      return (
                        <tr key={grade.id}>
                          <td className="font-medium">{grade.course_code || "—"}</td>
                          <td>{grade.course_name}</td>
                          <td className="text-center">{grade.credits}</td>
                          <td className="text-center">
                            {grade.attendance_score != null ? grade.attendance_score : "—"}
                          </td>
                          <td className="text-center">
                            {grade.midterm_score != null ? grade.midterm_score : "—"}
                          </td>
                          <td className="text-center">
                            {grade.final_score != null ? grade.final_score : "—"}
                          </td>
                          <td className="text-center">
                            <span className={"badge " + getGradeBadge(grade.average_score)}>
                              {grade.average_score != null ? grade.average_score : "—"}
                            </span>
                          </td>
                          <td className="text-center font-semibold">
                            {grade.letter_grade || "—"}
                          </td>
                          <td className="text-center font-semibold">
                            {grade.gpa_score != null ? grade.gpa_score : "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {grades.length > 0 && (
                    <tfoot>
                      <tr className="grades-summary-row">
                        <td colSpan={2} className="font-semibold">Tổng kết học kỳ</td>
                        <td className="text-center font-semibold">
                          {summary.totalCredits || "—"}
                        </td>
                        <td colSpan={4}></td>
                        <td className="text-center font-semibold">GPA</td>
                        <td className="text-center font-semibold text-primary">
                          {summary.semesterGPA != null ? summary.semesterGPA : "—"}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Grade Scale */}
        <div className="grades-legend">
          <h3 className="grades-legend-title">Thang điểm quy đổi:</h3>
          <div className="grades-legend-items">
            {GRADE_SCALE.map(function (item) {
              return (
                <div key={item.label} className="grades-legend-item">
                  <span className={"badge " + item.badge}>{item.label}</span>
                  <span>= {item.gpa}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
