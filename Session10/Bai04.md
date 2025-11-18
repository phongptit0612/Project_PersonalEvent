Use Case: Đăng ký tài khoản

Tên Use Case

Đăng ký tài khoản (Register Account)

Actor

Người dùng (User)

Mục tiêu

Cho phép người dùng tạo tài khoản mới để truy cập hệ thống.

Điều kiện trước (Precondition)

Người dùng chưa có tài khoản trong hệ thống.

Người dùng truy cập được trang đăng ký.

Luồng chính (Main Flow)

Người dùng mở trang đăng ký.

Hệ thống hiển thị form đăng ký (Họ tên, Email, Mật khẩu, Xác nhận mật khẩu).

Người dùng nhập đầy đủ thông tin yêu cầu.

Người dùng nhấn nút “Đăng ký”.

Hệ thống kiểm tra tính hợp lệ của dữ liệu.

Hệ thống lưu tài khoản mới vào cơ sở dữ liệu.

Hệ thống thông báo đăng ký thành công và chuyển đến trang đăng nhập hoặc tự động đăng nhập.

Ngoại lệ (Exception Flow)

E1 – Email trùng lặp: Hệ thống hiển thị thông báo “Email đã tồn tại”.

E2 – Email sai định dạng: Yêu cầu người dùng nhập email hợp lệ.

E3 – Mật khẩu yếu / không đủ độ dài: Hệ thống yêu cầu nhập mật khẩu đạt chuẩn.

E4 – Xác nhận mật khẩu không khớp: Hiển thị lỗi và yêu cầu nhập lại.

E5 – Thiếu thông tin bắt buộc: Hệ thống báo lỗi và không cho tiếp tục đăng ký.

Điều kiện sau (Postcondition)

Tài khoản mới được tạo trong hệ thống.

Người dùng có thể đăng nhập bằng email vừa đăng ký.

Ghi chú (Tùy chọn)

Mật khẩu phải được mã hóa trước khi lưu.

Email được dùng để xác thực hoặc khôi phục mật khẩu.