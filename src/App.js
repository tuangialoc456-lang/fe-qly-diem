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
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import SubjectManagement from './pages/SubjectManagement';
import ClassManagement from './pages/ClassManagement';
import GradeManagement from './pages/GradeManagement';
import Transcript from './pages/Transcript';
import AuditLog from './pages/AuditLog';
import StudentPortal from './pages/StudentPortal';
import LecturerGradeInput from './pages/LecturerGradeInput';
import StudentTranscript from './pages/StudentTranscript';

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
            <ProtectedRoute roles={['ADMIN']}>
              <GradeManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nhap-diem-giang-vien"
          element={
            <ProtectedRoute roles={['GIANG_VIEN']}>
              <LecturerGradeInput />
            </ProtectedRoute>
          }
        />

        {/* TRANG DÀNH RIÊNG CHO SINH VIÊN - ADMIN VÀ GIẢNG VIÊN BỊ CHẶN HOÀN TOÀN */}
        <Route
          path="/sinh-vien/portal"
          element={
            <ProtectedRoute roles={['SINH_VIEN']}>
              <StudentPortal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bang-diem"
          element={
            <ProtectedRoute roles={['ADMIN', 'GIANG_VIEN']}>
              <StudentTranscript />
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