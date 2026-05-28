"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { adminDepartmentService, adminMajorService } from "@/lib/services/adminService"
import { Building, BookOpen, Plus, Trash2, Edit } from "lucide-react"

export default function AcademicUnitsPage() {
  const [activeTab, setActiveTab] = useState("departments") // "departments" | "majors"
  
  // Shared Messages
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Department State
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [editingDeptId, setEditingDeptId] = useState(null)
  const [deptForm, setDeptForm] = useState({ code: "", name: "", description: "" })

  // Major State
  const [showMajorModal, setShowMajorModal] = useState(false)
  const [editingMajorId, setEditingMajorId] = useState(null)
  const [majorForm, setMajorForm] = useState({ code: "", name: "", department_id: "", total_credits: 150, duration_years: 4.0 })

  // APIs
  const { data: departments, loading: deptLoading, error: deptError, refetch: refetchDepts } = useApi(adminDepartmentService.getAll, [], { defaultData: [] })
  const { data: majors, loading: majorLoading, error: majorError, refetch: refetchMajors } = useApi(adminMajorService.getAll, [], { defaultData: [] })

  // Department Mutations
  const { mutate: createDept } = useMutation(adminDepartmentService.create, {
    onSuccess: () => { setSuccessMsg("Tạo khoa thành công"); closeDeptModal(); refetchDepts(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })
  const { mutate: updateDept } = useMutation(adminDepartmentService.update, {
    onSuccess: () => { setSuccessMsg("Cập nhật khoa thành công"); closeDeptModal(); refetchDepts(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })
  const { mutate: deleteDept } = useMutation(adminDepartmentService.delete, {
    onSuccess: () => { setSuccessMsg("Xóa khoa thành công"); refetchDepts(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })

  // Major Mutations
  const { mutate: createMajor } = useMutation(adminMajorService.create, {
    onSuccess: () => { setSuccessMsg("Tạo ngành học thành công"); closeMajorModal(); refetchMajors(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })
  const { mutate: updateMajor } = useMutation(adminMajorService.update, {
    onSuccess: () => { setSuccessMsg("Cập nhật ngành học thành công"); closeMajorModal(); refetchMajors(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })
  const { mutate: deleteMajor } = useMutation(adminMajorService.delete, {
    onSuccess: () => { setSuccessMsg("Xóa ngành học thành công"); refetchMajors(); setTimeout(() => setSuccessMsg(""), 3000) },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })

  // Department Handlers
  const openCreateDept = () => { setEditingDeptId(null); setDeptForm({ code: "", name: "", description: "" }); setShowDeptModal(true) }
  const openEditDept = (d) => { setEditingDeptId(d.id); setDeptForm({ code: d.code, name: d.name, description: d.description }); setShowDeptModal(true) }
  const closeDeptModal = () => setShowDeptModal(false)
  const handleDeptSubmit = (e) => {
    e.preventDefault()
    if (editingDeptId) updateDept(editingDeptId, deptForm)
    else createDept(deptForm)
  }

  // Major Handlers
  const openCreateMajor = () => { setEditingMajorId(null); setMajorForm({ code: "", name: "", department_id: departments?.[0]?.id || "", total_credits: 150, duration_years: 4.0 }); setShowMajorModal(true) }
  const openEditMajor = (m) => { setEditingMajorId(m.id); setMajorForm({ code: m.code, name: m.name, department_id: m.department_id, total_credits: m.total_credits, duration_years: m.duration_years }); setShowMajorModal(true) }
  const closeMajorModal = () => setShowMajorModal(false)
  const handleMajorSubmit = (e) => {
    e.preventDefault()
    if (editingMajorId) updateMajor(editingMajorId, majorForm)
    else createMajor(majorForm)
  }

  return (
    <div className="dashboard-content">
      <Header title="Quản lý Cơ cấu đào tạo (Khoa & Ngành)" />
      
      <div className="dashboard-body">
        {/* Custom Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <button 
            onClick={() => setActiveTab("departments")}
            style={{ 
              padding: "0.75rem 1.5rem", background: "none", border: "none", cursor: "pointer", 
              fontWeight: 600, fontSize: "15px", color: activeTab === "departments" ? "var(--primary)" : "var(--muted-foreground)",
              borderBottom: activeTab === "departments" ? "2px solid var(--primary)" : "2px solid transparent"
            }}
          >
            <Building size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }}/>
            Danh sách Khoa
          </button>
          <button 
            onClick={() => setActiveTab("majors")}
            style={{ 
              padding: "0.75rem 1.5rem", background: "none", border: "none", cursor: "pointer", 
              fontWeight: 600, fontSize: "15px", color: activeTab === "majors" ? "var(--primary)" : "var(--muted-foreground)",
              borderBottom: activeTab === "majors" ? "2px solid var(--primary)" : "2px solid transparent"
            }}
          >
            <BookOpen size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }}/>
            Danh sách Ngành học
          </button>
        </div>

        {successMsg && <div style={{ padding: "0.75rem 1rem", background: "#dcfce7", color: "#166534", marginBottom: "1rem", borderRadius: "0.5rem" }}>{successMsg}</div>}
        {errorMsg && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#991b1b", marginBottom: "1rem", borderRadius: "0.5rem" }}>{errorMsg}</div>}

        {/* Tab Content: Departments */}
        {activeTab === "departments" && (
          <div className="card">
            <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Khoa đào tạo</h3>
              <button className="btn btn-primary btn-sm" onClick={openCreateDept}><Plus size={16} /> Thêm khoa</button>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
              {deptError ? <div style={{ color: "red" }}>Lỗi: {deptError}</div> : deptLoading ? <div>Đang tải...</div> : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "var(--accent)", textAlign: "left" }}>
                      <th style={{ padding: "12px 16px" }}>Mã khoa</th>
                      <th style={{ padding: "12px 16px" }}>Tên khoa</th>
                      <th style={{ padding: "12px 16px" }}>Mô tả</th>
                      <th style={{ padding: "12px 16px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(departments || []).map(d => (
                      <tr key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>{d.code}</td>
                        <td style={{ padding: "12px 16px" }}>{d.name}</td>
                        <td style={{ padding: "12px 16px", color: "var(--muted-foreground)" }}>{d.description || "—"}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => openEditDept(d)}><Edit size={16}/></button>
                          <button className="btn btn-sm btn-ghost" style={{ color: "red" }} onClick={() => { if(confirm('Chắc chắn xóa?')) deleteDept(d.id) }}><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Majors */}
        {activeTab === "majors" && (
          <div className="card">
            <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Ngành học</h3>
              <button className="btn btn-primary btn-sm" onClick={openCreateMajor}><Plus size={16} /> Thêm ngành</button>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
              {majorError ? <div style={{ color: "red" }}>Lỗi: {majorError}</div> : majorLoading ? <div>Đang tải...</div> : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "var(--accent)", textAlign: "left" }}>
                      <th style={{ padding: "12px 16px" }}>Mã ngành</th>
                      <th style={{ padding: "12px 16px" }}>Tên ngành</th>
                      <th style={{ padding: "12px 16px" }}>Khoa chủ quản</th>
                      <th style={{ padding: "12px 16px" }}>Thời gian ĐT</th>
                      <th style={{ padding: "12px 16px" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(majors || []).map(m => (
                      <tr key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>{m.code}</td>
                        <td style={{ padding: "12px 16px" }}>{m.name}</td>
                        <td style={{ padding: "12px 16px" }}>{m.department_name}</td>
                        <td style={{ padding: "12px 16px" }}>{m.duration_years} năm ({m.total_credits} TC)</td>
                        <td style={{ padding: "12px 16px" }}>
                          <button className="btn btn-sm btn-ghost" onClick={() => openEditMajor(m)}><Edit size={16}/></button>
                          <button className="btn btn-sm btn-ghost" style={{ color: "red" }} onClick={() => { if(confirm('Chắc chắn xóa?')) deleteMajor(m.id) }}><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Modals for Department */}
        {showDeptModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "0.75rem", width: 400 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{editingDeptId ? "Sửa thông tin khoa" : "Thêm khoa mới"}</h3>
              <form onSubmit={handleDeptSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Mã khoa</label>
                  <input className="form-input" required value={deptForm.code} onChange={e => setDeptForm({...deptForm, code: e.target.value})} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Tên khoa</label>
                  <input className="form-input" required value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Mô tả</label>
                  <textarea className="form-input" rows="3" value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})} />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-outline" onClick={closeDeptModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modals for Major */}
        {showMajorModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "0.75rem", width: 400 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{editingMajorId ? "Sửa thông tin ngành" : "Thêm ngành mới"}</h3>
              <form onSubmit={handleMajorSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Mã ngành</label>
                  <input className="form-input" required value={majorForm.code} onChange={e => setMajorForm({...majorForm, code: e.target.value})} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Tên ngành</label>
                  <input className="form-input" required value={majorForm.name} onChange={e => setMajorForm({...majorForm, name: e.target.value})} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Khoa</label>
                  <select className="form-input" required value={majorForm.department_id} onChange={e => setMajorForm({...majorForm, department_id: e.target.value})}>
                    <option value="">-- Chọn khoa --</option>
                    {(departments || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Tín chỉ</label>
                    <input type="number" className="form-input" required value={majorForm.total_credits} onChange={e => setMajorForm({...majorForm, total_credits: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Số năm</label>
                    <input type="number" step="0.5" className="form-input" required value={majorForm.duration_years} onChange={e => setMajorForm({...majorForm, duration_years: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-outline" onClick={closeMajorModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
