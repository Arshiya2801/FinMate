
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  BarChart3,
  MessageSquare,
  Scissors,
  Settings,
  Menu,
  X,
  DollarSign,
  Building2,
  Users,
  Shield,
  FileText,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppProvider, useAppContext } from "@/components/AppContext";

const personalNavItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Expenses", url: createPageUrl("Transactions"), icon: Receipt },
  { title: "Budgets", url: createPageUrl("Budgets"), icon: PiggyBank },
  { title: "Financial Goals", url: createPageUrl("FinancialGoals"), icon: Target },
  { title: "Reports", url: createPageUrl("Reports"), icon: BarChart3 },
  { title: "Split Bills", url: createPageUrl("SplitBills"), icon: Scissors },
  { title: "AI Coach", url: createPageUrl("AIAssistant"), icon: MessageSquare },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
];

const businessNavItems = [
  { title: "Dashboard", url: createPageUrl("BusinessDashboard"), icon: LayoutDashboard },
  { title: "Transactions", url: createPageUrl("BusinessExpenses"), icon: Receipt },
  { title: "Reports", url: createPageUrl("BusinessReports"), icon: BarChart3 },
  { title: "KPIs", url: createPageUrl("BusinessKPIs"), icon: Target },
  { title: "Team", url: createPageUrl("TeamManagement"), icon: Users },
  { title: "Compliance", url: createPageUrl("Compliance"), icon: Shield },
  { title: "Settings", url: createPageUrl("Settings"), icon: Settings },
];

const LandingPageLayout = ({ children }) => (
  <div className="min-h-screen bg-black text-white">{children}</div>
);

const AppLayout = ({ children, currentPageName }) => {
  const { user } = useAppContext(); // Added useAppContext hook
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isBusinessPage = currentPageName.startsWith("Business") || ["TeamManagement", "Compliance"].includes(currentPageName);

  const navItems = isBusinessPage ? businessNavItems : personalNavItems;
  const dashboardType = isBusinessPage ? "Business" : "Personal";
  const iconColor = isBusinessPage ? "from-blue-500 to-cyan-500" : "from-green-500 to-emerald-500";
  const switchButtonClass = isBusinessPage
    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
    : "border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20";


  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative flex min-h-screen">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out flex flex-col
        `}>
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-800">
            <div className={`w-10 h-10 bg-gradient-to-r ${iconColor} rounded-xl flex items-center justify-center shadow-lg`}>
              {isBusinessPage ? (
                <Building2 className="w-6 h-6 text-white" />
              ) : (
                <DollarSign className="w-6 h-6 text-black" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                FinMate
              </h1>
              <p className="text-xs text-gray-400">{dashboardType}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                // More robust active check
                const isActive = item.title === 'Dashboard'
                  ? location.pathname === item.url
                  : location.pathname.startsWith(item.url) && item.url !== createPageUrl('Dashboard');

                const isBusinessActive = isBusinessPage && isActive;
                const isPersonalActive = !isBusinessPage && isActive;

                return (
                  <Link key={item.title} to={item.url} onClick={() => setSidebarOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${(isBusinessActive ? 'bg-blue-500 text-white font-bold shadow-md' : isPersonalActive ? 'bg-green-500 text-black font-bold shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-800')}
                    `}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Dashboard Switch */}
          <div className="p-4 border-t border-gray-800">
            <Link to={createPageUrl(isBusinessPage ? "Dashboard" : "BusinessDashboard")}>
              <Button
                variant="outline"
                className={`w-full ${switchButtonClass}`}
              >
                {isBusinessPage ? (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Switch to Personal
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4 mr-2" />
                    Switch to Business
                  </>
                )}
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Mobile header */}
          <header className="lg:hidden bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30 px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
                  {isBusinessPage ? (
                    <Building2 className="w-4 h-4 text-white" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-black" />
                  )}
                </div>
                <div>
                  <span className="font-bold text-white">FinMate</span>
                  <span className="text-xs text-gray-400 ml-1">{dashboardType}</span>
                </div>
              </div>
              <div className="w-10"></div>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-900 text-white">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  if (currentPageName === "Home") {
    return <LandingPageLayout>{children}</LandingPageLayout>;
  }
  return (
    <AppProvider>
      <AppLayout currentPageName={currentPageName}>{children}</AppLayout>
    </AppProvider>
  );
}
