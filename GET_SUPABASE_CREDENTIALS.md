# How to Get Your Supabase Credentials

Follow these steps to get your actual Supabase URL and API key.

---

## Step 1: Go to Supabase Dashboard

Visit: **https://supabase.com/dashboard**

(Log in if you're not already)

---

## Step 2: Select Your Project

- If you have an existing project, click on it
- If you don't have a project yet, click **"New Project"** and create one

---

## Step 3: Get Your Credentials

### Option A: From Project Settings (Recommended)

1. In your project dashboard, look for the **Settings** icon (⚙️) in the left sidebar
2. Click **Settings**
3. Click **API** in the settings menu

You'll see:

```
Project URL
https://abcdefghijklmnop.supabase.co
```

```
API Keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM0NTY3OCwiZXhwIjoxOTI3OTIxNjc4fQ.abcdefg1234567
```

### Option B: From Project Home Page

On your project's home page, you'll see a section called **"Connect to your project"** or **"Project API"** with similar information.

---

## Step 4: Copy Your Credentials

### Copy the Project URL
- The URL looks like: `https://[your-project-ref].supabase.co`
- Example: `https://abcdefghijklmnop.supabase.co`

### Copy the anon/public Key
- It's a long string starting with `eyJ...`
- Make sure to copy the entire key (it's very long!)
- This is the **anon public** key, NOT the service_role key

---

## Step 5: Update Your .env.local File

Open your `.env.local` file and replace the placeholders:

### Before:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### After (with your actual values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMjM0NTY3OCwiZXhwIjoxOTI3OTIxNjc4fQ.abcdefg1234567
```

**Important:**
- No quotes around the values
- No spaces around the `=` sign
- Copy the entire anon key (it's very long, usually 200+ characters)

---

## Step 6: Verify Your Setup

### Test the Connection

Run the seed script:
```bash
npm run seed:guides
```

### Expected Output if Correct:
```
🌱 Starting guide seed...

📝 Inserting: How to Import a Car from the US to Korea
   ✅ Successfully inserted "us-to-kr-import"

✨ Seed complete!
```

### If You See an Error:

**"Missing Supabase credentials"**
- Check that `.env.local` exists in the project root
- Make sure both variables are set

**"Invalid JWT"** or **"Invalid API key"**
- Double-check you copied the entire anon key
- Make sure you're using the **anon public** key, not service_role

**"Failed to fetch"** or **"Network error"**
- Check your internet connection
- Verify the Project URL is correct

---

## Visual Guide

Here's what the Supabase dashboard looks like:

```
Supabase Dashboard
├── [Your Project Name]
    ├── Home
    ├── Table Editor
    ├── SQL Editor
    ├── Database
    ├── Storage
    ├── Authentication
    └── Settings ← Click here
        ├── General
        ├── API ← Then click here
        ├── Database
        └── ...
```

On the API page, you'll see:

```
┌─────────────────────────────────────────────┐
│ Configuration                                │
├─────────────────────────────────────────────┤
│                                              │
│ Project URL                                  │
│ https://abcdefghijklmnop.supabase.co       │
│ [Copy]                                       │
│                                              │
│ API Keys                                     │
│                                              │
│ anon public                                  │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │
│ [Copy] [Reveal]                              │
│                                              │
│ service_role (secret)                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    │
│ [Copy] [Reveal]                              │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Security Notes

### ✅ Safe to Use (anon public key)
- Can be exposed in client-side code
- Has limited permissions (defined by RLS policies)
- This is what you should use in `.env.local`

### ⚠️ Keep Secret (service_role key)
- Has full database access
- Bypasses Row Level Security
- Never expose in client code
- Only use in server-side scripts if needed

### 🔒 Never Commit
- `.env.local` is in `.gitignore`
- Don't commit or share your keys publicly
- If exposed, regenerate them in Supabase dashboard

---

## Still Having Issues?

### Create a New Supabase Project

If you don't have a project or want to start fresh:

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: ocp-app (or whatever you like)
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to Korea (e.g., ap-northeast-1)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup
6. Follow the steps above to get your credentials

### Check the .env.local Location

Make sure `.env.local` is in the project root:

```
ocp-app/
├── .env.local          ← Should be here
├── src/
├── scripts/
├── package.json
└── ...
```

**Not** in:
- `ocp-app/src/.env.local` ❌
- `ocp-app/scripts/.env.local` ❌

---

## Quick Checklist

- [ ] I have a Supabase account
- [ ] I have a Supabase project
- [ ] I've navigated to Settings → API
- [ ] I've copied the Project URL
- [ ] I've copied the anon public key (the full thing)
- [ ] I've created `.env.local` in the project root
- [ ] I've pasted both values (no quotes, no spaces)
- [ ] I've saved the file

Now try: `npm run seed:guides`

---

## Example .env.local File

Your final `.env.local` should look like this (but with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123456789.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMzQ1Njc4OSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5NDgyNjg0LCJleHAiOjIwMjUwNTg2ODR9.abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

That's it! Once you have your actual credentials in `.env.local`, everything will work. 🎉
