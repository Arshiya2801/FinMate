import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Edit, Receipt } from "lucide-react";

export default function BusinessTransactionList({ transactions, isLoading, onEdit }) {
  const getCategoryColor = (category) => {
    const colors = {
      revenue: 'bg-green-500/20 text-green-400 border-green-500/30',
      payroll: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      software: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-6">
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full bg-gray-700" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Related Party</TableHead>
              <TableHead className="text-white text-right">Amount</TableHead>
              <TableHead className="text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? transactions.map((t) => (
              <TableRow key={t.id} className="border-gray-700/50">
                <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium text-white">{t.description}</TableCell>
                <TableCell><Badge className={`text-xs ${getCategoryColor(t.category)}`}>{t.category.replace('_', ' ')}</Badge></TableCell>
                <TableCell>{t.related_party || 'N/A'}</TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    ${t.amount.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(t)} className="text-gray-400 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Receipt className="mx-auto w-12 h-12 text-gray-500" />
                  <p className="mt-2 text-gray-400">No transactions found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}