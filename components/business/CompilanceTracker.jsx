import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Clock
} from "lucide-react";
import { format, addDays, addMonths } from 'date-fns';

export default function ComplianceTracker({ isLoading }) {
  // Mock compliance data
  const complianceItems = [
    {
      id: 1,
      title: "Monthly GST Return",
      dueDate: addDays(new Date(), 5),
      status: "pending",
      priority: "high",
      description: "File monthly GST return for current period"
    },
    {
      id: 2,
      title: "Quarterly Income Tax",
      dueDate: addDays(new Date(), 15),
      status: "in_progress",
      priority: "medium",
      description: "Advance tax payment due"
    },
    {
      id: 3,
      title: "Annual Audit Report",
      dueDate: addMonths(new Date(), 2),
      status: "completed",
      priority: "low",
      description: "Annual financial audit completed"
    },
    {
      id: 4,
      title: "Employee PF Returns",
      dueDate: addDays(new Date(), 10),
      status: "pending",
      priority: "medium",
      description: "Monthly PF contribution filing"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Compliance Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg bg-gray-700" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const pendingItems = complianceItems.filter(item => item.status !== 'completed');

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Compliance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingItems.length > 0 ? (
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={getPriorityColor(item.priority)}>
                        {getStatusIcon(item.status)}
                      </span>
                      <h4 className="font-medium text-white text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        Due: {format(item.dueDate, 'MMM d, yyyy')}
                      </div>
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <FileText className="w-4 h-4 mr-2" />
              View All Compliance Items
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>All compliance requirements up to date!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}