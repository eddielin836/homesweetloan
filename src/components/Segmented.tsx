import React from 'react';

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
  size?: 'sm' | 'md';
}

export function Segmented<T extends string | number>({ 
  options, 
  value, 
  onChange, 
  className = '', 
  itemClassName = '',
  size = 'md'
}: Props<T>) {
  return (
    <div className={`flex gap-2 p-1 bg-stone-100 rounded-xl ${className}`}>
      {options.map((opt) => (
        <button 
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            flex-1 rounded-lg font-bold transition-all whitespace-nowrap
            ${size === 'sm' ? 'py-2 px-3 text-xs' : 'py-3 px-4 text-sm'}
            ${value === opt.value ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-500'}
            ${itemClassName}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
