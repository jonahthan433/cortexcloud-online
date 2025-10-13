// Calendar Integration Service
// This service handles integration with personal calendars to show unavailable days

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

export interface CalendarConfig {
  provider: 'google' | 'outlook' | 'apple' | 'manual';
  credentials?: {
    clientId?: string;
    apiKey?: string;
    accessToken?: string;
  };
  calendarId?: string;
}

class CalendarIntegrationService {
  private config: CalendarConfig | null = null;
  private unavailableDates: Set<string> = new Set();
  private lastSync: Date | null = null;

  // Initialize the calendar integration
  async initialize(config: CalendarConfig): Promise<boolean> {
    try {
      this.config = config;
      
      switch (config.provider) {
        case 'google':
          return await this.initializeGoogleCalendar(config);
        case 'outlook':
          return await this.initializeOutlookCalendar(config);
        case 'apple':
          return await this.initializeAppleCalendar(config);
        case 'manual':
          return true; // Manual mode doesn't need initialization
        default:
          throw new Error(`Unsupported calendar provider: ${config.provider}`);
      }
    } catch (error) {
      console.error('Failed to initialize calendar integration:', error);
      return false;
    }
  }

  // Initialize Google Calendar integration
  private async initializeGoogleCalendar(config: CalendarConfig): Promise<boolean> {
    if (!config.credentials?.apiKey) {
      console.warn('Google Calendar API key not provided');
      return false;
    }

    try {
      // Test the connection
      const testUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${config.credentials.apiKey}&timeMin=${new Date().toISOString()}&maxResults=1`;
      const response = await fetch(testUrl);
      
      if (response.ok) {
        console.log('✅ Google Calendar integration initialized');
        return true;
      } else {
        console.error('Google Calendar API test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Google Calendar initialization error:', error);
      return false;
    }
  }

  // Initialize Outlook Calendar integration
  private async initializeOutlookCalendar(config: CalendarConfig): Promise<boolean> {
    if (!config.credentials?.accessToken) {
      console.warn('Outlook access token not provided');
      return false;
    }

    try {
      // Test the connection
      const testUrl = 'https://graph.microsoft.com/v1.0/me/calendar/events?$top=1';
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${config.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Outlook Calendar integration initialized');
        return true;
      } else {
        console.error('Outlook Calendar API test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Outlook Calendar initialization error:', error);
      return false;
    }
  }

  // Initialize Apple Calendar integration
  private async initializeAppleCalendar(config: CalendarConfig): Promise<boolean> {
    // Apple Calendar integration would require CalDAV setup
    // For now, we'll return false as it's more complex
    console.warn('Apple Calendar integration not yet implemented');
    return false;
  }

  // Fetch events from the connected calendar
  async fetchEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.config) {
      throw new Error('Calendar integration not initialized');
    }

    try {
      switch (this.config.provider) {
        case 'google':
          return await this.fetchGoogleEvents(startDate, endDate);
        case 'outlook':
          return await this.fetchOutlookEvents(startDate, endDate);
        case 'manual':
          return await this.fetchManualEvents(startDate, endDate);
        default:
          return [];
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return [];
    }
  }

  // Fetch events from Google Calendar
  private async fetchGoogleEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.config?.credentials?.apiKey) {
      return [];
    }

    try {
      const calendarId = this.config.calendarId || 'primary';
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${this.config.credentials.apiKey}&timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Calendar API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items?.map((event: any) => ({
        id: event.id,
        title: event.summary || 'Busy',
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        allDay: !event.start.dateTime
      })) || [];
    } catch (error) {
      console.error('Google Calendar fetch error:', error);
      return [];
    }
  }

  // Fetch events from Outlook Calendar
  private async fetchOutlookEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.config?.credentials?.accessToken) {
      return [];
    }

    try {
      const url = `https://graph.microsoft.com/v1.0/me/calendar/events?$filter=start/dateTime ge '${startDate.toISOString()}' and end/dateTime le '${endDate.toISOString()}'&$orderby=start/dateTime`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Outlook Calendar API error: ${response.status}`);
      }

      const data = await response.json();
      return data.value?.map((event: any) => ({
        id: event.id,
        title: event.subject || 'Busy',
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        allDay: event.isAllDay
      })) || [];
    } catch (error) {
      console.error('Outlook Calendar fetch error:', error);
      return [];
    }
  }

  // Fetch manually configured events (for testing or simple setups)
  private async fetchManualEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    // This could be extended to fetch from a local database or configuration
    // For now, return empty array
    return [];
  }

  // Get unavailable dates for a given date range
  async getUnavailableDates(startDate: Date, endDate: Date): Promise<Set<string>> {
    try {
      const events = await this.fetchEvents(startDate, endDate);
      const unavailableDates = new Set<string>();

      events.forEach(event => {
        if (event.allDay) {
          // All-day events block the entire day
          const dateStr = event.start.toISOString().split('T')[0];
          unavailableDates.add(dateStr);
        } else {
          // For timed events, we might want to block the day if it's a significant portion
          // For now, we'll block the entire day for any event
          const dateStr = event.start.toISOString().split('T')[0];
          unavailableDates.add(dateStr);
        }
      });

      this.unavailableDates = unavailableDates;
      this.lastSync = new Date();
      
      return unavailableDates;
    } catch (error) {
      console.error('Failed to get unavailable dates:', error);
      return new Set();
    }
  }

  // Check if a specific date is unavailable
  isDateUnavailable(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this.unavailableDates.has(dateStr);
  }

  // Get the last sync time
  getLastSync(): Date | null {
    return this.lastSync;
  }

  // Add a manual unavailable date (for testing or manual blocking)
  addManualUnavailableDate(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    this.unavailableDates.add(dateStr);
  }

  // Remove a manual unavailable date
  removeManualUnavailableDate(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    this.unavailableDates.delete(dateStr);
  }

  // Clear all unavailable dates
  clearUnavailableDates(): void {
    this.unavailableDates.clear();
  }
}

// Export a singleton instance
export const calendarIntegration = new CalendarIntegrationService();

// Helper function to get calendar configuration from environment variables
export function getCalendarConfig(): CalendarConfig | null {
  const provider = import.meta.env.VITE_CALENDAR_PROVIDER as 'google' | 'outlook' | 'apple' | 'manual';
  
  if (!provider) {
    return null;
  }

  const config: CalendarConfig = {
    provider,
    credentials: {},
    calendarId: import.meta.env.VITE_CALENDAR_ID
  };

  switch (provider) {
    case 'google':
      config.credentials = {
        apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
      };
      break;
    case 'outlook':
      config.credentials = {
        accessToken: import.meta.env.VITE_OUTLOOK_ACCESS_TOKEN
      };
      break;
    case 'apple':
      // Apple Calendar would need different credentials
      break;
    case 'manual':
      // Manual mode doesn't need credentials
      break;
  }

  return config;
}
