import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../lib/api';

type Complaint = { id: string; title: string; status: 'NEW'|'PENDING'|'RESOLVED'; createdAt: string };

export default function ResidentDashboard() {
  const { logout } = useAuth();
  const api = useApi();
  const [items, setItems] = useState<Complaint[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const list = await api.listMyComplaints();
      setItems(list);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createComplaint(title, description);
      setTitle(''); setDescription('');
      load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Complaints</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <form onSubmit={create} style={{ margin: '16px 0', display: 'grid', gap: 8 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Submit Complaint</button>
      </form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th align="left">Title</th><th>Status</th><th>Created</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td><a href={`/resident/complaints/${i.id}`}>{i.title}</a></td>
              <td>{i.status}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


