export const javaFiles = [
  {
    name: "FinanceController.java",
    path: "src/main/java/com/finrisk/api/FinanceController.java",
    description: "REST API Endpoint definition using Spring Web",
    content: `package com.finrisk.api;

import com.finrisk.service.FinanceService;
import com.finrisk.model.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/v1/finance")
@CrossOrigin(origins = "*")
public class FinanceController {

    private final FinanceService financeService;

    @Autowired
    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/summary")
    public FinancialHealthReport getHealthAnalysis(@RequestParam double liquidCash) {
        // Orchestrates data retrieval and risk analysis
        return financeService.generateHealthReport(liquidCash);
    }

    @PostMapping("/transaction")
    public Transaction recordTransaction(@RequestBody Transaction transaction) {
        return financeService.recordTransaction(transaction);
    }

    @GetMapping("/history")
    public List<Transaction> getHistory() {
        return financeService.getTransactionHistory();
    }
}`
  },
  {
    name: "RiskEngineService.java",
    path: "src/main/java/com/finrisk/engine/RiskEngineService.java",
    description: "Core deterministic business logic using BigDecimal for precision",
    content: `package com.finrisk.engine;

import com.finrisk.model.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Deterministic Rule-Based Financial Risk Engine.
 * Analyzes spending patterns to detect solvency issues and runway depletion.
 */
@Service
public class RiskEngineService {

    private static final BigDecimal CRITICAL_SAVINGS_RATE = new BigDecimal("0.10");
    private static final BigDecimal SAFE_EXPENSE_RATIO = new BigDecimal("0.80");

    public FinancialHealthReport analyze(BigDecimal income, BigDecimal expense, BigDecimal liquidCash) {
        List<RiskFactor> risks = new ArrayList<>();
        int score = 100;

        BigDecimal netSavings = income.subtract(expense);
        
        // 1. Solvency Analysis (Cash Flow)
        if (netSavings.compareTo(BigDecimal.ZERO) < 0) {
            score -= 40;
            risks.add(new RiskFactor(
                RiskCode.SOLVENCY_RISK,
                "Negative Cash Flow",
                "Monthly expenses exceed income by ₹" + netSavings.abs(),
                RiskLevel.CRITICAL,
                "Freeze discretionary spending immediately."
            ));
        }

        // 2. Runway Calculation (Survival Time)
        // Avoid division by zero
        BigDecimal burnRate = expense.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ONE : expense;
        BigDecimal runwayMonths = liquidCash.divide(burnRate, 1, RoundingMode.HALF_DOWN);

        if (runwayMonths.compareTo(new BigDecimal("3.0")) < 0) {
            score -= 25;
            risks.add(new RiskFactor(
                RiskCode.LOW_RUNWAY,
                "Critical Runway Level",
                "Only " + runwayMonths + " months of runway remaining.",
                RiskLevel.CRITICAL,
                "Liquidity injection required. Target 3+ months."
            ));
        }

        // 3. Structural Cost Analysis (Fixed vs Variable)
        if (income.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal ratio = expense.divide(income, 2, RoundingMode.HALF_UP);
            if (ratio.compareTo(SAFE_EXPENSE_RATIO) > 0) {
                score -= 15;
                risks.add(new RiskFactor(
                    RiskCode.HIGH_FIXED_COST,
                    "High Expense Ratio",
                    "Expenses consume " + ratio.multiply(new BigDecimal(100)) + "% of income.",
                    RiskLevel.WARNING,
                    "Audit recurring fixed costs."
                ));
            }
        }

        return new FinancialHealthReport(
            Math.max(0, score),
            resolveRiskLevel(score),
            risks
        );
    }
    
    private RiskLevel resolveRiskLevel(int score) {
        if (score < 60) return RiskLevel.CRITICAL;
        if (score < 80) return RiskLevel.WARNING;
        return RiskLevel.SAFE;
    }
}`
  },
  {
    name: "Transaction.java",
    path: "src/main/java/com/finrisk/model/Transaction.java",
    description: "JPA Entity definition",
    content: `package com.finrisk.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate date;

    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    private Category category;

    private boolean isRecurring;
}`
  }
];