/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BorrowerInfo, PropertyInfo, CalculationResult, LoanScheme } from './types';
import { SCHEME_DEFAULT_RATES, SCHEME_DEFAULT_YEARS, TAIWAN_CITIES } from './constants';

/**
 * Calculate Monthly Payment using PMT formula
 * @param principal Loan amount
 * @param annualRate Annual interest rate in percentage
 * @param years Total years
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
  // a. 預設年限：新青安與築巢優利貸 40 年，其他 30 年
  let years = SCHEME_DEFAULT_YEARS[borrower.scheme];

  // b. 年限 + 年齡 <= 89
  if (borrower.age + years > 89) {
    years = Math.max(0, 89 - borrower.age);
  }

  // c. 屋齡 + 年限 > 50 (非預售屋)，酌減 3 年
  if (!property.isPreSale && property.houseAge > 0) {
    if (property.houseAge + years > 50) {
      years = Math.max(0, years - 3);
    }
  }

  return years;
}

/**
 * Get required DTI (Income-Expense Ratio) based on LTV
 */
function getRequiredRatio(ltv: number, isNestNest: boolean): number {
  // 8成或以上(含築巢85成) 皆為 180%
  if (ltv >= 0.8) return 1.8;
  
  if (ltv >= 0.75) return 1.6;
  if (ltv >= 0.70) return 1.4;
  if (ltv >= 0.65) return 1.2;
  return 1.0; // 6成 100%
}

/**
 * Main calculation logic
 */
export function performMainCalculation(borrower: BorrowerInfo, property: PropertyInfo): CalculationResult[] {
  const years = calculateLoanTerm(borrower, property);
  const rate = borrower.annualRate || SCHEME_DEFAULT_RATES[borrower.scheme];
  const isNestNest = borrower.scheme === LoanScheme.NEST_NEST;
  
  // Living expenses
  const borrowerCity = TAIWAN_CITIES.find(c => c.name === property.city);
  const borrowerLivingExpense = borrowerCity ? borrowerCity.livingExpense : 16000;
  
  let totalLivingExpense = borrowerLivingExpense;
  if (borrower.hasGuarantor) {
    const guarantorCity = TAIWAN_CITIES.find(c => c.name === borrower.guarantor.residenceCity);
    const guarantorLivingExpense = guarantorCity ? guarantorCity.livingExpense : 16000;
    totalLivingExpense += guarantorLivingExpense;
  }
  
  // Other monthly payments
  const otherMonthlyRepayments = borrower.otherLoanMonthly + (borrower.hasGuarantor ? borrower.guarantor.otherLoanMonthly : 0);
  
  // Calculate for various LTV levels
  const ltvLevels = [0.6, 0.65, 0.7, 0.75, 0.8];
  if (isNestNest) ltvLevels.push(0.85);
  
  const results: CalculationResult[] = ltvLevels.map(ltv => {
    const loanAmount = property.purchasePrice * ltv;
    const monthlyRepayment = calculateMonthlyPayment(loanAmount, rate, years);
    
    // Reverse calculation for Required Annual Income
    // Ratio = (AnnualIncome) / ((MortgageMonthly + OtherMonthly + LivingExpense) * 12)
    // AnnualIncome = Ratio * (MortgageMonthly + OtherMonthly + LivingExpense) * 12
    const requiredRatio = getRequiredRatio(ltv, isNestNest);
    const totalMonthlyOutflow = monthlyRepayment + otherMonthlyRepayments + totalLivingExpense;
    
    // The annual income is for the person(s) involved
    // Total income required
    const totalRequiredAnnualIncome = requiredRatio * totalMonthlyOutflow * 12;
    
    return {
      ltv: ltv * 100,
      loanAmount,
      monthlyRepayment,
      requiredAnnualIncome: totalRequiredAnnualIncome
    };
  });

  return results.sort((a, b) => b.ltv - a.ltv);
}
