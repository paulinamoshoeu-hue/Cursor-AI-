import { useAuth } from '../auth/AuthContext';

const BASE = '';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE + path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data;
}

export function useApi() {
  const { token } = useAuth();
  function headers(extra?: HeadersInit): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return { ...h, ...(extra || {}) };
  }
  return {
    register: (email: string, password: string) => request('/api/auth/register', { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }),
    login: (email: string, password: string) => request('/api/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }),
    createComplaint: (title: string, description: string) => request('/api/complaints', { method: 'POST', headers: headers(), body: JSON.stringify({ title, description }) }),
    listMyComplaints: () => request('/api/complaints', { headers: headers() }),
    getComplaint: (id: string) => request(`/api/complaints/${id}`, { headers: headers() }),
    adminListComplaints: (qs: string) => request(`/api/admin/complaints${qs ? `?${qs}` : ''}`, { headers: headers() }),
    adminUpdateStatus: (id: string, payload: { status: 'NEW'|'PENDING'|'RESOLVED'; feedback?: string; comment?: string; }) => request(`/api/admin/complaints/${id}/status`, { method: 'PATCH', headers: headers(), body: JSON.stringify(payload) }),
    listNotifications: () => request('/api/notifications', { headers: headers() }),
    markRead: (id: string) => request(`/api/notifications/${id}/read`, { method: 'POST', headers: headers() }),
    markAllRead: () => request('/api/notifications/read-all', { method: 'POST', headers: headers() }),
  };
}


