import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center text-center w-16 md:w-20">
    <span className="text-4xl md:text-5xl font-bold text-dark">{value.toString().padStart(2, '0')}</span>
    <span className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-muted">{label}</span>
  </div>
);

const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  const hasEnded = days + hours + minutes + seconds <= 0;

  if (hasEnded) {
    return <div className="text-center text-2xl font-bold text-primary">The Challenge has concluded!</div>;
  }

  return (
    <div className="inline-block bg-white py-4 px-6 sm:py-6 sm:px-8 rounded-full shadow-xl shadow-gray-200/60 border border-gray-200/80">
        <div className="flex items-start justify-center">
            <CountdownItem value={days} label="Days" />
            <span className="text-4xl md:text-5xl text-muted font-light mx-1 md:mx-2 pt-0.5">:</span>
            <CountdownItem value={hours} label="Hours" />
            <span className="text-4xl md:text-5xl text-muted font-light mx-1 md:mx-2 pt-0.5">:</span>
            <CountdownItem value={minutes} label="Minutes" />
            <span className="text-4xl md:text-5xl text-muted font-light mx-1 md:mx-2 pt-0.5">:</span>
            <CountdownItem value={seconds} label="Seconds" />
        </div>
    </div>
  );
};

export default CountdownTimer;