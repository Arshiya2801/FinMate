
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"; // Added Input import
import { User } from "@/entities/all";
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  LogOut
} from "lucide-react";

export default function SecuritySettings({ user, onUserUpdate }) {
  const [settings, setSettings] = useState({
    two_factor_enabled: user?.two_factor_enabled || false,
    biometric_login: user?.biometric_login || false,
    session_timeout: user?.session_timeout || 30,
    data_export_requested: false
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // Added isExporting state
  const [showPasswordChange, setShowPasswordChange] = useState(false); // Added showPasswordChange state
  const [passwordForm, setPasswordForm] = useState({ // Added passwordForm state
    current: '',
    new: '',
    confirm: ''
  });
  const [actionSuccess, setActionSuccess] = useState(''); // Added actionSuccess state

  const handleSettingChange = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await onUserUpdate({ [key]: value });
      setActionSuccess(`${key.replace('_', ' ')} updated successfully!`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      // Optionally revert state on error or show error message
      setActionSuccess(`Failed to update ${key.replace('_', ' ')}. Please try again.`);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await User.logout();
      setActionSuccess('Logged out successfully!');
      // In a real app, this would likely redirect to a login page
    } catch (error) {
      console.error("Error logging out:", error);
      setActionSuccess('Error logging out. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleDataExport = async () => {
    try {
      setIsExporting(true);
      setSettings(prev => ({ ...prev, data_export_requested: true }));
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setActionSuccess('Data export initiated! You will receive an email with your data within 24 hours.');
      setSettings(prev => ({ ...prev, data_export_requested: false })); // Reset requested state after process
    } catch (error) {
      console.error('Error exporting data:', error);
      setActionSuccess('Error initiating data export. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setActionSuccess(''), 5000); // Keep success message a bit longer for export
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setActionSuccess('New passwords do not match!');
      setTimeout(() => setActionSuccess(''), 3000);
      return;
    }
    
    if (passwordForm.new.length < 8) {
      setActionSuccess('Password must be at least 8 characters long!');
      setTimeout(() => setActionSuccess(''), 3000);
      return;
    }

    try {
      // In a real app, you'd call an API here to update the password, e.g., await User.changePassword(passwordForm.current, passwordForm.new);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setActionSuccess('Password changed successfully!');
      setShowPasswordChange(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setActionSuccess('Error changing password. Please check your current password and try again.');
    } finally {
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {actionSuccess && (
        <Alert className={`border-green-500/30 bg-green-500/10 ${actionSuccess.includes('Error') ? 'border-red-500/30 bg-red-500/10' : ''}`}>
          {actionSuccess.includes('Error') ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-400" />
          )}
          <AlertDescription className={`${actionSuccess.includes('Error') ? 'text-red-200' : 'text-green-200'}`}>
            {actionSuccess}
          </AlertDescription>
        </Alert>
      )}

      {/* Authentication */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" /> {/* Changed color to green */}
            Authentication & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <Label className="text-white">Password</Label>
                <p className="text-sm text-gray-400">Last changed 3 months ago</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordChange && (
            <Card className="bg-gray-700/30">
              <CardContent className="p-4 space-y-4">
                <Input
                  type="password"
                  placeholder="Current password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                  className="bg-gray-600/50 border-gray-500 text-white"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                  className="bg-gray-600/50 border-gray-500 text-white"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                  className="bg-gray-600/50 border-gray-500 text-white"
                />
                <div className="flex gap-2">
                  <Button onClick={handlePasswordChange} className="bg-green-600 hover:bg-green-700 text-white">
                    Update Password
                  </Button>
                  <Button variant="outline" onClick={() => setShowPasswordChange(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-400" /> {/* Changed color to green */}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Label className="text-white">Two-Factor Authentication</Label>
                  {settings.two_factor_enabled && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
            </div>
            <Switch
              checked={settings.two_factor_enabled}
              onCheckedChange={(checked) => handleSettingChange('two_factor_enabled', checked)}
            />
          </div>

          {/* Biometric Login */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <Label className="text-white">Biometric Login</Label>
                <p className="text-sm text-gray-400">Use fingerprint or face recognition</p>
              </div>
            </div>
            <Switch
              checked={settings.biometric_login}
              onCheckedChange={(checked) => handleSettingChange('biometric_login', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Privacy & Data Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <Label className="text-white">Export Your Data</Label>
                <p className="text-sm text-gray-400">Download all your financial data</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleDataExport}
              disabled={isExporting || settings.data_export_requested} // Using both isExporting and data_export_requested
              className="border-gray-600 text-gray-300"
            >
              {isExporting ? "Processing..." : settings.data_export_requested ? "Requested" : "Export Data"}
            </Button>
          </div>

          {/* Active Sessions */}
          <div className="bg-gray-700/30 p-4 rounded-xl">
            <h4 className="font-medium text-white mb-3">Active Sessions</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Current Session (Web)</span>
                <span className="text-green-400">Active now</span> {/* Changed color to green */}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">iPhone App</span>
                <span className="text-gray-400">2 hours ago</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 border-gray-600 text-gray-300">
              Manage Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              These actions cannot be undone. Please proceed with caution.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Sign Out</Label>
              <p className="text-sm text-gray-400">Sign out from all devices</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Delete Account</Label>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
