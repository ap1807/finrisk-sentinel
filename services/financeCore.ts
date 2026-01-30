import { 
  Transaction, 
  TransactionType, 
  Category, 
  FinancialHealthReport, 
  RiskLevel, 
  RiskFactor,
  MonthlySummary 
} from '../types';

/**
 * ARCHITECTURAL NOTE:
 * This file simulates a Java Spring Boot Backend architecture within TypeScript.
 * 
 * Structure:
 * 1. TransactionRepository (Data Access Layer - simulates JPA/Hibernate)
 * 2. RiskEngineService (Domain Logic / Analysis Layer - Rule-based engine)
 * 3. FinanceService (Service Layer - Business Logic orchestration)
 * 4. FinanceController (API Layer - Entry point for Frontend)
 */

// --- 1. Data Access Layer (Repository) ---
class TransactionRepository {
  private transactions: Transaction[] = [];

  constructor() {
    this.seedData();
  }

  // Simulating database seed
  private seedData() {
    const today = new Date();
    
    // Generate 3 months of data
    for (let i = 0; i < 90; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Monthly Salary (approx every 30 days)
      if (i % 30 === 0) {
        this.save({
          id: crypto.randomUUID(),
          amount: 5200,
          date: dateStr,
          description: 'Monthly Salary',
          type: TransactionType.INCOME,
          category: Category.SALARY,
          isRecurring: true
        });
      }

      // Rent
      if (i % 30 === 2) {
        this.save({
          id: crypto.randomUUID(),
          amount: 2100,
          date: dateStr,
          description: 'Apartment Rent',
          type: TransactionType.EXPENSE,
          category: Category.HOUSING,
          isRecurring: true
        });
      }

      // Random Grocery
      if (i % 4 === 0) {
        this.save({
          id: crypto.randomUUID(),
          amount: 80 + Math.random() * 100,
          date: dateStr,
          description: 'Grocery Store',
          type: TransactionType.EXPENSE,
          category: Category.FOOD,
          isRecurring: false
        });
      }

       // Random Entertainment
       if (i % 7 === 0) {
        this.save({
          id: crypto.randomUUID(),
          amount: 40 + Math.random() * 60,
          date: dateStr,
          description: 'Streaming & Dining',
          type: TransactionType.EXPENSE,
          category: Category.ENTERTAINMENT,
          isRecurring: false
        });
      }
    }
  }

  public findAll(): Transaction[] {
    // Sort by date desc
    return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public save(transaction: Transaction): Transaction {
    this.transactions.push(transaction);
    return transaction;
  }

  public reset(): void {
    this.transactions = [];
    this.seedData();
  }
}

// --- 2. Analysis Layer (The Risk Engine) ---
class RiskEngineService {
  
  // Rule-based logic typically found in a Drools or custom Java engine
  public analyze(
    monthlyIncome: number, 
    monthlyExpense: number, 
    liquidCash: number
  ): FinancialHealthReport {
    const risks: RiskFactor[] = [];
    let score = 100;

    // Metric Calculations
    const burnRate = monthlyExpense;
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) : 0;
    const expenseRatio = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) : 100;
    const runwayMonths = burnRate > 0 ? (liquidCash / burnRate) : 0;

    // --- RULE 1: Solvency Check ---
    if (savings < 0) {
      score -= 40;
      risks.push({
        code: 'SOLVENCY_RISK',
        title: 'Negative Cash Flow Detected',
        description: `You are spending ₹${Math.abs(savings).toFixed(0)} more than you earn monthly.`,
        severity: RiskLevel.CRITICAL,
        recommendation: 'Immediate budget freeze required. Audit variable expenses.'
      });
    }

    // --- RULE 2: Savings Rate Health ---
    if (savingsRate < 0.10 && savings >= 0) {
      score -= 20;
      risks.push({
        code: 'LOW_SAVINGS',
        title: 'Low Savings Rate',
        description: `Current savings rate is ${(savingsRate * 100).toFixed(1)}%. Recommended is 20%+.`,
        severity: RiskLevel.WARNING,
        recommendation: 'Target reducing Housing or Transport costs to boost savings.'
      });
    }

    // --- RULE 3: Emergency Runway ---
    if (runwayMonths < 3) {
      score -= 25;
      risks.push({
        code: 'LOW_RUNWAY',
        title: 'Fragile Emergency Fund',
        description: `Current cash provides only ${runwayMonths.toFixed(1)} months of runway.`,
        severity: RiskLevel.CRITICAL,
        recommendation: 'Prioritize building liquid cash reserves to cover at least 3 months of expenses.'
      });
    } else if (runwayMonths < 6) {
      score -= 10;
      risks.push({
        code: 'MODERATE_RUNWAY',
        title: 'Building Resilience',
        description: `Runway is healthy (${runwayMonths.toFixed(1)} months) but could be stronger.`,
        severity: RiskLevel.SAFE,
        recommendation: 'Continue saving to reach the 6-month safety net.'
      });
    }

    // --- RULE 4: High Fixed Costs ---
    if (expenseRatio > 0.8) {
      score -= 15;
      risks.push({
        code: 'HIGH_FIXED_COST',
        title: 'High Expense Ratio',
        description: `Expenses consume ${(expenseRatio * 100).toFixed(0)}% of income.`,
        severity: RiskLevel.WARNING,
        recommendation: 'Review recurring subscriptions and housing costs.'
      });
    }

    // Determine Overall Status
    let status = RiskLevel.SAFE;
    if (score < 60) status = RiskLevel.CRITICAL;
    else if (score < 80) status = RiskLevel.WARNING;

    return {
      overallScore: Math.max(0, score),
      status,
      monthlyBurnRate: burnRate,
      projectedRunwayMonths: runwayMonths,
      savingsRate,
      expenseToIncomeRatio: expenseRatio,
      riskFactors: risks
    };
  }
}

// --- 3. Service Layer (Business Logic) ---
class FinanceService {
  private repository: TransactionRepository;
  private riskEngine: RiskEngineService;

  constructor() {
    this.repository = new TransactionRepository();
    this.riskEngine = new RiskEngineService();
  }

  public getTransactionHistory(): Transaction[] {
    return this.repository.findAll();
  }

  public addTransaction(t: Transaction): void {
    this.repository.save(t);
  }

  public getAnalysis(totalLiquidCash: number): FinancialHealthReport {
    const transactions = this.repository.findAll();
    
    // Calculate Average Monthly stats based on last 30 days for simplicity in this demo
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentTx = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    const income = recentTx
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = recentTx
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return this.riskEngine.analyze(income, expense, totalLiquidCash);
  }

  public getMonthlySummary(): MonthlySummary[] {
    const transactions = this.repository.findAll();
    const map = new Map<string, MonthlySummary>();

    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!map.has(key)) {
        map.set(key, { month: key, income: 0, expense: 0, savings: 0 });
      }
      
      const summary = map.get(key)!;
      if (t.type === TransactionType.INCOME) summary.income += t.amount;
      else summary.expense += t.amount;
      summary.savings = summary.income - summary.expense;
    });

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }

  public getCategoryTrends(): any[] {
    const transactions = this.repository.findAll();
    const map = new Map<string, any>();

    transactions.forEach(t => {
      if (t.type !== TransactionType.EXPENSE) return;

      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM

      if (!map.has(key)) {
        map.set(key, { name: key });
      }
      
      const entry = map.get(key);
      entry[t.category] = (entry[t.category] || 0) + t.amount;
    });

    // Sort by date ascending
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  public resetSystem(): void {
    this.repository.reset();
  }
}

// --- 4. Controller Layer (Singleton Export) ---
// In a real Spring Boot app, this would be the @RestController
export const financeController = new FinanceService();