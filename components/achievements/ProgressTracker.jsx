import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Clock } from "lucide-react";

export default function ProgressTracker({ achievements, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-gray-700" />
        ))}
      </div>
    );
  }

  const sortedAchievements = achievements.sort((a, b) => b.progress - a.progress);

  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Work in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedAchievements.length > 0 ? (
          sortedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-gray-700/30 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-600/50 rounded-xl flex items-center justify-center text-xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-cyan-400">{achievement.points} points</p>
                  <p className="text-xs text-gray-500">{Math.round(achievement.progress)}% complete</p>
                </div>
              </div>
              <Progress 
                value={achievement.progress} 
                className="h-2 bg-gray-700" 
                indicatorClassName="bg-gradient-to-r from-cyan-500 to-blue-500"
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No achievements in progress</p>
            <p className="text-sm">All available achievements have been unlocked!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}