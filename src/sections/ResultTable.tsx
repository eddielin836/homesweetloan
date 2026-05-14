import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';
import { CalculationResult, LoanScheme } from '../types';
import { SCHEME_LABELS } from '../constants';
import { formatCurrency, formatIncomeRounded } from '../utils';

interface Props {
  loanTerm: number; // Max allowed
  actualYears: number; // User selected
  age: number;
  scheme: LoanScheme;
  annualRate: number;
  results: CalculationResult[];
}

export const ResultTable: React.FC<Props> = ({ loanTerm, actualYears, age, scheme, annualRate, results }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="result-card p-4 md:p-8 shadow-lg flex flex-col justify-between"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="space-y-1 md:space-y-2">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl serif font-bold text-stone-800">
              計算年限：{actualYears} 年
            </h2>
            {actualYears !== loanTerm && (
              <p className="text-[10px] md:text-xs text-primary font-bold">
                (最長可貸：{loanTerm} 年)
              </p>
            )}
          </div>
          <p className="text-stone-500 text-[10px] md:text-xs italic font-medium">
            依年齡 {age} 歲與 {SCHEME_LABELS[scheme]} 評估。
          </p>
        </div>
        <div className="md:text-right w-full md:w-auto">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-0.5">預估適用利率</p>
          <p className="text-3xl md:text-4xl font-light text-primary serif">
            {annualRate.toFixed(3)}%
          </p>
        </div>
      </div>

      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="text-left border-b border-primary/20">
            <tr className="text-primary text-[10px] font-black uppercase tracking-widest">
              <th className="pb-3 px-2">貸款成數</th>
              <th className="pb-3 px-2">貸款金額</th>
              <th className="pb-3 px-2">預估月還款</th>
              <th className="pb-3 px-2 text-right">稅後年薪(估)</th>
            </tr>
          </thead>
          <tbody className="text-xs md:text-sm">
            {results.map((item) => (
              <tr key={`${item.ltv}-${item.dtiRatio}`} className="border-b border-stone-100 last:border-0 hover:bg-white/40 transition-all text-stone-600">
                <td className="py-3 md:py-4 px-1 md:px-2">
                  <span className="text-sm md:text-base font-bold text-stone-800 whitespace-nowrap">
                    {item.ltv}%
                  </span>
                </td>
                <td className="py-3 md:py-4 px-1 md:px-2 text-[11px] md:text-sm font-medium whitespace-nowrap">{item.loanAmount} 萬元</td>
                <td className="py-3 md:py-4 px-1 md:px-2 text-[11px] md:text-sm font-medium whitespace-nowrap">{formatCurrency(item.monthlyRepayment)}</td>
                <td className="py-3 md:py-4 px-1 md:px-2 text-right">
                  <span className="text-sm md:text-lg font-bold text-primary">
                    {formatIncomeRounded(item.requiredAnnualIncome)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between border border-border-earth shadow-sm gap-4">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-bg-earth rounded-lg text-stone-600">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs md:text-sm text-stone-600 font-bold leading-tight">
              所得門檻已計入借款人(及保證人)最低生活費。
            </p>
            <p className="text-[11px] md:text-xs text-stone-400 font-medium italic">
              若房屋屋齡偏高，核貸年限與金額可能依鑑價結果再行調整。
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
