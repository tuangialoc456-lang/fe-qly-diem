import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import Alert from '../components/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const { dang_nhap } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDangNhap = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.dangNhap(email, matKhau);
      dang_nhap(res.data.token, res.data.nguoiDung);
      setAlert({ type: 'success', message: 'Đăng nhập thành công!' });
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi đăng nhập' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* CSS Nội bộ giúp hiển thị giao diện đẹp ngay lập tức */}
      <style>{`
        .login-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #003049 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-sizing: border-box;
        }

        .login-header-text {
          text-align: center;
          color: #ffffff;
          margin-bottom: 30px;
        }

        .login-header-text h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 1px;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .login-header-text p {
          color: #90e0ef;
          font-size: 14px;
          margin: 0;
        }

        .login-grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1050px;
          width: 100%;
          align-items: stretch;
        }

        @media (max-width: 850px) {
          .login-grid-container {
            grid-template-columns: 1fr;
          }
        }

        /* CARD BÊN TRÁI - THÔNG TIN SINH VIÊN */
        .portal-info-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 35px 30px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .portal-info-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .portal-icon-circle {
          width: 42px;
          height: 42px;
          background-color: #e0f2fe;
          color: #0284c7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .portal-info-title h2 {
          font-size: 18px;
          font-weight: 700;
          color: #1e3a8a;
          margin: 0;
          text-transform: uppercase;
        }

        .portal-description {
          color: #4b5563;
          font-size: 13.5px;
          line-height: 1.5;
          margin-bottom: 25px;
        }

        .portal-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background-color: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          flex-shrink: 0;
        }

        .step-content h3 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          text-transform: uppercase;
        }

        .step-content p {
          margin: 0;
          font-size: 12.5px;
          color: #6b7280;
        }

        .portal-footer-btn {
          margin-top: 25px;
          background-color: #f97316;
          color: white;
          text-align: center;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          display: block;
          transition: background 0.2s;
        }

        .portal-footer-btn:hover {
          background-color: #ea580c;
        }

        /* CARD BÊN PHẢI - FORM ĐĂNG NHẬP */
        .login-card-custom {
          background: #ffffff;
          border-radius: 16px;
          padding: 40px 32px 30px 32px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .lock-badge {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          width: 48px;
          height: 48px;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
          border: 3px solid #ffffff;
        }

        .login-card-title {
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          color: #1e3a8a;
          margin-top: 10px;
          margin-bottom: 25px;
          text-transform: uppercase;
        }

        .input-group-custom {
          position: relative;
          margin-bottom: 18px;
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 16px;
        }

        .input-field-custom {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .input-field-custom:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .toggle-password-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
        }

        .login-links-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .login-links-row a {
          color: #2563eb;
          text-decoration: none;
        }

        .login-links-row a:hover {
          text-decoration: underline;
        }

        .btn-submit-custom {
          width: 100%;
          background-color: #1e3a8a;
          color: white;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-submit-custom:hover {
          background-color: #1e40af;
        }

        .btn-submit-custom:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }

        .register-prompt {
          text-align: center;
          margin-top: 20px;
          font-size: 13.5px;
          color: #4b5563;
        }

        .register-prompt a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }

        .register-prompt a:hover {
          text-decoration: underline;
        }
      `}</style>

      {/* Header Tiêu đề */}
      <div className="login-header-text">
        <h1>CỔNG THÔNG TIN SINH VIÊN</h1>
        <p>Hệ thống Tra cứu Điểm & Quản lý Học tập Trực tuyến</p>
      </div>

      {/* Container 2 Cột */}
      <div className="login-grid-container">
        
        {/* CỘT TRÁI: Giới thiệu tính năng Cổng Sinh Viên */}
        <div className="portal-info-card">
          <div>
            <div className="portal-info-title">
              <div className="portal-icon-circle">🎓</div>
              <h2>Dành cho Sinh viên</h2>
            </div>
            
            <p className="portal-description">
              Sinh viên đăng nhập tài khoản được cấp để truy cập các dịch vụ và tính năng trực tuyến trên hệ thống:
            </p>

            <div className="portal-steps">
              {/* Bước 1 */}
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Tra cứu điểm số</h3>
                  <p>Xem điểm các lớp học phần, điểm thi và kết quả học tập theo từng học kỳ.</p>
                </div>
              </div>

              {/* Bước 2 */}
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Đăng ký học phần</h3>
                  <p>Lựa chọn danh sách môn học, lớp tín chỉ và sắp xếp thời khóa biểu trực tuyến.</p>
                </div>
              </div>

              {/* Bước 3 */}
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Thời khóa biểu & Lịch thi</h3>
                  <p>Theo dõi lịch học, danh sách giảng viên giảng dạy và lịch thi cập nhật liên tục.</p>
                </div>
              </div>
            </div>
          </div>

          <a href="#tro-giup" className="portal-footer-btn">
            HƯỚNG DẪN SỬ DỤNG HỆ THỐNG →
          </a>
        </div>

        {/* CỘT PHẢI: Form Đăng nhập */}
        <div className="login-card-custom">
          {/* Biểu tượng ổ khóa nổi ở mép trên */}
          <div className="lock-badge">🔒</div>

          <h2 className="login-card-title">Đăng Nhập</h2>

          {/* Hiển thị Alert khi có thông báo */}
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

          <form onSubmit={handleDangNhap}>
            {/* Input Email / Mã sinh viên */}
            <div className="input-group-custom">
              <span className="input-icon-left">👤</span>
              <input
                type="email"
                className="input-field-custom"
                placeholder="Nhập tài khoản hoặc email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input Mật khẩu */}
            <div className="input-group-custom">
              <span className="input-icon-left">🔑</span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field-custom"
                placeholder="Mật khẩu"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {<div className="login-links-row">
  <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
  <a href="#tro-giup">❓ Trợ giúp!</a>
</div>/* Quên mật khẩu & Trợ giúp */}
            
            {/* Nút Đăng nhập */}
            <button type="submit" className="btn-submit-custom" disabled={loading}>
              {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          {/* Link sang trang Đăng ký */}
          <p className="register-prompt">
            Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
          </p>
        </div>

      </div>
    </div>
  );
}