
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from '@/components/lib/currency';

const CATEGORY_ICONS = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  healthcare: '🏥',
  education: '📚',
  travel: '✈️',
  other: '📌'
};

// CATEGORY_COLORS is no longer used directly in the JSX structure based on the outline changes,
// but keeping it here as it was part of the original code, in case it's used elsewhere
// or a different icon/color scheme is intended to be added later.
const CATEGORY_COLORS = {
  food: 'bg-red-500/20',
  transport: 'bg-blue-500/20',
  entertainment: 'bg-purple-500/20',
  shopping: 'bg-orange-500/20',
  bills: 'bg-indigo-500/20',
  healthcare: 'bg-pink-500/20',
  education: 'bg-yellow-500/20',
  travel: 'bg-green-500/20',
  other: 'bg-gray-500/20'
};

export default function BudgetItem({ budget, onEdit, onDelete, currency }) {
  const { category, monthly_limit, current_spent } = budget;
  const progress = (current_spent / monthly_limit) * 100;
  const isOverBudget = progress > 100;
  const remaining = monthly_limit - current_spent;

  let progressColor = "bg-emerald-500";
  if (progress > 75 && progress <= 100) progressColor = "bg-yellow-500";
  if (progress > 100) progressColor = "bg-red-500";

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 backdrop-blur-sm text-white flex flex-col justify-between`}>
      {/* New structure combining header-like elements and spent/limit display */}
      <div className="p-6 flex flex-row items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-white capitalize">{category.replace('_', ' ')}</h3>
            {budget.ai_suggested && <Badge className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">AI</Badge>}
          </div>
          {/* Optionally, you can add back a subtitle here if needed, e.g., <p className="text-sm text-gray-400">Monthly Budget</p> */}
        </div>
        <div className="flex-1 text-right mr-4">
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(current_spent, currency)}</p>
          <p className="text-sm text-gray-400">of {formatCurrency(monthly_limit, currency)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem onClick={() => onEdit(budget)} className="hover:bg-gray-700">
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(budget.id)} className="text-red-400 hover:!text-red-400 hover:!bg-red-500/10">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress Bar (extracted from original CardContent) */}
      <div className="px-6 pb-6">
        <Progress value={Math.min(progress, 100)} className="h-2" indicatorClassName={progressColor} />
      </div>

      <CardFooter>
        {isOverBudget ? (
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-600/90 text-white">Overspent by {formatCurrency(Math.abs(remaining), currency)}</Badge>
        ) : (
          <p className="text-sm text-gray-400">{formatCurrency(remaining, currency)} remaining</p>
        )}
      </CardFooter>
    </Card>
  );
}
