export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    name?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  location?: string;
  conferenceData?: {
    conferenceId: string;
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
    }>;
  };
  recurringEventId?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  type: 'Video Call' | 'Phone Call' | 'In-Person';
}

export interface CalendarTimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface CalendarStats {
  todayMeetings: number;
  confirmed: number;
  pending: number;
  monthTotal: number;
}