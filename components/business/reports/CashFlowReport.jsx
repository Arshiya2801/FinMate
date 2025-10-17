import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, TableFooter } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const CFItem = ({ label, value, isBold, isTotal, indent = false }) => (
  <TableRow className={isTotal ? 'bg-gray-700/30' : ''}>
    <TableCell className={`${indent ? 'pl-10' : 'pl-4'} ${isBold ? 'font-bold text-white' : ''}`}>
      {label}
    </TableCell>
    <TableCell className={`text-right ${isBold ? 'font-bold text-white' : ''}`}>
      ${value.toFixed(2)}
    </TableCell>
  </TableRow>
);

export default function CashFlowReport({ data, isLoading, dateRange }) {
  const cfData = useMemo(() => {
    // Note: This is a simplified cash flow from operations using the direct method
    const cashInflows = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const cashOutflows = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netCashFlow = cashInflows - cashOutflows;

    return { cashInflows, cashOutflows, netCashFlow };
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full bg-gray-700" />;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle>Statement of Cash Flows (Simplified)</CardTitle>
        <p className="text-sm text-gray-400">
          {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow><TableCell colSpan={2} className="font-bold text-white pt-4">Cash Flow from Operating Activities</TableCell></TableRow>
            <CFItem label="Cash from Customers (Revenue)" value={cfData.cashInflows} indent />
            <CFItem label="Cash Paid for Expenses" value={-cfData.cashOutflows} indent />
            <CFItem label="Net Cash from Operating Activities" value={cfData.netCashFlow} isBold isTotal />

            {/* Placeholders for Investing and Financing activities */}
            <TableRow><TableCell colSpan={2} className="font-bold text-white pt-6">Cash Flow from Investing Activities</TableCell></TableRow>
            <CFItem label="(e.g., Purchase of assets)" value={0} indent />
            <CFItem label="Net Cash from Investing Activities" value={0} isBold isTotal />

            <TableRow><TableCell colSpan={2} className="font-bold text-white pt-6">Cash Flow from Financing Activities</TableCell></TableRow>
            <CFItem label="(e.g., Loans, owner contributions)" value={0} indent />
            <CFItem label="Net Cash from Financing Activities" value={0} isBold isTotal />

            <TableRow><TableCell colSpan={2}>&nbsp;</TableCell></TableRow>

            <CFItem label="Net Increase in Cash" value={cfData.netCashFlow} isBold isTotal />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}