# 🚀 Quick Setup Instructions

Follow these steps to set up your database and seed guides.

---

## Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Log in if needed
3. Click on your project: **tyoeowlacwmhctmdrcgu**

---

## Step 2: Open SQL Editor

1. Look for **"SQL Editor"** in the left sidebar
2. Click on it
3. Click the **"New query"** button (usually a **+** button or says "New Query")

---

## Step 3: Copy the SQL

1. Open the file: **`QUICK_SETUP.sql`** in your project folder
2. Select **ALL** the text (Ctrl+A)
3. Copy it (Ctrl+C)

---

## Step 4: Paste and Run

1. In the Supabase SQL Editor, paste the SQL (Ctrl+V)
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait a few seconds...
4. You should see: **"Success. No rows returned"** ✅

---

## Step 5: Verify Tables Were Created

1. Click **"Table Editor"** in the left sidebar
2. You should now see these tables:
   - ✅ **users**
   - ✅ **guides**
   - ✅ **threads**
   - ✅ **comments**

---

## Step 6: Check Database from Terminal

Open your terminal in the project folder and run:

```bash
npm run db:check
```

You should see:

```
🔍 Checking database setup...

📋 Checking guides table...
   ✅ Guides table exists
   Found 0 guide(s)

📋 Checking threads table...
   ✅ Threads table exists

📋 Checking comments table...
   ✅ Comments table exists

✨ Database check complete!

✅ All tables exist. You can now run:
   npm run seed:guides
```

---

## Step 7: Seed the Guides

Run this command:

```bash
npm run seed:guides
```

You should see:

```
🌱 Starting guide seed...

📝 Inserting: How to Import a Car from the US to Korea
   ✅ Successfully inserted "us-to-kr-import"

✨ Seed complete!
```

---

## Step 8: Verify in Supabase

1. Go back to **Table Editor** → **guides** table
2. You should see your guide:
   - **slug**: `us-to-kr-import`
   - **title**: How to Import a Car from the US to Korea
   - **published**: `true`
   - **content**: (long markdown text)

---

## Step 9: Start Your App

```bash
npm run dev
```

Wait for it to start, then visit:

**http://localhost:3000/guides**

You should see your guide listed! Click on it to view the full content.

---

## 🎉 Done!

Your database is set up and your first guide is live!

### What You Can Do Now:

✅ **View guides**: http://localhost:3000/guides
✅ **Create an account**: http://localhost:3000/signup
✅ **Start a thread**: http://localhost:3000/community (after signing up)
✅ **Add more guides**: Edit `scripts/seed-guides.ts` and run `npm run seed:guides` again

---

## Troubleshooting

### "Success. No rows returned" is normal!
That's the expected response for database setup SQL. It means it worked.

### I see errors in the SQL Editor
- Make sure you copied **ALL** the SQL from QUICK_SETUP.sql
- Try running it again (it's safe to run multiple times)
- Check the error message - it might tell you what's wrong

### Tables don't appear in Table Editor
- Refresh the page
- Click on "Database" → "Tables" in the sidebar
- Make sure you're looking at the correct project

### `npm run db:check` still shows errors
- Go back to Supabase and verify the tables exist
- Try refreshing your Supabase schema cache (Settings → API → "Refresh" button)
- Make sure your `.env.local` has the correct credentials

### `npm run seed:guides` fails
- First run `npm run db:check` to verify tables exist
- Check the error message for details
- Make sure the `guides` table has all required columns

---

## Quick Commands Reference

```bash
# Check if database is set up
npm run db:check

# Seed guides into database
npm run seed:guides

# Start development server
npm run dev

# Other useful commands
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Check code quality
```

---

## File Structure

```
ocp-app/
├── .env.local                    ← Your Supabase credentials
├── QUICK_SETUP.sql              ← SQL to copy-paste into Supabase
├── SETUP_INSTRUCTIONS.md        ← This file
├── scripts/
│   ├── seed-guides.ts           ← Guide seeding script
│   └── check-db.ts              ← Database verification script
└── supabase/
    └── migrations/
        └── 20250101000000_initial_schema.sql
```

---

## Need Help?

1. Check this file first
2. Read SETUP_DATABASE.md for more details
3. Check the Supabase dashboard for errors
4. Look at the error messages carefully - they usually tell you what's wrong

Happy coding! 🚀
