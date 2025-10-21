'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Mail,
  UserPlus,
  Shield,
  User,
  Trash2
} from 'lucide-react';

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInviteMember = () => {
    toast.success('Opening invitation form...');
  };

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@cortexcloud.com',
      role: 'Owner',
      status: 'Active',
      joinedDate: 'Jan 2024',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah@cortexcloud.com',
      role: 'Admin',
      status: 'Active',
      joinedDate: 'Feb 2024',
      avatar: 'SS'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@cortexcloud.com',
      role: 'Editor',
      status: 'Active',
      joinedDate: 'Mar 2024',
      avatar: 'MJ'
    },
    {
      id: 4,
      name: 'Lisa Wilson',
      email: 'lisa@cortexcloud.com',
      role: 'Viewer',
      status: 'Pending',
      joinedDate: 'Apr 2024',
      avatar: 'LW'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Editor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Button onClick={handleInviteMember}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">4</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">3</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">1</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">2</div>
            <div className="text-sm text-muted-foreground">Admins</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="font-medium text-primary">{member.avatar}</span>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <Badge className={getRoleColor(member.role)}>
                      <Shield className="mr-1 h-3 w-3" />
                      {member.role}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Joined {member.joinedDate}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {member.role !== 'Owner' && (
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { role: 'Owner', description: 'Full access to all features and settings', color: 'purple' },
              { role: 'Admin', description: 'Can manage team members and most settings', color: 'blue' },
              { role: 'Editor', description: 'Can create and edit content', color: 'green' },
              { role: 'Viewer', description: 'Can only view content', color: 'gray' }
            ].map((role) => (
              <div key={role.role} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${role.color}-100`}>
                    <Shield className={`h-5 w-5 text-${role.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium">{role.role}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
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


