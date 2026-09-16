import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Alert from '../components/Alert';

export default function Register() {
  const [form, setForm] = useState({ hoTen: '', email: '', matKhau: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleDangKy = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.dangKy(form);
      setAlert({ type: 'success', message: 'Đăng ký thành công! Đang chuyển hướng...' });
      setTimeout(() => navigate('/dang-nhap'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi đăng ký' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📝 Đăng Ký</h1>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
        <form onSubmit={handleDangKy}>
          <div className="form-group">
            <label>Họ và Tên:</label>
            <input type="text" onChange={(e) => setForm({...form, hoTen: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input type="password" onChange={(e) => setForm({...form, matKhau: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }} disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>
        <p style={{ textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}