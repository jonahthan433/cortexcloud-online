# 🔍 Troubleshooting Blank Site Issue

## Current Status Check

### 1. Check GitHub Actions Status
1. Go to: `https://github.com/jonahthan433/cortexcloud-online/actions`
2. Look for the latest "Deploy to GitHub Pages" workflow
3. Check if it's:
   - ✅ **Green checkmark** = Success
   - ❌ **Red X** = Failed
   - 🟡 **Yellow circle** = Running

### 2. Check GitHub Pages Settings
1. Go to: `https://github.com/jonahthan433/cortexcloud-online/settings/pages`
2. Verify:
   - **Source**: GitHub Actions
   - **Custom domain**: `cortexcloud.online`
   - **Status**: Should show "Your site is live at https://cortexcloud.online"

### 3. Check Environment Variables
1. Go to: `https://github.com/jonahthan433/cortexcloud-online/settings/secrets/actions`
2. Verify these 3 secrets exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_APP_URL`

## Common Issues & Solutions

### Issue 1: Build Failed
**Symptoms**: Red X in GitHub Actions
**Solution**: 
1. Click on the failed workflow
2. Check the build logs for errors
3. Common causes:
   - Missing environment variables
   - Build errors in code
   - Dependency issues

### Issue 2: DNS Not Configured
**Symptoms**: Site shows GitHub 404 page
**Solution**: Configure DNS records at your domain registrar:
```
Type: A
Host: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153

Type: CNAME
Host: www
Value: jonahthan433.github.io
```

### Issue 3: Environment Variables Missing
**Symptoms**: Build succeeds but site is blank
**Solution**: Add the 3 required secrets in GitHub repository settings

### Issue 4: Vite Base Path Issue
**Symptoms**: Assets not loading (check browser console)
**Solution**: Already fixed in vite.config.ts

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Open `https://cortexcloud.online`
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any red error messages
5. Go to Network tab and check if files are loading

### Step 2: Test Direct GitHub Pages URL
Try accessing: `https://jonahthan433.github.io/cortexcloud-online`
- If this works but custom domain doesn't = DNS issue
- If this doesn't work = Build/deployment issue

### Step 3: Check CNAME File
Verify the CNAME file exists in your repository root with content:
```
cortexcloud.online
```

## Emergency Fixes

### Fix 1: Force Rebuild
1. Make a small change to README.md
2. Commit and push
3. This will trigger a new deployment

### Fix 2: Check Build Output
1. Go to Actions tab
2. Click on latest workflow
3. Check the "Build" job logs
4. Look for any error messages

### Fix 3: Verify Supabase Configuration
1. Check your Supabase project is active
2. Verify the URL and key are correct
3. Test the connection

## Next Steps
1. Check the GitHub Actions status first
2. If build failed, check the logs
3. If build succeeded but site is blank, check browser console
4. Verify DNS configuration if custom domain isn't working
