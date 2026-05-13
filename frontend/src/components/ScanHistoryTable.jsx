import { Link } from 'react-router-dom';

export default function ScanHistoryTable({ scans = [] }) {
  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/70 text-slate-300">
          <tr>
            <th className="text-left p-3">Target</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Risk Score</th>
            <th className="text-left p-3">Created</th>
            <th className="text-left p-3">Report</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan._id} className="border-t border-cyan-300/10">
              <td className="p-3 truncate max-w-xs">{scan.target}</td>
              <td className="p-3 capitalize">{scan.status}</td>
              <td className="p-3">{scan.riskScore}</td>
              <td className="p-3">{new Date(scan.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <Link className="text-accent hover:underline" to={`/scans/${scan._id}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {scans.length === 0 ? <p className="p-4 text-slate-400">No scans yet.</p> : null}
    </div>
  );
}
