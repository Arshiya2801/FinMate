import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart3 } from "lucide-react";

const CATEGORY_COLORS = {
  food: '#10B981',
  transport: '#3B82F6', 
  entertainment: '#8B5CF6',
  shopping: '#F59E0B',
  bills: '#EF4444',
  healthcare: '#06B6D4',
  education: '#84CC16',
  travel: '#F97316',
  other: '#6B7280'
};

export default function ExpenseChart({ transactions, isLoading }) {
  const getExpenseByCategory = () => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryData = {};

    expenses.forEach(transaction => {
      const category = transaction.category || 'other';
      categoryData[category] = (categoryData[category] || 0) + transaction.amount;
    });

    return Object.entries(categoryData)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value,
        color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other
      }))
      .sort((a, b) => b.value - a.value);
  };

  const data = getExpenseByCategory();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-emerald-400 font-bold">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Expense Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full bg-gray-700" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-4 w-16 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-18 bg-gray-700" />
            </div>
          </div>
        ) : data.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#374151"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {data.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-300">{entry.name}</span>
                  <span className="text-gray-400">${entry.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No expense data to display</p>
              <p className="text-sm">Add some transactions to see your spending breakdown</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}