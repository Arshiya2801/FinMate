import React, { createContext, useState, useEffect, useContext } from 'react';
import { base44 } from '@/api/base44Client';
import { Skeleton } from "@/components/ui/skeleton";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  const value = { user, isLoading, refetchUser: fetchUser };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 bg-gray-900 min-h-screen">
          <Skeleton className="h-12 w-1/4 bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-700" />
          <div className="grid grid-cols-4 gap-6 pt-4">
              <Skeleton className="h-24 bg-gray-700" />
              <Skeleton className="h-24 bg-gray-700" />
              <Skeleton className="h-24 bg-gray-700" />
              <Skeleton className="h-24 bg-gray-700" />
          </div>
           <div className="grid lg:grid-cols-2 gap-8 pt-4">
              <Skeleton className="h-64 bg-gray-700" />
              <Skeleton className="h-64 bg-gray-700" />
          </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};