
import React, { useState, useEffect } from "react";
import { Transaction } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";

import TransactionList from "../components/transactions/TransactionList";
import AddTransactionModal from "../components/transactions/AddTransactionModal";
import TransactionFilters from "../components/transactions/TransactionFilters";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    dateRange: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await Transaction.filter({ dashboard_type: "personal" }, "-date");
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      await Transaction.create(transactionData);
      await loadTransactions();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || transaction.category === filters.category;
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    
    let matchesDate = true;
    if (filters.dateRange !== "all") {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (filters.dateRange) {
        case "today":
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case "month":
          matchesDate = transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400 mt-1">Track and manage your financial transactions</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Transaction List */}
      <TransactionList 
        transactions={filteredTransactions} 
        isLoading={isLoading}
        onTransactionUpdate={loadTransactions}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
