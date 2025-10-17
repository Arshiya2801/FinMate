import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Camera, PiggyBank, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  const actions = [
    {
      title: "Add Transaction",
      description: "Record a new expense or income",
      icon: Plus,
      href: createPageUrl("Transactions"),
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Scan Receipt",
      description: "Upload and AI-analyze receipt",
      icon: Camera,
      href: createPageUrl("Transactions"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Set Budget",
      description: "Create spending limits",
      icon: PiggyBank,
      href: createPageUrl("Budgets"),
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Ask AI",
      description: "Get financial advice",
      icon: MessageSquare,
      href: createPageUrl("AIAssistant"),
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Button 
              variant="outline" 
              className="w-full h-auto p-4 bg-gray-700/30 border-gray-600/50 hover:bg-gray-600/30 group"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-white">{action.title}</p>
                  <p className="text-sm text-gray-400">{action.description}</p>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}