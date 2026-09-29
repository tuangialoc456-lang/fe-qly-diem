import React, { useState, useEffect } from 'react';
import { classAPI, gradeAPI } from '../api';

const QuanLyDiemAdmin = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopDuocChon, setLopDuocChon] = useState('');
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Tải danh sách các Lớp học phần khi vào trang
  useEffect(() => {
    loadDanhSachLop();
  }, []);

  const loadDanhSachLop = async () => {
    try {
      const res = await classAPI.getAll();
      setDanhSachLop(res.data || []);
    } catch (err) {
      alert('Lỗi tải danh sách lớp: ' + (err.response?.data?.message || err.message));
    }
  };

  // Tải bảng điểm của Lớp học phần khi chọn lớp
  const handleSelectLop = async (classId) => {
    setLopDuocChon(classId);
    if (!classId) {
      setDanhSachDiem([]);
      return;
    }

    try {
      setLoading(true);
      const res = await gradeAPI.getByClass(classId);
      setDanhSachDiem(res.data || []);
    } catch (err) {
      alert('Lỗi tải điểm lớp: ' + (err.response?.data?.message || err.message));
      setDanhSachDiem([]);
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi giá trị điểm trực tiếp trên hàng
  const handleScoreChange = (id, field, value) => {
    setDanhSachDiem((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Lưu thông tin điểm của một Sinh viên (Gọi PUT /api/diem/:id)
  const handleSaveGrade = async (item) => {
    try {
      setUpdatingId(item.id);
      const payload = {
        diemChuyenCan: item.diemChuyenCan !== '' ? Number(item.diemChuyenCan) : null,
        diemGiuaKy: item.diemGiuaKy !== '' ? Number(item.diemGiuaKy) : null,
        diemCuoiKy: item.diemCuoiKy !== '' ? Number(item.diemCuoiKy) : null,
      };

      const res = await gradeAPI.update(item.id, payload);
      alert('Lưu điểm thành công!');

      // Cập nhật lại kết quả tính tự động từ Backend (diemTongKet, xepLoai)
      setDanhSachDiem((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, ...res.data } : row))
      );
    } catch (err) {
      alert('Lỗi khi cập nhật điểm: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>📝 Quản Lý & Nhập Điểm Sinh Viên</h2>
        
        {/* Thanh chọn lớp học phần */}
        <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Chọn Lớp Học Phần:
          </label>
          <select
            value={lopDuocChon}
            onChange={(e) => handleSelectLop(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="">-- Chọn Lớp Học Phần --</option>
            {danhSachLop.map((lop) => (
              <option key={lop.id} value={lop.id}>
                {lop.tenLop || lop.maLop || `Lớp học phần #${lop.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Bảng thông tin và nhập điểm */}
        {loading ? (
          <p>Đang tải dữ liệu bảng điểm...</p>
        ) : lopDuocChon && danhSachDiem.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Chưa có sinh viên hoặc dữ liệu điểm trong lớp này.</p>
        ) : lopDuocChon ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px' }}>Mã SV / Họ tên</th>
                  <th style={{ padding: '12px', width: '130px' }}>Chuyên cần</th>
                  <th style={{ padding: '12px', width: '130px' }}>Giữa kỳ</th>
                  <th style={{ padding: '12px', width: '130px' }}>Cuối kỳ</th>
                  <th style={{ padding: '12px', width: '110px' }}>Tổng kết</th>
                  <th style={{ padding: '12px', width: '100px' }}>Xếp loại</th>
                  <th style={{ padding: '12px', width: '100px' }}>Trạng thái</th>
                  <th style={{ padding: '12px', width: '100px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {danhSachDiem.map((item) => {
                  const sv = item.sinhVien || {};
                  const isLocked = item.daKy; // Điểm đã ký số sẽ bị khóa sửa

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>
                        <strong>{sv.hoTen || 'N/A'}</strong>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{sv.email || sv.maSo}</div>
                      </td>

                      {/* Chuyên cần */}
                      <td style={{ padding: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={isLocked}
                          value={item.diemChuyenCan ?? ''}
                          onChange={(e) => handleScoreChange(item.id, 'diemChuyenCan', e.target.value)}
                          style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </td>

                      {/* Giữa kỳ */}
                      <td style={{ padding: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={isLocked}
                          value={item.diemGiuaKy ?? ''}
                          onChange={(e) => handleScoreChange(item.id, 'diemGiuaKy', e.target.value)}
                          style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </td>

                      {/* Cuối kỳ */}
                      <td style={{ padding: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          disabled={isLocked}
                          value={item.diemCuoiKy ?? ''}
                          onChange={(e) => handleScoreChange(item.id, 'diemCuoiKy', e.target.value)}
                          style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                      </td>

                      {/* Tổng kết */}
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>
                        {item.diemTongKet !== null ? item.diemTongKet : '-'}
                      </td>

                      {/* Xếp loại */}
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#2563eb' }}>
                        {item.xepLoai || '-'}
                      </td>

                      {/* Trạng thái Ký số */}
                      <td style={{ padding: '12px' }}>
                        {isLocked ? (
                          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>🔒 Đã ký</span>
                        ) : (
                          <span style={{ color: '#d97706' }}>⏳ Chưa chốt</span>
                        )}
                      </td>

                      {/* Nút lưu */}
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleSaveGrade(item)}
                          disabled={isLocked || updatingId === item.id}
                          style={{
                            backgroundColor: isLocked ? '#9ca3af' : '#2563eb',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {updatingId === item.id ? 'Đang lưu...' : 'Lưu'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuanLyDiemAdmin;