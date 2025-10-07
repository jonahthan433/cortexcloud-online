import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone,
  Send,
  Phone,
  Video,
  Image,
  File,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  MessageSquare,
  Users,
  Zap,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react";

interface WhatsAppChat {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'typing' | 'offline';
  labels: string[];
  lastActivity: string;
}

interface WhatsAppMessage {
  id: string;
  text: string;
  timestamp: string;
  isFromBusiness: boolean;
  messageType: 'text' | 'image' | 'document' | 'audio' | 'video';
  status: 'sent' | 'delivered' | 'read';
}

export const WhatsAppConsole = () => {
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);

  const [chats] = useState<WhatsAppChat[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1-555-0123',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Thanks for the quick response!',
      lastMessageTime: '2 min ago',
      unreadCount: 0,
      status: 'online',
      labels: ['VIP Customer', 'Support'],
      lastActivity: 'Active now'
    },
    {
      id: '2',
      name: 'Mike Chen',
      phone: '+1-555-0456',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Can you send me the pricing details?',
      lastMessageTime: '5 min ago',
      unreadCount: 1,
      status: 'typing',
      labels: ['Lead', 'Sales'],
      lastActivity: 'Typing...'
    },
    {
      id: '3',
      name: 'Emily Davis',
      phone: '+1-555-0789',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Perfect! I\'ll book the appointment.',
      lastMessageTime: '15 min ago',
      unreadCount: 0,
      status: 'offline',
      labels: ['Customer'],
      lastActivity: 'Last seen 2 hours ago'
    },
    {
      id: '4',
      name: 'David Wilson',
      phone: '+1-555-0321',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Is there a discount available?',
      lastMessageTime: '1 day ago',
      unreadCount: 2,
      status: 'offline',
      labels: ['Prospect'],
      lastActivity: 'Last seen yesterday'
    }
  ]);

  const [messages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      text: 'Hi Sarah! How can I help you today?',
      timestamp: '10:30 AM',
      isFromBusiness: true,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '2',
      text: 'I need help with my recent order',
      timestamp: '10:32 AM',
      isFromBusiness: false,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '3',
      text: 'Of course! I can help you with that. Can you provide your order number?',
      timestamp: '10:33 AM',
      isFromBusiness: true,
      messageType: 'text',
      status: 'read'
    },
    {
      id: '4',
      text: 'Thanks for the quick response!',
      timestamp: '10:35 AM',
      isFromBusiness: false,
      messageType: 'text',
      status: 'read'
    }
  ]);

  const [broadcastStats] = useState({
    sent: 1247,
    delivered: 1198,
    read: 893,
    replied: 156
  });

  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    toast({
      title: "Message Sent",
      description: "Your WhatsApp message has been delivered.",
    });
    
    setMessageText("");
  };

  const startBroadcast = () => {
    setIsBroadcastMode(true);
    toast({
      title: "Broadcast Mode",
      description: "Select contacts for bulk messaging.",
    });
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.phone.includes(searchTerm)
  );

  const selectedChatData = chats[selectedChat] || chats[0];

  const getStatusColor = (status: WhatsAppChat['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'typing': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getMessageStatusIcon = (status: WhatsAppMessage['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* WhatsApp Console Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-green-600" />
            <span>WhatsApp Business Console</span>
            <Badge className="bg-green-100 text-green-800">
              <Smartphone className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">Manage customer conversations via WhatsApp</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={startBroadcast}>
            <Users className="h-4 w-4 mr-2" />
            Broadcast
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Chat List */}
        <div className="xl:col-span-1 space-y-4">
          {/* Search */}
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Chats */}
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <span>Conversations</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {chats.filter(chat => chat.unreadCount > 0).length} Unread
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredChats.map((chat, index) => (
                  <div key={chat.id} className="relative">
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedChat === index 
                          ? 'border-primary/40 bg-primary/5' 
                          : 'border-transparent hover:border-primary/20'
                      }`}
                      onClick={() => setSelectedChat(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={chat.avatar} />
                              <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(chat.status)}`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                              <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1">
                              {chat.lastMessage}
                            </p>
                            <div className="flex items-center space-x-1">
                              {chat.labels.map(label => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {chat.unreadCount > 0 && (
                            <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Broadcast Stats */}
          {isBroadcastMode && (
            <Card className="glass-effect border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Broadcast Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Sent</span>
                    <span className="font-medium">{broadcastStats.sent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivered</span>
                    <span className="font-medium text-green-600">{broadcastStats.delivered}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Read</span>
                    <span className="font-medium text-blue-600">{broadcastStats.read}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Replied</span>
                    <span className="font-medium text-purple-600">{broadcastStats.replied}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Chat Interface */}
        <div className="xl:col-span-3">
          <Card className="glass-effect border-primary/20 h-full">
            <CardHeader className="border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedChatData.avatar} />
                      <AvatarFallback>{selectedChatData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(selectedChatData.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedChatData.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedChatData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedChatData.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromBusiness ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isFromBusiness 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        message.isFromBusiness ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.isFromBusiness && getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-primary/10 p-4">
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <File className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-12 resize-none"
                      rows={1}
                    />
                  </div>
                  <Button 
                    onClick={sendMessage}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-600" />
            <span>WhatsApp Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-green-200 hover:bg-green-50">
              <Smartphone className="h-6 w-6 text-green-600" />
              <span className="text-sm">Quick Reply Templates</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-green-200 hover:bg-green-50">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm">Customer Groups</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-green-200 hover:bg-green-50">
              <Volume2 className="h-6 w-6 text-green-600" />
              <span className="text-sm">Auto Responses</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 border-green-200 hover:bg-green-50">
              <Settings className="h-6 w-6 text-green-600" />
              <span className="text-sm">Business Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
