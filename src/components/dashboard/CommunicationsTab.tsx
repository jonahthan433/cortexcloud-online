import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
  const [selectedConversation, setSelectedConversation] = useState(1);

  const initialConversations = [
    {
      id: 1,
      contact: "John Smith",
      platform: "Email",
      lastMessage: "Thanks for the proposal, I'll review it and get back to you.",
      time: "2 minutes ago",
      status: "unread",
      avatar: "JS"
    },
    {
      id: 2,
      contact: "Sarah Johnson",
      platform: "WhatsApp",
      lastMessage: "Can we schedule a call for tomorrow?",
      time: "15 minutes ago",
      status: "read",
      avatar: "SJ"
    },
    {
      id: 3,
      contact: "Mike Davis",
      platform: "Email",
      lastMessage: "The automation workflow looks great!",
      time: "1 hour ago",
      status: "read",
      avatar: "MD"
    },
    {
      id: 4,
      contact: "Lisa Wilson",
      platform: "Slack",
      lastMessage: "Let's discuss the project timeline",
      time: "2 hours ago",
      status: "unread",
      avatar: "LW"
    }
  ];

  const [conversations] = useState(initialConversations);

  const handleNewMessage = () => {
    toast({
      title: "New Message",
      description: "Opening message composer...",
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "Message Sent",
        description: `Message sent to ${conversations.find(c => c.id === selectedConversation)?.contact}`,
      });
      setMessageText("");
    }
  };

  const handleCallAction = (action: string, contactName: string) => {
    toast({
      title: `${action} ${contactName}`,
      description: `Initiating ${action.toLowerCase()}...`,
    });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="text-2xl font-bold text-blue-500">156</div>
            <div className="text-sm text-muted-foreground">Emails Sent</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">89</div>
            <div className="text-sm text-muted-foreground">WhatsApp Messages</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">45</div>
            <div className="text-sm text-muted-foreground">Slack Messages</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">23</div>
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
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    conversation.status === 'unread' 
                      ? 'bg-primary/10 border border-primary/20' 
                      : selectedConversation === conversation.id
                      ? 'bg-primary/5 border border-primary/20'
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{conversation.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {conversation.contact}
                        </p>
                        <div className="flex items-center space-x-1">
                          {getPlatformIcon(conversation.platform)}
                          {getStatusIcon(conversation.status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.time}
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
          <Card className="glass-effect border-primary/20 h-96">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">JS</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">John Smith</h3>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCallAction("Call", "John Smith")}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCallAction("Video Call", "John Smith")}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages Area */}
              <div className="flex-1 bg-muted/20 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Thanks for reaching out! I'd love to learn more about your services.</p>
                      <p className="text-xs opacity-70 mt-1">2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-background border rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Great! I'll send you our proposal and we can schedule a call to discuss.</p>
                      <p className="text-xs text-muted-foreground mt-1">2:32 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Perfect, looking forward to it!</p>
                      <p className="text-xs opacity-70 mt-1">2:35 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

