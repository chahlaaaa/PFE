// ============================================================
// api.js — عميل API للواجهة الأمامية
// يُستخدم للاتصال بالخلفية Node.js/Express
// ============================================================

const API_BASE = 'http://localhost:3000/api';

// ── التوكن ──────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// ── طلبات عامة ──────────────────────────────────────────
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطأ في الخادم');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ── المصادقة ────────────────────────────────────────────
const authAPI = {
  login: async (username, password, role) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    });
    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
    }
    return data;
  },
  verify: () => apiCall('/auth/verify'),
  getUsers: () => apiCall('/auth/users'),
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  changePassword: (data) => apiCall('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// ── الطلاب ──────────────────────────────────────────────
const elevesAPI = {
  getAll: (params = '') => apiCall(`/eleves/${params}`),
  getById: (id) => apiCall(`/eleves/${id}`),
  getByClasse: (classe) => apiCall(`/eleves/par-classe/${classe}`),
  create: (data) => apiCall('/eleves', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/eleves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/eleves/${id}`, {
    method: 'DELETE'
  }),
  getStats: () => apiCall('/eleves/stats/overview')
};

// ── الدروس ──────────────────────────────────────────────
const coursAPI = {
  getAll: (params = '') => apiCall(`/cours/${params}`),
  getById: (id) => apiCall(`/cours/${id}`),
  create: (data) => apiCall('/cours', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/cours/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/cours/${id}`, {
    method: 'DELETE'
  })
};

// ── الغياب ──────────────────────────────────────────────
const absencesAPI = {
  getAll: (params = '') => apiCall(`/absences/${params}`),
  create: (data) => apiCall('/absences', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/absences/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/absences/${id}`, {
    method: 'DELETE'
  }),
  getStats: () => apiCall('/absences/stats/overview')
};

// ── الجدول الزمني ─────────────────────────────────────
const edtAPI = {
  getAll: (params = '') => apiCall(`/edt/${params}`),
  update: (data) => apiCall('/edt', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (data) => apiCall('/edt', {
    method: 'DELETE',
    body: JSON.stringify(data)
  })
};

// ── التسجيلات ─────────────────────────────────────────
const inscriptionsAPI = {
  getAll: (params = '') => apiCall(`/inscriptions/${params}`),
  create: (data) => apiCall('/inscriptions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/inscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiCall(`/inscriptions/${id}`, {
    method: 'DELETE'
  }),
  getStats: () => apiCall('/inscriptions/stats/overview')
};

// ── الدرجات ────────────────────────────────────────────
const notesAPI = {
  getByEleve: (eleveId) => apiCall(`/notes/eleve/${eleveId}`),
  create: (data) => apiCall('/notes', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiCall(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

// ── المحادثة ───────────────────────────────────────────
const chatAPI = {
  createSession: () => apiCall('/chat/session', { method: 'POST' }),
  sendMessage: (data) => apiCall('/chat/message', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMessages: (sessionId) => apiCall(`/chat/messages/${sessionId}`),
  getAdminSessions: () => apiCall('/chat/admin/sessions'),
  getUnreadCount: () => apiCall('/chat/admin/unread-count'),
  reply: (data) => apiCall('/chat/reply', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};