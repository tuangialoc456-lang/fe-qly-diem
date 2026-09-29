import React, { useState, useEffect } from 'react';
import { gradeAPI, classAPI } from '../services/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function LecturerGradeInput() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editGrades, setEditGrades] = useState({});

  useEffect(() => {
    loadLecturerClasses();
  }, []);

  // Tải danh sách lớp học phần do Giảng viên phụ trách
  const loadLecturerClasses = async () => {
    try {
      setLoading(true);
      const res = await classAPI.danhSach();
      // Lấy thông tin user hiện tại từ localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Lọc ra các lớp do giảng viên này giảng dạy
      const myClasses = (res.data || []).filter(
        (cls) => cls.giangVienId === user.id || cls.giangVien?.id === user.id
      );
      setClasses(myClasses);
      if (myClasses.length > 0) {
        setSelectedClass(myClasses[0].id);
        loadGradesByClass(myClasses[0].id);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi tải danh sách lớp học phần' });
    } finally {
      setLoading(false);
    }
  };

  // Tải bảng điểm của lớp được chọn
  const loadGradesByClass = async (classId) => {
    try {
      setLoading(true);
      const res = await gradeAPI.diemTheoLop(classId);
      const data = res.data || [];
      setStudents(data);

      // Khởi tạo object dữ liệu điểm tạm thời để chỉnh sửa
      const initialEdits = {};
      data.forEach((item) => {
        initialEdits[item.id] = {
          diemChuyenCan: item.diemChuyenCan ?? '',
          diemGiuaKy: item.diemGiuaKy ?? '',
          diemCuoiKy: item.diemCuoiKy ?? '',
        };
      });
      setEditGrades(initialEdits);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi tải điểm sinh viên' });
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) loadGradesByClass(classId);
  };

  const handleGradeChange = (enrollmentId, field, value) => {
    setEditGrades((prev) => ({
      ...prev,
      [enrollmentId]: {
        ...prev[enrollmentId],
        [field]: value === '' ? '' : parseFloat(value),
      },
    }));
  };

  // Lưu điểm cho một sinh viên
  const handleSaveGrade = async (enrollmentId) => {
    try {
      setSaving(true);
      const gradeData = editGrades[enrollmentId];
      await gradeAPI.capNhatDiem(enrollmentId, gradeData);
      setAlert({ type: 'success', message: 'Cập nhật điểm thành công!' });
      await loadGradesByClass(selectedClass);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi cập nhật điểm' });
    } finally {
      setSaving(false);
    }
  };

  if (loading && classes.length === 0) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>✏️ Nhập điểm Lớp học phần (Giảng viên)</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold' }}>Chọn lớp giảng dạy:</label>
          <select value={selectedClass} onChange={handleClassChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">-- Chọn lớp học phần --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.maLop} - {cls.monHoc?.tenMonHoc || 'Môn học'} - HK{cls.hocKy} ({cls.namHoc})
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <>
            {students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                Lớp này chưa có sinh viên đăng ký.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã SV</th>
                    <th>Họ và Tên</th>
                    <th>Chuyên cần (20%)</th>
                    <th>Giữa kỳ (30%)</th>
                    <th>Cuối kỳ (50%)</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td><strong>{item.sinhVien?.maSinhVien || item.sinhVien?.email || '-'}</strong></td>
                      <td>{item.sinhVien?.hoTen || '-'}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={item.daKy}
                          value={editGrades[item.id]?.diemChuyenCan}
                          onChange={(e) => handleGradeChange(item.id, 'diemChuyenCan', e.target.value)}
                          style={{ width: '70px', padding: '4px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={item.daKy}
                          value={editGrades[item.id]?.diemGiuaKy}
                          onChange={(e) => handleGradeChange(item.id, 'diemGiuaKy', e.target.value)}
                          style={{ width: '70px', padding: '4px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={item.daKy}
                          value={editGrades[item.id]?.diemCuoiKy}
                          onChange={(e) => handleGradeChange(item.id, 'diemCuoiKy', e.target.value)}
                          style={{ width: '70px', padding: '4px' }}
                        />
                      </td>
                      <td>
                        {item.daKy ? (
                          <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>🔒 Đã chốt & ký</span>
                        ) : (
                          <span style={{ color: '#e65100' }}>📝 Cho phép nhập</span>
                        )}
                      </td>
                      <td>
                        {!item.daKy && (
                          <button
                            className="btn edit-btn"
                            disabled={saving}
                            onClick={() => handleSaveGrade(item.id)}
                          >
                            Lưu điểm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}