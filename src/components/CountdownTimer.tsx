import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center text-center w-14 sm:w-16 md:w-20">
    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark tabular-nums tracking-tight">{value.toString().padStart(2, '0')}</span>
    <span className="mt-1 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider text-muted font-medium">{label}</span>
  </div>
);

const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  const hasEnded = days + hours + minutes + seconds <= 0;

  if (hasEnded) {
    return <div className="text-center text-2xl font-bold text-primary">The Challenge has concluded!</div>;
  }

  return (
    <div className="inline-block bg-white/95 backdrop-blur-sm py-3 px-3 sm:py-6 sm:px-8 rounded-2xl sm:rounded-full shadow-xl shadow-muted/5 border border-muted/20 max-w-full countdown-pulse-mobile">
      <div className="flex items-start justify-center gap-1 sm:gap-2">
        <CountdownItem value={days} label="Days" />
        <span className="text-2xl sm:text-4xl md:text-5xl text-muted/40 font-light pt-0.5">:</span>
        <CountdownItem value={hours} label="Hours" />
        <span className="text-2xl sm:text-4xl md:text-5xl text-muted/40 font-light pt-0.5">:</span>
        <CountdownItem value={minutes} label="Mins" />
        <span className="text-2xl sm:text-4xl md:text-5xl text-muted/40 font-light pt-0.5">:</span>
        <CountdownItem value={seconds} label="Secs" />
      </div>
    </div>
  );
};

export default CountdownTimer;