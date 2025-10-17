import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Lightbulb, Building2 } from "lucide-react";

export default function BusinessInsights({ insight, isLoading }) {
  return (
    <Card className="bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-200 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Business Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300" />
            <Skeleton className="h-4 w-3/4 bg-gray-300" />
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">
                {insight || "Focus on optimizing your cash flow and identifying growth opportunities in your top-performing revenue streams."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}