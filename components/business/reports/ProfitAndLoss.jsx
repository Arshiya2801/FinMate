import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableFooter } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const PNLItem = ({ label, value, isBold, isTotal, indent = false }) => (
  <TableRow className={isTotal ? 'bg-gray-700/30' : ''}>
    <TableCell className={`${indent ? 'pl-10' : 'pl-4'} ${isBold ? 'font-bold text-white' : ''}`}>
      {label}
    </TableCell>
    <TableCell className={`text-right ${isBold ? 'font-bold text-white' : ''}`}>
      ${value.toFixed(2)}
    </TableCell>
  </TableRow>
);

export default function ProfitAndLoss({ data, isLoading, dateRange }) {
  const pnlData = useMemo(() => {
    const revenue = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const cogs = data.filter(t => t.category === 'cogs').reduce((sum, t) => sum + t.amount, 0);
    const grossProfit = revenue - cogs;
    
    const operatingExpenses = data
      .filter(t => t.type === 'expense' && t.category !== 'cogs')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    const totalOperatingExpenses = Object.values(operatingExpenses).reduce((sum, v) => sum + v, 0);
    const netOperatingIncome = grossProfit - totalOperatingExpenses;
    // Assuming no non-operating income/expenses for simplicity
    const netIncome = netOperatingIncome;

    return { revenue, cogs, grossProfit, operatingExpenses, totalOperatingExpenses, netIncome };
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full bg-gray-700" />;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle>Profit & Loss Statement</CardTitle>
        <p className="text-sm text-gray-400">
          {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <PNLItem label="Revenue" value={pnlData.revenue} isBold />
            <PNLItem label="Cost of Goods Sold (COGS)" value={pnlData.cogs} indent />
            <PNLItem label="Gross Profit" value={pnlData.grossProfit} isBold isTotal />
            
            <TableRow><TableCell colSpan={2} className="font-bold text-white pt-6">Operating Expenses</TableCell></TableRow>
            {Object.entries(pnlData.operatingExpenses).map(([cat, val]) => (
              <PNLItem key={cat} label={cat.replace('_', ' ')} value={val} indent />
            ))}
            <PNLItem label="Total Operating Expenses" value={pnlData.totalOperatingExpenses} isBold indent />

            <TableRow><TableCell colSpan={2}>&nbsp;</TableCell></TableRow>
            
            <PNLItem label="Net Income" value={pnlData.netIncome} isBold isTotal />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}