# Calendar Integration Setup Guide

This guide will help you integrate your personal calendar with the booking system to automatically show your unavailable days.

## Supported Calendar Providers

### 1. Google Calendar (Recommended)

#### Step 1: Get Google Calendar API Key
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API
4. Create credentials (API Key)
5. Copy the API key

#### Step 2: Configure Environment Variables
Add these to your `.env.local` file:
```env
VITE_CALENDAR_PROVIDER=google
VITE_GOOGLE_CALENDAR_API_KEY=your_api_key_here
VITE_CALENDAR_ID=primary
```

#### Step 3: Test the Integration
1. Restart your development server
2. Go to the booking page
3. You should see "Calendar connected" status
4. Unavailable dates from your Google Calendar will be blocked

### 2. Outlook Calendar

#### Step 1: Get Outlook Access Token
1. Go to [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Sign in with your Microsoft account
3. Grant permissions for Calendar.Read
4. Copy the access token

#### Step 2: Configure Environment Variables
Add these to your `.env.local` file:
```env
VITE_CALENDAR_PROVIDER=outlook
VITE_OUTLOOK_ACCESS_TOKEN=your_access_token_here
```

### 3. Manual Mode

If you don't want to connect to an external calendar, you can use manual mode:

```env
VITE_CALENDAR_PROVIDER=manual
```

In manual mode, you can:
- Add unavailable dates through the admin interface
- Block specific dates manually
- Use the system without external calendar dependencies

## How It Works

1. **Calendar Sync**: The system fetches events from your connected calendar
2. **Date Blocking**: Any day with an event is marked as unavailable
3. **Real-time Updates**: Click "Refresh" to sync the latest calendar data
4. **Fallback**: If calendar connection fails, the system still works with your weekly schedule

## Troubleshooting

### Google Calendar Issues
- **API Key Invalid**: Make sure your API key is correct and has Calendar API enabled
- **Quota Exceeded**: Google Calendar API has daily limits. Consider caching results
- **Calendar Not Found**: Check if `VITE_CALENDAR_ID` is correct (use "primary" for main calendar)

### Outlook Calendar Issues
- **Access Token Expired**: Outlook tokens expire. You'll need to refresh them
- **Permissions**: Make sure you have Calendar.Read permissions
- **Rate Limits**: Microsoft Graph has rate limits. The system handles this gracefully

### General Issues
- **No Calendar Events**: Check if you have events in your calendar
- **Connection Failed**: Check your internet connection and API credentials
- **Slow Loading**: Calendar sync happens in the background and may take a few seconds

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Access Tokens**: Store tokens securely and rotate them regularly
- **Permissions**: Only grant necessary permissions to your calendar
- **HTTPS**: Always use HTTPS in production for secure API calls

## Advanced Configuration

### Custom Calendar ID
For Google Calendar, you can use a specific calendar ID:
```env
VITE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
```

### Multiple Calendars
Currently, the system supports one calendar at a time. For multiple calendars, you would need to modify the integration service.

### Event Filtering
The system blocks any day with events. To filter specific event types, modify the `fetchEvents` method in `calendarIntegration.ts`.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Test your API credentials independently
4. Check the network tab for failed API requests
