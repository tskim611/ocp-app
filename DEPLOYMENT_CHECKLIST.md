# Deployment Checklist ✅

Print this out or keep it open while you deploy!

---

## Before You Start

- [ ] Your app works locally (http://localhost:3005)
- [ ] You have a GitHub account
- [ ] You have your Supabase credentials ready (.env.local file)

---

## Part 1: Git Setup (One Time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

- [ ] Git configured with your name
- [ ] Git configured with your email

---

## Part 2: GitHub Upload

### Commands to run:
```bash
cd C:\Projects\ocp-app
git init
git add .
git commit -m "Initial commit - OCP App MVP"
```

- [ ] Opened Command Prompt
- [ ] Navigated to project folder
- [ ] Ran `git init`
- [ ] Ran `git add .`
- [ ] Ran `git commit -m "Initial commit"`

### Create GitHub Repository:

1. Go to https://github.com/new
2. Repository name: `ocp-app`
3. Make it Public or Private
4. DO NOT add README/gitignore
5. Click "Create repository"

- [ ] Repository created on GitHub
- [ ] Copied repository URL (https://github.com/USERNAME/ocp-app.git)

### Link and Push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ocp-app.git
git branch -M main
git push -u origin main
```

- [ ] Ran `git remote add origin ...`
- [ ] Ran `git branch -M main`
- [ ] Ran `git push -u origin main`
- [ ] Code is visible on GitHub.com

---

## Part 3: Vercel Deployment

### Account Setup:
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"

- [ ] Vercel account created
- [ ] Connected to GitHub

### Deploy Project:
1. Click "Add New Project"
2. Find and select `ocp-app`
3. Click "Import"

- [ ] Project imported

### Environment Variables:
Open your `.env.local` file and copy values:

Add in Vercel:
1. `NEXT_PUBLIC_SUPABASE_URL` = _________________
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = _________________

- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Clicked "Deploy"

### Wait for Build:
- [ ] Build completed successfully (2-5 minutes)
- [ ] Got Vercel URL: _________________________

---

## Part 4: Supabase Configuration

1. Go to https://supabase.com/dashboard
2. Select your project
3. Authentication → URL Configuration
4. Add to "Redirect URLs": `https://YOUR-VERCEL-URL.vercel.app/**`

- [ ] Opened Supabase Dashboard
- [ ] Found URL Configuration
- [ ] Added Vercel URL to Redirect URLs
- [ ] Clicked "Save"

---

## Part 5: Testing

### Test on Computer:
- [ ] Opened Vercel URL in browser
- [ ] Language switcher works (한국어 ↔ English)
- [ ] Calculator works
- [ ] Can sign up / log in
- [ ] Guides page loads correctly

### Test on Mobile:
- [ ] Opened on phone
- [ ] Navigation looks good
- [ ] Calculator works on mobile
- [ ] Touch targets are easy to tap

---

## Part 6: Share with Tester

Send your friend:
- [ ] Vercel URL: ___________________________
- [ ] TESTER_GUIDE.md file
- [ ] Asked them to test on multiple devices

---

## If Something Goes Wrong

### Build Failed?
- [ ] Check build logs in Vercel dashboard
- [ ] Try `npm run build` locally
- [ ] Check all dependencies in package.json

### Supabase Error?
- [ ] Verify environment variables in Vercel
- [ ] Check Supabase redirect URLs
- [ ] Check Supabase logs

### Can't Push to GitHub?
- [ ] Check if you're logged in to GitHub
- [ ] May need Personal Access Token
- [ ] Check repository permissions

---

## Future Updates

When you make changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

- [ ] Bookmark this checklist for future deployments!

---

## Quick Reference URLs

- GitHub: https://github.com
- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard
- Your Repo: https://github.com/YOUR_USERNAME/ocp-app
- Your App: https://___________________________

---

**Date Deployed:** _______________
**Version:** MVP 1.0
**Status:** ⭐ LIVE!
