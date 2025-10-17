
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { formatCurrency } from '@/components/lib/currency';

export default function ReportSummary({ data, isLoading, currency }) {
  const { income, expenses, netSavings, spendingByCategory, periodLabel } = data;

  const topCategory = Object.entries(spendingByCategory)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-300 mb-2">Summary for: <span className="text-emerald-400">{periodLabel}</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28 bg-gray-700" /> : <p className="text-2xl font-bold text-emerald-400">{formatCurrency(income, currency)}</p>}
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" /> Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28 bg-gray-700" /> : <p className="text-2xl font-bold text-red-400">{formatCurrency(expenses, currency)}</p>}
          </CardContent>
        </Card>

        {/* Net Savings */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" /> Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28 bg-gray-700" /> : 
            <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
              {formatCurrency(netSavings, currency)}
            </p>}
          </CardContent>
        </Card>

        {/* Top Spending */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" /> Top Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-28 bg-gray-700" /> : 
            topCategory ? (
              <div>
                <p className="text-2xl font-bold text-purple-400 capitalize">{topCategory[0].replace('_', ' ')}</p>
                <p className="text-sm text-gray-300">{formatCurrency(topCategory[1], currency)}</p>
              </div>
            ) : <p className="text-gray-400">No expenses</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
