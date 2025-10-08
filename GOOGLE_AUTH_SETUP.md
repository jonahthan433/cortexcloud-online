# Setting up Google Authentication

Follow these steps to enable Google Sign-In for your application:

1. **Configure Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to your project
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth Client ID"
   - Select "Web Application"
   - Add these authorized redirect URIs:
     ```
     https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback
     http://localhost:5173/auth/callback    # For local development
     ```

2. **Configure Supabase Auth**:
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list
   - Enable it and add your:
     - Client ID
     - Client Secret

3. **Update Environment Variables**:
   Create or update your `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Testing**:
   - Run your application locally
   - Try signing in with Google
   - Verify that you're redirected to the dashboard after successful sign-in

5. **Troubleshooting**:
   If sign-in isn't working:
   - Check that all redirect URIs are correctly configured
   - Verify your environment variables are set correctly
   - Look for errors in the browser console
   - Check Supabase authentication logs