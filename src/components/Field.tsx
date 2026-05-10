import React from 'react';

interface Props {
  label: string;
  children: React.ReactNode;
  suffix?: string;
  className?: string;
  helperText?: string;
}

export const Field: React.FC<Props> = ({ label, children, suffix, className = '', helperText }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="form-label">{label}</label>
      <div className="relative">
        {children}
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p className="text-[10px] text-text-muted font-medium ml-1">{helperText}</p>
      )}
    </div>
  );
};
