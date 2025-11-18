Bảng yêu cầu phần mềm: Mơ hồ → Rõ ràng & Kiểm thử được

| Yêu cầu mơ hồ          | Yêu cầu viết lại (cụ thể)                                                 | Lý do                                          |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Hệ thống thân thiện    | Người dùng mới hoàn tất đăng ký trong ≤ **2 phút** mà không cần hướng dẫn | Tạo tiêu chí usability đo được                 |
| Trang web chạy nhanh   | Trang chủ tải ≤ **2 giây** trên mạng 20Mbps                               | “Nhanh” → thành số đo hiệu năng                |
| Tìm kiếm tiện lợi      | Kết quả hiển thị trong ≤ **500ms** và có bộ lọc: giá, loại, tên           | Biến tính từ cảm tính → tiêu chí rõ ràng       |
| Ứng dụng bảo mật tốt   | Mật khẩu mã hóa **BCrypt**; khóa tài khoản sau **5** lần sai              | Đưa tiêu chuẩn bảo mật có thể kiểm thử         |
| Giao diện đẹp, dễ nhìn | Font ≥ **14px**, khoảng cách ≥ **8px**, màu đạt chuẩn tương phản WCAG AA  | Dùng tiêu chí UI/UX đo được                    |
| Hệ thống linh hoạt     | Admin thêm/sửa/xóa danh mục **không cần can thiệp mã nguồn**              | Định nghĩa rõ thế nào là “linh hoạt”           |
| Người dùng hài lòng    | ≥ **85%** người dùng chấm ≥ **4/5** sau khảo sát                          | Chuyển cảm xúc → thành dữ liệu khảo sát        |
| Ứng dụng ổn định       | Uptime ≥ **99.5%**; lỗi 5xx ≤ **0.1%** request                            | SLA đo đếm được thay cho “ổn định” chung chung |


Vì sao cách viết lại phù hợp hơn?
=> Các yêu cầu mới mô tả chính xác cái gì cần đạt được, thay vì dùng từ chung chung như “đẹp”, “linh hoạt”, “nhanh”.
Đo lường được
=> Mỗi yêu cầu đều có chỉ số, giới hạn, ngưỡng, giúp kiểm thử bằng số liệu.
Kiểm thử được
=> Có thể tạo test case:

Đếm thời gian tải

Thử đăng nhập sai 5 lần

Đo mức uptime

Kiểm tra survey
→ Điều mà yêu cầu mơ hồ không thể làm.

Giảm hiểu nhầm giữa BA – Dev – Tester
=> Yêu cầu rõ ràng giúp team lập trình & test hiểu giống nhau, tránh triển khai sai.