import axios from 'axios';

export interface MessageThread {
  id: string;
  contact: string;
  platform: 'Email' | 'WhatsApp' | 'Slack';
  lastMessage: string;
  time: string;
  status: 'unread' | 'read';
  avatar: string;
}

export interface Message {
  id: string;
  threadId: string;
  content: string;
  timestamp: string;
  sender: {
    name: string;
    avatar: string;
    type: 'user' | 'contact';
  };
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
    size: number;
  }>;
}

export interface CommunicationStats {
  emailsSent: number;
  whatsappMessages: number;
  slackMessages: number;
  callsMade: number;
}

class CommunicationsService {
  private API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

  async getMessageThreads(): Promise<MessageThread[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/communications/threads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching message threads:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          contact: "John Smith",
          platform: "Email",
          lastMessage: "Thanks for the proposal, I'll review it and get back to you.",
          time: "2 minutes ago",
          status: "unread",
          avatar: "JS"
        },
        {
          id: '2',
          contact: "Sarah Johnson",
          platform: "WhatsApp",
          lastMessage: "Can we schedule a call for tomorrow?",
          time: "15 minutes ago",
          status: "read",
          avatar: "SJ"
        }
      ];
    }
  }

  async getMessages(threadId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/communications/messages/${threadId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          threadId,
          content: "Hi, I'd like to learn more about your services.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          sender: {
            name: "John Smith",
            avatar: "JS",
            type: "contact"
          },
          status: "read"
        },
        {
          id: '2',
          threadId,
          content: "I'll send you our proposal and we can schedule a call to discuss.",
          timestamp: new Date(Date.now() - 3300000).toISOString(),
          sender: {
            name: "You",
            avatar: "YO",
            type: "user"
          },
          status: "read"
        },
        {
          id: '3',
          threadId,
          content: "That would be great, thank you!",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          sender: {
            name: "John Smith",
            avatar: "JS",
            type: "contact"
          },
          status: "read"
        }
      ];
    }
  }

  async sendMessage(threadId: string, content: string): Promise<Message> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/communications/messages`, {
        threadId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      // Return mock response for development
      return {
        id: Math.random().toString(36).substr(2, 9),
        threadId,
        content,
        timestamp: new Date().toISOString(),
        sender: {
          name: "You",
          avatar: "YO",
          type: "user"
        },
        status: "sent"
      };
    }
  }

  async getCommunicationStats(): Promise<CommunicationStats> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/communications/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching communication stats:', error);
      // Return mock data for development
      return {
        emailsSent: 156,
        whatsappMessages: 89,
        slackMessages: 45,
        callsMade: 23
      };
    }
  }

  async markThreadAsRead(threadId: string): Promise<void> {
    try {
      await axios.post(`${this.API_BASE_URL}/communications/threads/${threadId}/read`);
    } catch (error) {
      console.error('Error marking thread as read:', error);
    }
  }

  async setupWhatsAppBusiness(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/communications/whatsapp/setup`);
      return response.data;
    } catch (error) {
      console.error('Error setting up WhatsApp Business:', error);
      return {
        success: false,
        message: 'Failed to setup WhatsApp Business integration'
      };
    }
  }

  async uploadAttachment(file: File): Promise<{ url: string; name: string; type: string; size: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${this.API_BASE_URL}/communications/attachments`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw new Error('Failed to upload attachment');
    }
  }
}

export const communicationsService = new CommunicationsService();