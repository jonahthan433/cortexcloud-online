# 🚀 Deployment Troubleshooting Guide

## Issue: Blank Site After GitHub Publishing

### Root Causes Identified:
1. **Missing GitHub Pages Configuration**
2. **Vite Base Path Not Set for GitHub Pages**
3. **Missing Environment Variables**
4. **Node.js/npm Not Available Locally**

## ✅ Solutions Applied:

### 1. GitHub Pages Deployment Workflow
Created `.github/workflows/deploy.yml` to automatically build and deploy your site.

### 2. Vite Configuration Fixed
Updated `vite.config.ts` with correct base path for GitHub Pages:
```typescript
base: mode === "production" ? "/cortexcloud-online/" : "/"
```

### 3. Environment Variables Setup
Created `env.example` with required environment variables.

## 🔧 Manual Steps Required:

### Step 1: Enable GitHub Pages
1. Go to your repository: `https://github.com/jonahthan433/cortexcloud-online`
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 2: Add Environment Variables
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon key
   - `VITE_APP_URL`: `https://jonahthan433.github.io/cortexcloud-online`

### Step 3: Trigger Deployment
1. Make a small change to any file (like README.md)
2. Commit and push the changes
3. Go to **Actions** tab to see the deployment progress

## 🐛 Common Issues & Solutions:

### Issue: "npm not recognized"
**Solution**: The GitHub Actions workflow will handle the build process automatically. You don't need npm locally for deployment.

### Issue: "Blank page"
**Causes**:
- Missing base path in Vite config ✅ Fixed
- Missing environment variables ✅ Fixed
- Build errors in console

### Issue: "404 on routes"
**Solution**: The base path is now correctly configured for GitHub Pages.

## 📋 Verification Steps:

1. **Check GitHub Actions**: Go to Actions tab and ensure deployment succeeded
2. **Check Browser Console**: Open dev tools and look for errors
3. **Test Routes**: Try navigating to different pages
4. **Check Network Tab**: Ensure all assets are loading

## 🔗 Your Site URL:
Once deployed, your site will be available at:
`https://cortexcloud.online`

## 📞 Need Help?
If you're still experiencing issues:
1. Check the GitHub Actions logs for build errors
2. Verify all environment variables are set correctly
3. Ensure your Supabase project is properly configured
4. Check browser console for JavaScript errors

## 🎯 Next Steps:
1. Follow the manual steps above
2. Wait for the GitHub Actions deployment to complete
3. Test your site at the GitHub Pages URL
4. Verify all features are working correctly
