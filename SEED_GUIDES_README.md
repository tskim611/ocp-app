# Guide Seeding Instructions

This document explains how to seed your guides database with content.

## Prerequisites

1. **Supabase Project**: You must have a Supabase project set up
2. **Environment Variables**: Your `.env.local` file must contain Supabase credentials
3. **Database Schema**: The `guides` table must exist in your database

---

## Step 1: Set Up Environment Variables

### Create `.env.local` file

In the root of your project, create a file named `.env.local`:

```bash
# From the project root
touch .env.local
```

### Add Your Supabase Credentials

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Where to Find Your Credentials

1. Go to your Supabase Dashboard
2. Select your project
3. Click on **Settings** (gear icon in sidebar)
4. Click on **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 2: Verify Database Schema

Make sure the `guides` table exists with the correct schema:

### Required Table Structure

```sql
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Check if Table Exists

Run this in Supabase SQL Editor:

```sql
SELECT * FROM guides LIMIT 1;
```

If you get an error, you need to create the table first (see `supabase/migrations/` for schema files).

---

## Step 3: Run the Seed Script

### Install Dependencies (if not already done)

```bash
npm install
```

### Run the Seed Command

```bash
npm run seed:guides
```

### Expected Output

```
🌱 Starting guide seed...

📝 Inserting: How to Import a Car from the US to Korea
   ✅ Successfully inserted "us-to-kr-import"

✨ Seed complete!
```

### If Guide Already Exists

```
📝 Inserting: How to Import a Car from the US to Korea
   ⚠️  Guide "us-to-kr-import" already exists, skipping...
```

---

## Step 4: Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select `guides` table
4. You should see your newly seeded guide(s)

---

## Step 5: View on Your Website

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/guides`

3. You should see your guide listed

4. Click on it to view the full content

---

## Troubleshooting

### Error: "Missing Supabase credentials"

**Problem**: `.env.local` file is missing or incomplete

**Solution**:
1. Make sure `.env.local` exists in project root
2. Check that both variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. No quotes needed around values
4. No spaces around `=`

### Error: "relation 'guides' does not exist"

**Problem**: The guides table hasn't been created in Supabase

**Solution**:
1. Go to Supabase SQL Editor
2. Run the schema migration:
   ```sql
   -- See supabase/migrations/20250101000000_initial_schema.sql
   ```
3. Or manually create the table (see Step 2 above)

### Error: "null value in column 'author_id'"

**Problem**: The guides table requires an author_id but none is provided

**Solution**: Update the seed script to use a valid user ID:

```typescript
const guides = [
  {
    slug: 'us-to-kr-import',
    title: '...',
    content: '...',
    author_id: 'your-user-id-here', // Add this line
    published: true
  }
];
```

To get a user ID:
```sql
SELECT id FROM auth.users LIMIT 1;
```

### Error: "duplicate key value violates unique constraint"

**Problem**: A guide with that slug already exists

**Solution**: This is expected behavior. The script skips existing guides. To re-insert:

1. Delete the existing guide:
   ```sql
   DELETE FROM guides WHERE slug = 'us-to-kr-import';
   ```

2. Run the seed script again:
   ```bash
   npm run seed:guides
   ```

---

## Adding More Guides

### Edit the Seed Script

Open `scripts/seed-guides.ts` and add more guides to the array:

```typescript
const guides = [
  {
    slug: 'us-to-kr-import',
    title: 'How to Import a Car from the US to Korea',
    summary: 'Step-by-step guide...',
    content: `# Full markdown content here...`,
    published: true
  },
  {
    slug: 'your-new-guide',
    title: 'Your New Guide Title',
    summary: 'Brief description...',
    content: `# Your Guide

Full content here in markdown...`,
    published: true
  },
  // Add more guides here
];
```

### Run the Seed Script Again

```bash
npm run seed:guides
```

Only new guides will be inserted. Existing ones are skipped.

---

## Guide Content Tips

### Use Markdown Formatting

The `content` field supports full markdown:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet list
- Item 2

1. Numbered list
2. Item 2

[Link text](https://example.com)

![Image alt text](image-url.jpg)

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

> Blockquote

\`inline code\`

\`\`\`javascript
// Code block
const example = "code";
\`\`\`
```

### Slug Best Practices

- Use lowercase
- Use hyphens (not underscores)
- Be descriptive but concise
- Examples: `import-costs`, `required-documents`, `classic-car-exemption`

### Summary Best Practices

- 1-2 sentences
- Describe what the guide covers
- Enticing but accurate
- Example: "Learn how to calculate import taxes, duties, and fees for your vehicle"

---

## Script Details

### What the Script Does

1. Loads environment variables from `.env.local`
2. Connects to Supabase using provided credentials
3. For each guide in the array:
   - Checks if it already exists (by slug)
   - Skips if exists
   - Inserts if new
4. Reports success/failure for each guide

### Script Location

```
scripts/
└── seed-guides.ts
```

### Dependencies Used

- `@supabase/supabase-js` - Supabase client
- `dotenv` - Load environment variables
- `tsx` - Run TypeScript files directly

---

## Production Considerations

### Don't Commit `.env.local`

The `.env.local` file contains sensitive credentials. It's already in `.gitignore`.

**Never commit:**
- `.env.local`
- Any file with actual Supabase keys

**Safe to commit:**
- `.env.example`
- `.env.local.template`
- Seed scripts (without credentials)

### Use Service Role Key for Production Seeding

For production seeding, consider using the service role key instead of anon key:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Update the script to use it:

```typescript
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
```

This bypasses RLS policies and is suitable for admin operations.

---

## Alternative: Manual Guide Creation

### Via Supabase Dashboard

1. Go to **Table Editor** → `guides`
2. Click **Insert row**
3. Fill in:
   - slug: `my-guide`
   - title: `My Guide Title`
   - content: (paste markdown)
   - published: `true`
4. Click **Save**

### Via SQL

```sql
INSERT INTO guides (slug, title, summary, content, published)
VALUES (
  'my-guide',
  'My Guide Title',
  'Brief summary here',
  '# My Guide

Full content in markdown...',
  true
);
```

---

## Summary

**Quick setup:**

1. Create `.env.local` with Supabase credentials
2. Run `npm run seed:guides`
3. Visit `/guides` on your site
4. Done!

**To add more guides:**

1. Edit `scripts/seed-guides.ts`
2. Add new guide objects to the array
3. Run `npm run seed:guides` again

---

## Support

If you encounter issues:

1. Check this README
2. Verify `.env.local` is correct
3. Check Supabase dashboard for errors
4. Review `scripts/seed-guides.ts` for typos
5. Check the console output for specific error messages

Happy guide writing! 📚✨
