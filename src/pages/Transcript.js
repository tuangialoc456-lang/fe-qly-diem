import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { transcriptAPI } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function Transcript() {
  const { studentId } = useParams();
  const { user } = useContext(AuthContext);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const idCan = studentId || user?.id;
    if (!idCan) {
      setAlert({ type: 'error', message: 'Không tìm thấy ID sinh viên' });
      setLoading(false);
      return;
    }
    loadTranscript(idCan);
  }, [studentId, user?.id]);

  const loadTranscript = async (id) => {
    try {
      const res = await transcriptAPI.bangDiem(id);
      setTranscript(res.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Lỗi tải bảng điểm' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (alert) return <div className="main-content"><Alert type={alert.type} message={alert.message} /></div>;
  if (!transcript) return <div className="main-content"><Alert type="error" message="Không có dữ liệu bảng điểm" /></div>;

  // Trường hợp dữ liệu trả về dạng mảng từ API /diem/me hoặc dạng object có chiTiet
  const isArray = Array.isArray(transcript);
  const chiTiet = isArray ? transcript : (transcript.chiTiet || []);
  const sinhVien = isArray ? user : (transcript.sinhVien || user);
  const diemTrungBinhTichLuy = isArray ? null : transcript.diemTrungBinhTichLuy;
  const canhBaoGiaMao = isArray ? false : transcript.canhBaoGiaMao;

  return (
    <div className="main-content">
      <div className="card">
        <h2>📜 Bảng Điểm Sinh Viên</h2>

        {canhBaoGiaMao && (
          <Alert
            type="error"
            message="⚠️ CẢNH BÁO: Phát hiện điểm đã bị thay đổi sau khi ký số! Liên hệ phòng đào tạo ngay."
          />
        )}

        <div style={{
          background: 'white',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <p><strong>👤 Sinh viên:</strong> {sinhVien?.hoTen || sinhVien?.tenNguoiDung}</p>
          <p><strong>📧 Email:</strong> {sinhVien?.email}</p>
          <p><strong>🎓 Vai trò:</strong> {sinhVien?.vaiTro || 'SINH_VIEN'}</p>
          {diemTrungBinhTichLuy !== null && (
            <p><strong>📊 Điểm trung bình tích lũy:</strong> <span style={{ fontSize: '20px', color: '#667eea' }}>{diemTrungBinhTichLuy?.toFixed(2)}</span></p>
          )}
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Kỳ</th>
              <th>Năm học</th>
              <th>Chuyên cần</th>
              <th>Giữa kỳ</th>
              <th>Cuối kỳ</th>
              <th>Tổng kết</th>
              <th>Xếp loại</th>
              <th>✓ Ký</th>
            </tr>
          </thead>
          <tbody>
            {chiTiet.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Chưa có dữ liệu bảng điểm</td></tr>
            ) : (
              chiTiet.map((item, idx) => {
                const monHoc = item.lopHocPhan?.monHoc?.tenMonHoc || item.monHoc || 'Chưa cập nhật';
                const hocKy = item.lopHocPhan?.hocKy || item.hocKy || '-';
                const namHoc = item.lopHocPhan?.namHoc || item.namHoc || '-';

                return (
                  <tr key={idx} style={item.chuKyHopLe === false ? { background: '#fef2f2' } : {}}>
                    <td><strong>{monHoc}</strong></td>
                    <td>{hocKy}</td>
                    <td>{namHoc}</td>
                    <td>{item.diemChuyenCan !== null ? item.diemChuyenCan : '-'}</td>
                    <td>{item.diemGiuaKy !== null ? item.diemGiuaKy : '-'}</td>
                    <td>{item.diemCuoiKy !== null ? item.diemCuoiKy : '-'}</td>
                    <td><strong>{item.diemTongKet !== null ? item.diemTongKet : '-'}</strong></td>
                    <td>{item.xepLoai || '-'}</td>
                    <td>
                      {item.daKy ? (
                        <span title={item.chuKyHopLe ? 'Chữ ký hợp lệ' : 'Chữ ký KHÔNG hợp lệ'}>
                          {item.chuKyHopLe ? '✅' : '❌'}
                        </span>
                      ) : (
                        '⏳'
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
          <p>✅ = Ký hợp lệ (điểm chưa bị sửa) | ❌ = Ký KHÔNG hợp lệ (điểm bị sửa trái phép) | ⏳ = Chưa ký</p>
        </div>
      </div>
    </div>
  );
}