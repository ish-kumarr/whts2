"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchImportantMessages, fetchSimpleMessages } from "@/lib/api";
import { Link as LinkIcon, AlertCircle, MessageCircle, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MessagesPage() {
  const [importantMessages, setImportantMessages] = useState<any[]>([]);
  const [simpleMessages, setSimpleMessages] = useState<any[]>([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const [important, simple] = await Promise.all([
        fetchImportantMessages(),
        fetchSimpleMessages(),
      ]);
      setImportantMessages(important);
      setSimpleMessages(simple);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          {importantMessages.length} important, {simpleMessages.length} general messages
        </p>
      </div>

      <Tabs defaultValue="important" className="space-y-6">
        <TabsList className="h-12 p-1">
          <TabsTrigger value="important" className="gap-2">
            <Bell className="h-4 w-4" />
            Important Messages
          </TabsTrigger>
          <TabsTrigger value="simple" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            General Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="important" className="space-y-4">
          {importantMessages.map((message, index) => (
            <Card key={index} className="transform transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Important Message</CardTitle>
                  <p className="text-sm text-muted-foreground">From {message.from || 'System'}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{message.text}</p>
                {message.summary && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm">
                      <span className="font-medium">Summary:</span> {message.summary}
                    </p>
                  </div>
                )}
                {message.links && message.links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {message.links.map((link: string, i: number) => (
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
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="simple" className="space-y-4">
          {simpleMessages.map((message, index) => (
            <Card key={index} className="transform transition-all duration-200 hover:shadow-lg">
              <CardContent className="flex items-start gap-4 p-6">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {message.from?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{message.from || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{message.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}