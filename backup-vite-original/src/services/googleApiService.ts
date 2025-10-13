// Google API Service
// Handles Google OAuth and Calendar API integration

export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface GoogleCalendarConfig {
  apiKey: string;
  calendarId: string;
}

class GoogleApiService {
  private authConfig: GoogleAuthConfig | null = null;
  private calendarConfig: GoogleCalendarConfig | null = null;
  private accessToken: string | null = null;

  constructor() {
    this.loadConfigurations();
  }

  // Load configurations from environment variables
  private loadConfigurations() {
    this.authConfig = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'email profile https://www.googleapis.com/auth/calendar'
    };

    this.calendarConfig = {
      apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || '',
      calendarId: import.meta.env.VITE_CALENDAR_ID || 'primary'
    };
  }

  // Check if Google Auth is properly configured
  isGoogleAuthConfigured(): boolean {
    return !!(this.authConfig?.clientId);
  }

  // Check if Google Calendar is properly configured
  isGoogleCalendarConfigured(): boolean {
    return !!(this.calendarConfig?.apiKey);
  }

  // Initialize Google Auth
  async initializeGoogleAuth(): Promise<boolean> {
    if (!this.isGoogleAuthConfigured()) {
      console.warn('Google OAuth not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env.local file');
      return false;
    }

    try {
      // Load Google Auth library if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAuthLibrary();
      }

      await window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: this.authConfig!.clientId,
          scope: this.authConfig!.scope,
        });
      });

      console.log('✅ Google Auth initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Auth:', error);
      return false;
    }
  }

  // Load Google Auth library
  private async loadGoogleAuthLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', () => {
          window.gapi.client.setApiKey(this.calendarConfig?.apiKey || '');
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      if (!this.isGoogleAuthConfigured()) {
        return { 
          success: false, 
          error: 'Google Auth is not configured. Please contact support.' 
        };
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      const result = await authInstance.signIn();
      const profile = result.getBasicProfile();
      
      this.accessToken = result.getAuthResponse().access_token;

      const userData = {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        image: profile.getImageUrl(),
        accessToken: this.accessToken
      };

      console.log('✅ Google sign-in successful');
      return { success: true, user: userData };
    } catch (error: any) {
      console.error('❌ Google sign-in failed:', error);
      return { 
        success: false, 
        error: error.message || 'Google sign-in failed' 
      };
    }
  }

  // Sign out from Google
  async signOutFromGoogle(): Promise<void> {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.accessToken = null;
      console.log('✅ Google sign-out successful');
    } catch (error) {
      console.error('❌ Google sign-out failed:', error);
    }
  }

  // Get calendar events
  async getCalendarEvents(startDate: Date, endDate: Date): Promise<any[]> {
    try {
      if (!this.isGoogleCalendarConfigured()) {
        console.warn('Google Calendar API not configured');
        return [];
      }

      if (!this.accessToken) {
        throw new Error('No access token available');
      }

      const calendarId = encodeURIComponent(this.calendarConfig!.calendarId);
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('❌ Failed to fetch calendar events:', error);
      return [];
    }
  }

  // Create calendar event
  async createCalendarEvent(eventData: any): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      if (!this.isGoogleCalendarConfigured()) {
        return { 
          success: false, 
          error: 'Google Calendar API not configured' 
        };
      }

      if (!this.accessToken) {
        return { 
          success: false, 
          error: 'No access token available' 
        };
      }

      const calendarId = encodeURIComponent(this.calendarConfig!.calendarId);
      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Calendar API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Calendar event created:', data.id);
      return { success: true, eventId: data.id };
    } catch (error: any) {
      console.error('❌ Failed to create calendar event:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create calendar event' 
      };
    }
  }

  // Check authentication status
  async isSignedIn(): Promise<boolean> {
    try {
      if (!this.isGoogleAuthConfigured()) {
        return false;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      return authInstance.isSignedIn.get();
    } catch (error) {
      console.error('❌ Error checking sign-in status:', error);
      return false;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<any | null> {
    try {
      if (!this.isGoogleAuthConfigured()) {
        return null;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        return null;
      }

      const user = authInstance.currentUser.get();
      const profile = user.getBasicProfile();
      
      return {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        image: profile.getImageUrl()
      };
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Get configuration status
  getConfigurationStatus() {
    return {
      googleAuthConfigured: this.isGoogleAuthConfigured(),
      googleCalendarConfigured: this.isGoogleCalendarConfigured(),
      hasAccessToken: !!this.accessToken
    };
  }
}

// Export singleton instance
export const googleApiService = new GoogleApiService();

// Declare global Google API interface
declare global {
  interface Window {
    gapi: any;
  }
}
