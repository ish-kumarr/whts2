"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Plus, Bot } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { fetchTasks } from "@/lib/api";

export function Navbar() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        const recentTasks = data
          .filter((task: any) => !task.read)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setTasks(recentTasks);
        setUnreadCount(recentTasks.length);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
    const interval = setInterval(loadTasks, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="border-b bg-black/40 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">WhatsAssist</span>
          </div>
          <div className="relative w-96 ml-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages and tasks..." 
              className="pl-10 bg-black/20 border-white/10 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Recent Tasks</p>
                  <p className="text-xs text-muted-foreground">
                    Your latest WhatsApp tasks
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto">
                {tasks.map((task, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start gap-1 p-4">
                    <div className="flex items-center gap-2 w-full">
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                      <div className="font-medium flex-1">{task.task}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(task.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Due: {task.deadline} at {task.time}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
