---------------------------------------------------------
| LOGO                          | User: Nguyễn An       |
---------------------------------------------------------
| [Trang chủ]  [Khóa học]  [Lịch học]  [Tài khoản]     |
---------------------------------------------------------

                    ĐĂNG KÝ KHÓA HỌC

---------------------------------------------------------
| 1. Thông tin khóa học                                    |
|-----------------------------------------------------------|
| Tên khóa học:  Lập trình Python cơ bản                   |
| Giảng viên :   Trần Minh Khoa                            |
| Mô tả      :   Khóa học giúp người mới làm quen Python   |
-----------------------------------------------------------|

---------------------------------------------------------
| 2. Xác nhận đăng ký                                      |
|-----------------------------------------------------------|
| Bạn có muốn đăng ký vào khóa học này?                    |
|                                                           |
| [ĐĂNG KÝ]     [HỦY BỎ]                                    |
---------------------------------------------------------
Giải thích vùng chức năng

Header: logo + tên người dùng đang đăng nhập

Menu: điều hướng trang

Thông tin khóa học: hiển thị chi tiết để người dùng xác nhận

Xác nhận đăng ký: chứa nút hành động chính


Database Schema cho Use Case: Đăng ký khóa học
Để thực hiện chức năng “Đăng ký khóa học”, cần 3 bảng:

1. User – lưu thông tin người học
2. Course – lưu thông tin khóa học
3. Enrollment – lưu đăng ký (User đăng ký Course)

Bảng 1 — User
| Tên cột    | Kiểu dữ liệu | Mô tả              | Ghi chú |
| ---------- | ------------ | ------------------ | ------- |
| user_id    | INT          | Mã người dùng      | PK      |
| full_name  | VARCHAR(100) | Tên người dùng     |         |
| email      | VARCHAR(100) | Email đăng nhập    | UNIQUE  |
| password   | VARCHAR(255) | Mật khẩu đã mã hóa |         |
| created_at | DATETIME     | Ngày tạo tài khoản |         |

Bảng 2 — Course
| Tên cột     | Kiểu dữ liệu | Mô tả          | Ghi chú |
| ----------- | ------------ | -------------- | ------- |
| course_id   | INT          | Mã khóa học    | PK      |
| title       | VARCHAR(150) | Tên khóa học   |         |
| description | TEXT         | Mô tả khóa học |         |
| instructor  | VARCHAR(100) | Tên giảng viên |         |
| created_at  | DATETIME     | Ngày tạo       |         |

Bảng 3 — Enrollment
| Tên cột       | Kiểu dữ liệu               | Mô tả              | Ghi chú                |
| ------------- | -------------------------- | ------------------ | ---------------------- |
| enrollment_id | INT                        | Mã đăng ký         | PK                     |
| user_id       | INT                        | Người đăng ký      | FK → User(user_id)     |
| course_id     | INT                        | Khóa học đăng ký   | FK → Course(course_id) |
| enrolled_at   | DATETIME                   | Thời điểm đăng ký  |                        |
| status        | ENUM('active','cancelled') | Trạng thái đăng ký |                        |
