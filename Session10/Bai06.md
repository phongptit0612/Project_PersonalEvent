Phân tích yêu cầu SRS: “Người dùng nên có trải nghiệm tốt với trang tìm kiếm.”
1. Điểm chưa rõ trong yêu cầu

“Trải nghiệm tốt” là khái niệm mơ hồ, không đo được.

Không chỉ rõ yếu tố nào tạo nên “trải nghiệm tốt” (tốc độ? giao diện? độ chính xác?).

Không có tiêu chí định lượng để đánh giá.

Không biết phạm vi áp dụng: tốc độ tìm kiếm, số kết quả, UI, hay độ chính xác?

2. Vì sao chưa đạt chuẩn SRS

Không cụ thể (Specific).

Không đo lường được (Measurable).

Không thể kiểm thử (Testable).

Không dựa trên tiêu chí khách quan, chỉ mang tính cảm nhận.

Không thể dùng để làm tiêu chuẩn nghiệm thu.

3. Cách viết lại rõ ràng hơn (có thể đo lường)

Phiên bản cải tiến:

“Trang tìm kiếm phải hiển thị kết quả trong ≤ 2 giây với từ khóa hợp lệ.”

“Tỷ lệ trả về kết quả chính xác phải đạt ≥ 90% theo bộ dữ liệu kiểm thử.”

“Giao diện tìm kiếm phải hiển thị tối thiểu 5 gợi ý từ khóa khi người dùng nhập.”

(Chỉ cần chọn 1 trong 3 nếu muốn yêu cầu ngắn gọn – mình liệt kê 3 phiên bản để bạn lựa chọn tùy mục tiêu SRS)

4. Có thể kiểm thử như thế nào

Kiểm thử hiệu năng: đo thời gian phản hồi phải ≤ 2 giây.

Kiểm thử độ chính xác: nhập bộ 100 từ khóa mẫu, kết quả phải đúng ≥ 90%.

Kiểm thử UI/UX: kiểm tra gợi ý từ khóa xuất hiện khi nhập.

Kiểm thử người dùng thực tế: survey đánh giá mức hài lòng ≥ 80% (tùy chọn).