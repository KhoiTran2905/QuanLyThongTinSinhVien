"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  FileText,
  Download,
  ChevronDown,
  TrendingUp,
  Award,
  BookOpen,
  BarChart3
} from "lucide-react"

const semesters = [
  { id: "2024-2", name: "Học kỳ 2 (2024-2025)" },
  { id: "2024-1", name: "Học kỳ 1 (2024-2025)" },
  { id: "2023-2", name: "Học kỳ 2 (2023-2024)" },
  { id: "2023-1", name: "Học kỳ 1 (2023-2024)" },
]

const gradesData = {
  "2024-1": {
    gpa: 3.52,
    gpa4: 3.52,
    credits: 18,
    grades: [
      { id: "IT4060", name: "Lập trình Java", credits: 3, attendance: 10, midterm: 8.5, final: 8.0, average: 8.2, letterGrade: "A", gpa4: 3.7 },
      { id: "IT4061", name: "Mạng máy tính", credits: 3, attendance: 9, midterm: 7.5, final: 8.5, average: 8.1, letterGrade: "A", gpa4: 3.7 },
      { id: "IT4058", name: "Kiến trúc máy tính", credits: 3, attendance: 10, midterm: 9.0, final: 8.5, average: 8.7, letterGrade: "A", gpa4: 4.0 },
      { id: "MATH3", name: "Xác suất thống kê", credits: 3, attendance: 8, midterm: 7.0, final: 7.5, average: 7.3, letterGrade: "B+", gpa4: 3.3 },
      { id: "IT4055", name: "Cấu trúc dữ liệu", credits: 3, attendance: 10, midterm: 8.0, final: 8.5, average: 8.3, letterGrade: "A", gpa4: 3.7 },
      { id: "PHY2", name: "Vật lý đại cương 2", credits: 3, attendance: 9, midterm: 7.5, final: 7.0, average: 7.2, letterGrade: "B+", gpa4: 3.3 },
    ]
  },
  "2023-2": {
    gpa: 3.38,
    gpa4: 3.38,
    credits: 17,
    grades: [
      { id: "IT4050", name: "Lập trình hướng đối tượng", credits: 3, attendance: 9, midterm: 8.0, final: 7.5, average: 7.7, letterGrade: "B+", gpa4: 3.3 },
      { id: "IT4051", name: "Hệ điều hành", credits: 3, attendance: 10, midterm: 8.5, final: 9.0, average: 8.8, letterGrade: "A+", gpa4: 4.0 },
      { id: "MATH2", name: "Giải tích 2", credits: 3, attendance: 8, midterm: 6.5, final: 7.0, average: 6.8, letterGrade: "B", gpa4: 3.0 },
      { id: "IT4052", name: "Cơ sở dữ liệu", credits: 3, attendance: 10, midterm: 8.0, final: 8.0, average: 8.0, letterGrade: "A", gpa4: 3.7 },
      { id: "ENG3", name: "Tiếng Anh 3", credits: 2, attendance: 9, midterm: 7.5, final: 8.0, average: 7.8, letterGrade: "B+", gpa4: 3.3 },
      { id: "PHY1", name: "Vật lý đại cương 1", credits: 3, attendance: 8, midterm: 7.0, final: 7.5, average: 7.3, letterGrade: "B+", gpa4: 3.3 },
    ]
  }
}

const cumulativeStats = {
  totalCredits: 98,
  gpa: 3.45,
  gpa4: 3.45,
  rank: "Giỏi"
}

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState("2024-1")
  const currentData = gradesData[selectedSemester] || gradesData["2024-1"]

  const getGradeColor = (grade) => {
    if (grade >= 8.5) return "badge-primary"
    if (grade >= 7.0) return "badge-info"
    if (grade >= 5.5) return "badge-warning"
    return "badge-danger"
  }

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
              <span className="grades-stat-value">{cumulativeStats.gpa}</span>
              <span className="grades-stat-label">GPA Tích lũy (Hệ 4)</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon blue">
              <BookOpen />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">{cumulativeStats.totalCredits}</span>
              <span className="grades-stat-label">Tín chỉ tích lũy</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon green">
              <Award />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">{cumulativeStats.rank}</span>
              <span className="grades-stat-label">Xếp loại học lực</span>
            </div>
          </div>
          <div className="grades-stat-card">
            <div className="grades-stat-icon orange">
              <BarChart3 />
            </div>
            <div className="grades-stat-content">
              <span className="grades-stat-value">{currentData.gpa}</span>
              <span className="grades-stat-label">GPA Học kỳ này</span>
            </div>
          </div>
        </div>

        {/* Semester Selection */}
        <div className="grades-controls">
          <div className="semester-select-wrapper">
            <select 
              className="semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesters.map(sem => (
                <option key={sem.id} value={sem.id}>{sem.name}</option>
              ))}
            </select>
            <ChevronDown className="semester-select-icon" />
          </div>
          <button className="btn btn-outline btn-sm">
            <Download /> Xuất bảng điểm
          </button>
        </div>

        {/* Grades Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FileText />
              Bảng điểm chi tiết
            </h2>
            <span className="badge badge-outline">{currentData.credits} tín chỉ</span>
          </div>
          <div className="card-content">
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
                  {currentData.grades.map((grade) => (
                    <tr key={grade.id}>
                      <td className="font-medium">{grade.id}</td>
                      <td>{grade.name}</td>
                      <td className="text-center">{grade.credits}</td>
                      <td className="text-center">{grade.attendance}</td>
                      <td className="text-center">{grade.midterm}</td>
                      <td className="text-center">{grade.final}</td>
                      <td className="text-center">
                        <span className={`badge ${getGradeColor(grade.average)}`}>
                          {grade.average}
                        </span>
                      </td>
                      <td className="text-center font-semibold">{grade.letterGrade}</td>
                      <td className="text-center font-semibold">{grade.gpa4}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="grades-summary-row">
                    <td colSpan="2" className="font-semibold">Tổng kết học kỳ</td>
                    <td className="text-center font-semibold">{currentData.credits}</td>
                    <td colSpan="4"></td>
                    <td className="text-center font-semibold">GPA</td>
                    <td className="text-center font-semibold text-primary">{currentData.gpa}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Grade Scale Legend */}
        <div className="grades-legend">
          <h3 className="grades-legend-title">Thang điểm quy đổi:</h3>
          <div className="grades-legend-items">
            <div className="grades-legend-item">
              <span className="badge badge-primary">A+ (9.0-10)</span>
              <span>= 4.0</span>
            </div>
            <div className="grades-legend-item">
              <span className="badge badge-primary">A (8.5-8.9)</span>
              <span>= 3.7</span>
            </div>
            <div className="grades-legend-item">
              <span className="badge badge-info">B+ (7.0-8.4)</span>
              <span>= 3.3</span>
            </div>
            <div className="grades-legend-item">
              <span className="badge badge-info">B (6.5-6.9)</span>
              <span>= 3.0</span>
            </div>
            <div className="grades-legend-item">
              <span className="badge badge-warning">C+ (5.5-6.4)</span>
              <span>= 2.3</span>
            </div>
            <div className="grades-legend-item">
              <span className="badge badge-danger">D (4.0-5.4)</span>
              <span>= 1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
