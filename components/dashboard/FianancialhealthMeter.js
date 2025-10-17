import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, TrendingUp, Target } from "lucide-react";

export default function FinancialHealthMeter({ score, isLoading }) {
  const getHealthColor = (score) => {
    if (score >= 70) return 'emerald';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getHealthStatus = (score) => {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Attention';
  };

  const color = getHealthColor(score);
  const status = getHealthStatus(score);

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto bg-gray-700" />
            <Skeleton className="h-4 w-24 mx-auto bg-gray-700" />
          </div>
        ) : (
          <>
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgb(55 65 81)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={
                    color === 'emerald' ? 'rgb(16 185 129)' :
                    color === 'yellow' ? 'rgb(245 158 11)' :
                    'rgb(239 68 68)'
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * score) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    color === 'emerald' ? 'text-emerald-400' :
                    color === 'yellow' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {Math.round(score)}
                  </div>
                  <div className="text-xs text-gray-400">SCORE</div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {color === 'emerald' ? <TrendingUp className="w-4 h-4" /> :
                 color === 'yellow' ? <Target className="w-4 h-4" /> :
                 <Target className="w-4 h-4" />}
                {status}
              </div>
              <p className="text-sm text-gray-400">
                {score >= 70 
                  ? "Your finances are in great shape! Keep up the excellent work."
                  : score >= 40
                  ? "You're doing well, but there's room for improvement."
                  : "Focus on reducing expenses and increasing savings."
                }
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}