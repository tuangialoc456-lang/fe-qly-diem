import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { userAPI, subjectAPI, classAPI, gradeAPI } from '../services/api';
import Loading from '../components/Loading';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = { hocSinh: 0, giangVien: 0, monHoc: 0, lop: 0, diemNhap: 0 };

        if (user?.vaiTro === 'ADMIN') {
          const [students, teachers, subjects, classes] = await Promise.all([
            userAPI.danhSach('SINH_VIEN'),
            userAPI.danhSach('GIANG_VIEN'),
            subjectAPI.danhSach(),
            classAPI.danhSach(),
          ]);
          statsData.hocSinh = students.data.length;
          statsData.giangVien = teachers.data.length;
          statsData.monHoc = subjects.data.length;
          statsData.lop = classes.data.length;
        } else if (user?.vaiTro === 'GIANG_VIEN') {
          const classes = await classAPI.danhSach();
          statsData.lop = classes.data.length;
        }

        setStats(statsData);
      } catch (err) {
        console.error('Lỗi khi tải thống kê:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.vaiTro]);

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>👋 Chào mừng, {user?.hoTen}!</h2>
        <p>Vai trò: <strong>{user?.vaiTro}</strong></p>
      </div>

      {user?.vaiTro === 'ADMIN' && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>👥 Học Sinh</h3>
            <div className="number">{stats?.hocSinh || 0}</div>
          </div>
          <div className="stat-card">
            <h3>👨‍🏫 Giảng Viên</h3>
            <div className="number">{stats?.giangVien || 0}</div>
          </div>
          <div className="stat-card">
            <h3>📖 Môn Học</h3>
            <div className="number">{stats?.monHoc || 0}</div>
          </div>
          <div className="stat-card">
            <h3>🎓 Lớp Học Phần</h3>
            <div className="number">{stats?.lop || 0}</div>
          </div>
        </div>
      )}

      {user?.vaiTro === 'GIANG_VIEN' && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>🎓 Lớp Dạy</h3>
            <div className="number">{stats?.lop || 0}</div>
          </div>
        </div>
      )}

      {user?.vaiTro === 'SINH_VIEN' && (
        <div className="card">
          <h2>📝 Thông Tin Học Tập</h2>
          <p>Bạn có thể xem bảng điểm của mình tại mục "Bảng Điểm Của Tôi"</p>
        </div>
      )}
    </div>
  );
}
