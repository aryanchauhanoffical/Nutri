import { motion } from 'framer-motion';

interface Props {
  value: number;
  max: number;
  label?: string;
  colorShift?: boolean;
  className?: string;
}

function getColor(pct: number, shift: boolean): string {
  if (!shift) return 'bg-green-primary';
  if (pct < 80) return 'bg-green-primary';
  if (pct <= 95) return 'bg-amber-400';
  return 'bg-coral';
}

export default function ProgressBar({ value, max, label, colorShift = false, className = '' }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  const color = getColor(pct, colorShift);

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="progress-bar">
        <motion.div
          className={`progress-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  );
}
