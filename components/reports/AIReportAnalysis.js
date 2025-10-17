import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Lightbulb } from "lucide-react";

export default function AIReportAnalysis({ analysis, isLoading }) {
  return (
    <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          AI Report Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-300" />
            <Skeleton className="h-4 w-full bg-gray-300" />
            <Skeleton className="h-4 w-3/4 bg-gray-300" />
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <div className="text-gray-700 leading-relaxed space-y-3">
                {analysis.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}