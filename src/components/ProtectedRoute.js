import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loading from '../components/Loading';

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, dang_tai } = useContext(AuthContext);

  if (dang_tai) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.vaiTro)) {
    return (
      <div className="main-content">
        <div className="card">
          <h2>❌ Từ chối truy cập</h2>
          <p>Bạn không có quyền truy cập trang này.</p>
          <p>Vai trò của bạn: <strong>{user.vaiTro}</strong></p>
        </div>
      </div>
    );
  }

  return children;
}
