import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AchievementCard({ achievement }) {
  const { title, description, points, icon, progress, unlocked } = achievement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
        unlocked 
          ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30 shadow-emerald-500/20 shadow-lg' 
          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
      }`}>
        <CardContent className="p-6 text-center space-y-4">
          {/* Icon and Status */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto ${
              unlocked 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg' 
                : 'bg-gray-700/50'
            }`}>
              {unlocked ? (
                <span className="filter drop-shadow-lg">{icon}</span>
              ) : (
                <Lock className="w-8 h-8 text-gray-500" />
              )}
            </div>
            
            {unlocked && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className={`text-lg font-bold ${unlocked ? 'text-emerald-400' : 'text-gray-300'}`}>
              {title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Points Badge */}
          <Badge className={`${
            unlocked 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-gray-600/20 text-gray-400 border-gray-600/30'
          }`}>
            {points} points
          </Badge>

          {/* Progress Bar (for incomplete achievements) */}
          {!unlocked && (
            <div className="space-y-2">
              <Progress 
                value={progress} 
                className="h-2 bg-gray-700" 
                indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-500"
              />
              <p className="text-xs text-gray-400">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}

          {/* Unlocked Status */}
          {unlocked && (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Unlocked!</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}