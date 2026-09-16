# Frontend - Hệ thống quản lý điểm & bảng điểm sinh viên

React 18 + React Router v6, dùng Axios gọi API backend.

## Cài đặt & Chạy

```bash
cd frontend-diem
npm install
cp .env.example .env
# Chỉnh sửa .env nếu backend chạy trên port khác
npm start
```

Ứng dụng sẽ mở tại `http://localhost:3000`

## Tài khoản mặc định

```
Email: admin@school.edu.vn
Mật khẩu: Admin@123
```

## Tính năng

### Admin 🔐
- Quản lý người dùng (tạo/sửa/xóa)
- Quản lý môn học
- Quản lý lớp học phần
- Nhập/sửa điểm
- **Chốt & ký số** bảng điểm (khóa điểm chính thức)
- Xem nhật ký thao tác (audit log)

### Giảng viên 👨‍🏫
- Xem danh sách lớp dạy
- Nhập/sửa điểm (chỉ lớp mình dạy)
- Không sửa được sau khi lớp bị chốt
- Xem bảng điểm sinh viên

### Sinh viên 👤
- Xem bảng điểm của chính mình
- Xác thực chữ ký số ✅/❌
- Cảnh báo nếu phát hiện sửa điểm trái phép

## Cấu trúc thư mục

```
frontend-diem/
  public/
    index.html
  src/
    components/       # Header, Sidebar, Alert, Loading, ProtectedRoute
    pages/           # Login, Dashboard, UserManagement, ...
    contexts/        # AuthContext (quản lý authentication)
    services/        # API wrapper (axios)
    styles/          # CSS chung
    App.js           # Router chính
    index.js         # Entry point
  package.json
```

## API Endpoints (được gọi từ frontend)

Tất cả request cần header: `Authorization: Bearer <token>`

- `POST /auth/dang-nhap` - Đăng nhập
- `GET /auth/toi` - Lấy thông tin cá nhân
- `GET/POST/PUT/DELETE /nguoi-dung` - Quản lý người dùng (Admin)
- `GET /mon-hoc` - Danh sách môn học
- `POST/PUT/DELETE /mon-hoc` - Quản lý môn (Admin)
- `GET /lop-hoc-phan` - Danh sách lớp
- `POST /lop-hoc-phan` - Tạo lớp (Admin)
- `POST /lop-hoc-phan/:id/sinh-vien` - Thêm SV vào lớp (Admin)
- `GET /diem/lop/:classId` - Xem điểm cả lớp
- `PUT /diem/:enrollmentId` - Cập nhật điểm
- `POST /diem/lop/:classId/chot-ky` - Chốt & ký số (Admin)
- `GET /diem/me` - Điểm của mình (SV)
- `GET /bang-diem/:studentId` - Bảng điểm + xác thực chữ ký
- `GET /nhat-ky` - Nhật ký thao tác (Admin)

## Lưu ý

- Token JWT được lưu vào `localStorage`
- Nếu token hết hạn, sẽ tự redirect về login
- Tất cả request tự động thêm header `Authorization` dựa vào token trong `localStorage`
