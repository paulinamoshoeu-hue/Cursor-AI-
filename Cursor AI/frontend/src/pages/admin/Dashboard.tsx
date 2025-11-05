import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../lib/api';

type Complaint = { id: string; title: string; status: 'NEW'|'PENDING'|'RESOLVED'; residentId: string; createdAt: string };

export default function AdminDashboard() {
  const { logout } = useAuth();
  const api = useApi();
  const [items, setItems] = useState<Complaint[]>([]);
  const [status, setStatus] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [comment, setComment] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const qs = useMemo(() => new URLSearchParams(status ? { status } : {}).toString(), [status]);

  async function load() {
    try {
      const [list, sum] = await Promise.all([
        api.adminListComplaints(qs),
        fetch('/api/admin/summary').then(r=>r.json()),
      ]);
      setItems(list);
      setSummary(sum);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, [qs]);

  async function updateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    try {
      await api.adminUpdateStatus(selectedId, { status: status as any || 'PENDING', feedback, comment });
      setFeedback(''); setComment(''); setSelectedId(null);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      {summary && (
        <div style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
          <span>New: {summary.new}</span>
          <span>Pending: {summary.pending}</span>
          <span>Resolved: {summary.resolved}</span>
          <span>Residents: {summary.totalResidents}</span>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <label>Status Filter: </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr><th align="left">Title</th><th>Status</th><th>Resident</th><th>Created</th><th>Action</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.status}</td>
              <td>{i.residentId.slice(0,8)}…</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
              <td><button onClick={() => setSelectedId(i.id)}>Update</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedId && (
        <form onSubmit={updateStatus} style={{ display: 'grid', gap: 8 }}>
          <h3>Update Status</h3>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="NEW">New</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <input placeholder="Feedback (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <input placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setSelectedId(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}


