
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Palette, 
  Bell, 
  Shield, 
  CreditCard
} from "lucide-react"; // Removed Target icon as it's no longer needed for settings
import { useAppContext } from "@/components/AppContext";

import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import AccountSettings from "../components/settings/AccountSettings";
// Removed GoalsSettings import as financial goals will have a dedicated page

export default function SettingsPage() {
  const { user, isLoading, refetchUser } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");

  // Removed local user state and useEffect for loading as it's now handled by AppContext

  const handleUserUpdate = async (updatedData) => {
    try {
      await base44.auth.updateMe(updatedData);
      await refetchUser(); // Call refetchUser from context to update global user state
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const settingsTabs = [
    { 
      id: "profile", 
      label: "Profile", 
      icon: UserIcon,
      component: ProfileSettings
    },
    { 
      id: "appearance", 
      label: "Appearance", 
      icon: Palette,
      component: AppearanceSettings
    },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: Bell,
      component: NotificationSettings
    },
    { 
      id: "security", 
      label: "Security", 
      icon: Shield,
      component: SecuritySettings
    },
    { 
      id: "accounts", 
      label: "Linked Accounts", 
      icon: CreditCard,
      component: AccountSettings
    }
    // Removed "goals" tab as financial goals will have a dedicated page
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your FinMate experience</p>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-auto p-1 bg-gray-800/50 backdrop-blur-sm">
            {settingsTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-3 text-white data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        {settingsTabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id}>
              <TabComponent
                user={user}
                isLoading={isLoading}
                onUserUpdate={handleUserUpdate}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
