import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useApi } from '../../lib/api';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuth();
  const api = useApi();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await api.getComplaint(id!);
        setData(c);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, [id]);

  if (!id) return null;
  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Complaint Detail</h2>
        <button onClick={logout}>Logout</button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && (
        <div>
          <h3>{data.title}</h3>
          <p>Status: {data.status}</p>
          <p>{data.description}</p>
          <h4>History</h4>
          <ul>
            {data.history.map((h: any) => (
              <li key={h.id}>{h.status} — {h.comment || h.feedback || ''} — {new Date(h.createdAt).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


