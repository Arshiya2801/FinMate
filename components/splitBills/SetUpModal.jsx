
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard, CheckCircle } from "lucide-react";
import { formatCurrency } from '@/components/lib/currency';

export default function SettleUpModal({ isOpen, onClose, bill, participant, currentUser, onSettleUp, onRefresh }) {
  const [amount, setAmount] = useState('');
  const [isSettling, setIsSettling] = useState(false);

  // If currentUser has a currency, use it; otherwise, default to 'USD'
  const currency = currentUser?.currency || 'USD';
  
  // Get currency symbol using Intl.NumberFormat
  // This approach is robust as it handles various currencies and locales
  const currencySymbol = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // Prevent adding decimal places to symbol itself
    maximumFractionDigits: 0,
  }).formatToParts(0).find(p => p.type === 'currency').value;

  if (!bill || !participant) return null;

  const remainingOwed = participant ? (participant.amount_owed - participant.amount_paid) : 0;

  const handleSettleUp = async () => {
    setIsSettling(true);
    try {
      const payment = parseFloat(amount);
      if (isNaN(payment) || payment <= 0) {
        throw new Error("Invalid payment amount."); // Should ideally be handled by UI disabling or validation messages
      }

      const updatedParticipants = bill.participants.map(p => {
        if (p.email === participant.email) {
          const newPaidAmount = p.amount_paid + payment;
          return {
            ...p,
            amount_paid: newPaidAmount,
            settled: newPaidAmount >= p.amount_owed
          };
        }
        return p;
      });

      const allParticipantsSettled = updatedParticipants.every(p => p.settled);
      const newBillStatus = allParticipantsSettled ? 'settled' : 'active';

      await onSettleUp(bill.id, {
        participants: updatedParticipants,
        status: newBillStatus
      });

      onClose();
      onRefresh(); // Refresh data after settle up
      setAmount("");
    } catch (error) {
      console.error("Error settling up:", error);
      // TODO: Display a user-friendly error message
    } finally {
      setIsSettling(false);
    }
  };

  const isPaymentButtonDisabled = !amount || parseFloat(amount) <= 0 || isSettling || parseFloat(amount) > remainingOwed;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            Settle Up for "{bill.title}"
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You currently owe <span className="font-bold text-white">{formatCurrency(remainingOwed, currency)}</span>. Pay all or a portion of your share.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bill Summary */}
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-medium text-white mb-2">{bill.title}</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Total Bill: <span className="text-white">{formatCurrency(bill.total_amount, currency)}</span></p>
              <p>You Owe: <span className="text-red-400 font-bold">{formatCurrency(remainingOwed, currency)}</span></p>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount-to-pay" className="text-white">Amount to Pay</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-400 sm:text-sm">{currencySymbol}</span>
              </div>
              <Input
                id="amount-to-pay"
                type="number"
                step="0.01"
                min="0"
                max={remainingOwed} // Ensure user can't pay more than owed
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={remainingOwed.toFixed(2)}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount((remainingOwed / 2).toFixed(2))}
                disabled={remainingOwed <= 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Pay Half
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(remainingOwed.toFixed(2))}
                disabled={remainingOwed <= 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Pay Full Amount
              </Button>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Payment Recorded</span>
            </div>
            <p className="text-sm text-gray-400">
              This will mark your payment as completed in the split. Make sure to pay the bill creator separately using your preferred payment method.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSettleUp}
              disabled={isPaymentButtonDisabled}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black"
            >
              {isSettling ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Record Payment
                </>
              )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
