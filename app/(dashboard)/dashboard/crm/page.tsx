'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Building
} from 'lucide-react';

export default function CRMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const handleAddContact = () => {
    toast.success('Opening contact form...');
  };

  const handleContactAction = (action: string, contactName: string) => {
    toast.success(`${action} ${contactName}`);
  };

  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      status: 'Qualified',
      value: '$2,500',
      lastContact: '2 days ago',
      source: 'Website'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543',
      company: 'Marketing Pro',
      status: 'New',
      value: '$1,800',
      lastContact: '1 week ago',
      source: 'Social Media'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@business.com',
      phone: '+1 (555) 456-7890',
      company: 'Davis Consulting',
      status: 'Contacted',
      value: '$3,200',
      lastContact: '3 days ago',
      source: 'Referral'
    },
    {
      id: 4,
      name: 'Lisa Wilson',
      email: 'lisa@startup.com',
      phone: '+1 (555) 321-0987',
      company: 'StartupCo',
      status: 'Qualified',
      value: '$1,200',
      lastContact: '5 days ago',
      source: 'Email Campaign'
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* CRM Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM & Pipeline</h1>
          <p className="text-muted-foreground">Manage your contacts and sales pipeline</p>
        </div>
        <Button onClick={handleAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">24</div>
            <div className="text-sm text-muted-foreground">New Leads</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">18</div>
            <div className="text-sm text-muted-foreground">Contacted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">12</div>
            <div className="text-sm text-muted-foreground">Qualified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">8</div>
            <div className="text-sm text-muted-foreground">Closed</div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>{contact.company}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{contact.value}</p>
                    <p className="text-xs text-muted-foreground">Value</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{contact.lastContact}</p>
                    <p className="text-xs text-muted-foreground">Last Contact</p>
                  </div>
                  
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleContactAction('Call', contact.name)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleContactAction('Email', contact.name)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleContactAction('Message', contact.name)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleContactAction('Schedule', contact.name)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


