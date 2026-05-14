/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { BorrowerInfo, PropertyInfo, LoanScheme } from './types';
import { SCHEME_DEFAULT_RATES, CITY_BY_NAME, GRACE_DEFAULT_LTV, GRACE_DEFAULT_LTV_NEST_NEST } from './constants';
import { 
  performMainCalculation, 
  calculateLoanTerm, 
  performGracePeriodCalculation, 
  effectiveAnnualRate,
  defaultGraceLTV,
  getLTVLadder
} from './utils';

// Sections
import { Header } from './sections/Header';
import { BorrowerSection } from './sections/BorrowerSection';
import { PropertySection } from './sections/PropertySection';
import { GracePeriodSection } from './sections/GracePeriodSection';
import { ResultTable } from './sections/ResultTable';
import { GraceGrid } from './sections/GraceGrid';
import { FooterDisclaimer } from './sections/FooterDisclaimer';

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
    purchasePrice: 1000,
    needsGracePeriod: false,
    gracePeriodLTV: GRACE_DEFAULT_LTV
  });

  // --- Side Effects ---
  
  // 1. Sync Annual Rate when scheme changes
  useEffect(() => {
    setBorrower(prev => ({
      ...prev,
      annualRate: SCHEME_DEFAULT_RATES[prev.scheme]
    }));
  }, [borrower.scheme]);

  // 2. Sync Grace Period LTV with max allowed when context changes (Reset on change)
  useEffect(() => {
    const ladder = getLTVLadder(borrower.scheme, property);
    if (ladder.length > 0) {
      const maxLtv = ladder[0];
      setProperty(prev => ({ ...prev, gracePeriodLTV: maxLtv }));
    }
  }, [borrower.scheme, property.city, property.district, property.subDistrict]);

  // 3. Reset district when city changes
  useEffect(() => {
    const cityData = CITY_BY_NAME.get(property.city);
    if (cityData) {
      // Find the first non-empty zone to pick a default district
      const allDistricts = [
        ...cityData.zones.A,
        ...cityData.zones.B,
        ...cityData.zones.C,
        ...cityData.zones.D
      ];
      if (allDistricts.length > 0) {
        setProperty(prev => ({ ...prev, district: allDistricts[0], subDistrict: undefined }));
      }
    }
  }, [property.city]);

  // 4. Reset subDistrict when district changes
  useEffect(() => {
    setProperty(prev => ({ ...prev, subDistrict: undefined }));
  }, [property.district]);

  // 5. Sync loanYears with max loanTerm when max term changes or initially
  useEffect(() => {
    const maxTerm = calculateLoanTerm(borrower, property);
    // Only auto-update if loanYears is not set or if it exceeds new max
    setBorrower(prev => ({
      ...prev,
      loanYears: prev.loanYears && prev.loanYears <= maxTerm ? prev.loanYears : maxTerm
    }));
  }, [borrower.age, borrower.scheme, property.houseAge, property.isPreSale]);

  // --- Calculations ---
  const results = useMemo(() => performMainCalculation(borrower, property), [borrower, property]);
  const loanTerm = useMemo(() => calculateLoanTerm(borrower, property), [borrower, property]);
  const gracePeriodResults = useMemo(() => {
    if (!property.needsGracePeriod) return null;
    return performGracePeriodCalculation(borrower, property);
  }, [borrower, property]);

  // --- Handlers ---
  const handleBorrowerChange = <K extends keyof BorrowerInfo>(field: K, value: BorrowerInfo[K]) => {
    setBorrower(prev => ({ ...prev, [field]: value }));
  };

  const handleGuarantorChange = <K extends keyof BorrowerInfo['guarantor']>(field: K, value: BorrowerInfo['guarantor'][K]) => {
    setBorrower(prev => ({
      ...prev,
      guarantor: { ...prev.guarantor, [field]: value }
    }));
  };

  const handlePropertyChange = <K extends keyof PropertyInfo>(field: K, value: PropertyInfo[K]) => {
    setProperty(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-bg-earth text-text-earth font-sans selection:bg-primary selection:text-white p-4 md:p-8 relative">
      <Header />

      <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <BorrowerSection 
            borrower={borrower} 
            property={property}
            onChange={handleBorrowerChange} 
            onGuarantorChange={handleGuarantorChange} 
          />
          <PropertySection 
            property={property} 
            onChange={handlePropertyChange} 
          />
          <GracePeriodSection 
            property={property} 
            scheme={borrower.scheme} 
            onChange={handlePropertyChange} 
          />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-4">
          <ResultTable 
            loanTerm={loanTerm}
            actualYears={borrower.loanYears || loanTerm}
            age={borrower.age || 0}
            scheme={borrower.scheme}
            annualRate={effectiveAnnualRate(borrower)}
            results={results}
          />

          <AnimatePresence>
            {property.needsGracePeriod && gracePeriodResults && (
              <GraceGrid 
                ltv={property.gracePeriodLTV || defaultGraceLTV(borrower.scheme)} 
                results={gracePeriodResults} 
              />
            )}
          </AnimatePresence>

          <FooterDisclaimer />
        </div>
      </main>

      {/* Version Label */}
      <div className="absolute bottom-4 right-4 text-xs text-stone-400 font-mono pointer-events-none select-none opacity-50 z-50">
        {import.meta.env.VITE_APP_VERSION}
      </div>
    </div>
  );
}
