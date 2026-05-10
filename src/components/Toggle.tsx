import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button 
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-stone-300'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </button>
  );
};

interface ToggleRowProps extends ToggleProps {
  label: string;
  className?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange, className = '' }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm font-bold text-stone-700">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
};
