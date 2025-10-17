import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building,
  DollarSign,
  TrendingUp,
  Star
} from "lucide-react";

export default function TopCustomersVendors({ transactions, isLoading }) {
  const [activeTab, setActiveTab] = useState("customers");

  // Mock data for customers and vendors
  const topCustomers = [
    {
      name: "TechCorp Inc.",
      revenue: 15000,
      transactions: 8,
      growth: 23,
      category: "enterprise"
    },
    {
      name: "StartupXYZ",
      revenue: 8500,
      transactions: 12,
      growth: -5,
      category: "startup"
    },
    {
      name: "Global Solutions",
      revenue: 6200,
      transactions: 6,
      growth: 18,
      category: "enterprise"
    }
  ];

  const topVendors = [
    {
      name: "AWS Services",
      spent: 3200,
      transactions: 24,
      growth: 12,
      category: "infrastructure"
    },
    {
      name: "Office Supplies Co.",
      spent: 1800,
      transactions: 15,
      growth: -8,
      category: "office"
    },
    {
      name: "Marketing Agency",
      spent: 5500,
      transactions: 6,
      growth: 35,
      category: "marketing"
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      enterprise: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      startup: 'bg-green-500/20 text-green-400 border-green-500/30',
      infrastructure: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      office: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Top Relationships</CardTitle>
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
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Top Business Relationships
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
            <TabsTrigger value="customers" className="text-white">Customers</TabsTrigger>
            <TabsTrigger value="vendors" className="text-white">Vendors</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-3 mt-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{customer.name}</h4>
                      <p className="text-xs text-gray-400">{customer.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">${customer.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-3 h-3 ${customer.growth > 0 ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-xs ${customer.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {customer.growth > 0 ? '+' : ''}{customer.growth}%
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={`text-xs ${getCategoryColor(customer.category)}`}>
                  {customer.category}
                </Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              View All Customers
            </Button>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-3 mt-4">
            {topVendors.map((vendor, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{vendor.name}</h4>
                      <p className="text-xs text-gray-400">{vendor.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-400">${vendor.spent.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-3 h-3 ${vendor.growth > 0 ? 'text-red-400' : 'text-green-400'}`} />
                      <span className={`text-xs ${vendor.growth > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {vendor.growth > 0 ? '+' : ''}{vendor.growth}%
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={`text-xs ${getCategoryColor(vendor.category)}`}>
                  {vendor.category}
                </Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              View All Vendors
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}