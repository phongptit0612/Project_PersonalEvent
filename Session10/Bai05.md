Test Case cho chức năng: Thay đổi mật khẩu
Test Case 1 – Thành công (Happy Path)

Test ID: TC-001
Mô tả: Thay đổi mật khẩu thành công khi người dùng nhập đúng toàn bộ thông tin.

Input:

Đăng nhập vào hệ thống

Mật khẩu cũ: OldPass123!

Mật khẩu mới: NewPass123!

Xác nhận mật khẩu mới: NewPass123!

Nhấn “Xác nhận”

Kỳ vọng:

Hệ thống hiển thị thông báo: “Thay đổi mật khẩu thành công.”

Mật khẩu mới được lưu vào hệ thống

Người dùng có thể đăng nhập lại bằng mật khẩu mới

Kết quả: (Điền sau khi test)

Test Case 2 – Nhập sai mật khẩu cũ (Invalid Case)

Test ID: TC-002
Mô tả: Người dùng nhập sai mật khẩu cũ nên không thể đổi mật khẩu.

Input:

Đăng nhập vào hệ thống

Mật khẩu cũ: WrongPass!

Mật khẩu mới: ValidPass123!

Xác nhận mật khẩu mới: ValidPass123!

Nhấn “Xác nhận”

Kỳ vọng:

Hệ thống hiển thị lỗi: “Mật khẩu cũ không đúng.”

Không thay đổi mật khẩu

Người dùng vẫn giữ mật khẩu cũ trong hệ thống

Kết quả: (Điền sau khi test)

Test Case 3 – Mật khẩu xác nhận không khớp / để trống

Test ID: TC-003
Mô tả: Người dùng nhập mật khẩu mới nhưng xác nhận mật khẩu không khớp hoặc bỏ trống.

Input:

Mật khẩu cũ: OldPass123!

Mật khẩu mới: NewPassword123!

Xác nhận mật khẩu mới: (để trống hoặc nhập: NewPassXX!)

Nhấn “Xác nhận”

Kỳ vọng:

Hệ thống hiển thị thông báo lỗi:

Nếu để trống: “Vui lòng nhập lại mật khẩu xác nhận.”

Nếu không khớp: “Mật khẩu xác nhận không trùng khớp.”

Không thực hiện đổi mật khẩu

Kết quả: (Điền sau khi test)