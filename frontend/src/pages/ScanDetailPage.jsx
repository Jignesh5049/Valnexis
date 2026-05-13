import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import VulnerabilityCard from '../components/VulnerabilityCard';

export default function ScanDetailPage() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/scans/${id}`)
      .then((response) => setScan(response.data.scan))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to fetch scan'));
  }, [id]);

  const downloadPdf = async () => {
    const response = await api.get(`/reports/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `valnexis-report-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <p className="mx-auto max-w-4xl px-4 py-8 text-red-300">{error}</p>;
  if (!scan) return <p className="mx-auto max-w-4xl px-4 py-8 text-slate-300">Loading...</p>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="panel p-6 space-y-2">
        <p className="text-slate-300 text-sm">Target</p>
        <h1 className="text-2xl font-semibold text-cyan-100 break-all">{scan.target}</h1>
        <p className="text-slate-400">Status: {scan.status} | Risk Score: {scan.riskScore}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={downloadPdf} className="rounded-lg bg-accent px-4 py-2 font-semibold text-slate-900">
            Download PDF
          </button>
          <Link to="/dashboard" className="rounded-lg border border-cyan-300/30 px-4 py-2 text-cyan-100">
            Back
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {scan.vulnerabilities?.map((v) => (
          <VulnerabilityCard key={`${v.type}-${v.severity}`} vulnerability={v} />
        ))}
      </section>
    </main>
  );
}
