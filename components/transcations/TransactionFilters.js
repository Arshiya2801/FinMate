import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export default function TransactionFilters({ filters, onFiltersChange }) {
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food & Dining" },
    { value: "transport", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "bills", label: "Bills & Utilities" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "travel", label: "Travel" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" }
  ];

  const types = [
    { value: "all", label: "All Types" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expenses" }
  ];

  const dateRanges = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({ category: "all", type: "all", dateRange: "all" });
  };

  const hasActiveFilters = filters.category !== "all" || filters.type !== "all" || filters.dateRange !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filter Icon */}
      <div className="flex items-center gap-2 text-gray-400">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      {/* Category Filter */}
      <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
        <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700/50 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
        <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700/50 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-700">
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Range Filter */}
      <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
        <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700/50 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {dateRanges.map((range) => (
            <SelectItem key={range.value} value={range.value} className="text-white hover:bg-gray-700">
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Badge 
          variant="outline" 
          className="text-red-400 border-red-400/30 hover:bg-red-400/10 cursor-pointer"
          onClick={clearAllFilters}
        >
          <X className="w-3 h-3 mr-1" />
          Clear All
        </Badge>
      )}
    </div>
  );
}