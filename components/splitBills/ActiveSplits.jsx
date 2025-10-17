
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Receipt } from "lucide-react";
import SplitBillCard from "./SplitBillCard";

export default function ActiveSplits({ splitBills, currentUser, isLoading, onSettleUp, onRefresh }) {
  const activeSplits = splitBills.filter(split => split.status === 'active');

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Active Splits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activeSplits.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="text-center text-gray-400">
            <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No active splits</h3>
            <p>Create your first split bill to share expenses with friends!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Users className="w-6 h-6 text-green-400" />
        Active Splits ({activeSplits.length})
      </h2>
      
      <div className="grid gap-6">
        {activeSplits.map(split => (
          <SplitBillCard 
            key={split.id} 
            bill={split} 
            currentUser={currentUser}
            onSettleUp={onSettleUp}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </div>
  );
}
