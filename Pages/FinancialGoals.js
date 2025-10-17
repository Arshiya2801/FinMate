
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppContext } from "@/components/AppContext";
import { base44 } from "@/api/base44Client";
import { formatCurrency } from "@/components/lib/currency";
import {
  Target,
  Plus,
  TrendingUp,
  Home,
  Car,
  GraduationCap,
  Plane,
  Edit3,
  Trash2,
  CheckCircle,
  PiggyBank
} from "lucide-react";

export default function FinancialGoalsPage() {
  const { user, refetchUser } = useAppContext();
  const [goals, setGoals] = useState(user?.financial_goals || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: '',
    priority: 'medium'
  });
  const [actionSuccess, setActionSuccess] = useState('');

  const onUserUpdate = async (updatedData) => {
    try {
      await base44.auth.updateMe(updatedData);
      await refetchUser();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const goalCategories = [
    { value: 'savings', label: 'Emergency Fund', icon: Target },
    { value: 'house', label: 'House/Real Estate', icon: Home },
    { value: 'car', label: 'Vehicle', icon: Car },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'travel', label: 'Travel', icon: Plane },
    { value: 'other', label: 'Other', icon: Target }
  ];

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'savings': return '💰';
      case 'house': return '🏠';
      case 'car': return '🚗';
      case 'education': return '🎓';
      case 'travel': return '✈️';
      default: return '🎯';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.title && newGoal.target_amount && newGoal.target_date && newGoal.category) {
      const goalData = {
        id: editingGoal ? editingGoal.id : Date.now(),
        ...newGoal,
        target_amount: parseFloat(newGoal.target_amount),
        current_amount: parseFloat(newGoal.current_amount) || 0
      };

      let updatedGoals;
      if (editingGoal) {
        updatedGoals = goals.map(g => g.id === editingGoal.id ? goalData : g);
        setActionSuccess('Goal updated successfully!');
      } else {
        updatedGoals = [...goals, goalData];
        setActionSuccess('Goal created successfully!');
      }
      setGoals(updatedGoals);

      try {
        await onUserUpdate({ financial_goals: updatedGoals });
      } catch (error) {
        console.error('Error saving goals:', error);
      }

      setNewGoal({ title: '', target_amount: '', current_amount: '', target_date: '', category: '', priority: 'medium' });
      setShowAddForm(false);
      setEditingGoal(null);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      target_amount: goal.target_amount.toString(),
      current_amount: goal.current_amount.toString(),
      target_date: goal.target_date,
      category: goal.category,
      priority: goal.priority
    });
    setShowAddForm(true);
  };

  const handleDeleteGoal = async (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    setActionSuccess('Goal deleted successfully!');

    try {
      await onUserUpdate({ financial_goals: updatedGoals });
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleUpdateProgress = async (goalId, newAmount) => {
    const updatedGoals = goals.map(g =>
      g.id === goalId ? { ...g, current_amount: parseFloat(newAmount) } : g
    );
    setGoals(updatedGoals);

    try {
      await onUserUpdate({ financial_goals: updatedGoals });
      setActionSuccess('Progress updated!');
      setTimeout(() => setActionSuccess(''), 2000);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const currency = user?.currency || 'USD';
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + (goal.target_amount || 0), 0);

  return (
    <div className="p-4 lg:p-8 space-y-8">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
              <p className="text-gray-400">Plan and track your savings for a brighter future</p>
            </div>
        </div>

        {actionSuccess && (
            <Alert className="border-green-500/30 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">{actionSuccess}</AlertDescription>
            </Alert>
        )}

        <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-sm">
            <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                Goals Overview
            </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{goals.length}</p>
                <p className="text-sm text-gray-400">Active Goals</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                {formatCurrency(totalSaved, currency)}
                </p>
                <p className="text-sm text-gray-400">Total Saved</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                {formatCurrency(totalTarget, currency)}
                </p>
                <p className="text-sm text-gray-400">Total Target</p>
            </div>
            </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Your Financial Goals</CardTitle>
            <Button
                onClick={() => {
                setEditingGoal(null);
                setNewGoal({ title: '', target_amount: '', current_amount: '', target_date: '', category: '', priority: 'medium' });
                setShowAddForm(!showAddForm);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black"
            >
                <Plus className="w-4 h-4 mr-2" />
                {showAddForm ? 'Cancel' : 'Add Goal'}
            </Button>
            </CardHeader>
            <CardContent className="space-y-4">
            {showAddForm && (
                <div className="bg-gray-700/30 p-4 rounded-xl space-y-4">
                <h4 className="font-medium text-white">{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label className="text-white">Goal Title</Label>
                    <Input
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Emergency Fund"
                        className="bg-gray-600/50 border-gray-500 text-white"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white">Target Amount</Label>
                    <Input
                        type="number"
                        value={newGoal.target_amount}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target_amount: e.target.value }))}
                        placeholder="10000"
                        className="bg-gray-600/50 border-gray-500 text-white"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white">Current Saved Amount</Label>
                    <Input
                        type="number"
                        value={newGoal.current_amount}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, current_amount: e.target.value }))}
                        placeholder="0"
                        className="bg-gray-600/50 border-gray-500 text-white"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white">Target Date</Label>
                    <Input
                        type="date"
                        value={newGoal.target_date}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                        className="bg-gray-600/50 border-gray-500 text-white"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white">Category</Label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="bg-gray-600/50 border-gray-500 text-white">
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                        {goalCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                            {category.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="space-y-2">
                    <Label className="text-white">Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="bg-gray-600/50 border-gray-500 text-white">
                        <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                        <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button onClick={handleAddGoal} className="bg-emerald-600 hover:bg-emerald-700">
                    {editingGoal ? 'Save Changes' : 'Create Goal'}
                    </Button>
                    <Button variant="outline" onClick={() => {
                    setShowAddForm(false);
                    setEditingGoal(null);
                    setNewGoal({ title: '', target_amount: '', current_amount: '', target_date: '', category: '', priority: 'medium' });
                    }} className="border-gray-600 text-gray-300">
                    Cancel
                    </Button>
                </div>
                </div>
            )}
            <div className="space-y-4">
                {goals.map((goal) => {
                const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                const remaining = (goal.target_amount || 0) - (goal.current_amount || 0);
                
                return (
                    <div key={goal.id} className="bg-gray-700/30 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-600/50 rounded-xl flex items-center justify-center text-xl">
                            {getCategoryEmoji(goal.category)}
                        </div>
                        <div>
                            <h4 className="font-medium text-white">{goal.title}</h4>
                            <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(goal.priority)}>
                                {goal.priority} priority
                            </Badge>
                            <span className="text-sm text-gray-400">
                                Due: {new Date(goal.target_date).toLocaleDateString()}
                            </span>
                            </div>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="text-xl font-bold text-green-400">
                            {formatCurrency(goal.current_amount, currency)}
                        </p>
                        <p className="text-sm text-gray-400">
                            of {formatCurrency(goal.target_amount, currency)}
                        </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{progress.toFixed(1)}% complete</span>
                        <span className="text-gray-400">{formatCurrency(remaining, currency)} remaining</span>
                        </div>
                        <Progress
                        value={progress}
                        className="h-2 bg-gray-600"
                        indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                        />
                    </div>

                    <div className="mt-3 p-3 bg-gray-600/30 rounded-lg">
                        <Label className="text-white text-sm">Update Progress</Label>
                        <div className="flex gap-2 mt-2">
                        <Input
                            type="number"
                            placeholder="Current amount"
                            value={goal.current_amount}
                            onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                            className="bg-gray-700/50 border-gray-600 text-white text-sm h-8"
                        />
                        <Button
                            size="sm"
                            onClick={() => handleUpdateProgress(goal.id, goal.current_amount + 100)}
                            className="bg-green-600 hover:bg-green-700 text-white h-8"
                        >
                            +$100
                        </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>On track to reach by {new Date(goal.target_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                            onClick={() => handleEditGoal(goal)}
                        >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="border-red-500/50 text-red-400"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                        </Button>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            </CardContent>
        </Card>
    </div>
  );
}
