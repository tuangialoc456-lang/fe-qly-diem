import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuADMIN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/nguoi-dung', label: 'Quản lý Người dùng' },
    { path: '/mon-hoc', label: 'Quản lý Môn học' },
    { path: '/lop-hoc-phan', label: 'Quản lý Lớp học phần' },
    { path: '/diem', label: 'Quản lý Điểm' },
    { path: '/nhat-ky', label: 'Nhật ký Thao tác' },
  ];

  const menuGIANG_VIEN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/diem', label: 'Nhập/Sửa Điểm' },
    { path: '/bang-diem', label: 'Bảng Điểm Sinh viên' },
  ];

  const menuSINH_VIEN = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/bang-diem', label: 'Bảng Điểm Của Tôi' },
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
