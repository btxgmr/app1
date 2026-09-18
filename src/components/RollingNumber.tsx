import React from 'react';

interface RollingNumberProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

// Ultra-performant numeric display with CSS tabular figures to avoid 60fps React state re-render bottlenecks
export const RollingNumber: React.FC<RollingNumberProps> = React.memo(({ value, className = '', prefix = '', suffix = '' }) => {
  return (
    <span className={`tabular-nums font-mono font-bold tracking-tight inline-block transition-colors duration-150 ${className}`}>
      {prefix}{value.toLocaleString('pl-PL')}{suffix}
    </span>
  );
});

RollingNumber.displayName = 'RollingNumber';
