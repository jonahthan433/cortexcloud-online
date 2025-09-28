import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Video,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

export const CalendarTab = () => {
  const { toast } = useToast();

  const handleScheduleMeeting = () => {
    toast({
      title: "Schedule Meeting",
      description: "Opening meeting scheduler...",
    });
  };

  const handleEventAction = (action: string, eventTitle: string) => {
    toast({
      title: `${action} ${eventTitle}`,
      description: `${action} action initiated...`,
    });
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `Schedule ${action}`,
      description: `Opening ${action.toLowerCase()} scheduler...`,
    });
  };
  const upcomingEvents = [
    {
      id: 1,
      title: "Client Meeting - John Smith",
      time: "10:00 AM - 11:00 AM",
      date: "Today",
      type: "Video Call",
      status: "confirmed",
      description: "Discuss project requirements and timeline"
    },
    {
      id: 2,
      title: "Team Standup",
      time: "2:00 PM - 2:30 PM",
      date: "Today",
      type: "Video Call",
      status: "confirmed",
      description: "Daily team sync and updates"
    },
    {
      id: 3,
      title: "Sales Call - Sarah Johnson",
      time: "3:30 PM - 4:00 PM",
      date: "Today",
      type: "Phone Call",
      status: "pending",
      description: "Follow-up on proposal and next steps"
    },
    {
      id: 4,
      title: "Product Demo - Mike Davis",
      time: "10:00 AM - 11:00 AM",
      date: "Tomorrow",
      type: "Video Call",
      status: "confirmed",
      description: "Showcase new features and automation tools"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'Phone Call':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'In-Person':
        return <MapPin className="h-4 w-4 text-orange-500" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calendar Management</h2>
          <p className="text-muted-foreground">Schedule and manage your appointments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleScheduleMeeting}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-sm text-muted-foreground">Today's Meetings</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">8</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">3</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="glass-effect border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">156</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Calendar widget</p>
                  <p className="text-sm">Integration coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </span>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1">{event.status}</span>
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEventAction("Join", event.title)}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEventAction("View", event.title)}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleQuickAction("Video Call")}
            >
              <Video className="h-6 w-6" />
              <span>Video Call</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleQuickAction("Phone Call")}
            >
              <Phone className="h-6 w-6" />
              <span>Phone Call</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleQuickAction("In-Person Meeting")}
            >
              <MapPin className="h-6 w-6" />
              <span>In-Person</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => handleQuickAction("Block Time")}
            >
              <CalendarIcon className="h-6 w-6" />
              <span>Block Time</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

