import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { communicationsService } from "@/services/communicationsService";
import type { MessageThread, Message, CommunicationStats } from "@/services/communicationsService";
import { 
  Send, 
  Plus, 
  Search, 
  Mail, 
  MessageSquare, 
  Phone,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Smartphone,
  Download
} from "lucide-react";
import { FeatureGate } from "./FeatureGate";

export const CommunicationsTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<CommunicationStats>({
    emailsSent: 0,
    whatsappMessages: 0,
    slackMessages: 0,
    callsMade: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [threadsData, statsData] = await Promise.all([
          communicationsService.getMessageThreads(),
          communicationsService.getCommunicationStats()
        ]);
        
        setThreads(threadsData);
        setStats(statsData);
        
        // Select first thread if exists
        if (threadsData.length > 0) {
          setSelectedThread(threadsData[0].id);
          const messages = await communicationsService.getMessages(threadsData[0].id);
          setMessages(messages);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load communications data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load messages when thread is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedThread) return;

      setIsLoading(true);
      try {
        const messages = await communicationsService.getMessages(selectedThread);
        setMessages(messages);
        await communicationsService.markThreadAsRead(selectedThread);
        
        // Update thread status to read
        setThreads(prev => prev.map(thread =>
          thread.id === selectedThread
            ? { ...thread, status: 'read' }
            : thread
        ));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedThread]);

  const handleNewMessage = () => {
    toast({
      title: "New Message",
      description: "Opening message composer...",
    });
  };

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedThread || !messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      const newMessage = await communicationsService.sendMessage(selectedThread, messageText);
      setMessages(prev => [...prev, newMessage]);
      setMessageText("");
      
      // Update the thread's last message
      setThreads(prev => prev.map(thread => 
        thread.id === selectedThread
          ? { ...thread, lastMessage: messageText, time: 'Just now' }
          : thread
      ));

      toast({
        title: "Message Sent",
        description: `Message sent to ${threads.find(t => t.id === selectedThread)?.contact}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCallAction = (action: string, contactName: string) => {
    toast({
      title: `${action} ${contactName}`,
      description: `Initiating ${action.toLowerCase()}...`,
    });
  };

  const filteredThreads = threads.filter(thread =>
    thread.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'Slack':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Communications Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">All-In-One Conversations</h2>
          <p className="text-muted-foreground">Manage all your communications in one place</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleNewMessage}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.emailsSent}</div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.whatsappMessages}</div>
            <div className="text-sm text-muted-foreground">WhatsApp Messages</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.slackMessages}</div>
            <div className="text-sm text-muted-foreground">Slack Messages</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.callsMade}</div>
            <div className="text-sm text-muted-foreground">Calls Made</div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Integration */}
      <FeatureGate 
        feature="WhatsApp Business Integration"
        requiredPlan="elevate"
        upgradeMessage="Connect WhatsApp Business API for direct customer messaging with advanced automation capabilities."
      >
        <Card className="glass-effect border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-green-500" />
              <span>WhatsApp Business Integration</span>
              <Badge className="bg-green-100 text-green-800">
                <Smartphone className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="col-span-1 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
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
                
                <Card className="col-span-1 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
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
                
                <Card className="col-span-1 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
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
              
              <div className="space-y-4">
                <h4 className="font-medium">WhatsApp Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 justify-start border-green-200 hover:bg-green-50">
                    <Smartphone className="h-5 w-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Bulk Message Broadcasting</div>
                      <div className="text-xs text-muted-foreground">Send messages to multiple contacts</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start border-green-200 hover:bg-green-50">
                    <MessageSquare className="h-5 w-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Automated Welcome Messages</div>
                      <div className="text-xs text-muted-foreground">Instant reply templates</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start border-green-200 hover:bg-green-50">
                    <Download className="h-5 w-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Multimedia Support</div>
                      <div className="text-xs text-muted-foreground">Images, documents, voice notes</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-4 justify-start border-green-200 hover:bg-green-50">
                    <Phone className="h-5 w-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">WhatsApp Calling</div>
                      <div className="text-xs text-muted-foreground">Voice and video calls</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>

      {/* Search and Filters */}
      <Card className="glass-effect border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

      {/* Conversations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    thread.status === 'unread' 
                      ? 'bg-primary/10 border border-primary/20' 
                      : selectedThread === thread.id
                      ? 'bg-primary/5 border border-primary/20'
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{thread.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {thread.contact}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getPlatformIcon(thread.platform)}
                          {getStatusIcon(thread.status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
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
          <Card className="glass-effect border-primary/20 h-[calc(100vh-24rem)]">
            <CardHeader>
              {selectedThread ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {threads.find(t => t.id === selectedThread)?.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
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
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCallAction("Call", threads.find(t => t.id === selectedThread)?.contact || '')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCallAction("Video Call", threads.find(t => t.id === selectedThread)?.contact || '')}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages Area */}
              <div className="flex-1 bg-muted/20 rounded-lg p-4 mb-4 overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className="animate-pulse bg-primary/10 rounded-lg p-3 w-64 h-20" />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`rounded-lg p-3 max-w-xs ${
                            message.sender.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.attachments?.map((attachment, index) => (
                            <div key={index} className="mt-2 p-2 bg-background/10 rounded flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span className="text-xs">{attachment.name}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {message.sender.type === 'user' && (
                              <span className="text-xs">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder={selectedThread ? "Type your message..." : "Select a conversation to start chatting"}
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
                  disabled={!messageText.trim() || !selectedThread || isSending}
                  className="shrink-0"
                >
                  {isSending ? (
                    <span className="inline-block animate-spin">◌</span>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

