
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { formatCurrency } from '@/components/lib/currency';

export default function SplitBillStats({ splitBills, currentUser, isLoading }) {
  const stats = useMemo(() => {
    if (!currentUser) return { youOwe: 0, youAreOwed: 0, totalSplits: 0 };

    let youOwe = 0;
    let youAreOwed = 0;
    const myEmail = currentUser.email;

    splitBills.forEach(bill => {
      if (bill.status !== 'active') return;

      const iAmOwner = bill.created_by === myEmail;
      const myParticipantEntry = bill.participants.find(p => p.email === myEmail);
      
      if (iAmOwner) {
        // If I created this bill, others might owe me.
        // Sum up what other participants (who aren't settled) owe.
        bill.participants.forEach(p => {
          if (p.email !== myEmail && !p.settled) {
            youAreOwed += p.amount_owed - (p.amount_paid || 0);
          }
        });
      } else if (myParticipantEntry && !myParticipantEntry.settled) {
        // If I am a participant (but not the owner) and not settled, I might owe money.
        // Sum up my outstanding amount for this bill.
        youOwe += myParticipantEntry.amount_owed - (myParticipantEntry.amount_paid || 0);
      }
    });

    return {
      youOwe,
      youAreOwed,
      totalSplits: splitBills.filter(b => b.status === 'active').length,
    };
  }, [splitBills, currentUser]);
  
  const currency = currentUser?.currency || 'USD';

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-400">You Owe</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24 bg-gray-700" /> : <div className="text-2xl font-bold text-white">{formatCurrency(stats.youOwe, currency)}</div>}
          <p className="text-xs text-gray-400">Total amount you need to pay</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-400">You are Owed</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-8 w-24 bg-gray-700" /> : <div className="text-2xl font-bold text-white">{formatCurrency(stats.youAreOwed, currency)}</div>}
          <p className="text-xs text-gray-400">Total amount others need to pay you</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-400">Active Splits</CardTitle>
          <Users className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-gray-700" />
          ) : (
            <div className="text-2xl font-bold text-white">
              {stats.totalSplits}
            </div>
          )}
          <p className="text-xs text-gray-400">
            Ongoing split bills
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
