import React from 'react';

interface Props {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<Props> = ({ number, title, subtitle, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 mb-4 md:mb-6 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
        {number}
      </div>
      <h2 className="font-bold serif text-lg md:text-xl text-primary text-nowrap">{title}</h2>
      {subtitle && (
        <span className="text-[10px] md:text-xs text-text-muted font-bold ml-1 italic">
          {subtitle}
        </span>
      )}
    </div>
  );
};
