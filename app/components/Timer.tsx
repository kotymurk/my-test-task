'use client';
import { useState, useEffect } from 'react';

interface TimerProps {
  onExpire: () => void;
}

export default function Timer({ onExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft === 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 30 && timeLeft > 0;
  const isExpired = timeLeft === 0;

  return (
    <div className='bg-[#1D5B43] w-full py-2 flex flex-col items-center fixed top-0 z-50 border-b border-white/10'>
      <p className='text-white text-[10px] uppercase tracking-wider opacity-80 mb-1'>
        Успей открыть пробную неделю
      </p>
      <div
        className={`text-xl font-mono font-bold transition-colors ${
          isExpired
            ? 'text-gray-500'
            : isWarning
              ? 'text-[#FD5656] animate-blink-timer'
              : 'text-[#FDB056]'
        }`}
      >
        • {formatTime(timeLeft)} •
      </div>
    </div>
  );
}
