import clsx from 'clsx';

const tone = {
  Low: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  Medium: 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
  High: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
  Critical: 'bg-red-500/15 text-red-300 border-red-400/30'
};

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tone[severity] || 'bg-slate-500/15 text-slate-200 border-slate-400/30'
      )}
    >
      {severity}
    </span>
  );
}
