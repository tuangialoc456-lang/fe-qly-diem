import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Loading from './components/Loading';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // <-- Import trang Quên mật khẩu
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SubjectManagement from './pages/SubjectManagement';
import ClassManagement from './pages/ClassManagement';
import GradeManagement from './pages/GradeManagement';
import Transcript from './pages/Transcript';
import AuditLog from './pages/AuditLog';

export default function App() {
  const { user, dang_tai } = useContext(AuthContext);

  if (dang_tai) {
    return <Loading />;
  }

  // Nếu chưa đăng nhập, cho phép định tuyến các trang Public
  if (!user) {
    return (
      <Routes>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/quen-mat-khau" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/dang-nhap" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Header />
      <Sidebar />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN', 'GIANG_VIEN', 'SINH_VIEN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nguoi-dung"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mon-hoc"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <SubjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lop-hoc-phan"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <ClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diem"
          element={
            <ProtectedRoute roles={['ADMIN', 'GIANG_VIEN']}>
              <GradeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nhat-ky"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AuditLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bang-diem"
          element={
            <ProtectedRoute roles={['ADMIN', 'GIANG_VIEN', 'SINH_VIEN']}>
              <Transcript />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bang-diem/:studentId"
          element={
            <ProtectedRoute roles={['ADMIN', 'GIANG_VIEN']}>
              <Transcript />
            </ProtectedRoute>
          }
        />

        <Route path="/dang-nhap" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}