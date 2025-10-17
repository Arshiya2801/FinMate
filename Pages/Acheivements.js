import React, { useState, useEffect } from "react";
import { Achievement, Transaction, Budget, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, Zap } from "lucide-react";

import AchievementStats from "../components/achievements/AchievementStats";
import AchievementGrid from "../components/achievements/AchievementGrid";
import ProgressTracker from "../components/achievements/ProgressTracker";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    loadAchievementData();
  }, []);

  const loadAchievementData = async () => {
    try {
      setIsLoading(true);
      const [achievementData, transactionData, budgetData] = await Promise.all([
        Achievement.list("-unlocked_date"),
        Transaction.list("-date", 100),
        Budget.list("-created_date")
      ]);

      setAchievements(achievementData);
      setTransactions(transactionData);
      setBudgets(budgetData);

      // Calculate total points and level
      const points = achievementData.reduce((sum, a) => sum + (a.points || 0), 0);
      setTotalPoints(points);
      setUserLevel(Math.floor(points / 500) + 1); // 500 points per level
    } catch (error) {
      console.error("Error loading achievement data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Define all possible achievements with progress tracking
  const allAchievements = [
    {
      id: 'first_transaction',
      title: 'First Steps',
      description: 'Add your first transaction',
      badge_type: 'smart_spender',
      points: 50,
      category: 'getting_started',
      icon: '🎯',
      progress: Math.min(100, (transactions.length > 0 ? 100 : 0)),
      unlocked: achievements.some(a => a.badge_type === 'smart_spender')
    },
    {
      id: 'transaction_master',
      title: 'Transaction Master',
      description: 'Add 50 transactions',
      badge_type: 'smart_spender',
      points: 200,
      category: 'tracking',
      icon: '📊',
      progress: Math.min(100, (transactions.length / 50) * 100),
      unlocked: transactions.length >= 50
    },
    {
      id: 'budget_creator',
      title: 'Budget Planner',
      description: 'Create your first budget',
      badge_type: 'budget_master',
      points: 100,
      category: 'budgeting',
      icon: '💰',
      progress: Math.min(100, (budgets.length > 0 ? 100 : 0)),
      unlocked: achievements.some(a => a.badge_type === 'budget_master')
    },
    {
      id: 'budget_master',
      title: 'Budget Master',
      description: 'Create budgets for 5 categories',
      badge_type: 'budget_master',
      points: 300,
      category: 'budgeting',
      icon: '🏆',
      progress: Math.min(100, (budgets.length / 5) * 100),
      unlocked: budgets.length >= 5
    },
    {
      id: 'ai_explorer',
      title: 'AI Explorer',
      description: 'Use AI to categorize transactions',
      badge_type: 'ai_explorer',
      points: 75,
      category: 'ai',
      icon: '🤖',
      progress: Math.min(100, transactions.filter(t => t.ai_categorized).length > 0 ? 100 : 0),
      unlocked: achievements.some(a => a.badge_type === 'ai_explorer')
    },
    {
      id: 'streak_week',
      title: 'Weekly Tracker',
      description: 'Track expenses for 7 consecutive days',
      badge_type: 'savings_streak',
      points: 150,
      category: 'habits',
      icon: '🔥',
      progress: 60, // Mock progress - would need real streak calculation
      unlocked: false
    },
    {
      id: 'savings_goal',
      title: 'Savings Champion',
      description: 'Save $1000 in a month',
      badge_type: 'goal_crusher',
      points: 500,
      category: 'savings',
      icon: '💎',
      progress: 25, // Mock progress
      unlocked: false
    },
    {
      id: 'expense_category',
      title: 'Category Expert',
      description: 'Track expenses in 8 different categories',
      badge_type: 'smart_spender',
      points: 250,
      category: 'tracking',
      icon: '📋',
      progress: Math.min(100, (new Set(transactions.map(t => t.category)).size / 8) * 100),
      unlocked: new Set(transactions.map(t => t.category)).size >= 8
    }
  ];

  const filteredAchievements = allAchievements.filter(achievement => 
    activeCategory === "all" || achievement.category === activeCategory
  );

  const categories = [
    { id: "all", label: "All", icon: Trophy },
    { id: "getting_started", label: "Getting Started", icon: Star },
    { id: "tracking", label: "Tracking", icon: Target },
    { id: "budgeting", label: "Budgeting", icon: Target },
    { id: "ai", label: "AI Features", icon: Zap },
    { id: "habits", label: "Habits", icon: Trophy },
    { id: "savings", label: "Savings", icon: Trophy }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
            <p className="text-gray-400">Level up your financial journey</p>
          </div>
        </div>
        
        {/* User Stats */}
        <AchievementStats 
          level={userLevel}
          totalPoints={totalPoints}
          unlockedCount={allAchievements.filter(a => a.unlocked).length}
          totalCount={allAchievements.length}
          isLoading={isLoading}
        />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 max-w-md mx-auto">
          <TabsTrigger value="achievements" className="text-white">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-white">
            <Target className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Category Filter */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => {
                  const CategoryIcon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Grid */}
          <AchievementGrid 
            achievements={filteredAchievements}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <ProgressTracker 
            achievements={allAchievements.filter(a => !a.unlocked)}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}