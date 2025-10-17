
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { DollarSign, BarChart, Users, FileText, CheckSquare, Sparkles, Scissors, PiggyBank } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">FinMate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="ghost" className="text-white hover:bg-gray-800">For Individuals</Button>
            </Link>
             <Link to={createPageUrl("BusinessDashboard")}>
              <Button className="bg-green-500 text-black hover:bg-green-600">For Businesses</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Unified Finance Control for
              <br />
              <span className="text-green-500">Personal & Business</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              One platform to manage your individual wealth and drive your business forward. AI-powered insights, seamless experience.
            </p>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="grid md:grid-cols-2 gap-8"
          >
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">For Individuals</h2>
              <p className="text-gray-400 mb-6">Master your personal finances with smart budgets, bill splitting, and an AI coach.</p>
              <img src="https://i.imgur.com/uGmr2cK.png" alt="Personal Dashboard Preview" className="rounded-lg mb-6 shadow-2xl shadow-green-500/10"/>
              <Link to={createPageUrl("Dashboard")}>
                <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black w-full">
                  Go to Personal Dashboard
                </Button>
              </Link>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl text-center flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-4">For Businesses</h2>
              <p className="text-gray-400 mb-6">Track KPIs, manage team expenses, and automate reporting to scale your company.</p>
              <img src="https://i.imgur.com/8QoAaw5.png" alt="Business Dashboard Preview" className="rounded-lg mb-6 shadow-2xl shadow-green-500/10"/>
              <Link to={createPageUrl("BusinessDashboard")}>
                <Button size="lg" className="bg-green-500 text-black hover:bg-green-600 w-full">
                  Go to Business Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Powerful Features for Everyone</h2>
              <p className="text-lg text-gray-400">Tools designed for clarity and growth.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
               <FeatureCard icon={<Sparkles className="w-6 h-6 text-green-500"/>} title="AI-Powered Insights" description="Let our AI analyze your spending and find savings opportunities you missed." delay={0.1}/>
               <FeatureCard icon={<FileText className="w-6 h-6 text-green-500"/>} title="Automated Reports" description="Generate beautiful, easy-to-read financial reports for personal or business use in seconds." delay={0.2}/>
               <FeatureCard icon={<DollarSign className="w-6 h-6 text-green-500"/>} title="Seamless Expense Tracking" description="Use our AI receipt scanner to log expenses instantly from any dashboard." delay={0.3}/>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-center mb-8">For Personal Use</h3>
                <div className="space-y-8">
                  <FeatureCard icon={<Scissors className="w-6 h-6 text-green-500"/>} title="Intuitive Bill Splitting" description="Easily split bills with friends and family. Track who paid and who owes what, hassle-free." delay={0.4}/>
                  <FeatureCard icon={<PiggyBank className="w-6 h-6 text-green-500"/>} title="Smart Budgeting" description="Create and manage budgets that work for you. Get alerts before you overspend." delay={0.5}/>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-center mb-8">For Businesses</h3>
                <div className="space-y-8">
                  <FeatureCard icon={<CheckSquare className="w-6 h-6 text-green-500"/>} title="Compliance Tracking" description="Never miss a deadline. Get automated reminders for GST returns and other compliance tasks." delay={0.4}/>
                  <FeatureCard icon={<Users className="w-6 h-6 text-green-500"/>} title="Team Management" description="Onboard team members, set spending limits, and control access to financial data with ease." delay={0.5}/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} FinMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
