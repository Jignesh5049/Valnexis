import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ScanForm from '../components/ScanForm';
import ScanHistoryTable from '../components/ScanHistoryTable';

export default function DashboardPage() {
  const [scans, setScans] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadScans = () => {
    api
      .get('/scans')
      .then((response) => setScans(response.data.scans))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load scans'));
  };

  useEffect(() => {
    loadScans();
  }, []);

  const handleScanSubmit = async ({ targetType, target, project }) => {
    setBusy(true);
    setError('');
    try {
      if (targetType === 'upload') {
        const formData = new FormData();
        formData.append('targetType', 'upload');
        formData.append('target', project?.name || 'uploaded-project');
        formData.append('project', project);
        await api.post('/scans', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/scans', { targetType, target });
      }
      loadScans();
    } catch (err) {
      setError(err?.response?.data?.message || 'Scan request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <section className="panel p-6">
        <h1 className="text-3xl font-semibold text-cyan-100">Threat Surface Dashboard</h1>
        <p className="mt-2 text-slate-300">Queue scans, track risk, and review remediation guidance.</p>
      </section>

      <ScanForm onSubmit={handleScanSubmit} loading={busy} />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <ScanHistoryTable scans={scans} />
    </main>
  );
}
