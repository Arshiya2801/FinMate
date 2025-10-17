
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Users, Calculator, Copy, Share, Info } from "lucide-react";
import { format } from 'date-fns';

export default function CreateSplitModal({ isOpen, onClose, onCreate, currentUser }) {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    title: "",
    total_amount: "",
    category: "food",
    bill_date: format(new Date(), 'yyyy-MM-dd'),
    notes: "",
    split_method: "equal",
    currency: currentUser?.currency || 'USD' // Add currency to formData
  });
  const [participants, setParticipants] = useState([]); // This stores OTHER participants, creator handled separately.
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [newParticipantName, setNewParticipantName] = useState("");
  const [showShareMessage, setShowShareMessage] = useState(false);
  const [shareableMessage, setShareableMessage] = useState("");

  const currency = formData.currency; // Use currency from formData
  const currencySymbol = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).formatToParts(0).find(p => p.type === 'currency')?.value || '$';

  const categories = [
    { value: "food", label: "Food & Dining", icon: "🍕" },
    { value: "transport", label: "Transportation", icon: "🚗" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "bills", label: "Bills & Utilities", icon: "📄" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "other", label: "Other", icon: "📌" }
  ];

  const addParticipant = () => {
    if (!newParticipantEmail.trim() || !newParticipantName.trim()) return;
    
    // Prevent adding duplicates
    if (participants.some(p => p.email.toLowerCase() === newParticipantEmail.trim().toLowerCase()) ||
        (currentUser && currentUser.email.toLowerCase() === newParticipantEmail.trim().toLowerCase())) {
        // Optionally show a toast/alert that participant already exists or is the creator
        console.warn("Participant with this email already added or is the creator.");
        return;
    }

    const participant = {
      email: newParticipantEmail.trim(),
      name: newParticipantName.trim(),
      amount_owed: 0, // Will be calculated on submit for equal split
      amount_paid: 0,
      settled: false,
      is_creator: false // New participants are not creators
    };
    
    setParticipants(prev => [...prev, participant]);
    setNewParticipantEmail("");
    setNewParticipantName("");
  };

  const removeParticipant = (index) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const generateShareableMessage = (splitData, allParticipants) => {
    const creator = allParticipants.find(p => p.is_creator);
    const otherParticipants = allParticipants.filter(p => !p.is_creator);
    
    let message = `🧾 Split Bill Alert!\n\n`;
    message += `📋 ${splitData.title}\n`;
    message += `💰 Total: ${currencySymbol}${splitData.total_amount.toFixed(2)}\n`; // Use currencySymbol
    message += `📅 Date: ${format(new Date(splitData.bill_date), 'PPP')}\n\n`;
    
    message += `💸 Amount breakdown:\n`;
    otherParticipants.forEach(p => {
      message += `• ${p.name}: owes ${currencySymbol}${p.amount_owed.toFixed(2)}\n`; // Use currencySymbol
    });
    
    if (splitData.notes) {
      message += `\n📝 Notes: ${splitData.notes}\n`;
    }
    
    if (creator) {
      message += `\nPlease pay ${creator.name || creator.email} your share. Thanks! 🙏`;
    }
    
    return message;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWhatsApp = (message) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.total_amount) {
      // TODO: Add more specific validation messages for title/amount
      console.error("Title and Total Amount are required.");
      return;
    }

    const totalAmount = parseFloat(formData.total_amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      console.error("Invalid Total Amount.");
      // TODO: Show user-friendly error for invalid amount
      return;
    }

    const totalPeopleIncludingCreator = participants.length + 1; // +1 for the current user (creator)
    const amountPerPerson = totalAmount / totalPeopleIncludingCreator;

    // Construct allParticipants array, including the creator
    const allParticipants = [
      {
        email: currentUser.email,
        name: currentUser.full_name || currentUser.email,
        amount_owed: amountPerPerson, // Creator also "owes" their share conceptually
        amount_paid: totalAmount, // Creator is assumed to have paid the whole bill initially
        settled: false,
        is_creator: true // Mark the creator
      },
      ...participants.map(p => ({
        ...p,
        amount_owed: amountPerPerson, // Other participants owe their share
        amount_paid: 0, // Other participants have not paid anything yet
        settled: false,
        is_creator: false
      }))
    ];

    const splitData = {
      ...formData,
      total_amount: totalAmount,
      participants: allParticipants
    };

    try {
      // Create the split bill
      await onCreate(splitData);
      
      // Generate shareable message
      const message = generateShareableMessage(splitData, allParticipants);
      setShareableMessage(message);
      setShowShareMessage(true);
      
    } catch (error) {
      console.error("Error creating split:", error);
      // TODO: Show user-friendly error
    }
  };

  const resetAndClose = () => {
    setFormData({
      title: "",
      total_amount: "",
      category: "food",
      bill_date: format(new Date(), 'yyyy-MM-dd'),
      notes: "",
      split_method: "equal",
      currency: currentUser?.currency || 'USD' // Reset currency too
    });
    setParticipants([]);
    setNewParticipantEmail("");
    setNewParticipantName("");
    setShowShareMessage(false);
    setShareableMessage("");
    setActiveTab("details"); // Reset to default tab
    onClose();
  };

  if (showShareMessage) {
    return (
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="sm:max-w-lg bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Share className="w-6 h-6 text-green-400" />
              Share Bill Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-green-500/30 bg-green-500/10">
              <Info className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                Split bill created! Share the details with participants using the options below.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <Label className="text-white mb-2 block">Message to Share:</Label>
              <Textarea
                value={shareableMessage}
                readOnly
                className="bg-gray-600/50 border-gray-600 text-white min-h-[200px] resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => copyToClipboard(shareableMessage)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Message
              </Button>
              <Button
                onClick={() => shareViaWhatsApp(shareableMessage)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Share className="w-4 h-4 mr-2" />
                Share via WhatsApp
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button onClick={resetAndClose} className="bg-green-500 hover:bg-green-600 text-black">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-gray-800 border-gray-700"> {/* Changed max-width */}
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            Split a New Bill
          </DialogTitle>
        </DialogHeader>

        <Alert className="border-blue-500/30 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            After creating the bill, you'll get a shareable message to send to participants via WhatsApp, SMS, or other messaging apps.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700/50">
            <TabsTrigger value="details" className="text-white">Bill Details</TabsTrigger>
            <TabsTrigger value="participants" className="text-white">Add People</TabsTrigger>
            <TabsTrigger value="split" className="text-white">Split Amount</TabsTrigger>
          </TabsList>

          {/* Bill Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Bill Description *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Dinner at Tony's"
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Total Amount *</Label>
                {/* Apply currency symbol to total_amount input */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-400 sm:text-sm">{currencySymbol}</span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.total_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                    placeholder="0.00"
                    className="bg-gray-700/50 border-gray-600 text-white pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
                  value={formData.bill_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, bill_date: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Notes (Optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional details..."
                className="bg-gray-700/50 border-gray-600 text-white"
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {currentUser?.full_name?.charAt(0) || currentUser?.email?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{currentUser?.full_name || "You"}</p>
                    <p className="text-green-400 text-sm">{currentUser?.email}</p>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                    Bill Creator
                  </Badge>
                </div>
              </div>

              {/* Add Participant Form */}
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-3">Add People</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <Input
                    type="email"
                    value={newParticipantEmail}
                    onChange={(e) => setNewParticipantEmail(e.target.value)}
                    placeholder="Email address"
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                  <Input
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    placeholder="Full name"
                    className="bg-gray-700/50 border-gray-600 text-white"
                  />
                </div>
                <Button 
                  onClick={addParticipant}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Person
                </Button>
              </div>

              {/* Participants List */}
              {participants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-white font-medium">People in this split ({participants.length})</h4>
                  {participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{participant.name}</p>
                          <p className="text-gray-400 text-sm">{participant.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Split Amount Tab */}
          <TabsContent value="split" className="space-y-4 mt-6">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Split Calculation
              </h4>
              
              {formData.total_amount && (participants.length + 1) > 0 ? ( // Check if there's total amount and at least one person (creator)
                <div className="space-y-3">
                  <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-2xl font-bold">
                      {currencySymbol}{(parseFloat(formData.total_amount) / (participants.length + 1)).toFixed(2)}
                    </p>
                    <p className="text-gray-300 text-sm">per person ({participants.length + 1} people total)</p>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Creator's share */}
                    <div className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                      <span className="text-white">{currentUser?.full_name || "You"} (Paid)</span>
                      <span className="text-green-400 font-bold">
                        {currencySymbol}{(parseFloat(formData.total_amount) / (participants.length + 1)).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Other participants' shares */}
                    {participants.map((participant, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                        <span className="text-white">{participant.name}</span>
                        <span className="text-yellow-400 font-bold">
                          Owes {currencySymbol}{(parseFloat(formData.total_amount) / (participants.length + 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">
                  Add bill details and participants to see the split calculation
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black"
            disabled={!formData.title || !formData.total_amount || parseFloat(formData.total_amount) <= 0 || participants.length === 0}
          >
            Create Split & Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
