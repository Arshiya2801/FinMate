
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { 
  Plus, 
  Camera, 
  Upload, 
  Loader2, 
  CheckCircle,
  Sparkles,
  X
} from "lucide-react";
import { format } from 'date-fns';

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [activeTab, setActiveTab] = useState("manual");
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense",
    date: format(new Date(), 'yyyy-MM-dd'),
    recurring: false,
    tags: [],
    dashboard_type: "personal" // Added dashboard_type here
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [newTag, setNewTag] = useState("");

  const categories = [
    { value: "food", label: "Food & Dining", icon: "🍕" },
    { value: "transport", label: "Transportation", icon: "🚗" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "bills", label: "Bills & Utilities", icon: "📄" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "investment", label: "Investment", icon: "📈" },
    { value: "other", label: "Other", icon: "📌" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file) => {
    try {
      setIsUploading(true);
      
      // Upload file
      const { file_url } = await UploadFile({ file });
      setUploadedFile({ name: file.name, url: file_url });

      // Extract transaction data using AI
      const result = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            amount: { type: "number" },
            category: { 
              type: "string",
              enum: categories.map(c => c.value)
            },
            date: { type: "string", format: "date" }
          }
        }
      });

      if (result.status === "success" && result.output) {
        setExtractedData(result.output);
        setFormData(prev => ({
          ...prev,
          ...result.output,
          amount: result.output.amount?.toString() || "",
          receipt_url: file_url,
          ai_categorized: true
        }));
      }
    } catch (error) {
      console.error("Error processing receipt:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      ai_categorized: extractedData ? true : false,
      dashboard_type: "personal" // Ensure dashboard_type is included
    };

    await onAdd(transactionData);
    
    // Reset form
    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: format(new Date(), 'yyyy-MM-dd'),
      recurring: false,
      tags: [],
      dashboard_type: "personal" // Reset dashboard_type
    });
    setUploadedFile(null);
    setExtractedData(null);
    setActiveTab("manual");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-400" />
            Add New Transaction
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
            <TabsTrigger value="manual" className="text-white">Manual Entry</TabsTrigger>
            <TabsTrigger value="receipt" className="text-white">Receipt Scan</TabsTrigger>
          </TabsList>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-6 mt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Description *</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="What did you spend on?"
                    className="bg-gray-700/50 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Amount *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-700/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
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

                <div className="space-y-2">
                  <Label className="text-white">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="expense" className="text-white hover:bg-gray-700">Expense</SelectItem>
                      <SelectItem value="income" className="text-white hover:bg-gray-700">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Recurring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Recurring Transaction</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.recurring}
                      onCheckedChange={(checked) => handleInputChange('recurring', checked)}
                    />
                    <span className="text-sm text-gray-400">
                      This is a recurring transaction
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-white">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="bg-gray-700/50 border-gray-600 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm" variant="outline" className="border-gray-600">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-cyan-400 border-cyan-400/30">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500">
                  Add Transaction
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Receipt Scan Tab */}
          <TabsContent value="receipt" className="space-y-6 mt-6">
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Upload Receipt</h3>
                  <p className="text-gray-400 mb-4">
                    Our AI will automatically extract transaction details from your receipt
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload">
                    <Button 
                      type="button" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Upload Success */}
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-green-400">Receipt processed successfully!</p>
                        <p className="text-sm text-gray-400">{uploadedFile.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Extracted Data */}
                {extractedData && (
                  <Card className="bg-purple-500/10 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span className="font-medium text-purple-400">AI Extracted Data</span>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Same form fields as manual entry, but pre-filled */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Description</Label>
                            <Input
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-white">Amount</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.amount}
                              onChange={(e) => handleInputChange('amount', e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                <SelectValue />
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
                          <div className="space-y-2">
                            <Label className="text-white">Date</Label>
                            <Input
                              type="date"
                              value={formData.date}
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              className="bg-gray-700/50 border-gray-600 text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Add AI Transaction
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
