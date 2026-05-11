/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BorrowerInfo, PropertyInfo, CalculationResult, LoanScheme, GracePeriodResult } from './types';
import { 
  SCHEME_DEFAULT_RATES, 
  SCHEME_DEFAULT_YEARS, 
  CITY_BY_NAME,
  MAX_AGE_AT_LOAN_END,
  MAX_HOUSE_AGE_PLUS_TERM,
  OLD_HOUSE_TERM_PENALTY_YEARS,
  DEFAULT_LIVING_EXPENSE,
  DTI_RATIOS,
  GRACE_PERIOD_RATIOS,
  GRACE_LONG_THRESHOLD_YEARS,
  LTV_LADDER_DEFAULT,
  LTV_LADDER_NEST_NEST,
  GRACE_DEFAULT_LTV,
  GRACE_DEFAULT_LTV_NEST_NEST
} from './constants';

/**
 * Formatters (Single instance of Intl.NumberFormat)
 */
const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  maximumFractionDigits: 0
});

export const formatCurrency = (val: number) => currencyFormatter.format(val);

export const formatIncome = (val: number) => {
  if (val >= 10000) {
    return `${(val / 10000).toFixed(0)}萬↑`;
  }
  return val.toString();
};

export const formatIncomeRounded = (val: number) => {
  return formatIncome(Math.round(val / 10000) * 10000);
};

/**
 * Predicates
 */
export const schemeAllowsCustomRate = (scheme: LoanScheme) => 
  scheme === LoanScheme.GENERAL_FIRST;

/**
 * Helpers
 */
export const effectiveAnnualRate = (borrower: BorrowerInfo) => 
  borrower.annualRate || SCHEME_DEFAULT_RATES[borrower.scheme];

export const defaultGraceLTV = (scheme: LoanScheme) => 
  scheme === LoanScheme.NEST_NEST ? GRACE_DEFAULT_LTV_NEST_NEST : GRACE_DEFAULT_LTV;

/**
 * Get Property Zone Grade (A, B, C, D)
 */
export function getPropertyZoneGrade(property: PropertyInfo): 'A' | 'B' | 'C' | 'D' {
  // If a subDistrict (village) is selected, it's always Zone A
  if (property.subDistrict) return 'A';

  const city = CITY_BY_NAME.get(property.city);
  if (!city) return 'D';

  if (city.zones.A.includes(property.district)) return 'A';
  if (city.zones.B.includes(property.district)) return 'B';
  if (city.zones.C.includes(property.district)) return 'C';
  return 'D';
}

/**
 * Get Base LTV for General Schemes based on Zone
 */
export function getZoneBaseLTV(grade: 'A' | 'B' | 'C' | 'D'): number {
  switch (grade) {
    case 'A': return 0.8;
    case 'B': return 0.75;
    case 'C': return 0.7;
    case 'D': return 0.65;
  }
}

/**
 * Get LTV Ladder for a given scheme and property
 */
export function getLTVLadder(scheme: LoanScheme, property: PropertyInfo): number[] {
  if (scheme === LoanScheme.NEST_NEST) {
    return [0.85, 0.80, 0.75, 0.70, 0.65, 0.60];
  }
  const zoneGrade = getPropertyZoneGrade(property);
  const z = getZoneBaseLTV(zoneGrade);
  return [z, z - 0.05, z - 0.1, z - 0.15, z - 0.2];
}

/**
 * Calculate Household Outflow
 */
export function getHouseholdOutflow(borrower: BorrowerInfo, property: PropertyInfo) {
  const borrowerCity = CITY_BY_NAME.get(property.city);
  const borrowerLivingExpense = borrowerCity ? borrowerCity.livingExpense : DEFAULT_LIVING_EXPENSE;
  
  let totalLivingExpense = borrowerLivingExpense;
  if (borrower.hasGuarantor) {
    const guarantorCity = CITY_BY_NAME.get(borrower.guarantor.residenceCity);
    const guarantorLivingExpense = guarantorCity ? guarantorCity.livingExpense : DEFAULT_LIVING_EXPENSE;
    totalLivingExpense += guarantorLivingExpense;
  }
  
  const otherMonthlyRepayments = (borrower.otherLoanMonthly || 0) + 
                                 (borrower.hasGuarantor ? (borrower.guarantor.otherLoanMonthly || 0) : 0);
  
  return { totalLivingExpense, otherMonthlyRepayments };
}

/**
 * Calculate Monthly Payment using PMT formula
 */
export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numberOfPayments;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

/**
 * Calculate Loan Term based on constraints
 */
export function calculateLoanTerm(borrower: BorrowerInfo, property: PropertyInfo): number {
  let years = SCHEME_DEFAULT_YEARS[borrower.scheme];
  const age = borrower.age || 30;

  if (age + years > MAX_AGE_AT_LOAN_END) {
    years = Math.max(0, MAX_AGE_AT_LOAN_END - age);
  }

  if (!property.isPreSale && (property.houseAge || 0) > 0) {
    if ((property.houseAge || 0) + years > MAX_HOUSE_AGE_PLUS_TERM) {
      years = Math.max(0, years - OLD_HOUSE_TERM_PENALTY_YEARS);
    }
  }

  return years;
}

/**
 * Get required DTI based on LTV
 */
function getRequiredRatio(ltv: number): number {
  if (ltv >= 0.8) return DTI_RATIOS.LTV_80_PLUS;
  if (ltv >= 0.75) return DTI_RATIOS.LTV_75;
  if (ltv >= 0.70) return DTI_RATIOS.LTV_70;
  if (ltv >= 0.65) return DTI_RATIOS.LTV_65;
  return DTI_RATIOS.LTV_60;
}

/**
 * Main calculation logic
 */
export function performMainCalculation(borrower: BorrowerInfo, property: PropertyInfo): CalculationResult[] {
  const years = calculateLoanTerm(borrower, property);
  const rate = effectiveAnnualRate(borrower);
  const purchasePrice = property.purchasePrice || 0;
  
  const { totalLivingExpense, otherMonthlyRepayments } = getHouseholdOutflow(borrower, property);
  
  // Define the DTI Ratios (1.8 to 1.0)
  let dtiRatios = [1.8, 1.6, 1.4, 1.2, 1.0];
  const ltvLadder = getLTVLadder(borrower.scheme, property);
  
  if (borrower.scheme === LoanScheme.NEST_NEST && ltvLadder.length === 6) {
    dtiRatios = [1.8, 1.8, 1.6, 1.4, 1.2, 1.0];
  }
  
  const results: CalculationResult[] = ltvLadder.map((ltv, index) => {
    const ratio = dtiRatios[index];
    const loanAmount = purchasePrice * ltv;
    const monthlyRepayment = calculateMonthlyPayment(loanAmount, rate, years);
    const totalMonthlyOutflow = monthlyRepayment + otherMonthlyRepayments + totalLivingExpense;
    const totalRequiredAnnualIncome = ratio * totalMonthlyOutflow * 12;
    
    return {
      ltv: Math.round(ltv * 1000) / 10,
      dtiRatio: ratio,
      loanAmount,
      monthlyRepayment,
      requiredAnnualIncome: totalRequiredAnnualIncome
    };
  });

  return results;
}

/**
 * Grace Period calculation logic
 */
export function performGracePeriodCalculation(borrower: BorrowerInfo, property: PropertyInfo): GracePeriodResult[] {
  const loanTerm = calculateLoanTerm(borrower, property);
  const rate = effectiveAnnualRate(borrower);
  const { totalLivingExpense, otherMonthlyRepayments } = getHouseholdOutflow(borrower, property);
  
  const ltv = property.gracePeriodLTV || defaultGraceLTV(borrower.scheme);
  const purchasePrice = property.purchasePrice || 0;
  const loanAmount = purchasePrice * ltv;
  
  return [1, 2, 3, 4, 5].map(gYears => {
    const remainingYears = loanTerm - gYears;
    const monthlyRepayAfterGrace = calculateMonthlyPayment(loanAmount, rate, remainingYears);
    const ratio = gYears <= GRACE_LONG_THRESHOLD_YEARS - 1 ? GRACE_PERIOD_RATIOS.SHORT : GRACE_PERIOD_RATIOS.LONG;
    const annualIncome = ratio * (monthlyRepayAfterGrace + otherMonthlyRepayments + totalLivingExpense) * 12;
    
    return {
      label: `${gYears} 年`,
      ratio,
      loanAmount,
      monthlyRepayAfterGrace,
      requiredAnnualIncome: annualIncome
    };
  });
}
