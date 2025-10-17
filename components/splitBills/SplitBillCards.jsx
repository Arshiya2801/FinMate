
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Calendar,
  DollarSign, // This icon is not used but was in the original imports. Keeping for safety.
  CheckCircle,
  Copy,
  MessageSquare,
  Share,
  Info
} from "lucide-react";
import { format } from 'date-fns';
import SettleUpModal from './SettleUpModal';
import { formatCurrency } from '@/components/lib/currency';

const CATEGORY_ICONS = {
  food: '🍕',
  transport: '🚗',
  entertainment: '🎬',
  shopping: '🛍️',
  bills: '📄',
  travel: '✈️',
  other: '📌'
};

export default function SplitBillCard({ bill, currentUser, onSettleUp, onRefresh }) {
  const [showReminderMessage, setShowReminderMessage] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);

  // Add a guard clause to prevent crashes if bill is undefined
  if (!bill) {
    return null; // or a loading/error state
  }

  const myParticipantEntry = bill.participants.find(p => p.email === currentUser?.email);
  const iAmTheOwner = bill.created_by === currentUser?.email;

  const amountIOwed = myParticipantEntry ? (myParticipantEntry.amount_owed - myParticipantEntry.amount_paid) : 0;

  const outstandingParticipants = bill.participants.filter(p =>
    p.email !== currentUser?.email && !p.settled && (p.amount_owed - p.amount_paid) > 0
  );

  const totalOwedToMe = outstandingParticipants.reduce((sum, p) => sum + (p.amount_owed - p.amount_paid), 0);

  const currency = currentUser?.currency || 'USD';

  const generateReminderMessage = (participant) => {
    const amountOwedValue = (participant.amount_owed - participant.amount_paid);
    return `Hi ${participant.name}! 👋\n\nJust a friendly reminder about our bill:\n\n📋 ${bill.title}\n💰 Your share: ${formatCurrency(amountOwedValue, currency)}\n📅 From: ${format(new Date(bill.bill_date), 'PPP')}\n\n${bill.notes ? `📝 ${bill.notes}\n\n` : ''}Please let me know when you can settle this. Thanks! 🙏\n\n- ${currentUser?.full_name || currentUser?.email}`;
  };

  const copyReminderMessage = async (participant) => {
    const message = generateReminderMessage(participant);
    try {
      await navigator.clipboard.writeText(message);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareReminderViaWhatsApp = (participant) => {
    const message = generateReminderMessage(participant);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center text-xl">
              {CATEGORY_ICONS[bill.category] || CATEGORY_ICONS.other}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{bill.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(bill.bill_date), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {bill.participants.length} people
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{formatCurrency(bill.total_amount, currency)}</p>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
              {bill.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* My Status */}
        {!iAmTheOwner && (
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Your Share</p>
                <p className="text-sm text-gray-400">
                  {formatCurrency(myParticipantEntry?.amount_owed || 0, currency)}
                  {myParticipantEntry?.settled ? " (Settled)" : ` (You owe: ${formatCurrency(amountIOwed, currency)})`}
                </p>
              </div>
              {!myParticipantEntry?.settled && amountIOwed > 0 && (
                <Button
                  onClick={() => setShowSettleModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Creator View - Who Owes Me */}
        {iAmTheOwner && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">Outstanding Amounts</p>
              <p className="text-green-400 font-bold">
                Total Owed: {formatCurrency(totalOwedToMe, currency)}
              </p>
            </div>

            {outstandingParticipants.length > 0 ? (
              <div className="space-y-2">
                {outstandingParticipants.map((participant, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-600 text-white text-sm">
                            {participant.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-400">{participant.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-400 font-bold">
                          {formatCurrency((participant.amount_owed - participant.amount_paid), currency)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyReminderMessage(participant)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareReminderViaWhatsApp(participant)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Alert className="border-blue-500/20 bg-blue-500/5">
                      <Info className="h-3 w-3 text-blue-400" />
                      <AlertDescription className="text-xs text-blue-200">
                        Click Copy to get a reminder message, or Share to send via WhatsApp
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-green-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p>All settled! 🎉</p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {bill.notes && (
          <div className="bg-gray-700/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-gray-300 text-sm">{bill.notes}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* SettleUpModal for when a participant wants to mark their share as paid */}
      <SettleUpModal
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        bill={bill}
        participant={myParticipantEntry}
        currentUser={currentUser}
        onSettleUp={onSettleUp}
        onRefresh={onRefresh}
      />
    </Card>
  );
}
