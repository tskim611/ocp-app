# Complete Guide: Deploy OCP App for Remote Testing

## What You'll Achieve
By following this guide, you'll get a public URL like `https://ocp-app-xyz.vercel.app` that your friend can access from anywhere in the world.

---

## Prerequisites ✅

- [x] GitHub account (if not, sign up at https://github.com)
- [x] Git installed (you have version 2.51.0)
- [x] Supabase project running
- [x] Your app works locally

---

## Part 1: Configure Git (One-Time Setup)

### Step 1.1: Set Your Git Identity

Open **Command Prompt** or **PowerShell** and run:

```bash
# Check if already configured
git config --global user.name
git config --global user.email
```

If you get blank results, set them up:

```bash
# Replace with YOUR information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Example:**
```bash
git config --global user.name "김철수"
git config --global user.email "chulsoo@gmail.com"
```

**Why?** Git needs to know who is making changes to the code.

---

## Part 2: Create a GitHub Repository

### Step 2.1: Create New Repository

1. Go to **https://github.com**
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `ocp-app`
   - **Description**: "Vehicle import cost calculator for Korea"
   - **Visibility**:
     - Choose **Public** (free Vercel deployment)
     - OR **Private** (if you have Vercel Pro)
   - **Important**: DO NOT check any boxes (no README, no .gitignore)
4. Click **"Create repository"**

### Step 2.2: Copy Repository URL

After creating, you'll see a page with setup instructions. You'll see a URL like:
```
https://github.com/YOUR_USERNAME/ocp-app.git
```

**Keep this URL handy!** You'll need it soon.

---

## Part 3: Upload Your Code to GitHub

### Step 3.1: Initialize Git in Your Project

Open **Command Prompt** or **PowerShell**, navigate to your project:

```bash
cd C:\Projects\ocp-app
```

Then run:

```bash
# Initialize Git (creates a .git folder)
git init
```

**What this does:** Turns your folder into a Git repository.

### Step 3.2: Add All Your Files

```bash
# Add all files to Git (prepares them for upload)
git add .
```

**What this does:** Tells Git to track all files (except those in .gitignore).

**Note:** The `.` means "everything in this folder"

### Step 3.3: Create Your First Commit

A "commit" is like a snapshot of your code at this moment.

```bash
# Create a commit with a message
git commit -m "Initial commit - OCP App MVP ready for testing"
```

**What this does:** Saves a snapshot of your code with a description.

### Step 3.4: Connect to GitHub

Remember that URL from Step 2.2? Use it here:

```bash
# Connect your local project to GitHub
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ocp-app.git
```

**What this does:** Links your local folder to the GitHub repository.

### Step 3.5: Rename Branch to 'main'

```bash
# Rename branch to 'main' (GitHub's default)
git branch -M main
```

**What this does:** Changes your branch name from "master" to "main".

### Step 3.6: Push (Upload) Your Code

```bash
# Upload your code to GitHub
git push -u origin main
```

**What this does:**
- Uploads all your code to GitHub
- The `-u` means "remember this for next time"
- You might be asked to log in to GitHub here

### Step 3.7: Verify Upload

1. Go to **https://github.com/YOUR_USERNAME/ocp-app**
2. You should see all your files there!
3. Check that `.env.local` is **NOT** visible (it should be ignored)

✅ **Congratulations!** Your code is now on GitHub.

---

## Part 4: Deploy to Vercel

### Step 4.1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Log in with your GitHub account
5. Authorize Vercel to access your GitHub

**Why GitHub login?** Vercel needs permission to read your code from GitHub.

### Step 4.2: Import Your Project

1. After logging in, click **"Add New Project"** or **"Import Project"**
2. You'll see a list of your GitHub repositories
3. Find **"ocp-app"** and click **"Import"**

### Step 4.3: Configure Project

You'll see a configuration screen:

**Framework Preset:**
- Should auto-detect as **"Next.js"** ✅

**Root Directory:**
- Leave as **"./"** (default) ✅

**Build Settings:**
- Leave as default ✅

### Step 4.4: Add Environment Variables (CRITICAL!)

This is the most important step! Scroll down to **"Environment Variables"**.

You need to add these (from your `.env.local` file):

1. Click **"Add" or "+"**
2. Enter:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: (copy from your `.env.local` file)

3. Click **"Add" or "+"** again
4. Enter:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: (copy from your `.env.local` file)

**How to find your values:**

Open your `.env.local` file:
```
C:\Projects\ocp-app\.env.local
```

Copy the values (everything after the `=` sign).

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4.5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-5 minutes while Vercel builds your app
3. You'll see a progress screen with logs

**What's happening:**
- Vercel downloads your code from GitHub
- Installs all dependencies (`npm install`)
- Builds your Next.js app (`npm run build`)
- Deploys it to their servers

### Step 4.6: Get Your URL

When deployment finishes, you'll see:

🎉 **Congratulations! Your app is live!**

You'll get a URL like:
```
https://ocp-app-xyz.vercel.app
```

Click **"Visit"** to see your live app!

---

## Part 5: Configure Supabase for Your New URL

Your app is live, but authentication won't work yet. You need to tell Supabase about your new URL.

### Step 5.1: Open Supabase Dashboard

1. Go to **https://supabase.com/dashboard**
2. Select your **OCP App** project

### Step 5.2: Add Vercel URL to Allowed Redirects

1. Click **"Authentication"** in the left sidebar
2. Click **"URL Configuration"**
3. Find **"Redirect URLs"** section
4. Add your Vercel URL with wildcard:
   ```
   https://ocp-app-xyz.vercel.app/**
   ```
   *(Replace with your actual Vercel URL)*

5. Click **"Save"**

**Why?** Supabase needs to know which websites are allowed to use your authentication.

---

## Part 6: Test Your Deployment

### Step 6.1: Test on Your Device

1. Open your Vercel URL in your browser
2. Try switching languages (한국어 ↔ English)
3. Test the calculator
4. Try signing up/logging in

### Step 6.2: Test on Mobile

1. Open the URL on your phone
2. Check if everything looks good
3. Test navigation and calculator

### Step 6.3: Share with Your Friend

Send your friend:
1. **The Vercel URL**: `https://ocp-app-xyz.vercel.app`
2. **The TESTER_GUIDE.md** file (for testing instructions)

---

## Troubleshooting

### Issue: "Error connecting to Supabase"
**Solution:** Check that you added environment variables correctly in Vercel.

### Issue: "Authentication redirect error"
**Solution:** Make sure you added your Vercel URL to Supabase → Authentication → URL Configuration.

### Issue: "Build failed"
**Solution:**
1. Check build logs in Vercel dashboard
2. Make sure your code works locally (`npm run build`)
3. Check that all dependencies are in `package.json`

### Issue: "Page not found"
**Solution:**
- Make sure you deployed the `main` branch
- Try accessing `/ko` or `/en` directly (e.g., `https://your-url.vercel.app/ko`)

---

## Future Updates

Whenever you make changes to your code:

```bash
# 1. Add changed files
git add .

# 2. Create a commit
git commit -m "Description of what you changed"

# 3. Push to GitHub
git push

# Vercel will automatically detect the change and redeploy! 🎉
```

---

## Quick Reference Commands

```bash
# Check Git status (what files changed)
git status

# See commit history
git log --oneline

# Push updates
git add .
git commit -m "Your message"
git push

# View your remote URL
git remote -v
```

---

## What You've Accomplished 🎉

✅ Code is backed up on GitHub
✅ App is live on the internet
✅ Your friend can test from anywhere
✅ Automatic deployments when you push changes
✅ Professional deployment workflow

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Guides**: https://guides.github.com
- **Supabase Auth**: https://supabase.com/docs/guides/auth

---

**Need Help?**
- Check Vercel deployment logs
- Review Supabase logs in Dashboard → Logs
- Test locally first with `npm run build` and `npm start`
