import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  Send,
  Eye
} from "lucide-react";
import { format, addDays, subDays } from 'date-fns';

export default function OutstandingPayments({ amount, isLoading }) {
  // Mock outstanding payments data
  const outstandingInvoices = [
    {
      id: 1,
      client: "TechCorp Inc.",
      amount: 2500.00,
      dueDate: subDays(new Date(), 5),
      status: "overdue",
      invoiceNumber: "INV-2024-001"
    },
    {
      id: 2,
      client: "StartupXYZ",
      amount: 1800.00,
      dueDate: addDays(new Date(), 2),
      status: "due_soon",
      invoiceNumber: "INV-2024-002"
    },
    {
      id: 3,
      client: "Global Solutions",
      amount: 3200.00,
      dueDate: addDays(new Date(), 7),
      status: "pending",
      invoiceNumber: "INV-2024-003"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'due_soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'overdue':
        return 'Overdue';
      case 'due_soon':
        return 'Due Soon';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Outstanding Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Outstanding Payments
          </CardTitle>
          <div className="text-right">
            <p className="text-yellow-400 font-bold text-lg">
              ${amount.toFixed(2)}
            </p>
            <p className="text-gray-400 text-xs">Total Outstanding</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {outstandingInvoices.length > 0 ? (
          <div className="space-y-3">
            {outstandingInvoices.map((invoice) => (
              <div key={invoice.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{invoice.client}</h4>
                    <p className="text-xs text-gray-400">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${invoice.amount.toFixed(2)}</p>
                    <Badge className={`text-xs ${getStatusColor(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    Due: {format(invoice.dueDate, 'MMM d, yyyy')}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-gray-400">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-blue-400">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Send Payment Reminders
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No outstanding payments</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}