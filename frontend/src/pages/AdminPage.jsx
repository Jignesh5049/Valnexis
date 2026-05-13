import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/summary')
      .then((response) => setData(response.data))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load admin stats'));
  }, []);

  if (error) return <p className="mx-auto max-w-5xl px-4 py-8 text-red-300">{error}</p>;
  if (!data) return <p className="mx-auto max-w-5xl px-4 py-8 text-slate-300">Loading...</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-semibold text-cyan-100">Admin Operations</h1>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="panel p-4"><p className="text-slate-400">Users</p><p className="text-2xl">{data.summary.totalUsers}</p></article>
        <article className="panel p-4"><p className="text-slate-400">Scans</p><p className="text-2xl">{data.summary.totalScans}</p></article>
        <article className="panel p-4"><p className="text-slate-400">Failed</p><p className="text-2xl">{data.summary.failedScans}</p></article>
        <article className="panel p-4"><p className="text-slate-400">Critical Findings</p><p className="text-2xl">{data.summary.criticalFindings}</p></article>
      </section>

      <section className="panel p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-3 text-cyan-100">Recent Scans</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-cyan-300/10">
              <th className="p-2 text-left">Target</th>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Risk</th>
            </tr>
          </thead>
          <tbody>
            {data.recentScans.map((scan) => (
              <tr key={scan._id} className="border-b border-cyan-300/10">
                <td className="p-2">{scan.target}</td>
                <td className="p-2">{scan.userId?.email || 'Unknown'}</td>
                <td className="p-2">{scan.status}</td>
                <td className="p-2">{scan.riskScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
