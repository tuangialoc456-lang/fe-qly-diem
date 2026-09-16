import React, { useState, useEffect } from 'react';
import { auditAPI } from '../services/api';
import Alert from '../components/Alert';
import Loading from '../components/Loading';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filterBang, setFilterBang] = useState('');

  useEffect(() => {
    loadLogs();
  }, [filterBang]);

  const loadLogs = async () => {
    try {
      const params = filterBang ? { bang: filterBang } : {};
      const res = await auditAPI.danhSachNhatKy(params);
      setLogs(res.data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi tải nhật ký thao tác' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="main-content">
      <div className="card">
        <h2>📋 Nhật ký Thao tác</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className="form-group">
          <label>Lọc theo bảng:</label>
          <select value={filterBang} onChange={(e) => setFilterBang(e.target.value)}>
            <option value="">-- Tất cả --</option>
            <option value="nguoi_dung">Người dùng</option>
            <option value="mon_hoc">Môn học</option>
            <option value="lop_hoc_phan">Lớp học phần</option>
            <option value="ket_qua_hoc_tap">Kết quả học tập</option>
            <option value="nhat_ky_thao_tac">Nhật ký</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Bảng</th>
              <th>Hành động</th>
              <th>Người thực hiện</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td><code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>{log.bang}</code></td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: log.hanhDong === 'TAO' ? '#d4edda' :
                                  log.hanhDong === 'SUA' ? '#fff3cd' :
                                  log.hanhDong === 'XOA' ? '#f8d7da' : '#d1ecf1',
                      color: log.hanhDong === 'TAO' ? '#155724' :
                             log.hanhDong === 'SUA' ? '#856404' :
                             log.hanhDong === 'XOA' ? '#721c24' : '#0c5460'
                    }}>
                      {log.hanhDong}
                    </span>
                  </td>
                  <td>{log.nguoiThucHien?.hoTen || 'Hệ thống'}</td>
                  <td style={{ fontSize: '12px' }}>
                    {log.ghiChu || (log.duLieuMoi ? JSON.stringify(log.duLieuMoi).substring(0, 50) + '...' : '-')}
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
