"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { cohortService } from "@/lib/services/adminService"
import { GraduationCap, Plus, Trash2, Edit } from "lucide-react"

export default function AdminCohortsPage() {
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ code: "", name: "", start_year: "", end_year: "" })

  const { data: cohorts, loading, error, refetch } = useApi(cohortService.getAll, [], { defaultData: [] })

  const { mutate: createCohort } = useMutation(cohortService.create, {
    onSuccess: () => {
      setSuccessMsg("Thêm khóa học thành công")
      closeModal()
      refetch()
      setTimeout(() => setSuccessMsg(""), 3000)
    },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })

  const { mutate: updateCohort } = useMutation(cohortService.update, {
    onSuccess: () => {
      setSuccessMsg("Cập nhật khóa học thành công")
      closeModal()
      refetch()
      setTimeout(() => setSuccessMsg(""), 3000)
    },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })

  const { mutate: deleteCohort } = useMutation(cohortService.delete, {
    onSuccess: () => {
      setSuccessMsg("Xóa khóa học thành công")
      refetch()
      setTimeout(() => setSuccessMsg(""), 3000)
    },
    onError: (err) => { setErrorMsg(err.message); setTimeout(() => setErrorMsg(""), 3000) }
  })

  const openCreate = () => {
    setEditingId(null)
    setFormData({ code: "", name: "", start_year: "", end_year: "" })
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditingId(c.id)
    setFormData({ code: c.code, name: c.name, start_year: c.start_year || "", end_year: c.end_year || "" })
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) updateCohort(editingId, formData)
    else createCohort(formData)
  }

  return (
    <div className="dashboard-content">
      <Header title="Quản lý danh mục Khóa học" />
      <div className="dashboard-body">
        {successMsg && <div style={{ padding: "0.75rem 1rem", background: "#dcfce7", color: "#166534", marginBottom: "1rem", borderRadius: "0.5rem" }}>{successMsg}</div>}
        {errorMsg && <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", color: "#991b1b", marginBottom: "1rem", borderRadius: "0.5rem" }}>{errorMsg}</div>}

        <div className="card">
          <div className="card-header" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}><GraduationCap size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/> Danh sách các khóa học</h3>
            <button className="btn btn-primary btn-sm" onClick={openCreate}><Plus size={16} /> Thêm khóa</button>
          </div>
          <div className="card-body" style={{ padding: "20px" }}>
            {error ? <div style={{ color: "red" }}>Lỗi: {error}</div> : loading ? <div>Đang tải...</div> : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--accent)", textAlign: "left" }}>
                    <th style={{ padding: "12px 16px" }}>Mã khóa</th>
                    <th style={{ padding: "12px 16px" }}>Tên khóa</th>
                    <th style={{ padding: "12px 16px" }}>Năm bắt đầu</th>
                    <th style={{ padding: "12px 16px" }}>Năm kết thúc</th>
                    <th style={{ padding: "12px 16px" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(cohorts || []).map(c => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.code}</td>
                      <td style={{ padding: "12px 16px" }}>{c.name}</td>
                      <td style={{ padding: "12px 16px" }}>{c.start_year || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>{c.end_year || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => openEdit(c)}><Edit size={16}/></button>
                        <button className="btn btn-sm btn-ghost" style={{ color: "red" }} onClick={() => { if(confirm('Chắc chắn xóa khóa này?')) deleteCohort(c.id) }}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <div style={{ background: "var(--card)", padding: "2rem", borderRadius: "0.75rem", width: 400 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{editingId ? "Sửa thông tin khóa học" : "Thêm khóa học mới"}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Mã khóa (VD: D21)</label>
                  <input className="form-input" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Tên khóa</label>
                  <input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Năm bắt đầu</label>
                    <input type="number" className="form-input" value={formData.start_year} onChange={e => setFormData({...formData, start_year: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Năm kết thúc</label>
                    <input type="number" className="form-input" value={formData.end_year} onChange={e => setFormData({...formData, end_year: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Hủy</button>
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
