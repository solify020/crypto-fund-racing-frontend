import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface CountdownTimerProps {
  deadline: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, className = '' }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(deadline);

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-white font-bold text-lg">Campaign Ended</div>
        <div className="text-white text-sm">Deadline has passed</div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="text-accent-red font-bold text-lg mb-1">Time Remaining</div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-black rounded-lg p-2 border-2 border-white">
          <div className="text-2xl font-bold text-white">{days.toString().padStart(2, '0')}</div>
          <div className="text-xs text-white uppercase tracking-wide">Days</div>
        </div>
        <div className="bg-black rounded-lg p-2 border-2 border-white">
          <div className="text-2xl font-bold text-white">{hours.toString().padStart(2, '0')}</div>
          <div className="text-xs text-white uppercase tracking-wide">Hours</div>
        </div>
        <div className="bg-black rounded-lg p-2 border-2 border-white">
          <div className="text-2xl font-bold text-white">{minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs text-white uppercase tracking-wide">Minutes</div>
        </div>
        <div className="bg-black rounded-lg p-2 border-2 border-white">
          <div className="text-2xl font-bold text-white">{seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs text-white uppercase tracking-wide">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;