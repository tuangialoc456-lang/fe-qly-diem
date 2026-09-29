import React, { useState, useEffect, useContext } from 'react';
import { classAPI, gradeAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function GradeManagement() {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await classAPI.danhSach();
      setClasses(res.data);
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.message || 'Lỗi tải danh sách lớp' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = async (classId) => {
    if (!classId) {
      setSelectedClass(null);
      setGrades([]);
      return;
    }

    try {
      setSelectedClass(classId);
      const res = await gradeAPI.diemTheoLop(classId);
      setGrades(res.data);
    } catch (err) {
      setGrades([]);
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.message || 'Lỗi tải danh sách điểm' 
      });
    }
  };

  const handleEditStart = (grade) => {
    setEditingId(grade.id);
    setEditValues({
      diemChuyenCan: grade.diemChuyenCan ?? '',
      diemGiuaKy: grade.diemGiuaKy ?? '',
      diemCuoiKy: grade.diemCuoiKy ?? '',
    });
  };

  const handleEditChange = (field, value) => {
    const num = value === '' ? null : parseFloat(value);
    if (num !== null && (num < 0 || num > 10)) {
      setAlert({ type: 'warning', message: 'Điểm phải từ 0-10' });
      return;
    }
    setEditValues({ ...editValues, [field]: num });
  };

  const handleSaveDiem = async (id) => {
    try {
      await gradeAPI.capNhatDiem(id, editValues);
      setAlert({ type: 'success', message: 'Cập nhật điểm thành công' });
      setEditingId(null);
      
      // Tải lại dữ liệu trực tiếp, không làm nháy lại state chọn lớp
      if (selectedClass) {
        const res = await gradeAPI.diemTheoLop(selectedClass);
        setGrades(res.data);
      }
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.message || 'Lỗi cập nhật điểm' 
      });
    }
  };

  const handleChotKyLop = async () => {
    if (!window.confirm('Chốt điểm sẽ khóa bảng điểm và ký số tất cả sinh viên. Bạn chắc chắn?')) return;
    try {
      await gradeAPI.chotKyLop(selectedClass);
      setAlert({ type: 'success', message: 'Chốt điểm và ký số thành công!' });
      setSelectedClass(null);
      setGrades([]);
      loadClasses();
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.message || 'Lỗi chốt điểm' 
      });
    }
  };

  if (loading) return <Loading />;

  const selectedClassData = classes.find(c => c.id === selectedClass);

  return (
    <div className="main-content">
      <div className="card">
        <h2>📊 Quản lý Điểm</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="form-group">
          <label>Chọn lớp học phần:</label>
          <select 
            value={selectedClass || ''} 
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null;
              handleSelectClass(val);
            }}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.maLop} - {cls.monHoc?.tenMonHoc} - {cls.hocKy} ({cls.namHoc}) {cls.daChot ? '🔒' : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedClassData && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
            <p><strong>Lớp:</strong> {selectedClassData.maLop}</p>
            <p><strong>Giảng viên:</strong> {selectedClassData.giangVien?.hoTen}</p>
            <p><strong>Trạng thái:</strong> {selectedClassData.daChot ? '🔒 Đã chốt' : '✓ Mở'}</p>
            {user?.vaiTro === 'ADMIN' && !selectedClassData.daChot && (
              <button className="btn btn-success" onClick={handleChotKyLop} style={{ marginTop: '10px' }}>
                🔒 Chốt & Ký số Bảng điểm
              </button>
            )}
          </div>
        )}

        {grades.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Chuyên cần</th>
                <th>Giữa kỳ</th>
                <th>Cuối kỳ</th>
                <th>Tổng kết</th>
                <th>Xếp loại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(grade => (
                <tr key={grade.id}>
                  <td>{grade.sinhVien?.hoTen}</td>
                  <td>
                    {editingId === grade.id ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={editValues.diemChuyenCan === null ? '' : editValues.diemChuyenCan}
                        onChange={(e) => handleEditChange('diemChuyenCan', e.target.value)}
                      />
                    ) : (
                      grade.diemChuyenCan?.toFixed(2) || '-'
                    )}
                  </td>
                  <td>
                    {editingId === grade.id ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={editValues.diemGiuaKy === null ? '' : editValues.diemGiuaKy}
                        onChange={(e) => handleEditChange('diemGiuaKy', e.target.value)}
                      />
                    ) : (
                      grade.diemGiuaKy?.toFixed(2) || '-'
                    )}
                  </td>
                  <td>
                    {editingId === grade.id ? (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={editValues.diemCuoiKy === null ? '' : editValues.diemCuoiKy}
                        onChange={(e) => handleEditChange('diemCuoiKy', e.target.value)}
                      />
                    ) : (
                      grade.diemCuoiKy?.toFixed(2) || '-'
                    )}
                  </td>
                  <td><strong>{grade.diemTongKet?.toFixed(2) || '-'}</strong></td>
                  <td>{grade.xepLoai || '-'}</td>
                  <td>
                    {editingId === grade.id ? (
                      <div className="table-actions">
                        <button className="edit-btn" onClick={() => handleSaveDiem(grade.id)}>Lưu</button>
                        <button className="delete-btn" onClick={() => setEditingId(null)}>Hủy</button>
                      </div>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => handleEditStart(grade)}
                        disabled={selectedClassData?.daChot}
                      >
                        Sửa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedClass && grades.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            Chưa có sinh viên trong lớp này
          </div>
        )}
      </div>
    </div>
  );
}