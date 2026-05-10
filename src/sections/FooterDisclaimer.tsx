import React from 'react';
import { Info } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-border-earth">
      <div className="max-w-[1400px] mx-auto bg-primary/5 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 border border-primary/10">
        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
          <Info className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <p className="text-center md:text-left text-xs md:text-sm text-primary/80 font-bold leading-relaxed serif italic">
          本試算結果僅供參考，實際核貸與否及核貸條件仍需考量借款人信用狀況及房屋鑑價金額。
        </p>
      </div>
      <div className="mt-6 text-center text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">
        © {new Date().getFullYear()} Mortgage Eligibility Analysis Tool
      </div>
    </footer>
  );
};
