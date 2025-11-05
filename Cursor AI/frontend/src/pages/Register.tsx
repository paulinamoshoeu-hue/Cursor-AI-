import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const api = useApi();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.register(email, password);
      setOk(true);
      setTimeout(() => nav('/login'), 800);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '64px auto' }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {ok && <div style={{ color: 'green', marginBottom: 8 }}>Registered. Redirecting…</div>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>Create account</button>
      </form>
      <p style={{ marginTop: 8 }}>Have an account? <a href="/login">Login</a></p>
    </div>
  );
}


