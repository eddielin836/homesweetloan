/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  User, 
  Home, 
  MapPin, 
  CircleDollarSign, 
  Calendar, 
  CheckCircle2, 
  Info,
  ChevronRight,
  TrendingDown,
  Users,
  Building2,
  Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BorrowerInfo, PropertyInfo, LoanScheme, HouseType, CalculationResult } from './types';
import { SCHEME_LABELS, TAIWAN_CITIES, SCHEME_DEFAULT_RATES } from './constants';
import { performMainCalculation, calculateLoanTerm, calculateMonthlyPayment } from './utils';

export default function App() {
  // --- States ---
  const [borrower, setBorrower] = useState<BorrowerInfo>({
    age: 30,
    scheme: LoanScheme.NEW_YOUTH,
    annualRate: SCHEME_DEFAULT_RATES[LoanScheme.NEW_YOUTH],
    otherLoanMonthly: 0,
    residenceCity: '台北市',
    hasGuarantor: false,
    guarantor: {
      otherLoanMonthly: 0,
      residenceCity: '台北市'
    }
  });

  const [property, setProperty] = useState<PropertyInfo>({
    city: '台北市',
    district: '中正區',
    isPreSale: true,
    houseAge: 0,
    purchasePrice: 10000000,
    houseType: HouseType.ELEVATOR,
    needsGracePeriod: false,
    gracePeriodLTV: 0.8
  });

  // --- Helpers ---
  const currentCity = useMemo(() => TAIWAN_CITIES.find(c => c.name === property.city), [property.city]);
  
  const results = useMemo(() => performMainCalculation(borrower, property), [borrower, property]);
  
  const loanTerm = useMemo(() => calculateLoanTerm(borrower, property), [borrower, property]);

  const gracePeriodResults = useMemo(() => {
    if (!property.needsGracePeriod) return null;
    const isNestNest = borrower.scheme === LoanScheme.NEST_NEST;
    const ltv = property.gracePeriodLTV || (isNestNest ? 0.85 : 0.8);
    const loanAmount = property.purchasePrice * ltv;
    
    // Living expenses based on residence
    const bCity = TAIWAN_CITIES.find(c => c.name === borrower.residenceCity);
    const bExpense = bCity ? bCity.livingExpense : 16000;
    
    let totalExpense = bExpense;
    if (borrower.hasGuarantor) {
      const gCity = TAIWAN_CITIES.find(c => c.name === borrower.guarantor.residenceCity);
      const gExpense = gCity ? gCity.livingExpense : 16000;
      totalExpense += gExpense;
    }

    const otherRepays = borrower.otherLoanMonthly + (borrower.hasGuarantor ? borrower.guarantor.otherLoanMonthly : 0);
    
    // We calculate required income for 1-2 years (Ratio 200%) and 3-5 years (Ratio 250%)
    return [1, 2, 3, 4, 5].map(gYears => {
      const remainingYears = loanTerm - gYears;
      // Monthly payment AFTER grace period (shorter term)
      const rate = borrower.annualRate || SCHEME_DEFAULT_RATES[borrower.scheme];
      const monthlyRepayAfterGrace = calculateMonthlyPayment(loanAmount, rate, remainingYears);
      
      const ratio = gYears <= 2 ? 2.0 : 2.5;
      const annualIncome = ratio * (monthlyRepayAfterGrace + otherRepays + totalExpense) * 12;
      
      return {
        label: `${gYears} 年`,
        ratio,
        loanAmount,
        requiredAnnualIncome: annualIncome
      };
    });
  }, [property.needsGracePeriod, results, borrower, loanTerm]);

  // --- Handlers ---
  const handleNumericChange = (setter: (val: number) => void, value: string) => {
    if (value === '') {
      setter(0);
      return;
    }
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  const handleBorrowerChange = (field: keyof BorrowerInfo, value: any) => {
    setBorrower(prev => {
      const newState = { ...prev, [field]: value };
      
      // When scheme changes, check if gracePeriodLTV needs update AND update annualRate
      if (field === 'scheme') {
        const isNestNest = value === LoanScheme.NEST_NEST;
        if (!isNestNest && property.gracePeriodLTV === 0.85) {
          handlePropertyChange('gracePeriodLTV', 0.8);
        }
        newState.annualRate = SCHEME_DEFAULT_RATES[value as LoanScheme];
      }
      
      return newState;
    });
  };

  const handleGuarantorChange = (field: keyof BorrowerInfo['guarantor'], value: any) => {
    setBorrower(prev => ({
      ...prev,
      guarantor: { ...prev.guarantor, [field]: value }
    }));
  };

  const handlePropertyChange = (field: keyof PropertyInfo, value: any) => {
    setProperty(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatIncome = (val: number) => {
    if (val >= 10000) {
      return (val / 10000).toFixed(1) + ' 萬';
    }
    return val.toString();
  };

  return (
    <div className="min-h-screen bg-bg-earth text-text-earth font-sans selection:bg-primary selection:text-white p-6 md:p-12 relative">
      {/* Header */}
      <header className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end mb-6 md:mb-10 gap-6">
        <div className="space-y-1 w-full md:w-auto">
          <span className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-semibold text-primary uppercase">Mortgage Eligibility & Income Analysis</span>
          <h1 className="text-2xl md:text-4xl serif font-bold text-stone-800">房貸成數與所得試算</h1>
        </div>
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="accent-pill px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-all cursor-default">
            <Calculator className="w-5 h-5" />
            <span>智能試算</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section: Borrower */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="input-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">01</div>
              <h2 className="font-bold serif text-lg md:text-xl capitalize text-primary text-nowrap">借款人與保證人</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="form-label">借款人居住地</label>
                <select 
                  value={borrower.residenceCity}
                  onChange={(e) => handleBorrowerChange('residenceCity', e.target.value)}
                  className="input-field font-medium appearance-none"
                >
                  {TAIWAN_CITIES.map(city => (
                    <option key={`borrower-${city.name}`} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="form-label">借款人年齡</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={borrower.age === 0 ? '' : borrower.age}
                    onChange={(e) => handleNumericChange((v) => handleBorrowerChange('age', v), e.target.value)}
                    className="input-field pr-12 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">歲</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="form-label">房貸方案選擇</label>
                <select 
                  value={borrower.scheme}
                  onChange={(e) => handleBorrowerChange('scheme', e.target.value as LoanScheme)}
                  className="input-field font-medium appearance-none"
                >
                  {Object.entries(SCHEME_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {(borrower.scheme === LoanScheme.TOP_2500 || borrower.scheme === LoanScheme.OTHER_FIRST) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="form-label">自定義貸款利率 (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.001"
                      value={borrower.annualRate === 0 ? '' : borrower.annualRate}
                      onChange={(e) => handleNumericChange((v) => handleBorrowerChange('annualRate', v), e.target.value)}
                      className="input-field pr-12 font-medium"
                      placeholder={SCHEME_DEFAULT_RATES[borrower.scheme].toString()}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">%</span>
                  </div>
                </motion.div>
              )}

              <div className="space-y-1 md:col-span-2">
                <label className="form-label">其他貸款月還款金額 (信貸、車貸等)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={borrower.otherLoanMonthly === 0 ? '' : borrower.otherLoanMonthly}
                    onChange={(e) => handleNumericChange((v) => handleBorrowerChange('otherLoanMonthly', v), e.target.value)}
                    className="input-field pr-12 font-medium"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">元</span>
                </div>
              </div>

              <div className="md:col-span-2 pt-4 flex items-center justify-between border-t border-border-earth">
                <span className="text-sm font-semibold text-stone-700 font-bold">提供一般保證人</span>
                <button 
                  onClick={() => handleBorrowerChange('hasGuarantor', !borrower.hasGuarantor)}
                  className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-200 ${borrower.hasGuarantor ? 'bg-primary' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${borrower.hasGuarantor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            {/* Guarantor Details */}
            <AnimatePresence>
              {borrower.hasGuarantor && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-6 bg-stone-50/50 rounded-2xl p-6 border border-border-earth/50 space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-text-muted" />
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">保證人詳細資料</h3>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="form-label">保證人居住地</label>
                        <select 
                          value={borrower.guarantor.residenceCity}
                          onChange={(e) => handleGuarantorChange('residenceCity', e.target.value)}
                          className="input-field font-medium text-sm"
                        >
                          {TAIWAN_CITIES.map(city => (
                            <option key={`guarantor-${city.name}`} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                      </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="form-label">其他貸款月還款金額 (信貸、車貸等)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={borrower.guarantor.otherLoanMonthly === 0 ? '' : borrower.guarantor.otherLoanMonthly}
                          onChange={(e) => handleNumericChange((v) => handleGuarantorChange('otherLoanMonthly', v), e.target.value)}
                          className="input-field pr-12 font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">元</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Section: Property */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="input-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">02</div>
              <h2 className="font-bold serif text-lg md:text-xl capitalize text-primary text-nowrap">購房細節</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="form-label">縣市</label>
                <select 
                  value={property.city}
                  onChange={(e) => handlePropertyChange('city', e.target.value)}
                  className="input-field font-medium appearance-none"
                >
                  {TAIWAN_CITIES.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="form-label">行政區</label>
                <select 
                  value={property.district}
                  onChange={(e) => handlePropertyChange('district', e.target.value)}
                  className="input-field font-medium appearance-none"
                >
                  {currentCity?.districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex gap-4 p-1 bg-stone-100 rounded-xl">
                  <button 
                    onClick={() => handlePropertyChange('isPreSale', true)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${property.isPreSale ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-500'}`}
                  >
                    預售屋
                  </button>
                  <button 
                    onClick={() => handlePropertyChange('isPreSale', false)}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${!property.isPreSale ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-500'}`}
                  >
                    成屋 / 中古
                  </button>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="form-label">購屋總價 (萬)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={property.purchasePrice === 0 ? '' : property.purchasePrice / 10000}
                    onChange={(e) => handleNumericChange((v) => handlePropertyChange('purchasePrice', v * 10000), e.target.value)}
                    className="input-field pr-12 font-bold text-lg serif"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">萬</span>
                </div>
                <p className="text-[10px] text-text-muted font-medium ml-1">等於 {formatCurrency(property.purchasePrice)}</p>
              </div>

              <div className="space-y-1">
                <label className="form-label">房屋種類</label>
                <select 
                  value={property.houseType}
                  onChange={(e) => handlePropertyChange('houseType', e.target.value as HouseType)}
                  className="input-field font-medium appearance-none"
                >
                  <option value={HouseType.APARTMENT}>公寓</option>
                  <option value={HouseType.ELEVATOR}>電梯大樓</option>
                  <option value={HouseType.TOWNHOUSE}>透天</option>
                </select>
              </div>

              {!property.isPreSale && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-1"
                >
                  <label className="form-label">房屋屋齡</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={property.houseAge === 0 ? '' : property.houseAge}
                      onChange={(e) => handleNumericChange((v) => handlePropertyChange('houseAge', v), e.target.value)}
                      className="input-field pr-12 font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs font-bold">年</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* Section: Grace Period */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="input-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">03</div>
              <h2 className="font-bold serif text-lg md:text-xl capitalize text-primary text-nowrap">寬限期試算</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-stone-700 font-bold">需要寬限期試算</span>
                <button 
                  onClick={() => handlePropertyChange('needsGracePeriod', !property.needsGracePeriod)}
                  className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-200 ${property.needsGracePeriod ? 'bg-primary' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${property.needsGracePeriod ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {property.needsGracePeriod && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-border-earth overflow-hidden"
                >
                  <div className="space-y-1">
                    <label className="form-label">寬限期試算貸款成數</label>
                    <div className="flex gap-2 p-1 bg-stone-100 rounded-xl overflow-x-auto">
                      {(borrower.scheme === LoanScheme.NEST_NEST ? [0.85, 0.8, 0.75, 0.7, 0.65, 0.6] : [0.8, 0.75, 0.7, 0.65, 0.6]).map(val => (
                        <button 
                          key={val}
                          onClick={() => handlePropertyChange('gracePeriodLTV', val)}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${property.gracePeriodLTV === val ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-500'}`}
                        >
                          {(val * 100).toFixed(0)}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted italic leading-relaxed">
                    ※ 勾選後下方將顯示各寬限期所需之年薪門檻。
                  </p>
                </motion.div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="result-card p-6 md:p-10 shadow-lg flex flex-col justify-between"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  精算結果分析 Report
                </div>
                <h3 className="text-2xl md:text-3xl serif font-bold text-stone-800">最高核貸年限：{loanTerm} 年</h3>
                <p className="text-stone-500 text-xs md:text-sm italic font-medium">
                  依年齡 {borrower.age} 歲與 {SCHEME_LABELS[borrower.scheme]} 評估。
                </p>
              </div>
              <div className="md:text-right w-full md:w-auto">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">預估適用利率</p>
                <p className="text-4xl md:text-5xl font-light text-primary serif">
                  {results.length > 0 ? `${(borrower.annualRate || 0).toFixed(3)}%` : '---'}
                </p>
              </div>
            </div>

            <div className="my-10 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="text-left border-b border-primary/20">
                  <tr className="text-primary text-[10px] font-black uppercase tracking-widest">
                    <th className="pb-4 px-2">貸款成數</th>
                    <th className="pb-4 px-2">貸款金額</th>
                    <th className="pb-4 px-2">預估月付額</th>
                    <th className="pb-4 px-2 text-right">稅後年薪(估)</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {results.map((item, idx) => (
                    <tr key={idx} className={`border-b border-stone-100 last:border-0 hover:bg-white/40 transition-all ${idx === 0 ? 'text-stone-900 font-semibold' : 'text-stone-600'}`}>
                      <td className="py-4 md:py-5 px-1 md:px-2">
                        <span className={`badge ${idx === 0 ? 'bg-primary text-white' : 'bg-transparent'} py-1 px-2 md:px-3 rounded-full text-[10px] md:text-xs whitespace-nowrap`}>
                          {item.ltv}% {idx === 0 ? '(最高)' : ''}
                        </span>
                      </td>
                      <td className="py-4 md:py-5 px-1 md:px-2 text-[11px] md:text-sm font-medium whitespace-nowrap">{formatCurrency(item.loanAmount)}</td>
                      <td className="py-4 md:py-5 px-1 md:px-2 text-[11px] md:text-sm font-medium whitespace-nowrap">{formatCurrency(item.monthlyRepayment)}</td>
                      <td className="py-4 md:py-5 px-1 md:px-2 text-right">
                        <span className="text-base md:text-lg font-bold text-primary block md:inline">
                          {formatIncome(Math.round(item.requiredAnnualIncome / 10000) * 10000)}
                        </span>
                        <span className="text-[9px] md:text-[10px] md:ml-1 text-primary/60">元以上</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-border-earth shadow-sm gap-4">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-bg-earth rounded-xl text-stone-600">
                  <Info className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-stone-600 font-bold leading-relaxed">
                    所得門檻已計入借款人(及保證人)居住地生活費需用。
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium italic">
                    若房屋屋齡偏高，核貸年限與金額可能依鑑價結果再行調整。
                  </p>
                </div>
              </div>
              <div className="flex gap-4 shrink-0">

              </div>
            </div>
          </motion.div>

          {/* Grace Period Insight */}
          <AnimatePresence>
            {property.needsGracePeriod && gracePeriodResults && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary text-white rounded-[2rem] p-6 md:p-10 shadow-sm relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <CircleDollarSign className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl serif font-bold">寬限期資格審查預估</h2>
                  </div>

                  <p className="text-stone-200/80 text-xs mb-10 leading-relaxed font-medium bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                    寬限期試算係以貸款成數 {(property.gracePeriodLTV || (borrower.scheme === LoanScheme.NEST_NEST ? 0.85 : 0.8)) * 100}% 進行評估。銀行審核將視申請年限進行不同等級之所得門檻壓力測試。
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {gracePeriodResults.map((item, idx) => (
                      <div key={idx} className="bg-white/10 rounded-2xl p-6 border border-white/10 group hover:bg-white/20 transition-all flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-white text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">{item.label}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">稅後年薪(估)</p>
                          <p className="text-2xl font-black serif">{formatIncome(Math.round(item.requiredAnnualIncome / 10000) * 10000)} 元</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-12 -right-12 opacity-5 scale-150 rotate-12">
                   <Calculator className="w-64 h-64" />
                </div>
              </motion.section>
            )}
          </AnimatePresence>

      {/* Footer Guidelines */}
      <footer className="mt-16 pt-10 border-t border-border-earth">
        <div className="max-w-[1400px] mx-auto bg-primary/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-primary/10">
          <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
            <Info className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <p className="text-center md:text-left text-sm md:text-base text-primary/80 font-bold leading-relaxed serif italic">
            本試算結果僅供參考，主要揭示各成數下銀行可能之基本門檻，實際核貸仍需考量個人信用評價、負債狀況及銀行鑑價金額。
          </p>
        </div>
        <div className="mt-8 text-center text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">
          © {new Date().getFullYear()} Mortgage Eligibility Analysis Tool
        </div>
      </footer>
        </div>
      </main>

      {/* Version Label */}
      <div className="absolute bottom-4 right-4 text-[10px] text-stone-400 font-mono pointer-events-none select-none opacity-40 z-50">
        v.01.0510_03
      </div>
    </div>
  );
}
