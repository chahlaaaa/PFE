import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── إدارة بيانات المستخدم (LocalStorage)
export const authActions = {
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => JSON.parse(localStorage.getItem('user')),
  clearAll: () => localStorage.removeItem('user')
};

// ── 1. المصادقة (Auth)
export const authAPI = {
  login: (u, p) => api.post('/auth/login', { username: u, password: p }).then(res => res.data),
};

// ── 2. الطلاب (Students)
export const etudiantsAPI = {
  getAll: () => api.get('/students').then(res => res.data),
  create: (data) => api.post('/students', data).then(res => res.data),
  updateStatut: (id, s) => api.put(`/students/${id}`, { statut: s }).then(res => res.data),
};

// ── 3. المجموعات (Groupes)
export const groupesAPI = {
  getAll: () => api.get('/groupes').then(res => res.data),
  getById: (id) => api.get(`/groupes/${id}`).then(res => res.data),
  create: (data) => api.post('/groupes', data).then(res => res.data),
};

// ── 4. الأساتذة (Enseignants)
export const enseignantsAPI = {
  getAll: () => api.get('/enseignants').then(res => res.data),
  getSchedule: (id) => api.get(`/enseignants/${id}/schedule`).then(res => res.data),
};

// ── 5. النقاط (Notes)
export const notesAPI = {
  add: (data) => api.post('/notes', data).then(res => res.data),
  getStudentResults: (studentId) => api.get(`/notes/student/${studentId}`).then(res => res.data),
  update: (id, data) => api.put(`/notes/${id}`, data).then(res => res.data),
};

// ── 6. الغيابات (Absences)
export const absencesAPI = {
  mark: (data) => api.post('/absences', data).then(res => res.data),
  getHistory: (studentId) => api.get(`/absences/student/${studentId}`).then(res => res.data),
};

// ── 7. التكوينات (Formations)
export const formationsAPI = {
  getAll: () => api.get('/formations').then(res => res.data),
  create: (data) => api.post('/formations', data).then(res => res.data),
};
// ── إدارة المستخدمين والموظفين (Admin/Directeur) ──────────────
export const adminAPI = {
  // جلب كل الحسابات (سكرتارية، أساتذة) لتعديل صلاحياتهم أو حذفهم
  getAllUsers: () => api.get('/admin/users').then(res => res.data),
  
  // إنشاء حساب جديد لموظف
  createUser: (userData) => api.post('/admin/users', userData).then(res => res.data),
  
  // حذف مستخدم من النظام
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then(res => res.data),
};

// ── الإحصائيات العامة (Dashboard Global) ────────────────────
export const statsAPI = {
  // جلب إحصائيات الأرباح، عدد الطلاب الكلي، ونسبة الغياب للمدرسة ككل
  getGlobalStats: () => api.get('/admin/stats/global').then(res => res.data),
  
  // تقارير مالية مفصلة
  getFinancialReports: () => api.get('/admin/stats/finance').then(res => res.data),
};