import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Alert from '../components/Alert';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Nhập Email | Step 2: Nhập OTP & Mật khẩu mới
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  // BƯỚC 1: Yêu cầu gửi OTP
  const handleYeuCauOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await authAPI.quenMatKhau(email);
      setAlert({
        type: 'success',
        message: res.data.otp 
          ? `Mã OTP thử nghiệm của bạn là: ${res.data.otp}` 
          : 'Mã xác nhận đã được gửi đến email của bạn!',
      });
      setStep(2);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Không thể gửi yêu cầu' });
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: Xác nhận OTP & Đổi Mật Khẩu
  const handleDatLaiMatKhau = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const res = await authAPI.datLaiMatKhau({ email, otp, matKhauMoi });
      setAlert({ type: 'success', message: res.data.message });
      setTimeout(() => navigate('/dang-nhap'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
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
        }
        .forgot-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 40px 32px 30px 32px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          max-width: 450px;
          width: 100%;
          position: relative;
        }
        .icon-badge {
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
          border: 3px solid #ffffff;
        }
        .title {
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          color: #1e3a8a;
          margin-top: 10px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }
        .input-group {
          margin-bottom: 18px;
        }
        .input-field {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .btn-submit {
          width: 100%;
          background-color: #1e3a8a;
          color: white;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-submit:disabled {
          background-color: #93c5fd;
        }
      `}</style>

      <div className="forgot-card">
        <div className="icon-badge">🔑</div>
        <h2 className="title">Khôi Phục Mật Khẩu</h2>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        {step === 1 ? (
          <form onSubmit={handleYeuCauOTP}>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>
              Nhập email đăng ký tài khoản của bạn để nhận mã xác thực OTP khôi phục mật khẩu.
            </p>
            <div className="input-group">
              <input
                type="email"
                className="input-field"
                placeholder="Nhập địa chỉ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'ĐANG GỬI MÃ...' : 'GỬI MÃ XÁC THỰC OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleDatLaiMatKhau}>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Nhập mã OTP 6 số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                className="input-field"
                placeholder="Nhập mật khẩu mới"
                value={matKhauMoi}
                onChange={(e) => setMatKhauMoi(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'ĐANG ĐẶT LẠI...' : 'XÁC NHẬN ĐẶT LẠI MẬT KHẨU'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px' }}>
          <Link to="/dang-nhap" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            ← Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}