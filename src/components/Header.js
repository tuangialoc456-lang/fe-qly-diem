import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
  const { user, dang_xuat } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDangXuat = () => {
    dang_xuat();
    navigate('/dang-nhap');
  };

  return (
    <header>
      <div className="header-content">
        <h1>📚 Quản lý Điểm Sinh viên</h1>
        {user && (
          <div className="user-info">
            <span>
              {user.hoTen} ({user.vaiTro})
            </span>
            <button onClick={handleDangXuat}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
}
