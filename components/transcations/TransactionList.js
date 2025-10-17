
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt,
  Sparkles,
  Calendar
} from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { formatCurrency } from "@/components/lib/currency";

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
  investment: '📈',
  other: '📌'
};

export default function TransactionList({ transactions, isLoading }) {
  const { user } = useAppContext();
  const currency = user?.currency || 'USD';

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="w-12 h-12 rounded-xl bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40 bg-gray-700" />
                  <Skeleton className="h-3 w-24 bg-gray-700" />
                </div>
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-gray-400">
            <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p>Start by adding your first transaction or adjust your search filters</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-700/30 transition-all duration-200 group"
            >
              {/* Category Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                transaction.type === 'income' 
                  ? 'bg-emerald-500/20 group-hover:bg-emerald-500/30' 
                  : 'bg-blue-500/20 group-hover:bg-blue-500/30'
              } transition-colors`}>
                {CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.other}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                    {transaction.description}
                  </h3>
                  {transaction.ai_categorized && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  {transaction.recurring && (
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 text-xs">
                      Recurring
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                  <span>•</span>
                  <span className="capitalize">{transaction.category.replace('_', ' ')}</span>
                  {transaction.tags && transaction.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-1">
                        {transaction.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-700/50 rounded-md">
                            {tag}
                          </span>
                        ))}
                        {transaction.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{transaction.tags.length - 2} more</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <div className={`flex items-center gap-1 font-bold text-lg ${
                  transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount), currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
