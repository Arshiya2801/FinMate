
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { formatCurrency } from '@/components/lib/currency';

export default function AddBudgetModal({ isOpen, onClose, onSave, budget, currency }) {
  const [formData, setFormData] = useState({
    category: "",
    monthly_limit: "",
    month: format(new Date(), 'yyyy-MM-01')
  });

  // Derive currency symbol safely, defaulting to '$' or 'USD'
  const currencySymbol = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' })
    .formatToParts(0)
    .find(p => p.type === 'currency')?.value || '$';

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        monthly_limit: budget.monthly_limit.toString(),
        month: budget.month || format(new Date(), 'yyyy-MM-01')
      });
    } else {
      setFormData({
        category: "",
        monthly_limit: "",
        month: format(new Date(), 'yyyy-MM-01')
      });
    }
  }, [budget, isOpen]);

  const categories = [
    { value: "food", label: "Food & Dining", icon: "🍕" },
    { value: "transport", label: "Transportation", icon: "🚗" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "bills", label: "Bills & Utilities", icon: "📄" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "other", label: "Other", icon: "📌" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.monthly_limit) {
      // In a real application, you might want to show a toast or validation message here.
      return;
    }
    onSave({
      ...formData,
      monthly_limit: parseFloat(formData.monthly_limit)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Merged className: retaining sm:max-w-md and applying outline's text-white */}
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          {/* Removed specific text styling from DialogTitle as per outline */}
          <DialogTitle>{budget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
        </DialogHeader>
        {/* The form element wraps the content and footer to ensure proper submission */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Main content area wrapped in a div with grid gap as per outline */}
          <div className="grid gap-4 py-4">
            {/* Category Select */}
            <div className="space-y-2">
              <Label className="text-white">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
                disabled={!!budget} // Disable category selection when editing an existing budget
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Limit Input with Currency Symbol */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limit" className="text-right">
                Limit *
              </Label>
              <div className="col-span-3 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-400 sm:text-sm">{currencySymbol}</span>
                </div>
                <Input
                  id="limit"
                  type="number"
                  step="0.01" // Retained from original
                  min="0" // Retained from original
                  value={formData.monthly_limit}
                  onChange={(e) => handleInputChange('monthly_limit', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 pl-7 text-white" // Added text-white for consistency
                  placeholder="500.00" // Updated placeholder for clarity
                  required // Retained from original
                />
              </div>
            </div>
          </div>
          
          {/* DialogFooter kept inside the form */}
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500">
              {budget ? 'Save Changes' : 'Create Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
