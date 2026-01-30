// Domain Models (mirroring Java Entities)

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  HOUSING = 'Housing',
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  UTILITIES = 'Utilities',
  HEALTH = 'Health',
  ENTERTAINMENT = 'Entertainment',
  SALARY = 'Salary',
  INVESTMENT = 'Investment',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO Date
  description: string;
  type: TransactionType;
  category: Category;
  isRecurring: boolean;
}

export enum RiskLevel {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface RiskFactor {
  code: string;
  title: string;
  description: string;
  severity: RiskLevel;
  recommendation: string;
}

export interface FinancialHealthReport {
  overallScore: number; // 0-100
  status: RiskLevel;
  monthlyBurnRate: number;
  projectedRunwayMonths: number;
  savingsRate: number;
  expenseToIncomeRatio: number;
  riskFactors: RiskFactor[];
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  savings: number;
}