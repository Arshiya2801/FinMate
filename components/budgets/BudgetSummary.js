
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/components/lib/currency';

export default function BudgetSummary({ budgets, isLoading, currency }) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.monthly_limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.current_spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const chartData = budgets.slice(0, 5).map(b => ({
    name: b.category.charAt(0).toUpperCase() + b.category.slice(1, 4),
    spent: b.current_spent,
    limit: b.monthly_limit
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-red-400">Spent: {formatCurrency(payload[0].value, currency)}</p>
          <p className="text-cyan-400">Limit: {formatCurrency(payload[1].value, currency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Monthly Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <Target className="w-4 h-4" /> Total Budget
            </div>
            {isLoading ? <Skeleton className="h-6 w-24 bg-gray-700" /> : <p className="text-2xl font-bold text-white">{formatCurrency(totalBudget, currency)}</p>}
          </div>
          <div className="bg-gray-700/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <TrendingDown className="w-4 h-4" /> Total Spent
            </div>
            {isLoading ? <Skeleton className="h-6 w-24 bg-gray-700" /> : <p className="text-2xl font-bold text-red-400">{formatCurrency(totalSpent, currency)}</p>}
          </div>
          <div className="bg-gray-700/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <DollarSign className="w-4 h-4" /> Remaining
            </div>
            {isLoading ? <Skeleton className="h-6 w-24 bg-gray-700" /> : <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(remainingBudget, currency)}</p>}
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-48">
          {isLoading ? <Skeleton className="h-full w-full bg-gray-700" /> :
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
              <Bar dataKey="spent" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="limit" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          }
        </div>
      </CardContent>
    </Card>
  );
}
