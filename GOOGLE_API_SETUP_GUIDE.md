# Google APIs Setup Guide for Cortex Cloud

This guide will help you configure Google OAuth and Google Calendar API for your Cortex Cloud application.

## 🚀 Quick Setup Overview

1. **Create Google Cloud Project**
2. **Enable Required APIs**
3. **Configure OAuth Consent Screen**
4. **Create Credentials**
5. **Update Environment Variables**

---

## 📋 Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Enter project name: `Cortex Cloud [Your Company]`
4. Click "Create"

### Step 2: Enable Required APIs

Enable these APIs in your Google Cloud project:

#### Required APIs:
- **Google+ API** (for OAuth authentication)
- **Google Calendar API** (for calendar integration)

#### How to enable:
1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for each API and click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose **External** user type (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: `Cortex Cloud`
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar`
5. Add test users (for development) or publish the app

### Step 4: Create OAuth Credentials

#### For Authentication (OAuth):

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URI:
   ```
   http://localhost:8080/auth/callback
   ```
   *Add production URL when deploying*
5. Copy the generated **Client ID**

#### For Calendar API (API Key):

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API key"
3. Copy the generated **API Key**
4. (Optional) Restrict the API key to only Calendar API

### Step 5: Update Environment Variables

Create a `.env.local` file in your project root:

```env
# Copy from google-api-setup.env.example

# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_SUPABASE_anon_key

# Google OAuth Configuration (for Authentication)
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_from_step_4

# Google Calendar API Configuration (Optional)
VITE_GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key_from_step_4
VITE_CALENDAR_ID=primary

# App Configuration
VITE_APP_URL=https://cortexcloud.online
```

---

## 🔧 Configuration Details

### Supabase Setup (Required)

Before using Google APIs, you need Supabase configured:

1. Create account at [Supabase](https://supabase.com/)
2. Create new project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### Google Calendar API (Optional)

When Calendar API is configured:
- Users can sync their Google Calendar
- Bookings automatically create calendar events
- Unavailable dates are automatically blocked

### Environment Variables Explained

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase database URL | ✅ Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous key | ✅ Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ For login |
| `VITE_GOOGLE_CALENDAR_API_KEY` | Google Calendar API key | ❌ Optional |
| `VITE_CALENDAR_ID` | Default calendar ID | ❌ Optional |

---

## 🧪 Testing Your Setup

### Test Google Sign-In:

1. Start your development server: `npm run dev`
2. Go to: `http://localhost:8080/auth/login`
3. Click "Continue with Google"
4. Complete OAuth flow
5. You should be redirected to dashboard

### Test Calendar Integration:

1. Go to Dashboard → Calendar tab
2. Look for calendar sync options
3. Events should sync automatically

### Debug Common Issues:

#### "Google Sign-In Unavailable"
- Check `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify OAuth consent screen is configured
- Check redirect URI matches exactly

#### "Calendar API Error"
- Check `VITE_GOOGLE_CALENDAR_API_KEY` is set
- Verify Calendar API is enabled
- Check API key restrictions

#### CORS Errors
- Ensure redirect URI includes `localhost:8080` for development
- Use HTTPS in production

---

## 🚀 Production Deployment

### Update OAuth Redirect URIs:

Add production URL to Google OAuth settings:
```
https://your-production-domain.com/auth/callback
```

### Environment Variables:

Update production environment with:
```env
VITE_APP_URL=https://your-production-domain.com
```

### Security:

- Restrict API keys to specific domains
- Set up proper OAuth consent screen
- Consider rate limiting for Calendar API

---

## 📚 Additional Resources

- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Verify all environment variables are correct
3. Test each API individually
4. Check Google Cloud Console for quota limits

**Create an issue with:**
- Error messages
- Environment setup
- Steps to reproduce

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] Google Calendar API enabled (optional)
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Calendar API key created (optional)
- [ ] Supabase project configured
- [ ] Environment variables set
- [ ] Google sign-in works
- [ ] Calendar integration works (optional)
- [ ] Production URLs added
