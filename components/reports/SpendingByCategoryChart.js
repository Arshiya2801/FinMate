
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '@/components/lib/currency';

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

export default function SpendingByCategoryChart({ data, isLoading, currency }) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-purple-400 font-bold">{formatCurrency(payload[0].value, currency)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PieIcon className="w-5 h-5" /> Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {isLoading ? <Skeleton className="h-full w-full bg-gray-700" /> : 
        chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                strokeWidth={2}
                stroke="#374151"
              >
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                iconType="circle" 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{fontSize: "14px", color: "#d1d5db"}}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No expenses for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
