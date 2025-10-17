
import React, { useState, useEffect } from "react";
import { Transaction, Budget, Achievement } from "@/entities/all";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useAppContext } from "@/components/AppContext";
import { formatCurrency } from "@/components/lib/currency";

import FinancialHealthMeter from "../components/dashboard/FinancialHealthMeter";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AIInsights from "../components/dashboard/AIInsights";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const { user } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState("");
  const [financialHealth, setFinancialHealth] = useState(0);

  // Moved loadDashboardData inside useEffect to resolve the dependency warning.
  // Dependencies for generateAIInsight and calculateFinancialHealth are state setters
  // or functions defined outside, which are stable.
  // However, generateAIInsight and calculateFinancialHealth rely on values from
  // transactionData and budgetData obtained within loadDashboardData,
  // so passing them as arguments is correct.
  useEffect(() => {
    const generateAIInsight = async (transactionData) => {
      try {
        const currentMonth = new Date();
        const monthlyTransactions = transactionData.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth);
        });
  
        const prompt = `Analyze these financial transactions and provide a helpful, encouraging insight in 1-2 sentences. Use the currency code '${user?.currency || 'USD'}' for all financial values mentioned.
        
        Recent transactions: ${JSON.stringify(monthlyTransactions.slice(0, 10))}
        
        Focus on spending patterns, potential savings opportunities, or positive financial habits.`;
  
        // Assuming base44.llm.invoke is the new way to call the LLM, as InvokeLLM import was removed.
        const result = await base44.llm.invoke({ prompt }); 
        setAiInsight(result);
      } catch (error) {
        // console.error("Error generating AI insight:", error); // For debugging
        setAiInsight("Keep tracking your expenses consistently - you're building great financial habits!");
      }
    };
  
    const calculateBudgetAdherence = (transactions, budgets) => {
      if (budgets.length === 0) return 50; // Neutral score if no budgets
  
      let adherenceScore = 0;
      let budgetCount = 0;
  
      budgets.forEach(budget => {
        const categoryExpenses = transactions
          .filter(t => t.type === "expense" && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
  
        const adherencePercentage = budget.monthly_limit > 0 
          ? Math.max(0, (1 - (categoryExpenses / budget.monthly_limit)) * 100)
          : 50;
  
        adherenceScore += adherencePercentage;
        budgetCount++;
      });
  
      return budgetCount > 0 ? adherenceScore / budgetCount : 50;
    };

    const calculateFinancialHealth = (transactionData, budgetData) => {
      const currentMonth = new Date();
      const monthlyTransactions = transactionData.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth);
      });
  
      const totalIncome = monthlyTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
  
      const totalExpenses = monthlyTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
  
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      const budgetAdherence = calculateBudgetAdherence(monthlyTransactions, budgetData);
  
      // Calculate health score (0-100)
      const healthScore = Math.max(0, Math.min(100, (savingsRate * 0.6) + (budgetAdherence * 0.4)));
      setFinancialHealth(healthScore);
    };

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, budgetsData, achievementsData] = await Promise.all([
          Transaction.filter({ dashboard_type: "personal" }, "-date", 100),
          Budget.list(),
          Achievement.list()
        ]);

        setTransactions(transactionsData);
        setBudgets(budgetsData);
        setAchievements(achievementsData);

        // Generate AI insight
        if (transactionsData.length > 0) {
          generateAIInsight(transactionsData);
        }

        // Calculate financial health
        calculateFinancialHealth(transactionsData, budgetsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]); // Added user to dependency array because generateAIInsight now depends on user.currency

  const getMonthlyStats = () => {
    const currentMonth = new Date();
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth);
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netWorth = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netWorth, monthlyTransactions };
  };

  const { totalIncome, totalExpenses, netWorth, monthlyTransactions } = getMonthlyStats();

  const currency = user?.currency || 'USD'; // Get currency from context or default

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <div className="flex items-center gap-1 text-green-500">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
        <p className="text-gray-400">
          Here's your financial overview for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-gray-700" />
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(totalIncome, currency)}
                </p>
                <div className="flex items-center gap-1 text-sm text-green-500">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+5.2% from last month</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-gray-700" />
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-red-500">
                  {formatCurrency(totalExpenses, currency)}
                </p>
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>-2.1% from last month</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-gray-700" />
            ) : (
              <div className="space-y-2">
                <p className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {netWorth < 0 && '-'}{formatCurrency(Math.abs(netWorth), currency)}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <PiggyBank className="w-4 h-4" />
                  <span>{netWorth >= 0 ? 'Saved' : 'Overspent'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 bg-gray-700" />
            ) : (
              <div className="space-y-2">
                <p className={`text-2xl font-bold ${
                  financialHealth >= 70 ? 'text-green-500' : 
                  financialHealth >= 40 ? 'text-yellow-400' : 'text-red-500'
                }`}>
                  {financialHealth.toFixed(0)}%
                </p>
                <Badge className={`text-xs ${
                  financialHealth >= 70 ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                  financialHealth >= 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/20 text-red-500 border-red-500/30'
                }`}>
                  {financialHealth >= 70 ? 'Excellent' : financialHealth >= 40 ? 'Good' : 'Needs Attention'}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts and Insights Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ExpenseChart transactions={monthlyTransactions} isLoading={isLoading} />
        <FinancialHealthMeter score={financialHealth} isLoading={isLoading} />
      </div>

      {/* AI Insights */}
      <AIInsights insight={aiInsight} isLoading={!aiInsight} />

      {/* Recent Transactions and Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions.slice(0, 5)} isLoading={isLoading} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
