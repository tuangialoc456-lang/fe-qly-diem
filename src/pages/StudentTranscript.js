import React, { useState, useEffect, useContext } from 'react';
import { classAPI, gradeAPI, transcriptAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function StudentTranscript() {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (user?.vaiTro === 'GIANG_VIEN' || user?.vaiTro === 'ADMIN') {
      loadClasses();
    } else if (user?.vaiTro === 'SINH_VIEN') {
      loadMyTranscript();
    }
  }, [user]);

  // Tải danh sách lớp dành cho Giảng viên / Admin
  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.danhSach();
      const classList = res.data || [];
      
      // Nếu là giảng viên, lọc danh sách lớp do giảng viên này dạy
      const filtered = user?.vaiTro === 'GIANG_VIEN' 
        ? classList.filter(c => c.giangVienId === user.id || c.giangVien?.id === user.id)
        : classList;

      setClasses(filtered);
      if (filtered.length > 0) {
        setSelectedClass(filtered[0].id);
        loadClassGrades(filtered[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi tải danh sách lớp học phần' });
      setLoading(false);
    }
  };

  // Tải điểm theo lớp
  const loadClassGrades = async (classId) => {
    try {
      setLoading(true);
      const res = await gradeAPI.diemTheoLop(classId);
      setGrades(res.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi tải bảng điểm' });
    } finally {
      setLoading(false);
    }
  };

  // Tải bảng điểm cá nhân cho Sinh viên
  const loadMyTranscript = async () => {
    try {
      setLoading(true);
      const res = await transcriptAPI.bangDiem();
      setGrades(res.data || []);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi tải bảng điểm cá nhân' });
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) loadClassGrades(classId);
  };

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>📊 {user?.vaiTro === 'SINH_VIEN' ? 'Bảng Điểm Của Tôi' : 'Bảng Điểm Sinh viên'}</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {(user?.vaiTro === 'GIANG_VIEN' || user?.vaiTro === 'ADMIN') && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold' }}>Chọn lớp học phần:</label>
            <select 
              value={selectedClass} 
              onChange={handleClassChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">-- Chọn lớp học phần --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.maLop} - {cls.monHoc?.tenMonHoc || 'Môn học'} (HK{cls.hocKy} - {cls.namHoc})
                </option>
              ))}
            </select>
          </div>
        )}

        {grades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
            Không có dữ liệu bảng điểm.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>STT</th>
                {user?.vaiTro !== 'SINH_VIEN' && <th>Mã SV</th>}
                {user?.vaiTro !== 'SINH_VIEN' && <th>Họ và Tên</th>}
                {user?.vaiTro === 'SINH_VIEN' && <th>Môn học</th>}
                <th>Chuyên cần</th>
                <th>Giữa kỳ</th>
                <th>Cuối kỳ</th>
                <th>Điểm tổng kết</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((item, index) => {
                const cc = item.diemChuyenCan ?? 0;
                const gk = item.diemGiuaKy ?? 0;
                const ck = item.diemCuoiKy ?? 0;
                const tongKet = (cc * 0.2 + gk * 0.3 + ck * 0.5).toFixed(1);

                return (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    {user?.vaiTro !== 'SINH_VIEN' && (
                      <td><strong>{item.sinhVien?.maSinhVien || item.sinhVien?.email || '-'}</strong></td>
                    )}
                    {user?.vaiTro !== 'SINH_VIEN' && <td>{item.sinhVien?.hoTen || '-'}</td>}
                    {user?.vaiTro === 'SINH_VIEN' && <td>{item.lopHocPhan?.monHoc?.tenMonHoc || '-'}</td>}
                    <td>{item.diemChuyenCan ?? '-'}</td>
                    <td>{item.diemGiuaKy ?? '-'}</td>
                    <td>{item.diemCuoiKy ?? '-'}</td>
                    <td><strong style={{ color: tongKet >= 4.0 ? '#2e7d32' : '#c62828' }}>{tongKet}</strong></td>
                    <td>
                      {item.daKy ? (
                        <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>🔒 Đã chốt & ký</span>
                      ) : (
                        <span style={{ color: '#e65100' }}>⏳ Chưa chốt</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}