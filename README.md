# 📚 PTIT Student Management System

> **Hệ thống Quản lý Thông tin Sinh viên** – Học viện Công nghệ Bưu chính Viễn thông (PTIT)

Hệ thống web hiện đại giúp quản lý toàn diện thông tin học vụ sinh viên, bao gồm cổng dành cho **Quản trị viên** và **Sinh viên**, được xây dựng theo mô hình **REST API + Next.js**.

---

## 🗂️ Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [API Endpoints](#-api-endpoints)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Biến môi trường](#-biến-môi-trường)

---

## 🌟 Tổng quan

PTIT Student Management System là một ứng dụng web full-stack phục vụ quản lý học vụ nội bộ của trường đại học. Hệ thống phân quyền theo 2 vai trò chính:

| Vai trò | Mô tả |
|---|---|
| **Admin** | Quản lý toàn bộ hệ thống: sinh viên, điểm số, học phí, thông báo, v.v. |
| **Sinh viên** | Xem thông tin cá nhân, kết quả học tập, học phí và thông báo từ trường |

---

## ✨ Tính năng

📦 Hệ thống Quản lý Sinh viên
├── 👨‍💼 Admin
│   ├── 📊 Dashboard
│   │   ├── Thống kê sinh viên
│   │   ├── GPA trung bình
│   │   ├── Học phí chưa nộp
│   │   └── Thông báo mới
│   │
│   ├── 👨‍🎓 Sinh viên
│   │   ├── CRUD sinh viên
│   │   ├── Tìm kiếm
│   │   ├── Lọc theo khoa/ngành/lớp/khóa
│   │   └── Export CSV
│   │
│   ├── 📝 Điểm số
│   │   ├── Nhập điểm thủ công
│   │   │   └── Cascading:
│   │   │       Khoa → Ngành → Lớp → Sinh viên
│   │   ├── Import Excel/CSV
│   │   ├── Export dữ liệu
│   │   └── Duyệt / Từ chối điểm
│   │
│   ├── 🏫 Lớp học
│   │   ├── Quản lý lớp
│   │   └── Xem danh sách sinh viên
│   │
│   ├── 🏛️ Khoa / Ngành
│   │   ├── CRUD khoa
│   │   ├── CRUD ngành
│   │   └── Liên kết phân cấp
│   │
│   ├── 👨‍🏫 Giảng viên
│   │   └── Quản lý thông tin giảng viên
│   │
│   ├── 💳 Học phí
│   │   ├── Xem trạng thái học phí
│   │   └── Cập nhật thanh toán
│   │
│   ├── 📢 Thông báo
│   │   ├── Tạo thông báo
│   │   ├── Sửa thông báo
│   │   └── Xóa thông báo
│   │
│   └── ⚙️ Cài đặt
│       ├── Thông tin hệ thống
│       ├── Đổi mật khẩu
│       └── Quản lý phiên đăng nhập
│
└── 🎓 Sinh viên
    ├── 📊 Tổng quan
    │   ├── GPA
    │   ├── Tín chỉ tích lũy
    │   ├── Học phí
    │   └── Thông báo mới nhất
    │
    ├── 📚 Kết quả học tập
    │   ├── Xem bảng điểm
    │   ├── Lọc theo năm học
    │   ├── Lọc theo học kỳ
    │   └── Nút xác nhận bộ lọc
    │
    ├── 💳 Học phí
    │   └── Xem chi tiết học phí từng học kỳ
    │
    ├── 📢 Thông báo
    │   ├── Đọc thông báo
    │   ├── Đánh dấu đã đọc
    │   └── Xóa thông báo
    │
    └── 👤 Hồ sơ
        └── Xem thông tin cá nhân

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────┐
│              Frontend (Next.js)             │
│         Port 3000 – http://localhost:3000   │
│                                             │
│  /login         → Đăng nhập                │
│  /admin/*       → Giao diện Quản trị viên  │
│  /student/*     → Giao diện Sinh viên      │
└──────────────────────┬──────────────────────┘
                       │ REST API (fetch)
                       │ Authorization: Bearer JWT
                       ▼
┌─────────────────────────────────────────────┐
│              Backend (Express.js)           │
│         Port 5000 – http://localhost:5000   │
│                                             │
│  /api/auth/*         → Xác thực            │
│  /api/admin/*        → Quản trị viên       │
│  /api/student/*      → Sinh viên           │
│  /health             → Health Check        │
└──────────────────────┬──────────────────────┘
                       │ MySQL2
                       ▼
┌─────────────────────────────────────────────┐
│              MySQL Database                 │
│      ptit_student_management                │
└─────────────────────────────────────────────┘
```

---

🛠️ Công nghệ sử dụng
├── 🎨 Frontend
│   ├── Next.js (16.2.6)
│   │   └── React Framework (App Router)
│   │
│   ├── React (19)
│   │   └── UI Library
│   │
│   ├── Lucide React (0.564.0)
│   │   └── Icon Library
│   │
│   ├── Recharts (2.15.0)
│   │   └── Thư viện biểu đồ
│   │
│   └── Vanilla CSS
│       └── Styling tùy chỉnh
│
└── ⚙️ Backend
    ├── Node.js (>=18)
    │   └── Runtime Environment
    │
    ├── Express.js (4.22.2)
    │   └── REST API Framework
    │
    ├── MySQL2 (3.6.5)
    │   └── Kết nối cơ sở dữ liệu MySQL
    │
    ├── jsonwebtoken (9.0.2)
    │   └── Xác thực JWT
    │
    ├── bcryptjs (2.4.3)
    │   └── Mã hóa mật khẩu
    │
    ├── ExcelJS (4.4.0)
    │   └── Import / Export Excel
    │
    ├── Multer (1.4.5)
    │   └── Upload file
    │
    ├── Helmet (7.1.0)
    │   └── Bảo mật HTTP Header
    │
    └── Nodemon (3.0.2)
        └── Hot reload khi phát triển

### Database
- **MySQL** 8.x
- Tên database: `ptit_student_management`

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- Node.js ≥ 18
- MySQL 8.x
- npm hoặc yarn

### 1. Clone dự án

```bash
git clone <repository-url>
cd qlsv
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ptit_student_management

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=30d

CLIENT_URL=http://localhost:3000
```

Khởi tạo database và seed dữ liệu mẫu:

```bash
npm run db:migrate
npm run db:seed
```

Khởi động server:

```bash
npm run dev      # Development (hot reload)
npm start        # Production
```

> Server chạy tại: `http://localhost:5000`  
> Health check: `http://localhost:5000/health`

---

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Khởi động dev server:

```bash
npm run dev
```

> Ứng dụng chạy tại: `http://localhost:3000`

---

## 📁 Cấu trúc thư mục

```
qlsv/
├── backend/
│   ├── src/
│   │   ├── app.js                   # Express app entry
│   │   ├── config/
│   │   │   └── database.js          # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── admin/               # Controllers cho Admin
│   │   │   │   ├── dashboardController.js
│   │   │   │   ├── studentController.js
│   │   │   │   ├── gradeController.js   # Bao gồm import Excel/CSV
│   │   │   │   ├── classController.js
│   │   │   │   ├── departmentController.js
│   │   │   │   ├── majorController.js
│   │   │   │   ├── instructorController.js
│   │   │   │   ├── notificationController.js
│   │   │   │   ├── tuitionController.js
│   │   │   │   ├── cohortController.js
│   │   │   │   └── settingController.js
│   │   │   └── student/             # Controllers cho Sinh viên
│   │   │       ├── dashboardController.js
│   │   │       ├── gradeController.js
│   │   │       ├── notificationController.js
│   │   │       ├── tuitionController.js
│   │   │       └── profileController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── admin/               # Admin API routes
│   │   │   └── student/             # Student API routes
│   │   └── utils/
│   │       ├── apiResponse.js       # Chuẩn hóa response
│   │       ├── helpers.js           # Tính điểm, xếp loại
│   │       └── pagination.js
│   ├── database/
│   │   ├── migrate.js               # Tạo bảng
│   │   └── seed.js                  # Dữ liệu mẫu
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── layout.jsx               # Root layout (favicon, metadata)
    │   ├── page.jsx                 # Landing/redirect page
    │   ├── login/
    │   │   └── page.jsx
    │   ├── admin/
    │   │   ├── layout.jsx
    │   │   ├── page.jsx             # Admin Dashboard
    │   │   ├── students/            # Quản lý sinh viên
    │   │   ├── grades/              # Quản lý điểm số
    │   │   ├── classes/             # Quản lý lớp học
    │   │   ├── departments/         # Quản lý khoa
    │   │   ├── cohorts/             # Quản lý khóa học
    │   │   ├── teachers/            # Quản lý giảng viên
    │   │   ├── tuition/             # Quản lý học phí
    │   │   ├── notifications/       # Quản lý thông báo
    │   │   └── settings/            # Cài đặt hệ thống
    │   └── student/
    │       ├── layout.jsx
    │       ├── page.jsx             # Student Dashboard
    │       ├── grades/              # Kết quả học tập
    │       ├── tuition/             # Học phí
    │       ├── notifications/       # Thông báo
    │       └── profile/             # Hồ sơ cá nhân
    ├── components/
    │   └── dashboard/               # Shared components (Header, Charts, ...)
    ├── contexts/
    │   └── auth-context.jsx         # AuthContext (đăng nhập, phiên)
    ├── hooks/
    │   └── use-api.js               # useApi, usePaginatedApi, useMutation
    ├── lib/
    │   ├── api.js                   # apiClient (fetch wrapper + JWT refresh)
    │   └── services/
    │       └── adminService.js      # Tất cả API calls
    ├── public/
    │   └── ptit-favicon.ico         # Favicon logo PTIT
    └── styles/
        ├── dashboard.css
        ├── home.css
        └── login.css
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| POST | `/api/auth/refresh-token` | Làm mới access token |
| GET | `/api/auth/me` | Thông tin người dùng hiện tại |

### 👨‍💼 Admin – Sinh viên
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/students` | Danh sách sinh viên (có filter, phân trang) |
| GET | `/api/admin/students/:id` | Chi tiết sinh viên |
| POST | `/api/admin/students` | Thêm sinh viên |
| PUT | `/api/admin/students/:id` | Cập nhật sinh viên |
| DELETE | `/api/admin/students/:id` | Xóa sinh viên |

### 📊 Admin – Điểm số
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/grades` | Danh sách điểm (filter: khoa, ngành, lớp, học kỳ, trạng thái) |
| POST | `/api/admin/grades` | Nhập điểm mới |
| PUT | `/api/admin/grades/:id` | Cập nhật điểm |
| DELETE | `/api/admin/grades/:id` | Xóa bản ghi điểm |
| PUT | `/api/admin/grades/:id/approve` | Duyệt điểm |
| PUT | `/api/admin/grades/:id/reject` | Từ chối điểm |
| PUT | `/api/admin/grades/approve-all` | Duyệt tất cả điểm chờ |
| **POST** | **`/api/admin/grades/import`** | **Import điểm từ file Excel/CSV** |
| GET | `/api/admin/grades/options/form-data` | Lấy danh sách SV, môn học, lớp cho form |

### 🔔 Admin – Thông báo
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/notifications` | Danh sách thông báo |
| POST | `/api/admin/notifications` | Tạo thông báo mới |
| PUT | `/api/admin/notifications/:id` | Sửa thông báo |
| DELETE | `/api/admin/notifications/:id` | Xóa thông báo |

### 🎓 Student API
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/student/dashboard` | Tổng quan cá nhân |
| GET | `/api/student/grades` | Kết quả học tập |
| GET | `/api/student/tuition` | Thông tin học phí |
| GET | `/api/student/notifications` | Thông báo |
| PUT | `/api/student/notifications/:id/read` | Đánh dấu đã đọc |
| PUT | `/api/student/notifications/:id/delete` | Xóa thông báo (soft delete) |
| GET | `/api/student/profile` | Hồ sơ cá nhân |

---

## 📥 Hướng dẫn Import điểm (Excel/CSV)

### Cấu trúc file mẫu

| Mã Sinh viên | Mã Môn học | Chuyên cần | Giữa kỳ | Cuối kỳ |
|---|---|---|---|---|
| B22DCPT001 | INT001 | 8.5 | 7.0 | 8.0 |
| B22DCPT002 | INT001 | 9.0 | 8.5 | 9.0 |

> Hỗ trợ định dạng: `.xlsx`, `.xls`, `.csv`  
> Dòng đầu tiên là **header** (tiêu đề), dữ liệu bắt đầu từ dòng 2.  
> Trong màn hình Import, nhấn **"Tải file mẫu"** để tải file CSV mẫu.

### Quy trình Import
1. Vào **Admin → Điểm số**
2. Nhấn nút **Import**
3. Chọn lần lượt: **Khoa → Khóa → Ngành → Lớp → Học kỳ → Năm học**
4. Chọn file Excel/CSV
5. Nhấn **Import** — hệ thống sẽ xử lý và báo kết quả ngay trong modal
6. Điểm import vào sẽ ở trạng thái **"Chờ duyệt"**

---

## 👤 Tài khoản mặc định

> Được tạo sau khi chạy `npm run db:seed`

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@ptit.edu.vn` | `Admin@123` |
| Sinh viên | `b22dcpt001@ptit.edu.vn` | `Student@123` |

---

## ⚙️ Biến môi trường

### Backend (`backend/.env`)

| Biến | Mô tả | Mặc định |
|---|---|---|
| `PORT` | Cổng server | `5000` |
| `NODE_ENV` | Môi trường | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Tên database | `ptit_student_management` |
| `JWT_SECRET` | Khóa bí mật JWT | — |
| `JWT_EXPIRES_IN` | Thời hạn access token | `7d` |
| `JWT_REFRESH_SECRET` | Khóa refresh token | — |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn refresh token | `30d` |
| `CLIENT_URL` | URL frontend (CORS) | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Biến | Mô tả | Mặc định |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL API backend | `http://localhost:5000/api` |

---

## 📊 Sơ đồ Database (chính)

```
cohorts ──────────────────────────────────────────┐
departments ──┐                                   │
              ▼                                   │
            majors ──┐                            │
                     ▼                            │
                   classes ──┐                    │
                             ▼                    │
                          students ◄──────────────┘
                             │
              ┌──────────────┤
              ▼              ▼
           grades        tuitions
              │
         courses ◄────────────┘

notifications ──► notification_reads (per student)
users (admin/student accounts)
```

---

## 🔒 Bảo mật

- **JWT Access Token** (7 ngày) + **Refresh Token** (30 ngày) tự động làm mới
- **bcryptjs** mã hóa mật khẩu với salt rounds = 10
- **Helmet.js** bảo vệ HTTP headers
- **CORS** chỉ cho phép origin đã cấu hình
- Phân quyền middleware kiểm tra `role` trên mọi route

---

## 📝 Ghi chú phát triển

- Điểm được tính tự động theo công thức: `Trung bình = (Giữa kỳ × 0.4) + (Cuối kỳ × 0.6)`
- Xếp loại chữ: A+ (≥9.0), A (≥8.5), B+ (≥8.0), B (≥7.0), C+ (≥6.5), C (≥6.0), D+ (≥5.5), D (≥5.0), F (<5.0)
- Điểm hệ 4 tính theo thang điểm chuẩn Việt Nam
- Thông báo hỗ trợ soft-delete riêng cho từng sinh viên (không xóa khỏi DB)

---

## 📄 License

MIT License — Dự án học thuật, không sử dụng thương mại.