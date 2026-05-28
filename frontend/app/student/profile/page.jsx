import { Header } from "@/components/dashboard/header"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  CreditCard,
  Edit,
  Camera,
  Shield,
  FileText
} from "lucide-react"

const studentData = {
  avatar: "NA",
  fullName: "Nguyễn Văn An",
  studentId: "B21DCCN001",
  email: "b21dccn001@ptit.edu.vn",
  personalEmail: "nguyenvanan@gmail.com",
  phone: "0912345678",
  dateOfBirth: "15/03/2003",
  gender: "Nam",
  ethnicity: "Kinh",
  religion: "Không",
  idNumber: "001203012345",
  idDate: "20/05/2021",
  idPlace: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
  permanentAddress: "Số 10, Ngõ 5, Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội",
  currentAddress: "Phòng 305, KTX B1, Học viện CNBCVT, Hà Đông, Hà Nội",
  faculty: "Công nghệ thông tin 1",
  major: "Công nghệ thông tin",
  class: "D21CQCN01-B",
  course: "2021-2026",
  educationType: "Chính quy",
  status: "Đang học",
  gpa: 3.45,
  credits: 98
}

const familyInfo = {
  fatherName: "Nguyễn Văn Bình",
  fatherPhone: "0987654321",
  fatherJob: "Công nhân",
  motherName: "Trần Thị Lan",
  motherPhone: "0976543210",
  motherJob: "Nội trợ"
}

export default function ProfilePage() {
  return (
    <div className="dashboard-content">
      <Header title="Thông tin cá nhân" />
      
      <div className="dashboard-body">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">{studentData.avatar}</div>
                <button className="profile-avatar-edit">
                  <Camera />
                </button>
              </div>
              <div className="profile-basic-info">
                <h1 className="profile-name">{studentData.fullName}</h1>
                <p className="profile-id">{studentData.studentId}</p>
                <span className="badge badge-success">{studentData.status}</span>
              </div>
            </div>
            <div className="profile-quick-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{studentData.gpa}</span>
                <span className="profile-stat-label">GPA</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{studentData.credits}</span>
                <span className="profile-stat-label">Tín chỉ</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{studentData.class}</span>
                <span className="profile-stat-label">Lớp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <User />
                Thông tin cá nhân
              </h2>
              <button className="btn btn-outline btn-sm">
                <Edit /> Chỉnh sửa
              </button>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Họ và tên</span>
                  <span className="info-value">{studentData.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngày sinh</span>
                  <span className="info-value">{studentData.dateOfBirth}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Giới tính</span>
                  <span className="info-value">{studentData.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dân tộc</span>
                  <span className="info-value">{studentData.ethnicity}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tôn giáo</span>
                  <span className="info-value">{studentData.religion}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số CCCD</span>
                  <span className="info-value">{studentData.idNumber}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Ngày cấp - Nơi cấp</span>
                  <span className="info-value">{studentData.idDate} - {studentData.idPlace}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Mail />
                Thông tin liên hệ
              </h2>
              <button className="btn btn-outline btn-sm">
                <Edit /> Chỉnh sửa
              </button>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Email sinh viên</span>
                  <span className="info-value">{studentData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email cá nhân</span>
                  <span className="info-value">{studentData.personalEmail}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số điện thoại</span>
                  <span className="info-value">{studentData.phone}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Địa chỉ thường trú</span>
                  <span className="info-value">{studentData.permanentAddress}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Địa chỉ hiện tại</span>
                  <span className="info-value">{studentData.currentAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <GraduationCap />
                Thông tin học tập
              </h2>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Mã sinh viên</span>
                  <span className="info-value">{studentData.studentId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Khoa</span>
                  <span className="info-value">{studentData.faculty}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Ngành học</span>
                  <span className="info-value">{studentData.major}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lớp</span>
                  <span className="info-value">{studentData.class}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Khóa học</span>
                  <span className="info-value">{studentData.course}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Hệ đào tạo</span>
                  <span className="info-value">{studentData.educationType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái</span>
                  <span className="badge badge-success">{studentData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Shield />
                Thông tin gia đình
              </h2>
              <button className="btn btn-outline btn-sm">
                <Edit /> Chỉnh sửa
              </button>
            </div>
            <div className="card-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Họ tên cha</span>
                  <span className="info-value">{familyInfo.fatherName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">SĐT cha</span>
                  <span className="info-value">{familyInfo.fatherPhone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nghề nghiệp</span>
                  <span className="info-value">{familyInfo.fatherJob}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Họ tên mẹ</span>
                  <span className="info-value">{familyInfo.motherName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">SĐT mẹ</span>
                  <span className="info-value">{familyInfo.motherPhone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Nghề nghiệp</span>
                  <span className="info-value">{familyInfo.motherJob}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
