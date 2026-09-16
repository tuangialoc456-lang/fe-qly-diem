import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

// Tự động gắn Token vào Header nếu đã đăng nhập
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  dangNhap: (email, matKhau) => API.post('/auth/dang-nhap', { email, matKhau }),
  dangKy: (data) => API.post('/auth/dang-ky', data),
  quenMatKhau: (email) => API.post('/auth/quen-mat-khau', { email }),
  datLaiMatKhau: (data) => API.post('/auth/dat-lai-mat-khau', data),
};

export const userAPI = {
  getAll: () => API.get('/nguoi-dung'),
  getById: (id) => API.get(`/nguoi-dung/${id}`),
  create: (data) => API.post('/nguoi-dung', data),
  update: (id, data) => API.put(`/nguoi-dung/${id}`, data),
  delete: (id) => API.delete(`/nguoi-dung/${id}`),
};

export const subjectAPI = {
  getAll: () => API.get('/mon-hoc'),
  getById: (id) => API.get(`/mon-hoc/${id}`),
  create: (data) => API.post('/mon-hoc', data),
  update: (id, data) => API.put(`/mon-hoc/${id}`, data),
  delete: (id) => API.delete(`/mon-hoc/${id}`),
};

export const classAPI = {
  getAll: () => API.get('/lop-hoc-phan'),
  getById: (id) => API.get(`/lop-hoc-phan/${id}`),
  create: (data) => API.post('/lop-hoc-phan', data),
  update: (id, data) => API.put(`/lop-hoc-phan/${id}`, data),
  delete: (id) => API.delete(`/lop-hoc-phan/${id}`),
};

export const gradeAPI = {
  getAll: () => API.get('/diem'),
  getByClass: (classId) => API.get(`/diem/lop/${classId}`),
  save: (data) => API.post('/diem', data),
  update: (id, data) => API.put(`/diem/${id}`, data),
};

// 6. Transcript API (Đã sửa đúng hàm bangDiem và đường dẫn /diem/me)
export const transcriptAPI = {
  bangDiem: (studentId) => API.get(studentId ? `/bang-diem/${studentId}` : '/diem/me'),
  getTranscript: (studentId) => API.get(studentId ? `/bang-diem/${studentId}` : '/diem/me'),
};

export const auditAPI = {
  getAll: () => API.get('/nhat-ky'),
};


export default API;