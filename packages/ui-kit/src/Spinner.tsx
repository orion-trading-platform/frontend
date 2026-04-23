import React from 'react';

interface SpinnerProps {
  overlay?: boolean;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ overlay = false, label = 'Loading' }) => (
  <div
    role="status"
    aria-label={label}
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    className={overlay ? 'fixed inset-0 bg-black/60 z-[9999]' : ''}
  >
    <div
      aria-hidden="true"
      style={{ animation: 'spin 2s linear infinite' }}
      className="border-[3px] border-[rgba(124,143,245,0.25)] border-t-[#7C8FF5] rounded-full w-10 h-10"
    />
  </div>
);

export default Spinner;
