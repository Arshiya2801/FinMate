
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';

export default function AddBusinessTransactionModal({ isOpen, onClose, onSave, transaction }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(transaction ? {
      ...transaction,
      date: format(new Date(transaction.date), 'yyyy-MM-dd')
    } : {
      description: "",
      amount: "",
      category: "other",
      type: "expense",
      date: format(new Date(), 'yyyy-MM-dd'),
      related_party: "",
      invoice_number: "",
      is_tax_deductible: false,
      dashboard_type: "business"
    });
  }, [transaction, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, amount: parseFloat(formData.amount), dashboard_type: "business" });
  };

  const categories = [
    'revenue', 'cogs', 'payroll', 'marketing', 'rent', 'utilities', 'software', 'travel', 'office_supplies', 'other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Edit' : 'Add'} Business Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-2">
            <Label>Description *</Label>
            <Input value={formData.description} onChange={e => handleChange('description', e.target.value)} required className="bg-gray-700/50" />
          </div>
          <div className="space-y-2">
            <Label>Amount *</Label>
            <Input type="number" value={formData.amount} onChange={e => handleChange('amount', e.target.value)} required className="bg-gray-700/50" />
          </div>
          <div className="space-y-2">
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} required className="bg-gray-700/50" />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={v => handleChange('type', v)}>
              <SelectTrigger className="bg-gray-700/50"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
              <SelectTrigger className="bg-gray-700/50"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                {categories.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Related Party</Label>
            <Input value={formData.related_party} onChange={e => handleChange('related_party', e.target.value)} placeholder="Customer, vendor..." className="bg-gray-700/50" />
          </div>
          <div className="space-y-2">
            <Label>Invoice #</Label>
            <Input value={formData.invoice_number} onChange={e => handleChange('invoice_number', e.target.value)} className="bg-gray-700/50" />
          </div>
          <div className="col-span-2 flex items-center space-x-2 pt-2">
            <Switch id="tax-deductible" checked={formData.is_tax_deductible} onCheckedChange={c => handleChange('is_tax_deductible', c)} />
            <Label htmlFor="tax-deductible">This expense is tax-deductible</Label>
          </div>
          <div className="col-span-2 flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">{transaction ? 'Save Changes' : 'Add Transaction'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
