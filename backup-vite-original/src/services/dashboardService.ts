import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  progress: number;
}

export interface RevenueData {
  date: string;
  amount: number;
}

export interface LeadSource {
  source: string;
  percentage: number;
}

export interface Lead {
  name: string;
  email: string;
  source: string;
  status: string;
  value: string;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetric[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Return mock data for development
      return [
        {
          title: "Lead Conversion Rate",
          value: "24.5%",
          change: "+3.2%",
          trend: "up",
          progress: 75
        },
        {
          title: "Email Open Rate",
          value: "68.2%",
          change: "+5.1%",
          trend: "up",
          progress: 68
        },
        {
          title: "Automation Completion",
          value: "89.3%",
          change: "+2.8%",
          trend: "up",
          progress: 89
        },
        {
          title: "Customer Satisfaction",
          value: "4.8/5",
          change: "+0.3",
          trend: "up",
          progress: 96
        }
      ];
    }
  },

  async getRevenueData(): Promise<RevenueData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/revenue`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Return mock data for development
      const today = new Date();
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        return {
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 10000) + 5000
        };
      }).reverse();
    }
  },

  async getLeadSources(): Promise<LeadSource[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/lead-sources`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead sources:', error);
      // Return mock data for development
      return [
        { source: "Website", percentage: 45 },
        { source: "Social Media", percentage: 30 },
        { source: "Email Campaigns", percentage: 15 },
        { source: "Referrals", percentage: 10 }
      ];
    }
  },

  async getRecentLeads(): Promise<Lead[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/recent-leads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent leads:', error);
      // Return mock data for development
      return [
        { name: "John Smith", email: "john@example.com", source: "Website", status: "New", value: "$2,500" },
        { name: "Sarah Johnson", email: "sarah@company.com", source: "Social Media", status: "Qualified", value: "$1,800" },
        { name: "Mike Davis", email: "mike@business.com", source: "Referral", status: "Contacted", value: "$3,200" },
        { name: "Lisa Wilson", email: "lisa@startup.com", source: "Email Campaign", status: "New", value: "$1,200" }
      ];
    }
  }
};