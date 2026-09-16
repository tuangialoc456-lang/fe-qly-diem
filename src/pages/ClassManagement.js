import React, { useState, useEffect } from 'react';
import { classAPI, subjectAPI, userAPI } from '../services/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    maLop: '',
    monHocId: '',
    giangVienId: '',
    hocKy: 'HK1',
    namHoc: '2025-2026',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [classRes, subRes, teachRes] = await Promise.all([
        classAPI.danhSach(),
        subjectAPI.danhSach(),
        userAPI.danhSach('GIANG_VIEN'),
      ]);
      setClasses(classRes.data);
      setSubjects(subRes.data);
      setTeachers(teachRes.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi tải dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'monHocId' || name === 'giangVienId' ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classAPI.taoLop(formData);
      setAlert({ type: 'success', message: 'Tạo lớp học phần thành công' });
      setFormData({ maLop: '', monHocId: '', giangVienId: '', hocKy: 'HK1', namHoc: '2025-2026' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi tạo lớp' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>🎓 Quản lý Lớp học phần</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Đóng' : '➕ Tạo Lớp'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Mã lớp:</label>
                <input type="text" name="maLop" value={formData.maLop} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Môn học:</label>
                <select name="monHocId" value={formData.monHocId} onChange={handleChange} required>
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.tenMonHoc} ({s.maMonHoc})</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Giảng viên:</label>
                <select name="giangVienId" value={formData.giangVienId} onChange={handleChange} required>
                  <option value="">-- Chọn giảng viên --</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.hoTen} ({t.email})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Học kỳ:</label>
                <select name="hocKy" value={formData.hocKy} onChange={handleChange}>
                  <option value="HK1">HK1</option>
                  <option value="HK2">HK2</option>
                  <option value="HK3">HK3</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Năm học:</label>
              <input type="text" name="namHoc" value={formData.namHoc} onChange={handleChange} />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">💾 Tạo</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Mã lớp</th>
              <th>Môn học</th>
              <th>Giảng viên</th>
              <th>Học kỳ</th>
              <th>Năm học</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</td></tr>
            ) : (
              classes.map(cls => (
                <tr key={cls.id}>
                  <td><strong>{cls.maLop}</strong></td>
                  <td>{cls.monHoc?.tenMonHoc}</td>
                  <td>{cls.giangVien?.hoTen}</td>
                  <td>{cls.hocKy}</td>
                  <td>{cls.namHoc}</td>
                  <td>{cls.daChot ? '🔒 Đã chốt' : '✓ Mở'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
