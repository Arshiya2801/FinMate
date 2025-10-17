
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Transaction } from "@/entities/all";
import { base44 } from "@/api/base44Client"; // Updated import
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  format
} from 'date-fns';
import { useAppContext } from "@/components/AppContext";

import ReportControls from "../components/reports/ReportControls";
import ReportSummary from "../components/reports/ReportSummary";
import IncomeVsExpenseChart from "../components/reports/IncomeVsExpenseChart";
import SpendingByCategoryChart from "../components/reports/SpendingByCategoryChart";
import AIReportAnalysis from "../components/reports/AIReportAnalysis";

export default function ReportsPage() {
  const { user } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState("this-month");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const dateRange = useMemo(() => {
    const now = new Date();
    switch (reportPeriod) {
      case 'this-week':
        return { from: startOfWeek(now), to: endOfWeek(now) };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case 'this-month':
      default:
        return { from: startOfMonth(now), to: endOfMonth(now) };
    }
  }, [reportPeriod]);

  const generateAIAnalysis = useCallback(async (reportData) => {
    setIsGeneratingAI(true);
    try {
      const prompt = `You are FinMate, an expert financial analyst. Based on the following financial report data, provide a concise, insightful analysis in 2-3 short paragraphs.
      IMPORTANT: Use the currency code '${user?.currency || 'USD'}' for all financial figures.

      Report Period: ${reportPeriod}
      Data: ${JSON.stringify(reportData)}

      1.  Start with a clear summary of the user's financial performance (income vs. expenses, net savings).
      2.  Identify the top 1-2 spending categories and comment on them.
      3.  Provide one actionable, encouraging tip for improvement based on the data.

      Maintain a supportive and professional tone.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt }); // Updated invocation
      setAiAnalysis(response);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
      setAiAnalysis("Could not generate AI analysis at this time. Please try again later.");
    } finally {
      setIsGeneratingAI(false);
    }
  }, [reportPeriod, user?.currency]); // Added user?.currency to dependencies

  const reportData = useMemo(() => {
    const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= dateRange.from && tDate <= dateRange.to;
    });

    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netSavings = income - expenses;

    const spendingByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return {
      income,
      expenses,
      netSavings,
      spendingByCategory,
      transactions: filteredTransactions,
      periodLabel: format(dateRange.from, 'MMM d, yyyy') + ' - ' + format(dateRange.to, 'MMM d, yyyy'),
    };
  }, [transactions, dateRange]);


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!dateRange.from || !dateRange.to) {
        console.warn("Date range not fully defined, skipping transaction fetch.");
        return;
      }
      setIsLoading(true);
      try {
        const filters = {
          date: { '$gte': dateRange.from.toISOString().split('T')[0], '$lte': dateRange.to.toISOString().split('T')[0] },
          dashboard_type: "personal"
        };
        const data = await Transaction.filter(filters, '-date', 5000); // Fetch a larger set for historical reports
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]); // Clear transactions on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [dateRange]); // Refetch transactions when dateRange changes

  useEffect(() => {
    if (!isLoading && reportData.transactions.length > 0) {
      generateAIAnalysis(reportData);
    } else if (!isLoading && reportData.transactions.length === 0) {
      setAiAnalysis("No transactions found for this period. Try a different date range to get an analysis.");
    }
  }, [reportData, isLoading, generateAIAnalysis]);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
          <p className="text-gray-400 mt-1">Analyze your spending and saving habits</p>
        </div>
        <ReportControls
          selectedPeriod={reportPeriod}
          onPeriodChange={setReportPeriod}
          reportData={reportData}
        />
      </div>

      {/* Report Summary Cards */}
      <ReportSummary data={reportData} isLoading={isLoading} currency={user?.currency || 'USD'} />

      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <IncomeVsExpenseChart data={reportData.transactions} isLoading={isLoading} currency={user?.currency || 'USD'} />
        </div>
        <div className="lg:col-span-2">
          <SpendingByCategoryChart data={reportData.spendingByCategory} isLoading={isLoading} currency={user?.currency || 'USD'} />
        </div>
      </div>

      {/* AI Analysis */}
      <AIReportAnalysis analysis={aiAnalysis} isLoading={isGeneratingAI} />

    </div>
  );
}
