import React, { useState, useEffect } from 'react';
import { subjectAPI } from '../services/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    maMonHoc: '',
    tenMonHoc: '',
    soTinChi: 3,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await subjectAPI.danhSach();
      setSubjects(res.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi tải danh sách môn học' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'soTinChi' ? parseInt(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await subjectAPI.capNhat(editingId, formData);
        setAlert({ type: 'success', message: 'Cập nhật môn học thành công' });
      } else {
        await subjectAPI.taoMonHoc(formData);
        setAlert({ type: 'success', message: 'Tạo môn học thành công' });
      }
      setFormData({ maMonHoc: '', tenMonHoc: '', soTinChi: 3 });
      setEditingId(null);
      setShowForm(false);
      loadSubjects();
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi lưu môn học' });
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      maMonHoc: subject.maMonHoc,
      tenMonHoc: subject.tenMonHoc,
      soTinChi: subject.soTinChi,
    });
    setEditingId(subject.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa môn học này?')) return;
    try {
      await subjectAPI.xoa(id);
      setAlert({ type: 'success', message: 'Xóa môn học thành công' });
      loadSubjects();
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi xóa môn học' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>📖 Quản lý Môn học</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <button className="btn btn-primary" onClick={() => {
          setFormData({ maMonHoc: '', tenMonHoc: '', soTinChi: 3 });
          setEditingId(null);
          setShowForm(!showForm);
        }}>
          {showForm ? '✕ Đóng' : '➕ Thêm Môn học'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '4px' }}>
            <div className="form-row">
              <div className="form-group">
                <label>Mã môn học:</label>
                <input type="text" name="maMonHoc" value={formData.maMonHoc} onChange={handleChange} required disabled={editingId !== null} />
              </div>
              <div className="form-group">
                <label>Tên môn học:</label>
                <input type="text" name="tenMonHoc" value={formData.tenMonHoc} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Số tín chỉ:</label>
              <input type="number" name="soTinChi" value={formData.soTinChi} onChange={handleChange} min="1" required />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-success">💾 Lưu</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Mã môn</th>
              <th>Tên môn học</th>
              <th>Tín chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</td></tr>
            ) : (
              subjects.map(subject => (
                <tr key={subject.id}>
                  <td><strong>{subject.maMonHoc}</strong></td>
                  <td>{subject.tenMonHoc}</td>
                  <td>{subject.soTinChi}</td>
                  <td>
                    <div className="table-actions">
                      <button className="edit-btn" onClick={() => handleEdit(subject)}>Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(subject.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
