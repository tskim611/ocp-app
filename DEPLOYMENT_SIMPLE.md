# Super Simple Deployment Guide - 5 Main Steps

## The Big Picture

```
Your Computer → GitHub → Vercel → Internet
(C:\Projects)  (Backup)  (Hosting) (Anyone can access)
```

---

## 🎯 Quick Start (15 minutes)

### Step 1: Setup Git (One time only)
Open Command Prompt:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

### Step 2: Create GitHub Account
- Go to https://github.com
- Click "Sign up"
- Verify your email

---

### Step 3: Upload Code to GitHub

Open Command Prompt in your project folder:

```bash
cd C:\Projects\ocp-app

git init
git add .
git commit -m "First upload"
```

Now create a repository on GitHub:
1. Go to https://github.com/new
2. Name it: `ocp-app`
3. Click "Create repository"
4. Copy the URL shown (looks like: `https://github.com/USERNAME/ocp-app.git`)

Back in Command Prompt:
```bash
# Replace YOUR_USERNAME with your actual username
git remote add origin https://github.com/YOUR_USERNAME/ocp-app.git
git branch -M main
git push -u origin main
```

---

### Step 4: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Sign up" → Choose "Continue with GitHub"
3. Click "Add New Project"
4. Select your `ocp-app` repository
5. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (copy from your .env.local)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (copy from your .env.local)
6. Click "Deploy"
7. Wait 2-3 minutes

**You'll get a URL like:** `https://ocp-app-abc123.vercel.app`

---

### Step 5: Update Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Authentication" → "URL Configuration"
4. Add to "Redirect URLs":
   ```
   https://ocp-app-abc123.vercel.app/**
   ```
   (Use your actual Vercel URL)
5. Click "Save"

---

## ✅ Done! Share the URL with Your Friend

Send them:
- Your Vercel URL: `https://ocp-app-abc123.vercel.app/ko`
- The file `TESTER_GUIDE.md` for testing instructions

---

## Need to Update Your App Later?

```bash
cd C:\Projects\ocp-app
git add .
git commit -m "Fixed bug / Added feature"
git push
```

Vercel will automatically update your site! ✨

---

## Stuck? Common Issues

**"Authentication failed when pushing"**
- GitHub might ask for credentials
- Use a Personal Access Token instead of password
- Guide: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

**"Build failed on Vercel"**
- Check if `npm run build` works locally
- Review build logs on Vercel dashboard

**"Supabase not connecting"**
- Double-check environment variables in Vercel
- Make sure you added redirect URL in Supabase

---

## Alternative: Test Locally First

If you're not ready for public deployment:

**Share with friend on same WiFi:**
- Korean: http://172.100.100.84:3005/ko
- English: http://172.100.100.84:3005/en

Keep your server running:
```bash
npm run dev
```
