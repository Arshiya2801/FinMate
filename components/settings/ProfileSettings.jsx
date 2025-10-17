import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function ProfileSettings({ user, isLoading, onUserUpdate }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    currency: "USD"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        currency: user.currency || "USD"
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    await onUserUpdate({ 
      full_name: formData.full_name,
      currency: formData.currency
    });
    setIsSaving(false);
  };

  const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-gray-700 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-700" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24 bg-gray-700" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm text-white">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription className="text-gray-400">Update your account's profile information and settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            className="bg-gray-700/50 border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={formData.email} disabled className="bg-gray-900/50 border-gray-700" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Preferred Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({...prev, currency: value}))}>
            <SelectTrigger id="currency" className="bg-gray-700/50 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {currencies.map(c => (
                <SelectItem key={c} value={c} className="hover:bg-gray-700">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-400">This currency will be used for display across the app.</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}