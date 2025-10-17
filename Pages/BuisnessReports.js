
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '@/entities/all';

import BusinessReportControls from '../components/business/reports/BusinessReportControls';
import ProfitAndLoss from '../components/business/reports/ProfitAndLoss';
import CashFlowReport from '../components/business/reports/CashFlowReport';

export default function BusinessReportsPage() {
  const [reportType, setReportType] = useState('p&l');
  const [dateRange, setDateRange] = useState({ 
    from: new Date(new Date().getFullYear(), 0, 1), 
    to: new Date() 
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!dateRange.from || !dateRange.to) return;
      setIsLoading(true);
      try {
        const filters = {
          date: { '$gte': dateRange.from.toISOString().split('T')[0], '$lte': dateRange.to.toISOString().split('T')[0] },
          dashboard_type: "business"
        };
        const data = await Transaction.filter(filters, '-date', 5000);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions for report:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [dateRange]);

  const renderReport = () => {
    if (!dateRange.from || !dateRange.to) {
        return <div className='text-center p-8 text-gray-400'>Please select a valid date range.</div>
    }
      
    switch(reportType) {
      case 'p&l':
        return <ProfitAndLoss data={transactions} isLoading={isLoading} dateRange={dateRange} />;
      case 'cashflow':
        return <CashFlowReport data={transactions} isLoading={isLoading} dateRange={dateRange} />;
      default:
        return <ProfitAndLoss data={transactions} isLoading={isLoading} dateRange={dateRange} />;
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Business Reports</h1>
        <p className="text-gray-400 mt-1">Deep dive into your company's financial performance.</p>
      </div>

      <BusinessReportControls
        reportType={reportType}
        setReportType={setReportType}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <div className="mt-6">
        {renderReport()}
      </div>
    </div>
  );
}
