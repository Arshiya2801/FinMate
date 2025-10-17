
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, eachDayOfInterval, startOfDay } from 'date-fns';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/components/lib/currency';

export default function IncomeVsExpenseChart({ data, isLoading, currency }) {
  const processData = () => {
    if (!data || data.length === 0) return [];

    // Ensure dates are sorted for correct interval calculation
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dates = sortedData.map(t => startOfDay(new Date(t.date)));
    
    // Handle cases where there might be only one date or no dates
    if (dates.length === 0) return [];

    const interval = { start: dates[0], end: dates[dates.length - 1] }; // interval start should be the earliest date, end the latest
    let dateRange = [];
    try {
        dateRange = eachDayOfInterval(interval);
    } catch (e) {
        // Handle cases where start > end, which can happen if interval is malformed or empty
        console.error("Error generating date range:", e);
        return [];
    }


    const dailyData = dateRange.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayTransactions = data.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === dayStr);
      
      return {
        date: format(day, 'MMM d'),
        income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        expenses: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      };
    });
    return dailyData;
  };

  const chartData = processData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-emerald-400">Income: {formatCurrency(payload.find(p => p.dataKey === 'income')?.value || 0, currency)}</p>
          <p className="text-red-400">Expenses: {formatCurrency(payload.find(p => p.dataKey === 'expenses')?.value || 0, currency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Income vs. Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? <Skeleton className="h-full w-full bg-gray-700" /> : 
        chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, notation: 'compact' }).format(value)} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
              <Legend wrapperStyle={{fontSize: "14px"}} />
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
