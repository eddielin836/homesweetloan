/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LoanScheme {
  NEW_YOUTH = 'NEW_YOUTH', // 青年安心成家貸款
  NEST_NEST = 'NEST_NEST', // 築巢優利貸
  GENERAL_FIRST = 'GENERAL_FIRST', // 一般首購
}

export interface BorrowerInfo {
  age?: number;
  scheme: LoanScheme;
  annualRate?: number;
  loanYears?: number;
  otherLoanMonthly?: number;
  residenceCity: string;
  hasGuarantor: boolean;
  guarantor: {
    otherLoanMonthly?: number;
    residenceCity: string;
  };
}

export interface PropertyInfo {
  city: string;
  district: string;
  subDistrict?: string; // 特定區/里 (Note 1-7)
  isPreSale: boolean;
  houseAge?: number;
  purchasePrice?: number;
  needsGracePeriod: boolean;
  gracePeriodLTV?: number;
}

export interface CalculationResult {
  ltv: number;
  dtiRatio: number; // 新增：收支比 (1.8, 1.6, etc.)
  loanAmount: number;
  monthlyRepayment: number;
  requiredAnnualIncome: number;
}

export interface GracePeriodResult {
  label: string;
  ratio: number;
  loanAmount: number;
  monthlyRepayAfterGrace: number;
  requiredAnnualIncome: number;
}
