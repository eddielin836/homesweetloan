import React from 'react';
import { motion } from 'motion/react';
import { GracePeriodResult } from '../types';
import { formatCurrency, formatIncomeRounded } from '../utils';

interface Props {
  ltv: number;
  results: GracePeriodResult[];
}

export const GraceGrid: React.FC<Props> = ({ ltv, results }) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="result-card p-4 md:p-8 shadow-lg relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl md:text-2xl serif font-bold text-stone-800">寬限期試算</h2>
        </div>

        <p className="text-text-muted text-[11px] mb-6 leading-relaxed font-medium bg-white/40 p-3 rounded-lg border border-border-earth/40">
          寬限期試算係以貸款成數 {ltv * 100}% 進行評估。銀行審核將視申請年限進行不同等級之所得門檻壓力測試。
        </p>

        <div className="space-y-4">
          {/* Header for Mobile - Only visible on small screens */}
          <div className="flex md:hidden px-4 py-2 border-b border-border-earth/30 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">
            <div className="w-14">寬限年數</div>
            <div className="flex-1 text-right pr-3">月還款(估)</div>
            <div className="flex-1 text-right">年薪門檻</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            {results.map((item, idx) => (
              <div key={idx} className="bg-white/60 rounded-xl p-3 md:p-4 border border-border-earth group hover:border-primary/30 transition-all flex flex-row md:flex-col items-center md:items-stretch justify-between shadow-sm">
                <div className="flex items-center md:mb-3 shrink-0">
                  <span className="bg-primary text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                    {item.label}
                  </span>
                </div>
                
                <div className="flex flex-1 flex-row md:flex-col justify-end md:justify-start items-center md:items-start gap-4 md:gap-3 px-2">
                  <div className="text-right md:text-left">
                    <p className="hidden md:block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">預估月還款</p>
                    <p className="text-xs md:text-base font-bold text-stone-800">{formatCurrency(item.monthlyRepayAfterGrace)}</p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="hidden md:block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">稅後年薪(估)</p>
                    <span className="text-sm md:text-xl font-bold text-primary">
                      {formatIncomeRounded(item.requiredAnnualIncome)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-4 text-[10px] text-text-muted/70 italic text-right font-medium">
            ※ 預估月還款金額係以寬限期結束後之還款金額進行試算。
          </p>
        </div>
      </div>
    </motion.section>
  );
};
