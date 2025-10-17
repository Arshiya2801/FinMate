import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingDown, 
  AlertTriangle, 
  Flame,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";

export default function KPIDashboard({ metrics, isLoading }) {
  const { monthlyRevenue, monthlyExpenses, outstandingPayments, burnRate } = metrics;

  const profitMargin = monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Monthly Revenue */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Revenue (MTD)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-gray-700" />
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-400">
                ${monthlyRevenue.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12.5% vs last month</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outstanding Payments */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-yellow-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Outstanding Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-gray-700" />
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-yellow-400">
                ${outstandingPayments.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-sm text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span>3 overdue invoices</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Burn Rate */}
      <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-400 flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Daily Burn Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-gray-700" />
          ) : (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-red-400">
                ${burnRate.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-sm text-red-400">
                <ArrowDownRight className="w-4 h-4" />
                <span>-5.2% vs last month</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profit Margin */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Profit Margin
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-gray-700" />
          ) : (
            <div className="space-y-2">
              <p className={`text-2xl font-bold ${
                profitMargin >= 20 ? 'text-green-400' : 
                profitMargin >= 10 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {profitMargin.toFixed(1)}%
              </p>
              <Badge className={`text-xs ${
                profitMargin >= 20 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                profitMargin >= 10 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {profitMargin >= 20 ? 'Excellent' : profitMargin >= 10 ? 'Good' : 'Low'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}