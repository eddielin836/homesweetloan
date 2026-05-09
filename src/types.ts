/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LoanScheme {
  NEW_YOUTH = 'NEW_YOUTH', // 新青安
  NEST_NEST = 'NEST_NEST', // 築巢優利貸
  TOP_2500 = 'TOP_2500',   // 一般首購-2500大企業
  OTHER_FIRST = 'OTHER_FIRST' // 一般首購-非2500大
}

export enum HouseType {
  APARTMENT = 'APARTMENT', // 公寓
  ELEVATOR = 'ELEVATOR',   // 電梯大樓
  TOWNHOUSE = 'TOWNHOUSE' // 透天
}

export enum Relationship {
  FAMILY = 'FAMILY',
  SPOUSE = 'SPOUSE',
  OTHER = 'OTHER'
}

export interface BorrowerInfo {
  age: number;
  scheme: LoanScheme;
  otherLoanMonthly: number;
  residenceCity: string;
  hasGuarantor: boolean;
  guarantor: {
    otherLoanMonthly: number;
    relationship: Relationship;
    residenceCity: string;
  };
}

export interface PropertyInfo {
  city: string;
  district: string;
  isPreSale: boolean;
  houseAge: number;
  purchasePrice: number;
  houseType: HouseType;
  needsGracePeriod: boolean;
  gracePeriodLTV?: number;
}

export interface CalculationResult {
  ltv: number;
  loanAmount: number;
  monthlyRepayment: number;
  requiredAnnualIncome: number;
}
