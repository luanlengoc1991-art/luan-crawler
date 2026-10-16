# LUAN CRAWLER — Landing Page

Giao diện toàn màn hình theo phong cách LUAN GROUP, tích hợp vào Cloudflare Worker hiện có.

## Bảng theo dõi (watchlist)

- Ô **Thiết lập nguồn dữ liệu** nằm ngay đầu trang: dán nhiều link, đặt tên gợi nhớ, nhóm, chu kỳ tự cập nhật (mặc định 60 phút) và loại thay đổi cần báo đỏ (căn mới, đã bán / gỡ, đổi giá, khác).
- Nguồn, dữ liệu tải về và lịch sử thay đổi lưu trong Cloudflare D1 (`luan-crawler-db`, binding `DB`). Bảng được tạo tự động ở lần gọi đầu tiên.
- Cron `*/15 * * * *`: mỗi 15 phút máy chủ tải lại các nguồn đến hạn theo chu kỳ riêng, kể cả khi trình duyệt đã tắt.
- So sánh từng dòng theo khoá (mã căn với Vhub, cột đầu tiên duy nhất với bảng HTML). Có thay đổi thì nguồn báo đỏ cho tới khi bấm ✓ Đã xem; không đổi thì tích xanh. Lần quét đầu tiên chỉ lưu mốc so sánh.
- Giao diện tự làm mới mỗi 60 giây; có nút ↻ Cập nhật ngay cho từng nguồn và cho tất cả.

## Các đường dẫn

- `/` — giao diện landing page
- `/api/dashboard/status` — kiểm tra trạng thái và cấu hình API
- `/api/dashboard/crawl` — POST JSON `{"url":"https://..."}` để quét một nguồn
- `/api/dashboard/export` — POST JSON `{"sources":[...]}` để tải Excel
- `/api/watch/sources` — GET danh sách, POST `{"urls":[...],"name","tag","intervalMin","alertOn":[...]}` để thêm nguồn
- `/api/watch/sources/:id/check` (POST, quét ngay), `/seen` (POST), `/items`, `/changes`, `/export.xlsx` (GET), PATCH / DELETE `/api/watch/sources/:id`
- `/api/watch/changes` — dòng thời gian thay đổi; `/api/watch/seen-all` (POST)
- `/mcp` — **giữ nguyên** máy chủ MCP tra cứu bảng hàng
- `/export.xlsx` — **giữ nguyên** xuất Excel quỹ căn đã có

## Tính năng giao diện

- Thêm nhiều URL (tối đa 50 nguồn được lưu trong trình duyệt).
- Mỗi lượt quét tối đa 12 nguồn, chạy tối đa 3 tác vụ song song.
- Xem trước bảng dữ liệu, lọc và xuất Excel/CSV/JSON.
- Quét lại theo chu kỳ 5/15/30/60 phút **khi trang đang mở**.

## Triển khai

```bash
npm ci
npx wrangler dev
npm run deploy
```

Cần kiểm tra bằng `npx wrangler dev` trước khi xuất bản. Việc cập nhật GitHub không tự động triển khai Cloudflare nếu chưa có CI/CD.

## Bảo mật và giới hạn

- Worker chỉ tải HTTPS từ các miền được cho phép. Mặc định gồm `vhub.com.vn`, `salepro.com`, `luangroup.asia`, `vinhomegreencity.com.vn`.
- Muốn bổ sung miền, đặt biến môi trường `DASHBOARD_ALLOWED_HOSTS` chứa các miền, phân cách bằng dấu phẩy.
- Để bảo vệ API quét và tải Excel, thiết lập bí mật `DASHBOARD_TOKEN` bằng `npx wrangler secret put DASHBOARD_TOKEN`. Sau đó nhập mã tại mục Cài đặt truy cập trong giao diện.
- Không lưu token vào mã nguồn hay repository công khai.
- Chỉ xử lý HTML tải trực tiếp và JSON công khai. Website tải dữ liệu bằng JavaScript, yêu cầu đăng nhập hoặc chặn bot có thể cần bộ chuyển đổi riêng / Playwright hoặc Crawl4AI self-host.
- API bảng theo dõi đang công khai nếu chưa đặt `DASHBOARD_TOKEN`: ai có link đều thêm / xoá được nguồn. Nên đặt token khi dùng thật.

## Thiết kế

Phong cách emerald theo https://luangroup.asia/du-an: chỉ dùng font Be Vietnam Pro, nền xanh rêu đậm `#03261d`, gradient mint `#8ef0c4 → #5fe0a8`, nút và nhãn dạng viên thuốc, thẻ bo góc 24–32px, thẻ kính mờ trên hero tối, tiêu đề lớn với khoảng cách chữ khít. Không sao chép pixel-perfect.
