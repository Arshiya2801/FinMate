
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank } from "lucide-react";
import BudgetItem from "./BudgetItem";

export default function BudgetList({ budgets, isLoading, onEdit, onDelete, currency }) {
  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Your Budgets</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-gray-400">
            <PiggyBank className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No budgets created yet</h3>
            <p>Click "Create Budget" to set your first spending goal.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Your Budgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {budgets.map(budget => (
          <BudgetItem key={budget.id} budget={budget} onEdit={onEdit} onDelete={onDelete} currency={currency} />
        ))}
      </div>
    </div>
  );
}
