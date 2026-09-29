import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Menu dành riêng cho Admin (Quản trị viên) - Hoàn toàn không có portal của Sinh viên
  const menuADMIN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/nguoi-dung', label: 'Quản lý Người dùng' },
    { path: '/mon-hoc', label: 'Quản lý Môn học' },
    { path: '/lop-hoc-phan', label: 'Quản lý Lớp học phần' },
    { path: '/diem', label: 'Quản lý & Ký số Điểm' },
    { path: '/nhat-ky', label: 'Nhật ký Thao tác' },
  ];

  // Menu dành riêng cho Giảng viên
  const menuGIANG_VIEN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/nhap-diem-giang-vien', label: '✏️ Nhập điểm Lớp học' },
    { path: '/bang-diem', label: 'Bảng Điểm Sinh viên' },
  ];

  // Menu DÀNH RIÊNG CHO SINH VIÊN (1 trang duy nhất gộp Đăng ký & Xem điểm)
  const menuSINH_VIEN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/sinh-vien/portal', label: '🎓 Đăng ký học & Xem điểm' },
  ];

  let menu = [];
  if (user?.vaiTro === 'ADMIN') menu = menuADMIN;
  else if (user?.vaiTro === 'GIANG_VIEN') menu = menuGIANG_VIEN;
  else if (user?.vaiTro === 'SINH_VIEN') menu = menuSINH_VIEN;

  return (
    <aside className="sidebar">
      <nav>
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}