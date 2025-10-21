# OCP App - Deployment Guide for Testing

## Quick Vercel Deployment (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com - free)
3. Your Supabase credentials ready

### Step 1: Push to GitHub
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - OCP App MVP"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ocp-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure environment variables:
   - Click "Environment Variables"
   - Add these variables from your `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```
4. Click "Deploy"

**That's it!** Vercel will give you a URL like: `https://ocp-app-xyz.vercel.app`

### Step 3: Update Supabase Redirect URLs

After deployment, add your Vercel URL to Supabase:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to "Redirect URLs":
   ```
   https://your-vercel-url.vercel.app/**
   ```

---

## Alternative: Local Network Access

If your friend is on the same WiFi:

**Access URLs:**
- Korean: `http://172.100.100.84:3005/ko`
- English: `http://172.100.100.84:3005/en`

**Keep server running:**
```bash
npm run dev
```

---

## Testing Checklist for Your Friend

Share this checklist with your tester:

### Mobile Testing
- [ ] Open on mobile browser (both iOS and Android if possible)
- [ ] Check header navigation (hamburger menu)
- [ ] Toggle language switcher (한국어 ↔ English)
- [ ] Navigate to Calculator, Guides, Community pages
- [ ] Test all pages in both languages

### Calculator Testing
- [ ] Enter vehicle details (price, country, engine size)
- [ ] Verify calculations appear correct
- [ ] Test different countries (US, Japan, UK, Germany, Other)
- [ ] Test different engine sizes (under 1000cc, 1000-2000cc, over 2000cc)
- [ ] Check that FTA countries (US, UK, Germany) show 0% import duty
- [ ] Check that non-FTA (Japan, Other) show 8% import duty

### Guide System Testing
- [ ] Browse guides list
- [ ] Open individual guides
- [ ] Check formatting and readability
- [ ] Verify "Back to Guides" button works
- [ ] Check footer navigation buttons

### Authentication Testing
- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] Check user avatar/email display
- [ ] Log out
- [ ] Test on both mobile and desktop

### Community/Forum Testing
- [ ] Create new post
- [ ] Reply to posts
- [ ] Test permissions (can only edit own posts)
- [ ] Check post formatting

### Visual/UX Testing
- [ ] Check dark mode toggle (if implemented)
- [ ] Verify all text is readable
- [ ] Check for layout issues on different screen sizes
- [ ] Test landscape and portrait modes on mobile
- [ ] Verify footer displays correctly

### Bug Reporting
Ask your tester to note:
- What device/browser they used
- What they were trying to do
- What they expected vs. what happened
- Screenshots if possible

---

## Quick Links

- **Local Dev**: http://172.100.100.84:3005
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

## Notes
- Database is shared across all deployments
- Changes to guides require running SQL updates in Supabase
- Environment variables must be set in Vercel for production deployment
