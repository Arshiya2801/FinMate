
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { format } from 'date-fns';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAppContext } from "@/components/AppContext"; // Changed from "@/contexts/AppContext"
import { formatCurrency } from "@/components/lib/currency"; // Changed from "@/utils/currency"

const CATEGORY_ICONS = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  healthcare: '🏥',
  education: '📚',
  travel: '✈️',
  income: '💰',
  other: '📌'
};

export default function RecentTransactions({ transactions, isLoading }) {
  const { user } = useAppContext();
  const currency = user?.currency || 'USD';

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cyan-400" />
          Recent Transactions
        </CardTitle>
        <Link to={createPageUrl("Transactions")}>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10 cursor-pointer">
            View All
          </Badge>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                  <Skeleton className="h-3 w-20 bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-16 bg-gray-700" />
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-blue-500/20'
                }`}>
                  {CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.other}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">
                      {transaction.description}
                    </p>
                    {transaction.ai_categorized && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                    <span>•</span>
                    <span className="capitalize">{transaction.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-1 font-bold ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {formatCurrency(transaction.amount, currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Start by adding your first transaction</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
