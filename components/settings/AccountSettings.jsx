
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Building2, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Unlink
} from "lucide-react";

export default function AccountSettings({ user, onUserUpdate }) {
  const [linkedAccounts] = useState([
    {
      id: 1,
      type: 'bank',
      name: 'Chase Checking',
      last4: '4567',
      status: 'connected',
      balance: 2540.50,
      lastSync: '2 hours ago'
    },
    {
      id: 2,
      type: 'credit',
      name: 'Capital One Venture',
      last4: '8901',
      status: 'connected',
      balance: -1250.30,
      lastSync: '1 hour ago'
    },
    {
      id: 3,
      type: 'savings',
      name: 'Ally High Yield Savings',
      last4: '2345',
      status: 'syncing',
      balance: 15680.75,
      lastSync: 'Syncing...'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'syncing':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'syncing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'bank':
        return '🏦';
      case 'credit':
        return '💳';
      case 'savings':
        return '💰';
      default:
        return '🏛️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Alert className="border-blue-500/30 bg-blue-500/10">
        <CheckCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          Bank connections are secured with 256-bit encryption and read-only access.
        </AlertDescription>
      </Alert>

      {/* Linked Accounts */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Linked Accounts
          </CardTitle>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedAccounts.map((account) => (
            <div key={account.id} className="bg-gray-700/30 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-600/50 rounded-xl flex items-center justify-center text-xl">
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{account.name}</h4>
                    <p className="text-sm text-gray-400">•••• {account.last4}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(account.status)}>
                      {getStatusIcon(account.status)}
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {account.balance >= 0 ? '$' : '-$'}{Math.abs(account.balance).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last sync: {account.lastSync}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 h-8">
                    Sync Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 h-8">
                    <Unlink className="w-3 h-3 mr-1" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Connection Options */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Add New Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-3 h-16 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-400">Checking & Savings</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-3 h-16 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-gray-400">Track spending</p>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="flex items-center gap-3 h-16 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span className="text-emerald-400 font-bold">$</span>
              </div>
              <div className="text-left">
                <p className="font-medium">Investment</p>
                <p className="text-sm text-gray-400">Brokerage accounts</p>
              </div>
            </Button>
          </div>

          <Alert className="border-gray-600/50 bg-gray-700/30">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <AlertDescription className="text-gray-300">
              We support 12,000+ financial institutions via Plaid integration. Your login credentials are never stored.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Sync Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Automatic Sync</Label>
              <p className="text-sm text-gray-400">Update account data every 6 hours</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Transaction Categorization</Label>
              <p className="text-sm text-gray-400">Let AI automatically categorize new transactions</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Duplicate Detection</Label>
              <p className="text-sm text-gray-400">Automatically merge duplicate transactions</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
