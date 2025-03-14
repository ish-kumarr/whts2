"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HomeIcon, 
  ListTodoIcon, 
  StickyNoteIcon, 
  InboxIcon,
  LayoutDashboardIcon,
  CalendarIcon,
  TagIcon,
  Settings2Icon,
  HelpCircleIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    href: "/dashboard",
    color: "text-violet-500",
  },
  {
    label: "Tasks",
    icon: ListTodoIcon,
    href: "/tasks",
    color: "text-blue-500",
  },
  {
    label: "Calendar",
    icon: CalendarIcon,
    href: "/calendar",
    color: "text-emerald-500",
  },
  {
    label: "Notes",
    icon: StickyNoteIcon,
    href: "/notes",
    color: "text-amber-500",
  },
  {
    label: "Messages",
    icon: InboxIcon,
    href: "/messages",
    color: "text-rose-500",
  },
  {
    label: "Categories",
    icon: TagIcon,
    href: "/categories",
    color: "text-indigo-500",
  },
];

const bottomRoutes = [
  {
    label: "Settings",
    icon: Settings2Icon,
    href: "/settings",
    color: "text-gray-500",
  },
  {
    label: "Help",
    icon: HelpCircleIcon,
    href: "/help",
    color: "text-gray-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <HomeIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link href={route.href} key={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2 relative", {
                  "bg-secondary": pathname === route.href,
                })}
              >
                {pathname === route.href && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-full bg-primary rounded-r-full"
                  />
                )}
                <route.icon className={cn("h-4 w-4", route.color)} />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="space-y-2">
          {bottomRoutes.map((route) => (
            <Link href={route.href} key={route.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}