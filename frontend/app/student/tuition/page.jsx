"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  ChevronDown,
  Printer,
  Wallet
} from "lucide-react"

const tuitionData = {
  currentSemester: {
    semester: "Học kỳ 2 (2024-2025)",
    totalAmount: 8100000,
    paidAmount: 8100000,
    remainingAmount: 0,
    status: "paid",
    dueDate: "31/01/2025",
    paidDate: "15/01/2025",
    details: [
      { item: "Học phí (18 tín chỉ x 450.000đ)", amount: 8100000 },
    ],
    discounts: [
      { item: "Không có", amount: 0 },
    ]
  },
  history: [
    { semester: "Học kỳ 1 (2024-2025)", amount: 7650000, status: "paid", paidDate: "10/09/2024" },
    { semester: "Học kỳ 2 (2023-2024)", amount: 7200000, status: "paid", paidDate: "15/01/2024" },
    { semester: "Học kỳ 1 (2023-2024)", amount: 6750000, status: "paid", paidDate: "12/09/2023" },
    { semester: "Học kỳ 2 (2022-2023)", amount: 6300000, status: "paid", paidDate: "18/01/2023" },
    { semester: "Học kỳ 1 (2022-2023)", amount: 5850000, status: "paid", paidDate: "08/09/2022" },
  ]
}

const paymentMethods = [
  { id: "bank", name: "Chuyển khoản ngân hàng", desc: "Vietcombank, BIDV, Techcombank..." },
  { id: "momo", name: "Ví MoMo", desc: "Thanh toán qua ví điện tử MoMo" },
  { id: "vnpay", name: "VNPay", desc: "Thanh toán qua cổng VNPay" },
  { id: "counter", name: "Nộp trực tiếp", desc: "Tại phòng Tài chính - Kế toán" },
]

export default function TuitionPage() {
  const { currentSemester, history } = tuitionData
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge badge-success"><CheckCircle /> Đã thanh toán</span>
      case "pending":
        return <span className="badge badge-warning"><Clock /> Chờ thanh toán</span>
      case "overdue":
        return <span className="badge badge-danger"><AlertCircle /> Quá hạn</span>
      default:
        return null
    }
  }

  return (
    <div className="dashboard-content">
      <Header title="Học phí" />
      
      <div className="dashboard-body">
        {/* Current Semester Summary */}
        <div className="tuition-summary-card">
          <div className="tuition-summary-header">
            <div>
              <h2 className="tuition-semester-title">{currentSemester.semester}</h2>
              <p className="tuition-due-date">Hạn nộp: {currentSemester.dueDate}</p>
            </div>
            {getStatusBadge(currentSemester.status)}
          </div>
          
          <div className="tuition-amounts">
            <div className="tuition-amount-item">
              <span className="tuition-amount-label">Tổng học phí</span>
              <span className="tuition-amount-value">{currentSemester.totalAmount.toLocaleString()}đ</span>
            </div>
            <div className="tuition-amount-item">
              <span className="tuition-amount-label">Đã thanh toán</span>
              <span className="tuition-amount-value success">{currentSemester.paidAmount.toLocaleString()}đ</span>
            </div>
            <div className="tuition-amount-item">
              <span className="tuition-amount-label">Còn nợ</span>
              <span className="tuition-amount-value">{currentSemester.remainingAmount.toLocaleString()}đ</span>
            </div>
          </div>

          {currentSemester.status === "paid" ? (
            <div className="tuition-paid-info">
              <CheckCircle />
              <span>Đã thanh toán ngày {currentSemester.paidDate}</span>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
              <Wallet /> Thanh toán ngay
            </button>
          )}
        </div>

        <div className="tuition-grid">
          {/* Tuition Details */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FileText />
                Chi tiết học phí
              </h2>
              <button className="btn btn-outline btn-sm">
                <Download /> Tải hóa đơn
              </button>
            </div>
            <div className="card-content">
              <div className="tuition-detail-list">
                <h4 className="tuition-detail-title">Các khoản thu:</h4>
                {currentSemester.details.map((item, index) => (
                  <div key={index} className="tuition-detail-item">
                    <span>{item.item}</span>
                    <span className="font-semibold">{item.amount.toLocaleString()}đ</span>
                  </div>
                ))}
                
                <div className="tuition-detail-divider" />
                
                <h4 className="tuition-detail-title">Miễn giảm:</h4>
                {currentSemester.discounts.map((item, index) => (
                  <div key={index} className="tuition-detail-item">
                    <span>{item.item}</span>
                    <span className="font-semibold text-success">-{item.amount.toLocaleString()}đ</span>
                  </div>
                ))}
                
                <div className="tuition-detail-divider" />
                
                <div className="tuition-detail-item total">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="font-semibold text-primary">{currentSemester.totalAmount.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <CreditCard />
                Phương thức thanh toán
              </h2>
            </div>
            <div className="card-content">
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="payment-method-item">
                    <div className="payment-method-icon">
                      <CreditCard />
                    </div>
                    <div className="payment-method-info">
                      <span className="payment-method-name">{method.name}</span>
                      <span className="payment-method-desc">{method.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bank-info">
                <h4 className="bank-info-title">Thông tin chuyển khoản:</h4>
                <div className="bank-info-content">
                  <p><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh Hà Nội</p>
                  <p><strong>Số TK:</strong> 1234567890123</p>
                  <p><strong>Chủ TK:</strong> Học viện Công nghệ BCVT</p>
                  <p><strong>Nội dung:</strong> [Mã SV] [Họ tên] nop hoc phi</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Calendar />
              Lịch sử thanh toán
            </h2>
          </div>
          <div className="card-content">
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Học kỳ</th>
                    <th className="text-right">Số tiền</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Ngày thanh toán</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium">{item.semester}</td>
                      <td className="text-right">{item.amount.toLocaleString()}đ</td>
                      <td className="text-center">{getStatusBadge(item.status)}</td>
                      <td className="text-center">{item.paidDate}</td>
                      <td className="text-center">
                        <button className="btn btn-ghost btn-sm">
                          <Printer /> In biên lai
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
