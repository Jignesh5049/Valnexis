import { useState } from 'react';

export default function ScanForm({ onSubmit, loading }) {
  const [targetType, setTargetType] = useState('url');
  const [target, setTarget] = useState('https://');
  const [project, setProject] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ targetType, target, project });
  };

  return (
    <form onSubmit={handleSubmit} className="panel p-5 space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-2 rounded-lg text-sm ${targetType === 'url' ? 'bg-accent text-slate-900 font-semibold' : 'bg-slate-700'}`}
          onClick={() => setTargetType('url')}
        >
          Scan URL
        </button>
        <button
          type="button"
          className={`px-3 py-2 rounded-lg text-sm ${targetType === 'upload' ? 'bg-accent text-slate-900 font-semibold' : 'bg-slate-700'}`}
          onClick={() => setTargetType('upload')}
        >
          Upload Project
        </button>
      </div>

      {targetType === 'url' ? (
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/50 px-4 py-3 outline-none focus:border-accent"
          placeholder="https://target.example"
          required
          maxLength={2048}
        />
      ) : (
        <input
          type="file"
          onChange={(e) => setProject(e.target.files?.[0] || null)}
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/50 px-4 py-3"
          required
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-accent text-slate-950 font-semibold py-3 disabled:opacity-60"
      >
        {loading ? 'Queueing scan...' : 'Start Security Scan'}
      </button>
    </form>
  );
}
