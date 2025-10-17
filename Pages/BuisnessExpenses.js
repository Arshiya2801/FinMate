
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

import BusinessTransactionList from '../components/business/expenses/BusinessTransactionList';
import BusinessTransactionFilters from '../components/business/expenses/BusinessTransactionFilters';
import AddBusinessTransactionModal from '../components/business/expenses/AddBusinessTransactionModal';

export default function BusinessExpensesPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: 'this-month',
  });

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await Transaction.filter({ dashboard_type: "business" }, '-date', 500);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSaveTransaction = async (data) => {
    try {
      if (editingTransaction) {
        await Transaction.update(editingTransaction.id, data);
      } else {
        await Transaction.create(data);
      }
      await loadTransactions();
      setShowAddModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowAddModal(true);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const searchMatch = searchTerm === "" || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.related_party?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const typeMatch = filters.type === 'all' || t.type === filters.type;
      const categoryMatch = filters.category === 'all' || t.category === filters.category;

      return searchMatch && typeMatch && categoryMatch;
    });
  }, [transactions, searchTerm, filters]);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Business Transactions</h1>
          <p className="text-gray-400 mt-1">Manage all your company's income and expenses.</p>
        </div>
        <Button 
          onClick={() => { setEditingTransaction(null); setShowAddModal(true); }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by description, party, invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
        <BusinessTransactionFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <BusinessTransactionList 
        transactions={filteredTransactions} 
        isLoading={isLoading}
        onEdit={handleEditTransaction}
      />

      <AddBusinessTransactionModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingTransaction(null); }}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
}
