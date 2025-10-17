import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function BusinessTransactionFilters({ filters, onFiltersChange }) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cogs', label: 'Cost of Goods Sold' },
    { value: 'payroll', label: 'Payroll' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'software', label: 'Software' },
    { value: 'travel', label: 'Travel' },
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'other', label: 'Other' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
        <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700/50 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          {types.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
        <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700/50 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700 text-white">
          {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}