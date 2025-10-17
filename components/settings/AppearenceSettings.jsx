
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Palette, Moon, Sun, Monitor, Sparkles, CheckCircle } from "lucide-react";

export default function AppearanceSettings({ user, onUserUpdate }) {
  const [settings, setSettings] = useState({
    theme: user?.theme || 'dark',
    accent_color: user?.accent_color || 'green',
    animations: user?.animations !== false,
    compact_mode: user?.compact_mode || false,
    language: user?.language || 'en'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Apply theme changes immediately
    if (key === 'accent_color') {
      applyAccentColor(value);
    }
    if (key === 'animations') {
      applyAnimationSettings(value);
    }
    
    try {
      await onUserUpdate({ [key]: value });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const applyAccentColor = (color) => {
    const root = document.documentElement;
    const colorMap = {
      green: { primary: '#22C55E', secondary: '#16A34A' },
      blue: { primary: '#3B82F6', secondary: '#2563EB' },
      purple: { primary: '#8B5CF6', secondary: '#7C3AED' },
      pink: { primary: '#EC4899', secondary: '#DB2777' },
      orange: { primary: '#F97316', secondary: '#EA580C' },
      cyan: { primary: '#06B6D4', secondary: '#0891B2' }
    };
    
    const colors = colorMap[color] || colorMap.green;
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-secondary', colors.secondary);
  };

  const applyAnimationSettings = (enabled) => {
    const root = document.documentElement;
    root.style.setProperty('--animation-duration', enabled ? '0.3s' : '0s');
  };

  useEffect(() => {
    // Apply current settings on component mount and when relevant settings change
    applyAccentColor(settings.accent_color);
    applyAnimationSettings(settings.animations);
  }, [settings.accent_color, settings.animations]);

  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'auto', label: 'System', icon: Monitor }
  ];

  const accentColors = [
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'cyan', label: 'Cyan', color: 'bg-cyan-500' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' }
  ];

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <Alert className="border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            Appearance settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Theme Selection */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-green-400" />
            Theme & Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-3">
            <Label className="text-white">Theme Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={settings.theme === option.value ? "default" : "outline"}
                    onClick={() => handleSettingChange('theme', option.value)}
                    className={`flex items-center gap-2 h-12 ${
                      settings.theme === option.value 
                        ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <Label className="text-white">Accent Color</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {accentColors.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  onClick={() => handleSettingChange('accent_color', color.value)}
                  className={`flex items-center gap-2 h-12 border-gray-600 hover:bg-gray-700/50 ${
                    settings.accent_color === color.value ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${color.color}`} />
                  <span className="text-gray-300 hidden sm:inline">{color.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-green-400" />
            Display Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Animations */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Enable Animations
              </Label>
              <p className="text-sm text-gray-400">
                Show smooth transitions and floating effects
              </p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={(checked) => handleSettingChange('animations', checked)}
            />
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white">Compact Mode</Label>
              <p className="text-sm text-gray-400">
                Reduce spacing and padding for more content
              </p>
            </div>
            <Switch
              checked={settings.compact_mode}
              onCheckedChange={(checked) => handleSettingChange('compact_mode', checked)}
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-white">Language</Label>
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="text-white hover:bg-gray-700">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700/30 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-bold text-white">Sample Transaction</h3>
                <p className="text-sm text-gray-400">Coffee Shop • Today</p>
              </div>
              <div className="ml-auto text-green-400 font-bold">-$4.50</div>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-1/3 transition-all duration-300"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
