
"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { useApi, useMutation } from "@/hooks/use-api"
import { tuitionService } from "@/lib/services/studentService"
import {
  CreditCard, Download, CheckCircle,
  Clock, AlertCircle, FileText,
  Calendar, Printer, Wallet
} from "lucide-react"

function formatCurrency(amount) {
  if (amount == null) return "—"
  return Number(amount).toLocaleString("vi-VN") + "đ"
}

function formatDate(dateStr) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("vi-VN")
}

function StatusBadge(props) {
  var status = props.status
  if (status === "Đã thanh toán") {
    return (
      <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <CheckCircle size={12} /> Đã thanh toán
      </span>
    )
  }
  if (status === "Thanh toán một phần") {
    return (
      <span className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
        <Clock size={12} /> Thanh toán một phần
      </span>
    )
  }
  return (
    <span className="badge badge-danger" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <AlertCircle size={12} /> Chưa thanh toán
    </span>
  )
}

export default function TuitionPage() {
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const { data: currentTuition, loading: currentLoading, refetch } = useApi(
    tuitionService.getCurrent,
    [],
    { defaultData: null }
  )

  const { data: history, loading: historyLoading } = useApi(
    tuitionService.getHistory,
    [],
    { defaultData: [] }
  )

  const { data: paymentMethods, loading: methodsLoading } = useApi(
    tuitionService.getPaymentMethods,
    [],
    { defaultData: [] }
  )

  const { data: bankInfo } = useApi(
    tuitionService.getBankInfo,
    [],
    { defaultData: null }
  )

  const { mutate: pay, loading: paying } = useMutation(
    tuitionService.pay,
    {
      onSuccess: function () {
        setSuccessMsg("Thanh toán thành công!")
        refetch()
        setTimeout(function () { setSuccessMsg("") }, 3000)
      },
      onError: function (err) {
        setErrorMsg(err.message || "Lỗi khi thanh toán")
        setTimeout(function () { setErrorMsg("") }, 4000)
      },
    }
  )

  var historyList = Array.isArray(history) ? history : []
  var methodsList = Array.isArray(paymentMethods) ? paymentMethods : []

  // Find current tuition id from history for payment
  var currentTuitionId = null
  if (historyList.length > 0 && currentTuition && currentTuition.semester) {
    var found = historyList.find(function (h) {
      return h.semester === currentTuition.semester
    })
    if (found) currentTuitionId = found.id
  }

  function handlePay() {
    if (!currentTuitionId) {
      setErrorMsg("Không tìm thấy thông tin học phí để thanh toán")
      return
    }
    pay(currentTuitionId, selectedMethod)
  }

  return (
    <div className="dashboard-content">
      <Header title="Học phí" />

      <div className="dashboard-body">
        {successMsg && (
          <div style={{
            padding: "0.75rem 1rem", background: "#dcfce7",
            border: "1px solid #16a34a", borderRadius: "0.5rem",
            color: "#166534", fontSize: "0.875rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <CheckCircle size={16} /> {successMsg}
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

        {/* Current Tuition */}
        {currentLoading ? (
          <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
            Đang tải thông tin học phí...
          </div>
        ) : currentTuition && currentTuition.semester ? (
          <div className="tuition-summary-card">
            <div className="tuition-summary-header">
              <div>
                <h2 className="tuition-semester-title">{currentTuition.semester}</h2>
                <p className="tuition-due-date">
                  Hạn nộp: {formatDate(currentTuition.deadline)}
                </p>
              </div>
              <StatusBadge status={currentTuition.status} />
            </div>

            <div className="tuition-amounts">
              <div className="tuition-amount-item">
                <span className="tuition-amount-label">Tổng học phí</span>
                <span className="tuition-amount-value">
                  {formatCurrency(currentTuition.details && currentTuition.details.totalAmount)}
                </span>
              </div>
              <div className="tuition-amount-item">
                <span className="tuition-amount-label">Đã thanh toán</span>
                <span className="tuition-amount-value success">
                  {formatCurrency(currentTuition.details && currentTuition.details.paidAmount)}
                </span>
              </div>
              <div className="tuition-amount-item">
                <span className="tuition-amount-label">Còn nợ</span>
                <span className="tuition-amount-value">
                  {formatCurrency(currentTuition.details && currentTuition.details.remaining)}
                </span>
              </div>
            </div>

            {currentTuition.status === "Đã thanh toán" ? (
              <div className="tuition-paid-info">
                <CheckCircle />
                <span>
                  Đã thanh toán ngày {formatDate(currentTuition.payment && currentTuition.payment.date)}
                  {currentTuition.payment && currentTuition.payment.method
                    ? " — " + currentTuition.payment.method
                    : ""}
                </span>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
                onClick={handlePay}
                disabled={paying || !currentTuitionId}
              >
                <Wallet />
                {paying ? "Đang xử lý..." : "Thanh toán ngay"}
              </button>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
            Chưa có thông tin học phí
          </div>
        )}

        <div className="tuition-grid">
          {/* Tuition Detail */}
          {currentTuition && currentTuition.semester && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title"><FileText /> Chi tiết học phí</h2>
                <button className="btn btn-outline btn-sm">
                  <Download size={14} /> Tải hóa đơn
                </button>
              </div>
              <div className="card-content">
                <div className="tuition-detail-list">
                  <h4 className="tuition-detail-title">Các khoản thu:</h4>
                  <div className="tuition-detail-item">
                    <span>
                      Học phí ({currentTuition.details && currentTuition.details.totalCredits} TC ×{" "}
                      {formatCurrency(currentTuition.details && currentTuition.details.creditFee)})
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(currentTuition.details && currentTuition.details.totalAmount)}
                    </span>
                  </div>

                  <div className="tuition-detail-divider" />

                  <h4 className="tuition-detail-title">Miễn giảm:</h4>
                  <div className="tuition-detail-item">
                    <span>
                      {currentTuition.details && currentTuition.details.discount > 0
                        ? "Miễn giảm học phí"
                        : "Không có"}
                    </span>
                    <span className="font-semibold text-success">
                      -{formatCurrency(currentTuition.details && currentTuition.details.discount || 0)}
                    </span>
                  </div>

                  <div className="tuition-detail-divider" />

                  <div className="tuition-detail-item total">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-semibold text-primary">
                      {formatCurrency(currentTuition.details && currentTuition.details.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title"><CreditCard /> Phương thức thanh toán</h2>
            </div>
            <div className="card-content">
              {methodsLoading ? (
                <div style={{ color: "var(--muted-foreground)", padding: "1rem" }}>
                  Đang tải...
                </div>
              ) : (
                <div className="payment-methods">
                  {methodsList.map(function (method) {
                    var isSelected = selectedMethod === method.id
                    return (
                      <div
                        key={method.id}
                        className="payment-method-item"
                        onClick={function () { setSelectedMethod(method.id) }}
                        style={{
                          borderColor: isSelected ? "var(--primary)" : undefined,
                          background: isSelected ? "rgba(185,28,28,0.05)" : undefined,
                          cursor: "pointer",
                        }}
                      >
                        <div className="payment-method-icon">
                          <CreditCard />
                        </div>
                        <div className="payment-method-info">
                          <span className="payment-method-name">{method.name}</span>
                          <span className="payment-method-desc">
                            {method.description}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Bank Transfer Info */}
              {bankInfo && selectedMethod === "bank_transfer" && (
                <div className="bank-info">
                  <h4 className="bank-info-title">Thông tin chuyển khoản:</h4>
                  <div className="bank-info-content">
                    <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
                    <p><strong>Số TK:</strong> {bankInfo.accountNumber}</p>
                    <p><strong>Chủ TK:</strong> {bankInfo.accountHolder}</p>
                    <p><strong>Nội dung:</strong> {bankInfo.content}</p>
                    {bankInfo.note && (
                      <p style={{ marginTop: "0.5rem", fontSize: "12px", color: "var(--muted-foreground)" }}>
                        * {bankInfo.note}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><Calendar /> Lịch sử thanh toán</h2>
          </div>
          <div className="card-content">
            {historyLoading ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Đang tải...
              </div>
            ) : historyList.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--muted-foreground)" }}>
                Chưa có lịch sử thanh toán
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Học kỳ</th>
                      <th className="text-right">Số tiền</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-center">Ngày thanh toán</th>
                      <th className="text-center">Phương thức</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map(function (item) {
                      return (
                        <tr key={item.id}>
                          <td className="font-medium">{item.semester}</td>
                          <td className="text-right">
                            {formatCurrency(item.total_amount)}
                          </td>
                          <td className="text-center">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="text-center">
                            {item.payment_date ? formatDate(item.payment_date) : "—"}
                          </td>
                          <td className="text-center">
                            {item.payment_method || "—"}
                          </td>
                          <td className="text-center">
                            {item.status === "Đã thanh toán" && (
                              <button className="btn btn-ghost btn-sm">
                                <Printer size={14} /> In biên lai
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
