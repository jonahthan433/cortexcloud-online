# Backup - Original Vite/React Implementation

This folder contains the original React/Vite implementation of CortexCloud that was replaced with the Next.js 14+ version.

## What's in This Folder

- **src/** - Original React source code
- **vite.config.js** and **vite.config.ts** - Vite configuration
- **index.html** and **index.dev.html** - Vite entry points
- **vitest.config.ts** - Vite test configuration
- **dist/** - Old build output

## Why It's Here

These files were backed up when migrating to Next.js 14+ to:
1. Preserve the original implementation
2. Allow reference during migration
3. Enable rollback if needed
4. Keep historical record

## Current Status

**⚠️ This code is no longer active**

The application now runs on Next.js with:
- All features migrated
- New features added
- Modern architecture
- Better performance
- Enhanced security

## If You Need to Reference Old Code

The original features can be found here:
- **Dashboard tabs**: `src/components/dashboard/`
- **Pages**: `src/pages/`
- **Services**: `src/services/`
- **Components**: `src/components/`
- **Contexts**: `src/contexts/`

## New Next.js Locations

| Old Location | New Location |
|--------------|--------------|
| `src/pages/Dashboard.tsx` | `app/(dashboard)/dashboard/page.tsx` |
| `src/components/dashboard/*` | `app/(dashboard)/dashboard/*` |
| `src/services/*` | `lib/*` and `app/api/*` |
| `src/contexts/AuthContext.tsx` | `lib/auth.ts` (NextAuth) |
| `src/components/ui/*` | `components/ui/*` |

## Can I Delete This?

**Yes, eventually.** But keep it for now:
- Keep for 30 days during transition
- Useful for reference
- Safe to delete after Next.js version is stable in production

## Restoration

If you need to go back to Vite:
```bash
# From project root
cp -r backup-vite-original/src .
cp backup-vite-original/vite.config.* .
cp backup-vite-original/index.html .
# Restore old package.json and reinstall
```

---

**Created:** October 13, 2025  
**Purpose:** Backup of original implementation  
**Status:** Archived - Replaced by Next.js version

