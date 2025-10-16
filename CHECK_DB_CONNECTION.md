# Fix Database Connection

## Step 1: Get Your Correct Connection String

1. Go to: https://supabase.com/dashboard
2. Select your CortexCloud project
3. Click **Project Settings** (gear icon)
4. Click **Database** tab on the left

## Step 2: Find Connection String

Scroll down to **Connection string** section

### IMPORTANT: Use the "Transaction" pooler, NOT "Session" pooler

1. Click the **"Transaction"** tab (not Session!)
2. Select **"URI"** from the dropdown
3. Click the 👁️ (eye icon) to reveal the password
4. Copy the ENTIRE string

It should look like:
```
postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 3: Update Your .env File

Replace the `SUPABASE_DB_URL` line in your `.env` with the string you just copied.

**IMPORTANT:** Make sure it:
- ✅ Starts with `postgresql://postgres.`
- ✅ Has your ACTUAL password (not the word "password")
- ✅ Ends with `?pgbouncer=true`
- ✅ Port is 6543

## Example:

```env
SUPABASE_DB_URL=postgresql://postgres.abcdefghijk:your_actual_password_here@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 4: Save and Restart

1. Save the `.env` file
2. Stop the dev server (Ctrl+C)
3. Start it again: `npm run dev`
4. Try signup again

---

## Alternative: Direct Connection (If Above Doesn't Work)

If the pooler connection doesn't work, try the direct connection:

1. In Supabase Dashboard → Database
2. Look for **Connection parameters** section
3. Use these to build the string:

```env
SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

Replace:
- `[password]` with your database password
- `[project-ref]` with your project reference

---

## Quick Test

After updating, this should work without errors:

```bash
npm run dev
```

Then go to http://localhost:3000/signup and create an account.

