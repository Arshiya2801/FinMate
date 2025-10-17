import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Star, Target, Zap } from "lucide-react";

export default function AchievementStats({ level, totalPoints, unlockedCount, totalCount, isLoading }) {
  const nextLevelPoints = level * 500;
  const currentLevelPoints = (level - 1) * 500;
  const progressToNextLevel = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {/* Level Card */}
      <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          {isLoading ? <Skeleton className="h-6 w-16 mx-auto bg-gray-700" /> : <p className="text-2xl font-bold text-yellow-400">Level {level}</p>}
          <p className="text-xs text-gray-400">Your current level</p>
        </CardContent>
      </Card>

      {/* Total Points */}
      <Card className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star className="w-6 h-6 text-white" />
          </div>
          {isLoading ? <Skeleton className="h-6 w-16 mx-auto bg-gray-700" /> : <p className="text-2xl font-bold text-emerald-400">{totalPoints}</p>}
          <p className="text-xs text-gray-400">Total points</p>
        </CardContent>
      </Card>

      {/* Achievements Unlocked */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6 text-white" />
          </div>
          {isLoading ? <Skeleton className="h-6 w-16 mx-auto bg-gray-700" /> : <p className="text-2xl font-bold text-purple-400">{unlockedCount}/{totalCount}</p>}
          <p className="text-xs text-gray-400">Unlocked</p>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="text-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {isLoading ? <Skeleton className="h-4 w-20 mx-auto bg-gray-700" /> : <p className="text-sm font-medium text-blue-400">Next Level</p>}
          </div>
          {isLoading ? <Skeleton className="h-2 w-full bg-gray-700" /> : 
          <>
            <Progress value={progressToNextLevel} className="h-2 bg-gray-700" indicatorClassName="bg-gradient-to-r from-blue-500 to-cyan-500" />
            <p className="text-xs text-gray-400 text-center mt-1">{Math.max(0, nextLevelPoints - totalPoints)} points to go</p>
          </>}
        </CardContent>
      </Card>
    </div>
  );
}