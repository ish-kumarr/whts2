"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchTasks, fetchNotes, fetchImportantMessages } from "@/lib/api";
import { analyzeTask, chatWithAI } from "@/lib/gemini";
import { 
  Bot,
  Brain,
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Timer,
  Calendar,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Link as LinkIcon,
  Tag,
  User,
  Mail,
  Send,
  Loader2,
  MessageCircle,
  Bell,
  ArrowRight,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactMarkdown from 'react-markdown';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function AIAnalysis({ task }: { task: any }) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      setLoading(true);
      const result = await analyzeTask(task);
      setAnalysis(result);
      setLoading(false);
    };
    getAnalysis();
  }, [task]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative">
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-75 blur animate-pulse" />
          <div className="relative bg-black rounded-lg p-4 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">AI is analyzing your task...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-75 blur-lg" />
      <div className="relative bg-black/40 backdrop-blur-xl rounded-lg p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function AIChat({ task }: { task: any }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Namaste! Main aapki task ke baare mein help karne ke liye here hoon. Kya puchna chahenge?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await chatWithAI(newMessages);
    setMessages([...newMessages, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-lg p-4">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[80%] px-4 py-2 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                } shadow-lg`}
              >
                <div className={`absolute top-0 ${
                  message.role === "user" ? "-right-2" : "-left-2"
                } w-2 h-2 ${
                  message.role === "user" ? "bg-primary" : "bg-muted"
                }`} />
                <ReactMarkdown className="prose-sm dark:prose-invert break-words">
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-2 shadow-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4">
        <div className="relative flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Apna question type karein..."
            className="flex-1 bg-black/40 backdrop-blur-xl border-white/10 focus:border-primary h-12 px-4 rounded-full"
          />
          <Button
            size="icon"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [timeTracking, setTimeTracking] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timeTracking');
      return saved ? JSON.parse(saved) : { isRunning: false, time: 0 };
    }
    return { isRunning: false, time: 0 };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, messagesData] = await Promise.all([
          fetchTasks(),
          fetchImportantMessages(),
        ]);
        setTasks(tasksData);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeTracking.isRunning) {
      interval = setInterval(() => {
        setTimeTracking(prev => {
          const newState = {
            ...prev,
            time: prev.time + 1
          };
          localStorage.setItem('timeTracking', JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeTracking.isRunning]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const urgentTasks = tasks.filter(task => task.priority === "Urgent" && !task.completed);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  const days = getDaysInMonth();

  return (
    <div className="min-h-screen bg-black">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center relative">
              <Bot className="h-8 w-8 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {getGreeting()}, <span className="text-primary">Ish</span>
              </h1>
              <p className="text-gray-400 mt-1">
                I've analyzed your WhatsApp messages and organized your tasks
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </motion.div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages Analyzed</CardTitle>
                <Brain className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{messages.length}</div>
                <Progress value={(messages.length / 100) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  From your WhatsApp chats
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Task Progress</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{completedTasks}/{tasks.length}</div>
                <Progress value={(completedTasks / tasks.length) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  Tasks completed today
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Urgent Tasks</CardTitle>
                <AlertCircle className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{urgentTasks.length}</div>
                <Progress value={(urgentTasks.length / tasks.length) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Focus Timer</CardTitle>
                <Timer className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono text-white">{formatTime(timeTracking.time)}</div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={timeTracking.isRunning ? "destructive" : "secondary"}
                    onClick={() => setTimeTracking(prev => {
                      const newState = { ...prev, isRunning: !prev.isRunning };
                      localStorage.setItem('timeTracking', JSON.stringify(newState));
                      return newState;
                    })}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    {timeTracking.isRunning ? "Stop" : "Start"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const newState = { time: 0, isRunning: false };
                      localStorage.setItem('timeTracking', JSON.stringify(newState));
                      setTimeTracking(newState);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold text-white">Priority Tasks</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  <div className="space-y-4">
                    {urgentTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        <Card 
                          className={`border-none shadow-lg backdrop-blur-lg transition-all cursor-pointer ${
                            task.priority.toLowerCase() === 'urgent' 
                              ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 hover:from-red-500/30 hover:to-red-600/20' 
                              : 'bg-gradient-to-br from-black/40 to-black/20 hover:from-black/60 hover:to-black/40'
                          }`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-white">{task.task}</h3>
                                  <Badge className={`${getPriorityBadgeColor(task.priority)}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/60">From {task.from}</p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    Send Message
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{task.deadline}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{task.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Tag className="h-4 w-4" />
                                <span>{task.category}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold text-white">Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                    className="text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-white font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                    className="text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-400 py-1">
                      {day}
                    </div>
                  ))}
                  {days.map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    return (
                      <HoverCard key={day.toString()}>
                        <HoverCardTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`h-10 relative ${
                              isToday(day) ? 'bg-primary/20' : 
                              dayTasks.length > 0 ? 'bg-white/5' : ''
                            } hover:bg-white/10`}
                            onClick={() => {
                              if (dayTasks.length > 0) {
                                setSelectedTask(dayTasks[0]);
                              }
                            }}
                          >
                            <span className={`text-sm ${isToday(day) ? 'text-primary' : 'text-white'}`}>
                              {format(day, 'd')}
                            </span>
                            {dayTasks.length > 0 && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                {dayTasks.slice(0, 3).map((_, i) => (
                                  <div
                                    key={i}
                                    className="h-1 w-1 rounded-full bg-primary"
                                  />
                                ))}
                              </div>
                            )}
                          </Button>
                        </HoverCardTrigger>
                        {dayTasks.length > 0 && (
                          <HoverCardContent className="w-64">
                            <div className="space-y-2">
                              {dayTasks.map((task, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full bg-${getPriorityColor(task.priority)}`} />
                                  <span className="text-sm">{task.task}</span>
                                </div>
                              ))}
                            </div>
                          </HoverCardContent>
                        )}
                      </HoverCard>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[900px] h-[85vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl flex items-center gap-2">
                <span>Task Details</span>
                <Badge className={`${getPriorityBadgeColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="flex h-[calc(85vh-80px)] gap-6 p-6 pt-2">
              <div className="flex-1 overflow-y-auto pr-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{selectedTask.task}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>From {selectedTask.from}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                    <p className="text-muted-foreground">{selectedTask.deadline}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      <span>Due Time</span>
                    </div>
                    <p className="text-muted-foreground">{selectedTask.time}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Tag className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                    <p className="text-muted-foreground">{selectedTask.category}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat Type</span>
                    </div>
                    <p className="text-muted-foreground">
                      {selectedTask.isGroup ? 'Group Chat' : 'Direct Message'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    <span>Original Message</span>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedTask.snippet}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{selectedTask.reminded ? 'Reminder sent' : 'No reminder sent'}</span>
                  </div>
                  <span>Created {formatDistanceToNow(new Date(selectedTask.timestamp))} ago</span>
                </div>

                {selectedTask.links && selectedTask.links.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <LinkIcon className="h-4 w-4" />
                      <span>Related Links</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask.links.map((link: string, i: number) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                          <span>Link {i + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-[400px] border-l pl-6">
                <Tabs defaultValue="analysis" className="h-full flex flex-col">
                  <TabsList className="w-full">
                    <TabsTrigger value="analysis" className="flex-1 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Analysis
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="analysis" className="flex-1 mt-6 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                      <AIAnalysis task={selectedTask} />
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="chat" className="flex-1 mt-6 flex flex-col overflow-hidden">
                    <AIChat task={selectedTask} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
