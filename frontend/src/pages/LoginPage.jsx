import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid-noise min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="panel w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-cyan-100">Valnexis Access</h1>
        <p className="text-sm text-slate-400">Security operations sign-in</p>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <input
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/50 px-4 py-3"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/50 px-4 py-3"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button disabled={loading} className="w-full rounded-xl bg-accent py-3 font-semibold text-slate-900">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="text-sm text-slate-400">
          New user? <Link className="text-accent" to="/signup">Create account</Link>
        </p>
      </form>
    </main>
  );
}
