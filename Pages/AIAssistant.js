
import React, { useState, useEffect, useRef } from "react";
import { Transaction, Budget } from "@/entities/all";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot,
  Loader2,
  TrendingUp,
  DollarSign,
  PieChart
} from "lucide-react";
import { useAppContext } from "@/components/AppContext";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI financial assistant. I can help you analyze your spending, create budgets, and provide personalized financial advice. What would you like to know about your finances?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const messagesEndRef = useRef(null);
  const { user } = useAppContext();

  useEffect(() => {
    loadFinancialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadFinancialData = async () => {
    try {
      const [transactionData, budgetData] = await Promise.all([
        Transaction.list("-date", 100),
        Budget.list("-created_date")
      ]);
      setTransactions(transactionData);
      setBudgets(budgetData);
    } catch (error) {
      console.error("Error loading financial data:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Prepare financial context
      const financialContext = {
        transactions: transactions.slice(0, 20), // Last 20 transactions
        budgets: budgets,
        summary: {
          total_transactions: transactions.length,
          monthly_expenses: transactions
            .filter(t => t.type === 'expense' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + t.amount, 0),
          monthly_income: transactions
            .filter(t => t.type === 'income' && new Date(t.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .reduce((sum, t) => sum + t.amount, 0)
        }
      };

      const prompt = `You are FinMate, an AI financial assistant. The user asked: "${inputMessage}"

Here's their financial data context:
${JSON.stringify(financialContext, null, 2)}

Please provide a helpful, personalized, and encouraging response. Include specific numbers and actionable advice when relevant.
IMPORTANT: Use the currency code '${user?.currency || 'USD'}' for all monetary values in your response.
Keep the response conversational and supportive. If the question is about spending analysis, budgeting, or financial planning, use their actual data to provide insights.

Respond in a warm, friendly tone as their personal financial coach.`;

      const response = await base44.integrations.Core.InvokeLLM({ prompt });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    {
      icon: TrendingUp,
      text: "How much did I spend this month?",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: PieChart,
      text: "What's my biggest expense category?",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      text: "How can I save more money?",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="h-screen flex flex-col p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Financial Assistant</h1>
            <p className="text-gray-400">Your personal finance coach powered by AI</p>
          </div>
        </div>
        
        {/* Quick Questions */}
        <div className="flex flex-wrap gap-3 mt-4">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question.text)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <question.icon className="w-4 h-4 mr-2" />
              {question.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'bg-gray-700/50 text-gray-100'
                  }`}>
                    {message.type === 'ai' && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Assistant
                      </Badge>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-700/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-700/50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your finances..."
                className="flex-1 bg-gray-700/50 border-gray-600 text-white"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
