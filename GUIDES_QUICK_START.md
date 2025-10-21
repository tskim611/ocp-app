# Guides System - Quick Start

## ✅ Already Built & Ready!

The complete dynamic guides system is already implemented and ready to use.

## 📂 File Locations

```
✅ src/app/guides/[slug]/page.tsx    - Dynamic guide page
✅ src/app/guides/page.tsx           - Guides list page
✅ src/components/MarkdownContent.tsx - Markdown renderer
✅ supabase/seed-guides.sql          - Sample data
```

## 🚀 Quick Setup (3 Steps)

### Step 1: Add Sample Data

In Supabase SQL Editor, run:

```sql
-- From file: supabase/seed-guides.sql
-- Then update author_id:

UPDATE public.guides
SET author_id = 'your-user-id-here'
WHERE author_id = 'YOUR_USER_ID_HERE';
```

### Step 2: Test Routes

```bash
npm run dev
```

Visit:
- http://localhost:3000/guides
- http://localhost:3000/guides/getting-started-vehicle-imports

### Step 3: Add Your Own Guide

```sql
INSERT INTO public.guides (slug, title, content, author_id, published)
VALUES (
  'my-guide',
  'My Guide Title',
  '# My Guide

Full markdown content here...
',
  'your-user-id',
  true
);
```

## 💡 Key Features

### Dynamic Route: `/guides/[slug]`
- ✅ Server-side data fetching
- ✅ Supabase integration
- ✅ Markdown rendering
- ✅ SEO optimized
- ✅ Mobile responsive

### What's Included:
```typescript
// Server Component
async function getGuide(slug: string) {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return data;
}

// Render
<MarkdownContent content={guide.content} />
```

### Database Schema:
```sql
guides
├── slug         TEXT (UNIQUE)
├── title        TEXT
├── content      TEXT (markdown)
├── author_id    UUID
├── published    BOOLEAN
├── created_at   TIMESTAMPTZ
└── updated_at   TIMESTAMPTZ
```

## 🎨 Features on Page

**Header:**
- Title
- Publication date
- Update date
- Gradient background

**Content:**
- Markdown rendered to HTML
- Syntax highlighting
- Tables, lists, code blocks
- Images support
- Dark mode

**Navigation:**
- ← Back to Guides button
- View All Guides button
- Try Calculator button
- Community link

## 📝 Creating New Guides

### Method 1: Supabase Dashboard
1. Go to Table Editor → guides
2. Insert row
3. Fill: slug, title, content (markdown), author_id, published=true

### Method 2: SQL
```sql
INSERT INTO guides (slug, title, content, author_id, published)
VALUES ('slug-here', 'Title', '# Content', 'user-id', true);
```

### Method 3: Code
```typescript
const { data } = await supabase
  .from('guides')
  .insert({
    slug: 'my-guide',
    title: 'My Guide',
    content: '# Guide content',
    author_id: userId,
    published: true
  });
```

## 🔍 Example URLs

After seeding data:
- `/guides/getting-started-vehicle-imports`
- `/guides/understanding-import-costs`
- `/guides/required-documentation`

## 📱 Mobile Responsive

All pages automatically adapt:
- Single column on mobile
- Touch-friendly buttons
- Readable font sizes
- Horizontal scroll for tables
- Responsive images

## 🎯 What You Get

```
/guides                    → List all guides
/guides/[slug]            → Individual guide
  ├── Back button
  ├── Title header
  ├── Publication info
  ├── Markdown content
  ├── Navigation footer
  └── Help section
```

## 🔗 Related Documentation

- `GUIDES_README.md` - Complete documentation
- `supabase/seed-guides.sql` - Sample data
- `supabase/README.md` - Database schema

## 💻 Code Examples

### Fetch Guide (Server Component)
```typescript
import { createServerClient } from '@/lib/supabase-server';

const supabase = await createServerClient();
const { data: guide } = await supabase
  .from('guides')
  .select('*')
  .eq('slug', 'my-guide')
  .single();
```

### Render Markdown
```typescript
import MarkdownContent from '@/components/MarkdownContent';

<MarkdownContent content={guide.content} />
```

### Link to Guide
```typescript
<Link href={`/guides/${guide.slug}`}>
  {guide.title}
</Link>
```

## ⚡ Quick Commands

```bash
# Run dev server
npm run dev

# Format code
npx prettier --write "src/app/guides/**/*.tsx"

# Check build
npm run build

# View logs (Supabase)
supabase logs
```

## 🎨 Customization

### Change Markdown Styles
Edit: `src/components/MarkdownContent.tsx`

### Change Page Layout
Edit: `src/app/guides/[slug]/page.tsx`

### Change List View
Edit: `src/app/guides/page.tsx`

## 🐛 Troubleshooting

**No guides showing?**
- Check: Database has guides with `published=true`
- Run: `SELECT * FROM guides WHERE published=true;`

**404 on guide page?**
- Check: Slug matches exactly (case-sensitive)
- Check: Guide is published

**Markdown not rendering?**
- Check: Content field has markdown
- Check: MarkdownContent component imported

## 🎉 You're All Set!

The system is production-ready. Just add your guide data and start using it!

**Test it now:**
```bash
npm run dev
# Then visit: http://localhost:3000/guides
```
