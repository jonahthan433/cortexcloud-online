'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Send, 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  User,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CommunicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const stats = {
    emailsSent: 156,
    whatsappMessages: 89,
    slackMessages: 34,
    callsMade: 23
  };

  const threads = [
    {
      id: '1',
      contact: 'John Smith',
      lastMessage: 'Thanks for the information!',
      time: '2 min ago',
      platform: 'Email',
      status: 'unread',
      avatar: 'JS'
    },
    {
      id: '2',
      contact: 'Sarah Johnson',
      lastMessage: 'When can we schedule a call?',
      time: '1 hour ago',
      platform: 'WhatsApp',
      status: 'read',
      avatar: 'SJ'
    },
    {
      id: '3',
      contact: 'Mike Davis',
      lastMessage: 'Looking forward to our meeting',
      time: '3 hours ago',
      platform: 'Email',
      status: 'read',
      avatar: 'MD'
    }
  ];

  const handleSendMessage = () => {
    if (!selectedThread || !messageText.trim()) return;
    
    toast.success('Message sent successfully');
    setMessageText('');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'unread' 
      ? <AlertCircle className="h-4 w-4 text-blue-500" />
      : <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
          <p className="text-muted-foreground">Manage all your communications in one place</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.emailsSent}</div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.whatsappMessages}</div>
            <div className="text-sm text-muted-foreground">WhatsApp Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.slackMessages}</div>
            <div className="text-sm text-muted-foreground">Slack Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.callsMade}</div>
            <div className="text-sm text-muted-foreground">Calls Made</div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Integration */}
      <Card className="border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-green-500" />
            <span>WhatsApp Business Integration</span>
            <Badge className="bg-green-100 text-green-800">
              <Smartphone className="mr-1 h-3 w-3" />
              Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">89</div>
                    <div className="text-sm text-green-700">Messages Sent</div>
                  </div>
                </div>
                <div className="text-xs text-green-600">+23% this week</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">45</div>
                    <div className="text-sm text-green-700">Active Chats</div>
                  </div>
                </div>
                <div className="text-xs text-green-600">95% response rate</div>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center space-x-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">12min</div>
                    <div className="text-sm text-green-700">Avg Response</div>
                  </div>
                </div>
                <div className="text-xs text-green-600">Fast response</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">All Platforms</Button>
            <Button variant="outline">Unread Only</Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`cursor-pointer rounded-lg p-3 transition-colors ${
                    thread.status === 'unread' 
                      ? 'border border-primary/20 bg-primary/10' 
                      : selectedThread === thread.id
                      ? 'border border-primary/20 bg-primary/5'
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">{thread.avatar}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium">
                          {thread.contact}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getPlatformIcon(thread.platform)}
                          {getStatusIcon(thread.status)}
                        </div>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {thread.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {thread.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-24rem)]">
            <CardHeader>
              {selectedThread ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {threads.find(t => t.id === selectedThread)?.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {threads.find(t => t.id === selectedThread)?.contact}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {threads.find(t => t.id === selectedThread)?.platform}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {/* Messages Area */}
              <div className="mb-4 flex-1 rounded-lg bg-muted/20 p-4">
                {selectedThread ? (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <MessageSquare className="mb-4 h-12 w-12" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation</p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Select a conversation
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={selectedThread ? 'Type your message...' : 'Select a conversation to start chatting'}
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={!selectedThread}
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage} 
                  disabled={!messageText.trim() || !selectedThread}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


