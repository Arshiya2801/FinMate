
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

export default function BurnRateChart({ metrics, isLoading }) {
  const { burnRate, monthlyExpenses } = metrics;
  
  // Calculate runway (how many days the business can operate at current burn rate)
  // For demo purposes, assume cash reserves of $50,000
  const cashReserves = 50000;
  const runway = burnRate > 0 ? Math.floor(cashReserves / burnRate) : 0;

  const getBurnRateStatus = (rate, expenses) => {
    const burnRatio = (rate * 30) / expenses;
    if (burnRatio > 1.2) return { status: 'high', color: 'red' };
    if (burnRatio > 0.8) return { status: 'moderate', color: 'yellow' };
    return { status: 'healthy', color: 'green' };
  };

  const burnStatus = getBurnRateStatus(burnRate, monthlyExpenses);

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Burn Rate Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full bg-gray-700" />
            <Skeleton className="h-16 w-full bg-gray-700" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Burn Rate Display */}
            <div className="text-center p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
              <div className="space-y-2">
                <p className="text-orange-400 text-3xl font-bold">
                  ${burnRate.toFixed(2)}
                </p>
                <p className="text-gray-300 text-sm">Daily Burn Rate</p>
                <Badge className={`
                  ${burnStatus.color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    burnStatus.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'}
                `}>
                  {burnStatus.status === 'healthy' ? 'Healthy' : 
                   burnStatus.status === 'moderate' ? 'Moderate' : 'High Risk'}
                </Badge>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Runway</span>
                </div>
                <p className="text-xl font-bold text-blue-400">
                  {runway} days
                </p>
              </div>
              
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Monthly</span>
                </div>
                <p className="text-xl font-bold text-purple-400">
                  ${(burnRate * 30).toFixed(0)}
                </p>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-3 rounded-lg border ${
              burnStatus.color === 'green' ? 'bg-green-500/10 border-green-500/20' :
              burnStatus.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
              'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-2">
                {burnStatus.status === 'high' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
                <div className="flex-1">
                  <p className={`text-sm ${
                    burnStatus.color === 'green' ? 'text-green-200' :
                    burnStatus.color === 'yellow' ? 'text-yellow-200' :
                    'text-red-200'
                  }`}>
                    {burnStatus.status === 'healthy' && 
                      "Your burn rate is healthy. You have good cash flow management."}
                    {burnStatus.status === 'moderate' && 
                      "Monitor your burn rate closely. Consider optimizing expenses."}
                    {burnStatus.status === 'high' && 
                      "High burn rate detected. Review expenses and cash flow immediately."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
