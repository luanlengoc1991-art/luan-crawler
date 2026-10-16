# LUAN CRAWLER — Landing Page

Giao diện toàn màn hình theo phong cách LUAN GROUP, tích hợp vào Cloudflare Worker hiện có.

## Các đường dẫn

- `/` — giao diện landing page
- `/api/dashboard/status` — kiểm tra trạng thái và cấu hình API
- `/api/dashboard/crawl` — POST JSON `{"url":"https://..."}` để quét một nguồn
- `/api/dashboard/export` — POST JSON `{"sources":[...]}` để tải Excel
- `/mcp` — **giữ nguyên** máy chủ MCP tra cứu bảng hàng
- `/export.xlsx` — **giữ nguyên** xuất Excel quỹ căn đã có

## Tính năng giao diện

- Thêm nhiều URL (tối đa 50 nguồn được lưu trong trình duyệt).
- Mỗi lượt quét tối đa 12 nguồn, chạy tối đa 3 tác vụ song song.
- Xem trước bảng dữ liệu, lọc và xuất Excel/CSV/JSON.
- Quét lại theo chu kỳ 5/15/30/60 phút **khi trang đang mở**.
- Danh sách URL lưu vào `localStorage` và không đồng bộ giữa các thiết bị.

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
- Không có cập nhật 24/7 trên máy chủ. Muốn làm mới ngay cả khi tắt trình duyệt phải thêm Cloudflare Cron và cơ sở dữ liệu.

## Thiết kế

Sử dụng Be Vietnam Pro, DM Serif Display, nền trắng ngà, xanh thương hiệu và điểm nhấn vàng đồng. Tham khảo cấu trúc trình bày của https://luangroup.asia/gioi-thieu nhưng không sao chép pixel-perfect.
