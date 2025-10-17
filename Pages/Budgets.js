
import React, { useState, useEffect, useMemo } from "react";
import { Budget, Transaction } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Filter } from "lucide-react";
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useAppContext } from "@/components/AppContext";

import BudgetList from "../components/budgets/BudgetList";
import AddBudgetModal from "../components/budgets/AddBudgetModal";
import AIBudgetSuggestions from "../components/budgets/AIBudgetSuggestions";
import BudgetSummary from "../components/budgets/BudgetSummary";

export default function BudgetsPage() {
  const { user } = useAppContext();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      setIsLoading(true);
      // Fetch all personal expense transactions instead of just the current month's
      const [budgetData, transactionData] = await Promise.all([
        Budget.list("-created_date"),
        Transaction.filter({
          type: 'expense',
          dashboard_type: 'personal'
        }, "-date", 5000) // Fetch a larger set of recent transactions
      ]);
      setBudgets(budgetData);
      setTransactions(transactionData);
    } catch (error) {
      console.error("Error loading budget data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const budgetsWithSpending = useMemo(() => {
    return budgets.map(budget => {
      // For each budget, filter transactions that match its category AND its month
      // Note: budget.month is expected to be an ISO string like "YYYY-MM-DD" representing the start of the month
      // If budget.month is just "YYYY-MM", adjust new Date(budget.month) accordingly.
      const budgetMonthStart = startOfMonth(new Date(budget.month));
      const budgetMonthEnd = endOfMonth(new Date(budget.month));

      const spent = transactions
        .filter(t => {
          const transactionDate = new Date(t.date); // Assuming t.date is also a valid date string
          return t.category === budget.category &&
                 transactionDate >= budgetMonthStart &&
                 transactionDate <= budgetMonthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return { ...budget, current_spent: spent };
    });
  }, [budgets, transactions]);

  const handleAddOrUpdateBudget = async (budgetData) => {
    try {
      if (editingBudget) {
        await Budget.update(editingBudget.id, budgetData);
      } else {
        await Budget.create(budgetData);
      }
      await loadBudgetData();
      setShowAddModal(false);
      setEditingBudget(null);
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowAddModal(true);
  };

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingBudget(null);
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Budgets</h1>
          <p className="text-gray-400 mt-1">Manage your monthly spending goals</p>
        </div>
        <Button 
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Budget
        </Button>
      </div>
      
      {/* Summary and AI Suggestions */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <BudgetSummary budgets={budgetsWithSpending} isLoading={isLoading} currency={user?.currency || 'USD'} />
        </div>
        <AIBudgetSuggestions 
          budgets={budgets} 
          transactions={transactions} 
          isLoading={isLoading}
          onSuggestionClick={handleOpenAddModal}
          currency={user?.currency || 'USD'}
        />
      </div>

      {/* Budget List */}
      <BudgetList 
        budgets={budgetsWithSpending} 
        isLoading={isLoading}
        onEdit={handleEditBudget}
        onDelete={async (id) => {
          await Budget.delete(id);
          loadBudgetData();
        }}
        currency={user?.currency || 'USD'}
      />

      {/* Add/Edit Budget Modal */}
      <AddBudgetModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleAddOrUpdateBudget}
        budget={editingBudget}
        currency={user?.currency || 'USD'}
      />
    </div>
  );
}
