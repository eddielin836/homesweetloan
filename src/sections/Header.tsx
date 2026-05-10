import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end mb-4 md:mb-6 gap-4">
      <div className="space-y-1 w-full md:w-auto">
        <span className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-semibold text-primary uppercase">
          WHAT IT TAKES TO BUY A HOUSE
        </span>
        <h1 className="text-xl md:text-2xl serif font-bold text-stone-800">
          房貸成數與所得試算
        </h1>
      </div>
    </header>
  );
};
