
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert"; // New import
import { Bell, Mail, Smartphone, AlertTriangle, TrendingUp, Calendar, CheckCircle } from "lucide-react"; // CheckCircle new import

export default function NotificationSettings({ user, onUserUpdate }) {
  const [settings, setSettings] = useState({
    email_notifications: user?.email_notifications !== false,
    push_notifications: user?.push_notifications !== false,
    budget_alerts: user?.budget_alerts !== false,
    spending_insights: user?.spending_insights !== false,
    weekly_reports: user?.weekly_reports !== false,
    bill_reminders: user?.bill_reminders !== false,
    notification_frequency: user?.notification_frequency || 'daily',
    quiet_hours_start: user?.quiet_hours_start || '22:00', // New setting
    quiet_hours_end: user?.quiet_hours_end || '08:00' // New setting
  });

  const [saveSuccess, setSaveSuccess] = useState(false); // New state for success message

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await onUserUpdate({ [key]: value });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000); // Hide success message after 2 seconds
    } catch (error) {
      console.error('Error saving notification setting:', error);
      // Optionally, revert the setting in UI or show an error message
    }
  };

  const handleBulkUpdate = async (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
    try {
      await onUserUpdate(updates);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const notificationTypes = [
    {
      key: 'budget_alerts',
      title: 'Budget Alerts',
      description: 'Get notified when you approach or exceed budget limits',
      icon: AlertTriangle,
      color: 'text-yellow-400'
    },
    {
      key: 'spending_insights',
      title: 'AI Spending Insights',
      description: 'Receive personalized tips and spending analysis',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      key: 'weekly_reports',
      title: 'Weekly Reports',
      description: 'Summary of your financial activity each week',
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      key: 'bill_reminders',
      title: 'Bill Reminders',
      description: 'Never miss a payment with smart reminders',
      icon: Bell,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            Notification settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Delivery Methods */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-400" /> {/* Changed color from emerald to green */}
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <Label className="text-white">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-gray-400">Get instant alerts on your device</p>
              </div>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">What to Notify</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div key={type.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700/50 rounded-xl flex items-center justify-center">
                    <IconComponent className={`w-5 h-5 ${type.color}`} />
                  </div>
                  <div>
                    <Label className="text-white">{type.title}</Label>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[type.key]}
                  onCheckedChange={(checked) => handleSettingChange(type.key, checked)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Notification Frequency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">How often should we notify you?</Label>
            <Select
              value={settings.notification_frequency}
              onValueChange={(value) => handleSettingChange('notification_frequency', value)}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="realtime" className="text-white hover:bg-gray-700">Real-time</SelectItem>
                <SelectItem value="daily" className="text-white hover:bg-gray-700">Daily Digest</SelectItem>
                <SelectItem value="weekly" className="text-white hover:bg-gray-700">Weekly Summary</SelectItem>
                <SelectItem value="monthly" className="text-white hover:bg-gray-700">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-700/30 p-4 rounded-xl">
            <h4 className="font-medium text-white mb-2">Quiet Hours</h4>
            <p className="text-sm text-gray-400 mb-3">
              Pause non-urgent notifications during these hours
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={settings.quiet_hours_start} // Connected to state
                onValueChange={(value) => handleSettingChange('quiet_hours_start', value)} // Handle change
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="20:00" className="text-white">8:00 PM</SelectItem>
                  <SelectItem value="21:00" className="text-white">9:00 PM</SelectItem>
                  <SelectItem value="22:00" className="text-white">10:00 PM</SelectItem>
                  <SelectItem value="23:00" className="text-white">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={settings.quiet_hours_end} // Connected to state
                onValueChange={(value) => handleSettingChange('quiet_hours_end', value)} // Handle change
              >
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="06:00" className="text-white">6:00 AM</SelectItem>
                  <SelectItem value="07:00" className="text-white">7:00 AM</SelectItem>
                  <SelectItem value="08:00" className="text-white">8:00 AM</SelectItem>
                  <SelectItem value="09:00" className="text-white">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
