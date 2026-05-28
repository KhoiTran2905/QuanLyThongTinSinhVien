-- database/seeders/seed_data.sql
-- Seed data matching the frontend mock data

USE ptit_student_management;

-- =============================================
-- USERS (Admin + Students)
-- Password: admin123 / 123456
-- bcrypt hash of 'admin123': $2a$10$8KzQJK1RQhF8xVbKqGZRXODq.FqXsN5q5LrKxJZ7Q9YQ5WzZ5Y5Iq
-- bcrypt hash of '123456':   $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =============================================

INSERT INTO users (username, password, role, is_active, last_login) VALUES
('admin', '$2a$10$8KzQJK1RQhF8xVbKqGZRXODq.FqXsN5q5LrKxJZ7Q9YQ5WzZ5Y5Iq', 'admin', true, NOW()),
('B21DCCN001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NOW()),
('B21DCCN002', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NOW()),
('B21DCAT003', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL),
('B21DCVT004', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL),
('B21DCDT005', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL),
('B21DCCN006', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL),
('B21DCAT007', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL),
('B21DCVT008', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', true, NULL);

-- =============================================
-- DEPARTMENTS (Khoa)
-- =============================================
INSERT INTO departments (code, name, description) VALUES
('CNTT', 'Khoa Công nghệ thông tin', 'Khoa Công nghệ thông tin - PTIT'),
('ATTT', 'Khoa An toàn thông tin', 'Khoa An toàn thông tin - PTIT'),
('VT', 'Khoa Viễn thông', 'Khoa Viễn thông - PTIT'),
('DT', 'Khoa Điện tử', 'Khoa Điện tử - PTIT'),
('DPT', 'Khoa Đa phương tiện', 'Khoa Đa phương tiện - PTIT'),
('QTKD', 'Khoa Quản trị kinh doanh', 'Khoa Quản trị kinh doanh - PTIT');

-- =============================================
-- MAJORS (Ngành)
-- =============================================
INSERT INTO majors (code, name, department_id, total_credits) VALUES
('CNTT', 'Công nghệ thông tin', 1, 145),
('KTPM', 'Kỹ thuật phần mềm', 1, 145),
('KHMT', 'Khoa học máy tính', 1, 145),
('ATTT', 'An toàn thông tin', 2, 145),
('VT', 'Viễn thông', 3, 150),
('DT', 'Điện tử', 4, 150),
('DPT', 'Đa phương tiện', 5, 140),
('QTKD', 'Quản trị kinh doanh', 6, 135);

-- =============================================
-- INSTRUCTORS (Giảng viên)
-- =============================================
INSERT INTO instructors (instructor_code, full_name, email, phone, department_id, academic_rank, degree, status, rating, total_teaching_hours) VALUES
('GV001', 'Nguyễn Văn Minh', 'minhnv@ptit.edu.vn', '0901234001', 1, 'PGS.TS', 'GS/PGS', 'Đang dạy', 4.9, 320),
('GV002', 'Trần Thị Hương', 'huongtt@ptit.edu.vn', '0901234002', 1, 'TS', 'Tiến sĩ', 'Đang dạy', 4.8, 280),
('GV003', 'Lê Hoàng Nam', 'namlh@ptit.edu.vn', '0901234003', 3, 'ThS', 'Thạc sĩ', 'Đang dạy', 4.5, 240),
('GV004', 'Phạm Văn Đức', 'ducpv@ptit.edu.vn', '0901234004', 4, 'PGS.TS', 'GS/PGS', 'Đang dạy', 4.7, 260),
('GV005', 'Hoàng Thị Lan', 'lanht@ptit.edu.vn', '0901234005', 1, 'TS', 'Tiến sĩ', 'Nghỉ phép', 4.5, 200),
('GV006', 'Ngô Văn Hải', 'haingv@ptit.edu.vn', '0901234006', 2, 'ThS', 'Thạc sĩ', 'Đang dạy', 4.6, 220);

-- =============================================
-- CLASSES (Lớp học)
-- =============================================
INSERT INTO classes (class_code, name, department_id, major_id, academic_year, advisor_id, total_students, avg_gpa, status) VALUES
('D21CQCN01-B', 'CNTT K21 - Nhóm 1', 1, 1, 'K2021', 1, 45, 3.45, 'Đang học'),
('D21CQCN02-B', 'CNTT K21 - Nhóm 2', 1, 1, 'K2021', 2, 42, 3.28, 'Đang học'),
('D21CQAT01-B', 'ATTT K21 - Nhóm 1', 2, 4, 'K2021', 6, 38, 3.38, 'Đang học'),
('D21CQVT01-B', 'Viễn thông K21', 3, 5, 'K2021', 3, 35, 3.22, 'Đang học'),
('D21CQDT01-B', 'Điện tử K21', 4, 6, 'K2021', 4, 40, 3.15, 'Đang học'),
('D22CQCN01-B', 'CNTT K22 - Nhóm 1', 1, 1, 'K2022', 5, 48, 3.32, 'Đang học'),
('D20CQCN01-B', 'CNTT K20 - Nhóm 1', 1, 1, 'K2020', 4, 40, 3.40, 'Đã tốt nghiệp');

-- =============================================
-- STUDENTS (Sinh viên)
-- =============================================
INSERT INTO students (
    user_id, student_code, full_name, date_of_birth, gender, ethnicity, religion,
    id_number, id_issue_date, id_issue_place,
    email, personal_email, phone, permanent_address, current_address,
    department_id, major_id, class_id, academic_year, enrollment_date,
    training_system, status, gpa, total_credits,
    father_name, father_phone, father_occupation,
    mother_name, mother_phone, mother_occupation
) VALUES
(2, 'B21DCCN001', 'Nguyễn Văn An', '2003-03-15', 'Nam', 'Kinh', 'Không',
 '001203012345', '2021-05-20', 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư',
 'b21dccn001@ptit.edu.vn', 'nguyenvanan@gmail.com', '0912345678',
 'Số 10, Ngõ 5, Đường Láng, Phường Láng Hạ, Quận Đống Đa, Hà Nội',
 'Phòng 305, KTX B1, Học viện CNBCVT, Hà Đông, Hà Nội',
 1, 1, 1, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.45, 98,
 'Nguyễn Văn Bình', '0987654321', 'Công nhân',
 'Trần Thị Lan', '0976543210', 'Nội trợ'),

(3, 'B21DCCN002', 'Trần Thị Bình', '2003-07-22', 'Nữ', 'Kinh', 'Không',
 '001203054321', '2021-06-10', 'Công an Hà Nội',
 'b21dccn002@ptit.edu.vn', 'tranbinhtt@gmail.com', '0912345679',
 'Số 20, Phố Huế, Hai Bà Trưng, Hà Nội',
 'Phòng 210, KTX A2, Học viện CNBCVT, Hà Đông, Hà Nội',
 1, 1, 1, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.72, 98,
 'Trần Văn Hùng', '0987111222', 'Kinh doanh',
 'Nguyễn Thị Hoa', '0976111222', 'Giáo viên'),

(4, 'B21DCAT003', 'Lê Hoàng Cường', '2003-01-10', 'Nam', 'Kinh', 'Không',
 '001203098765', '2021-05-15', 'Công an Hà Nội',
 'b21dcat003@ptit.edu.vn', 'cuonglh@gmail.com', '0912345680',
 'Số 5, Ngõ 10, Trần Phú, Hà Đông, Hà Nội',
 'Phòng 401, KTX B2, Học viện CNBCVT, Hà Đông, Hà Nội',
 2, 4, 3, 'K2021', '2021-09-01', 'Chính quy', 'Chờ duyệt', 3.15, 90,
 'Lê Văn Thắng', '0987222333', 'Kỹ sư',
 'Phạm Thị Mai', '0976222333', 'Bác sĩ'),

(5, 'B21DCVT004', 'Phạm Minh Đức', '2003-05-28', 'Nam', 'Kinh', 'Không',
 '001203076543', '2021-04-20', 'Công an Hải Phòng',
 'b21dcvt004@ptit.edu.vn', 'ducpm@gmail.com', '0912345681',
 '15 Lê Lợi, Ngô Quyền, Hải Phòng',
 'Phòng 102, KTX A1, Học viện CNBCVT, Hà Đông, Hà Nội',
 3, 5, 4, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.28, 95,
 'Phạm Văn Hải', '0987333444', 'Thuyền trưởng',
 'Lê Thị Ngọc', '0976333444', 'Nội trợ'),

(6, 'B21DCDT005', 'Hoàng Thị Hà', '2003-11-05', 'Nữ', 'Kinh', 'Phật giáo',
 '001203065432', '2021-06-01', 'Công an Nam Định',
 'b21dcdt005@ptit.edu.vn', 'haht@gmail.com', '0912345682',
 '20 Trần Hưng Đạo, Nam Định',
 'Phòng 503, KTX A3, Học viện CNBCVT, Hà Đông, Hà Nội',
 4, 6, 5, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.85, 100,
 'Hoàng Văn Nam', '0987444555', 'Giáo viên',
 'Vũ Thị Hằng', '0976444555', 'Kế toán'),

(7, 'B21DCCN006', 'Ngô Văn Hùng', '2003-08-14', 'Nam', 'Kinh', 'Không',
 '001203087654', '2021-05-25', 'Công an Hà Nội',
 'b21dccn006@ptit.edu.vn', 'hungnv@gmail.com', '0912345683',
 '8 Nguyễn Trãi, Thanh Xuân, Hà Nội',
 'Phòng 205, KTX B1, Học viện CNBCVT, Hà Đông, Hà Nội',
 1, 1, 2, 'K2021', '2021-09-01', 'Chính quy', 'Bảo lưu', 2.95, 75,
 'Ngô Văn Thành', '0987555666', 'Lái xe',
 'Đỗ Thị Lan', '0976555666', 'Buôn bán'),

(8, 'B21DCAT007', 'Đỗ Thị Kim', '2003-04-20', 'Nữ', 'Kinh', 'Không',
 '001203076789', '2021-05-30', 'Công an Hà Nội',
 'b21dcat007@ptit.edu.vn', 'kimdt@gmail.com', '0912345684',
 '12 Hoàng Mai, Hà Nội',
 'Phòng 301, KTX A2, Học viện CNBCVT, Hà Đông, Hà Nội',
 2, 4, 3, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.55, 96,
 'Đỗ Văn Quang', '0987666777', 'Doanh nhân',
 'Trần Thị Thu', '0976666777', 'Giáo viên'),

(9, 'B21DCVT008', 'Vũ Minh Long', '2003-09-08', 'Nam', 'Kinh', 'Không',
 '001203098123', '2021-06-05', 'Công an Hà Nội',
 'b21dcvt008@ptit.edu.vn', 'longvm@gmail.com', '0912345685',
 '25 Bà Triệu, Hai Bà Trưng, Hà Nội',
 'Phòng 405, KTX B2, Học viện CNBCVT, Hà Đông, Hà Nội',
 3, 5, 4, 'K2021', '2021-09-01', 'Chính quy', 'Đang học', 3.12, 92,
 'Vũ Văn Tùng', '0987777888', 'Kỹ sư',
 'Phạm Thị Hương', '0976777888', 'Y tá');

-- =============================================
-- COURSES (Môn học)
-- =============================================
INSERT INTO courses (course_code, name, credits, department_id, instructor_id, type, max_students, current_students, status, semester) VALUES
('INT1340', 'Lập trình Java', 3, 1, 1, 'Bắt buộc', 150, 120, 'Đang mở', 'HK2 (2024-2025)'),
('INT1341', 'Cơ sở dữ liệu', 3, 1, 2, 'Bắt buộc', 150, 150, 'Đang mở', 'HK2 (2024-2025)'),
('INT1342', 'Mạng máy tính', 3, 1, 3, 'Bắt buộc', 150, 95, 'Đang mở', 'HK2 (2024-2025)'),
('INT1343', 'Trí tuệ nhân tạo', 3, 1, 5, 'Tự chọn', 150, 80, 'Đang mở', 'HK2 (2024-2025)'),
('TEL2201', 'Xử lý tín hiệu số', 3, 3, 4, 'Bắt buộc', 150, 65, 'Đang mở', 'HK2 (2024-2025)'),
('SEC3101', 'An ninh mạng', 3, 2, 6, 'Bắt buộc', 150, 45, 'Đã đóng', 'HK2 (2024-2025)'),
('IT4060', 'Lập trình Java nâng cao', 3, 1, 1, 'Bắt buộc', 50, 38, 'Đang mở', 'HK2 (2024-2025)'),
('IT4061', 'Mạng máy tính nâng cao', 3, 1, 3, 'Bắt buộc', 50, 42, 'Đang mở', 'HK2 (2024-2025)'),
('IT4062', 'Phát triển ứng dụng Web', 3, 1, 1, 'Bắt buộc', 45, 38, 'Đang mở', 'HK2 (2024-2025)'),
('IT4063', 'Phát triển ứng dụng Di động', 3, 1, 3, 'Tự chọn', 40, 40, 'Đang mở', 'HK2 (2024-2025)'),
('IT4064', 'Trí tuệ nhân tạo nâng cao', 3, 1, 5, 'Tự chọn', 50, 42, 'Đang mở', 'HK2 (2024-2025)'),
('IT4065', 'Học máy', 3, 1, 4, 'Tự chọn', 45, 30, 'Đang mở', 'HK2 (2024-2025)');

-- =============================================
-- SEMESTERS
-- =============================================
INSERT INTO semesters (code, name, start_date, end_date, registration_start, registration_end, is_current) VALUES
('HK1 (2022-2023)', 'Học kỳ 1 - 2022-2023', '2022-09-01', '2023-01-15', '2022-08-15', '2022-08-25', false),
('HK2 (2022-2023)', 'Học kỳ 2 - 2022-2023', '2023-02-01', '2023-06-15', '2023-01-15', '2023-01-25', false),
('HK1 (2023-2024)', 'Học kỳ 1 - 2023-2024', '2023-09-01', '2024-01-15', '2023-08-15', '2023-08-25', false),
('HK2 (2023-2024)', 'Học kỳ 2 - 2023-2024', '2024-02-01', '2024-06-15', '2024-01-15', '2024-01-25', false),
('HK1 (2024-2025)', 'Học kỳ 1 - 2024-2025', '2024-09-01', '2025-01-15', '2024-08-15', '2024-08-25', false),
('HK2 (2024-2025)', 'Học kỳ 2 - 2024-2025', '2025-01-20', '2025-06-15', '2025-01-15', '2025-01-20', true);

-- =============================================
-- SCHEDULES (Thời khóa biểu)
-- =============================================
INSERT INTO schedules (course_id, instructor_id, class_id, room, day_of_week, period_start, period_end, start_time, end_time, type, week_start, week_end, semester, group_number) VALUES
-- Class D21CQCN01-B schedules
(9, 1, 1, 'A2-301', 'Thứ 2', 1, 3, '07:00:00', '09:30:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(8, 3, 1, 'A3-402', 'Thứ 3', 4, 6, '09:45:00', '12:15:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(7, 1, 1, 'A3-201', 'Thứ 2', 7, 9, '13:30:00', '16:00:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(11, 5, 1, 'A1-201', 'Thứ 4', 7, 9, '13:30:00', '16:00:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(12, 4, 1, 'A2-302', 'Thứ 5', 1, 3, '07:00:00', '09:30:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(9, 1, 1, 'A4-Lab2', 'Thứ 6', 4, 6, '09:45:00', '12:15:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(6, 6, 1, 'A1-301', 'Thứ 5', 10, 12, '16:15:00', '18:45:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),

-- Admin view schedules (general)
(1, 1, 1, 'D5-301', 'Thứ 2', 1, 3, '07:00:00', '09:35:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(3, 3, 2, 'D5-401', 'Thứ 3', 4, 6, '09:45:00', '12:20:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(2, 2, 3, 'D5-302', 'Thứ 4', 1, 3, '07:00:00', '09:35:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(4, 5, 1, 'D5-501', 'Thứ 5', 4, 6, '09:45:00', '12:20:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(5, 4, 4, 'D3-201', 'Thứ 2', 7, 9, '12:30:00', '15:05:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(6, 6, 3, 'D4-101', 'Thứ 4', 7, 9, '12:30:00', '15:05:00', 'Lý thuyết', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(1, 1, 1, 'LAB-A1', 'Thứ 7', 1, 3, '07:00:00', '09:35:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(2, 2, 3, 'LAB-B2', 'Thứ 7', 4, 6, '09:45:00', '12:20:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(3, 3, 2, 'LAB-C1', 'Thứ 3', 10, 12, '15:15:00', '17:50:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1),
(4, 5, 1, 'LAB-D2', 'Thứ 5', 10, 12, '15:15:00', '17:50:00', 'Thực hành', '2025-01-20', '2025-05-30', 'HK2 (2024-2025)', 1);

-- =============================================
-- GRADES (Điểm - HK1 2024-2025 for student B21DCCN001)
-- =============================================
INSERT INTO grades (student_id, course_id, semester, attendance_score, midterm_score, final_score, average_score, letter_grade, gpa_score, status, approved_by, approved_at) VALUES
(1, 1, 'HK1 (2024-2025)', 10, 8.5, 8.0, 8.2, 'A', 3.7, 'Đã duyệt', 1, '2025-01-10 10:00:00'),
(1, 3, 'HK1 (2024-2025)', 9, 7.5, 8.5, 8.1, 'A', 3.7, 'Đã duyệt', 1, '2025-01-10 10:00:00'),
(1, 2, 'HK1 (2024-2025)', 10, 9.0, 8.5, 8.7, 'A', 3.7, 'Đã duyệt', 1, '2025-01-10 10:00:00'),
(1, 5, 'HK1 (2024-2025)', 8, 7.0, 7.5, 7.3, 'B+', 3.3, 'Đã duyệt', 1, '2025-01-10 10:00:00'),
(1, 4, 'HK1 (2024-2025)', 10, 8.0, 8.5, 8.3, 'A', 3.7, 'Đã duyệt', 1, '2025-01-10 10:00:00'),
(1, 6, 'HK1 (2024-2025)', 9, 7.5, 7.0, 7.2, 'B+', 3.3, 'Đã duyệt', 1, '2025-01-10 10:00:00');

-- Grades for current semester (pending/mixed) - Admin view
INSERT INTO grades (student_id, course_id, semester, attendance_score, midterm_score, final_score, average_score, letter_grade, gpa_score, status) VALUES
(1, 7, 'HK2 (2024-2025)', NULL, 8.5, 9.0, 8.8, 'A', 3.7, 'Đã duyệt'),
(2, 7, 'HK2 (2024-2025)', NULL, 7.0, 8.0, 7.6, 'B+', 3.3, 'Đã duyệt'),
(1, 8, 'HK2 (2024-2025)', NULL, 6.5, 7.5, 7.1, 'B+', 3.3, 'Chờ duyệt'),
(2, 8, 'HK2 (2024-2025)', NULL, 9.0, 9.5, 9.3, 'A+', 4.0, 'Đã duyệt'),
(1, 9, 'HK2 (2024-2025)', NULL, 5.0, 6.0, 5.6, 'C+', 2.3, 'Chờ duyệt'),
(2, 9, 'HK2 (2024-2025)', NULL, 4.0, 4.5, 4.3, 'D', 1.0, 'Từ chối');

-- =============================================
-- REGISTRATIONS (Đăng ký môn học - HK2 2024-2025)
-- =============================================
INSERT INTO registrations (student_id, course_id, schedule_id, semester, status) VALUES
(1, 9, 1, 'HK2 (2024-2025)', 'Đã đăng ký'),
(1, 11, 4, 'HK2 (2024-2025)', 'Đã đăng ký'),
(1, 12, 5, 'HK2 (2024-2025)', 'Đã đăng ký'),
(2, 9, 1, 'HK2 (2024-2025)', 'Đã đăng ký'),
(2, 7, 3, 'HK2 (2024-2025)', 'Đã đăng ký');

-- =============================================
-- TUITIONS (Học phí)
-- =============================================
INSERT INTO tuitions (student_id, semester, total_credits, credit_fee, total_amount, discount, paid_amount, remaining, status, payment_method, payment_date, deadline) VALUES
-- B21DCCN001
(1, 'HK2 (2024-2025)', 18, 450000, 8100000, 0, 8100000, 0, 'Đã thanh toán', 'Chuyển khoản ngân hàng', '2025-01-15 09:30:00', '2025-01-31'),
(1, 'HK1 (2024-2025)', 17, 450000, 7650000, 0, 7650000, 0, 'Đã thanh toán', 'VNPay', '2024-09-10 14:20:00', '2024-09-30'),
(1, 'HK2 (2023-2024)', 16, 450000, 7200000, 0, 7200000, 0, 'Đã thanh toán', 'Chuyển khoản ngân hàng', '2024-01-15 10:00:00', '2024-01-31'),
(1, 'HK1 (2023-2024)', 15, 450000, 6750000, 0, 6750000, 0, 'Đã thanh toán', 'Ví MoMo', '2023-09-12 08:45:00', '2023-09-30'),
(1, 'HK2 (2022-2023)', 14, 450000, 6300000, 0, 6300000, 0, 'Đã thanh toán', 'Chuyển khoản ngân hàng', '2023-01-18 11:00:00', '2023-01-31'),
(1, 'HK1 (2022-2023)', 13, 450000, 5850000, 0, 5850000, 0, 'Đã thanh toán', 'Nộp trực tiếp', '2022-09-08 09:00:00', '2022-09-30'),
-- B21DCCN002
(2, 'HK2 (2024-2025)', 18, 450000, 8100000, 0, 8100000, 0, 'Đã thanh toán', 'VNPay', '2025-01-16 10:00:00', '2025-01-31');

-- =============================================
-- NOTIFICATIONS (Thông báo)
-- =============================================
INSERT INTO notifications (title, content, type, priority, target_role, created_by, created_at) VALUES
('Thông báo lịch thi học kỳ 2 năm học 2024-2025',
 'Phòng Đào tạo thông báo lịch thi kết thúc học phần học kỳ 2 năm học 2024-2025. Sinh viên xem chi tiết lịch thi trên hệ thống và chuẩn bị đầy đủ thẻ sinh viên khi đến phòng thi.',
 'Thông báo chung', 'Quan trọng', 'student', 1, '2025-01-20 09:30:00'),

('Nhắc nhở đăng ký môn học',
 'Thời gian đăng ký môn học học kỳ 2 sẽ kết thúc vào ngày 20/01/2025. Sinh viên chưa đăng ký vui lòng hoàn thành trước thời hạn.',
 'Đăng ký học', 'Quan trọng', 'student', 1, '2025-01-18 14:00:00'),

('Thông báo nộp học phí',
 'Học phí học kỳ 2 năm 2024-2025 đã được cập nhật. Hạn nộp học phí: 31/01/2025. Sinh viên vui lòng thanh toán đúng hạn để tránh bị khóa tài khoản.',
 'Học phí', 'Lưu ý', 'student', 1, '2025-01-15 08:00:00'),

('Điểm môn Lập trình Java đã được công bố',
 'Điểm thi kết thúc học phần môn Lập trình Java (IT4060) đã được cập nhật trên hệ thống. Sinh viên kiểm tra và phản hồi trong vòng 7 ngày nếu có thắc mắc.',
 'Điểm số', 'Thường', 'student', 1, '2025-01-12 16:45:00'),

('Lịch nghỉ Tết Nguyên đán 2025',
 'Học viện thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ ngày 25/01/2025 đến hết ngày 02/02/2025. Sinh viên quay lại học tập từ ngày 03/02/2025.',
 'Thông báo chung', 'Thường', 'all', 1, '2025-01-10 10:00:00'),

('Hội thảo: Cơ hội nghề nghiệp trong ngành CNTT',
 'Phòng Công tác sinh viên phối hợp với các doanh nghiệp tổ chức Hội thảo Cơ hội nghề nghiệp. Thời gian: 14:00 ngày 08/01/2025. Địa điểm: Hội trường A1.',
 'Sự kiện', 'Thường', 'student', 1, '2025-01-05 11:30:00');

-- =============================================
-- EVENTS (Sự kiện)
-- =============================================
INSERT INTO events (title, description, event_date, type) VALUES
('Khai giảng học kỳ II', 'Lễ khai giảng học kỳ 2 năm học 2024-2025', '2025-01-15', 'Sự kiện'),
('Đăng ký môn học', 'Hạn cuối đăng ký môn học HK2', '2025-01-20', 'Deadline'),
('Thi giữa kỳ', 'Lịch thi giữa kỳ HK2 2024-2025', '2025-03-10', 'Thi'),
('Hạn nộp học phí', 'Hạn cuối nộp học phí HK2', '2025-01-31', 'Deadline'),
('Thi cuối kỳ', 'Lịch thi cuối kỳ HK2 2024-2025', '2025-05-20', 'Thi');

-- =============================================
-- REQUESTS (Yêu cầu)
-- =============================================
INSERT INTO requests (student_id, type, title, description, status, created_at) VALUES
(1, 'Xin nghỉ học', 'Xin nghỉ học tạm thời', 'Em xin phép nghỉ học tạm thời 1 học kỳ vì lý do sức khỏe.', 'Chờ xử lý', '2025-01-14 10:00:00'),
(2, 'Xác nhận', 'Xác nhận sinh viên', 'Em cần giấy xác nhận sinh viên để làm hồ sơ vay vốn.', 'Chờ xử lý', '2025-01-13 09:00:00'),
(3, 'Chuyển ngành', 'Chuyển ngành học', 'Em muốn chuyển từ ngành An toàn thông tin sang Công nghệ thông tin.', 'Chờ xử lý', '2025-01-12 14:30:00');

-- =============================================
-- SETTINGS
-- =============================================
INSERT INTO settings (setting_key, setting_value, description) VALUES
('system_name', 'Hệ thống quản lý thông tin sinh viên PTIT', 'Tên hệ thống'),
('current_semester', 'HK2 (2024-2025)', 'Học kỳ hiện tại'),
('language', 'vi', 'Ngôn ngữ'),
('timezone', 'Asia/Ho_Chi_Minh', 'Múi giờ'),
('email_notifications', 'true', 'Bật/tắt thông báo email'),
('system_alerts', 'true', 'Bật/tắt cảnh báo hệ thống'),
('auto_backup', 'true', 'Tự động sao lưu'),
('admin_name', 'Admin PTIT', 'Tên admin'),
('admin_email', 'admin@ptit.edu.vn', 'Email admin'),
('admin_phone', '024.3456.7890', 'SĐT admin'),
('last_backup', '2025-01-15 14:30:00', 'Lần sao lưu cuối');