# Deployment Guide: Next.js App to Vercel

This guide will walk you through deploying your Next.js app to Vercel with automatic deployments from GitHub.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com - you can use your GitHub account)
- Your Supabase credentials ready

---

## Step 1: Push Code to GitHub

### 1.1 Add and Commit Your Code

From the `ocp-app` directory, run:

```bash
git add .
git commit -m "Initial commit: Next.js app with TypeScript, Tailwind, and Supabase"
```

### 1.2 Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ocp-app` (or your preferred name)
3. Make it Public or Private (your choice)
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 1.3 Push to GitHub

GitHub will show you commands. Use these (replace with your actual repo URL):

```bash
git remote add origin https://github.com/YOUR-USERNAME/ocp-app.git
git branch -M main
git push -u origin main
```

**Note:** If you're still on `master` branch, rename it to `main`:

```bash
git branch -M main
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In" (use GitHub for easiest integration)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Select your GitHub account and find `ocp-app`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   | Name                            | Value                     |
   | ------------------------------- | ------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    |

   **Important:** Add these for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for the build to complete
   - You'll get a live URL like: `https://ocp-app-xyz.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from ocp-app directory)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ocp-app
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

---

## Step 3: Configure Auto-Deploy on Push

**Good news:** This is already set up automatically! 🎉

When you connected your GitHub repository to Vercel:

- **Every push to `main`** → Automatic production deployment
- **Every push to other branches** → Automatic preview deployment
- **Every pull request** → Automatic preview deployment with comment

### How It Works

1. Push to `main` branch:

   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. Vercel automatically:
   - Detects the push
   - Runs the build
   - Deploys to production
   - Updates your live URL

3. You'll receive:
   - Email notification (if enabled)
   - GitHub commit status check
   - Deployment comment on PRs

### View Deployments

- **Dashboard:** https://vercel.com/dashboard
- **Project Settings:** Click your project → "Deployments" tab
- **GitHub Integration:** Vercel bot comments on commits/PRs

---

## Step 4: Verify Deployment

1. **Visit Your Live URL**
   - Example: `https://ocp-app-xyz.vercel.app`
   - Check that all pages load correctly

2. **Test Supabase Connection**
   - Add the `SupabaseExample` component to a page to verify connection
   - Check browser console for any errors

3. **Check Build Logs**
   - Go to Vercel dashboard → Your project → Latest deployment
   - Click "View Build Logs" if there are any issues

---

## Step 5: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., `myapp.com`)
4. Follow Vercel's instructions to update your DNS records
5. Vercel automatically provisions SSL certificates

---

## Troubleshooting

### Build Fails

**Check environment variables:**

- Go to Vercel Dashboard → Project Settings → Environment Variables
- Ensure all required variables are set
- Redeploy after adding variables

**Check build logs:**

```bash
# Build locally to test
npm run build
```

### Environment Variables Not Working

- Make sure variable names start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Clear build cache: Dashboard → Settings → General → Clear Build Cache

### Supabase Connection Issues

1. Verify environment variables are correct
2. Check Supabase project is active
3. Verify API keys have correct permissions
4. Check browser console for detailed errors

---

## Monitoring and Analytics

### View Analytics

Vercel provides built-in analytics:

- Dashboard → Your Project → "Analytics" tab
- View page views, visitor data, and performance metrics

### View Logs

Real-time logs:

```bash
vercel logs YOUR-DEPLOYMENT-URL
```

Or view in dashboard:

- Dashboard → Your Project → Deployments → Click deployment → "Logs"

---

## Useful Commands

```bash
# View all deployments
vercel ls

# View project info
vercel inspect YOUR-DEPLOYMENT-URL

# Pull environment variables locally
vercel env pull

# Link local project to Vercel
vercel link

# Open project in browser
vercel open
```

---

## Next Steps

✅ Your app is deployed with auto-deploy enabled!

**Recommended Next Steps:**

1. Set up a custom domain
2. Enable Vercel Analytics
3. Configure preview deployments for development branches
4. Set up GitHub branch protection rules
5. Configure Vercel Speed Insights for performance monitoring

**Learn More:**

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel + Supabase Guide](https://vercel.com/guides/deploying-nextjs-with-supabase)

---

## Quick Reference

| Action         | Command                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| Deploy         | `git push origin main`                                                   |
| Preview branch | `git push origin feature-branch`                                         |
| Rollback       | Dashboard → Deployments → Click old deployment → "Promote to Production" |
| View logs      | `vercel logs`                                                            |
| Redeploy       | Dashboard → Latest deployment → "⋯" → "Redeploy"                         |

Happy deploying! 🚀
