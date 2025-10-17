
import React, { useState, useEffect, useCallback } from "react";
import { Transaction, Budget, User } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  AlertTriangle,
  Calendar,
  FileText,
  Target,
  Sparkles
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

import KPIDashboard from "../components/business/KPIDashboard";
import RevenueChart from "../components/business/RevenueChart";
import OutstandingPayments from "../components/business/OutstandingPayments";
import BurnRateChart from "../components/business/BurnRateChart";
import TopCustomersVendors from "../components/business/TopCustomersVendors";
import ComplianceTracker from "../components/business/ComplianceTracker";
import BusinessInsights from "../components/business/BusinessInsights";

export default function BusinessDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessMetrics, setBusinessMetrics] = useState({
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    outstandingPayments: 0,
    burnRate: 0
  });
  const [aiInsight, setAiInsight] = useState("");

  const calculateBusinessMetrics = (transactionData) => {
    const currentMonth = new Date();
    const monthlyTransactions = transactionData.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startOfMonth(currentMonth) && transactionDate <= endOfMonth(currentMonth);
    });

    const revenue = monthlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Mock outstanding payments and burn rate for demo
    const outstandingPayments = revenue * 0.15; // 15% of revenue as outstanding
    const burnRate = expenses / 30; // Daily burn rate

    setBusinessMetrics({
      monthlyRevenue: revenue,
      monthlyExpenses: expenses,
      outstandingPayments,
      burnRate
    });
  };

  const generateBusinessInsight = async (transactionData) => {
    try {
      const prompt = `Analyze this business financial data and provide a strategic business insight in 2-3 sentences:
      
      Recent transactions: ${JSON.stringify(transactionData.slice(0, 15))}
      
      Focus on cash flow, business growth opportunities, cost optimization, or strategic recommendations.`;

      const result = await InvokeLLM({ prompt });
      setAiInsight(result);
    } catch (error) {
      setAiInsight("Focus on optimizing your cash flow and identifying growth opportunities in your top-performing revenue streams.");
    }
  };

  const loadBusinessData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [transactionData] = await Promise.all([
        Transaction.filter({ dashboard_type: "business" }, "-date", 100)
      ]);

      setTransactions(transactionData);
      calculateBusinessMetrics(transactionData);
      generateBusinessInsight(transactionData);
    } catch (error) {
      console.error("Error loading business data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies of calculateBusinessMetrics and generateBusinessInsight would technically go here if they were defined outside and were mutable. Since they are defined inside (or will be shortly), and don't depend on props/state, this is fine for now.

  useEffect(() => {
    loadBusinessData();
  }, [loadBusinessData]);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Business Dashboard</h1>
          <div className="flex items-center gap-1 text-blue-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Enterprise Analytics</span>
          </div>
        </div>
        <p className="text-gray-400">
          Strategic overview for {format(new Date(), "MMMM yyyy")}
        </p>
      </div>

      {/* KPI Cards */}
      <KPIDashboard metrics={businessMetrics} isLoading={isLoading} />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueChart transactions={transactions} isLoading={isLoading} />
        <BurnRateChart metrics={businessMetrics} isLoading={isLoading} />
      </div>

      {/* Business Insights */}
      <BusinessInsights insight={aiInsight} isLoading={!aiInsight} />

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <OutstandingPayments 
          amount={businessMetrics.outstandingPayments} 
          isLoading={isLoading} 
        />
        <TopCustomersVendors 
          transactions={transactions} 
          isLoading={isLoading} 
        />
        <ComplianceTracker isLoading={isLoading} />
      </div>
    </div>
  );
}
