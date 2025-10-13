'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, RefreshCw, Settings, Video, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const stats = {
    todayMeetings: 4,
    confirmed: 12,
    pending: 3,
    monthTotal: 28
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar & Appointments</h1>
          <p className="text-muted-foreground">View and manage your scheduled appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Link href="/booking">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Google Calendar Status */}
      <Card className="border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-green-500/10 p-2">
                <Settings className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Google Calendar Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Calendar events will sync automatically
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.todayMeetings}</div>
            <div className="text-sm text-muted-foreground">Today's Meetings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.monthTotal}</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto mb-4 h-12 w-12 text-primary" />
            <p className="mb-2 text-lg font-medium">Need to schedule appointments?</p>
            <p className="mb-4 text-muted-foreground">Use our booking page to manage appointments and sync with your calendar.</p>
            <Link href="/booking">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Go to Booking Page
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <Video className="h-6 w-6" />
              <span>Video Call</span>
              <span className="text-xs text-muted-foreground">30 min</span>
            </Button>
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <Phone className="h-6 w-6" />
              <span>Phone Call</span>
              <span className="text-xs text-muted-foreground">15 min</span>
            </Button>
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2">
              <MapPin className="h-6 w-6" />
              <span>In-Person</span>
              <span className="text-xs text-muted-foreground">60 min</span>
            </Button>
            <Button variant="outline" className="flex h-20 flex-col items-center justify-center space-y-2 relative">
              <CalendarIcon className="h-6 w-6" />
              <span>Block Time</span>
              <span className="text-xs text-muted-foreground">Custom</span>
              <div className="absolute -right-1 -top-1">
                <Badge variant="secondary" className="flex h-6 w-6 items-center justify-center rounded-full p-0">
                  <Plus className="h-4 w-4" />
                </Badge>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


