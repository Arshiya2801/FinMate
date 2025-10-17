
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Lightbulb, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIBudgetSuggestions({ budgets, transactions, isLoading, onSuggestionClick, currency }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateSuggestions = async () => {
      if (isLoading || transactions.length === 0) return;
      setIsGenerating(true);
      try {
        const existingBudgetCategories = budgets.map(b => b.category);
        const spendingByCategory = transactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

        const unbudgetedSpending = Object.entries(spendingByCategory)
          .filter(([category]) => !existingBudgetCategories.includes(category))
          .sort(([, a], [, b]) => b - a);

        const prompt = `Based on the following spending data, suggest up to 2 budget categories to create. For each suggestion, provide a short, encouraging reason. Use the currency code '${currency}' in your 'reason' if you mention any amounts.

        Unbudgeted spending: ${JSON.stringify(unbudgetedSpending)}
        
        Format your response as a JSON array of objects, where each object has a "category" and a "reason" key. For example: [{"category": "shopping", "reason": "You've spent a significant amount on shopping. Creating a budget can help you manage it better!"}]`;

        const response = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: { type: 'object', properties: { suggestions: { type: 'array', items: { type: 'object', properties: { category: { type: 'string' }, reason: { type: 'string' } } } } } } });
        
        if (response && response.suggestions) {
          setSuggestions(response.suggestions.slice(0, 2));
        }

      } catch (error) {
        console.error("Error generating AI suggestions:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateSuggestions();
  }, [isLoading, transactions, budgets, currency]);

  return (
    <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          AI Budget Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-300" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white/50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 capitalize">
                    Set a budget for {suggestion.category.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full border-green-500/30 text-green-600 bg-green-500/10 hover:bg-green-500/20" onClick={() => onSuggestionClick(suggestion.category)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Budget
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600 py-4">
            <p>You're all set! No new budget suggestions right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
