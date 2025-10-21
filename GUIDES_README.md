# Guides System Documentation

Dynamic guides system with Supabase integration and markdown rendering.

## Features

- ✅ Dynamic routing with `/guides/[slug]`
- ✅ Markdown rendering with syntax highlighting
- ✅ Supabase database integration
- ✅ Server-side rendering (SSR)
- ✅ SEO-optimized metadata
- ✅ Mobile-responsive design
- ✅ Back navigation
- ✅ Dark mode support
- ✅ Bilingual content (English/Korean)

## File Structure

```
src/
├── app/
│   └── guides/
│       ├── page.tsx              # Guides index/list page
│       └── [slug]/
│           └── page.tsx          # Dynamic guide detail page
├── components/
│   └── MarkdownContent.tsx       # Markdown renderer component
└── lib/
    ├── database.types.ts         # TypeScript types
    └── supabase-server.ts        # Server-side Supabase client

supabase/
└── seed-guides.sql               # Sample guide data
```

## How It Works

### 1. Guides Index Page (`/guides`)

**Server Component** that:

- Fetches all published guides from Supabase
- Displays guides in a list with previews
- Shows "Coming Soon" state if no guides
- Links to individual guide pages

**Features:**

- SEO metadata
- Responsive grid layout
- Hover effects
- Quick tips section
- Link to calculator

### 2. Guide Detail Page (`/guides/[slug]`)

**Server Component** that:

- Fetches specific guide by slug
- Renders markdown content
- Shows 404 if guide not found
- Generates metadata dynamically

**Features:**

- Back to guides button
- Beautiful header with gradient
- Publication/update dates
- Markdown rendering
- Footer navigation (guides list, calculator)
- Help section with community link
- Print/share functionality

### 3. Markdown Renderer Component

**Client Component** that:

- Parses markdown to HTML
- Applies custom styling
- Sanitizes content for security
- Supports GitHub Flavored Markdown

**Supported Elements:**

- Headers (h1-h6)
- Paragraphs
- Links (internal/external)
- Lists (ordered/unordered)
- Code blocks (inline & blocks)
- Tables
- Blockquotes
- Images
- Bold/italic text
- Horizontal rules

## Setup Instructions

### Step 1: Database Setup

The guides table should already exist from the initial schema migration.

Verify with:

```sql
SELECT * FROM guides LIMIT 1;
```

### Step 2: Add Sample Guides

Run the seed script:

```bash
# Option 1: Supabase Dashboard
# Go to SQL Editor and run the content of supabase/seed-guides.sql

# Option 2: Supabase CLI
supabase db reset --linked
# Or manually run:
psql "YOUR_CONNECTION_STRING" -f supabase/seed-guides.sql
```

**Important**: Replace `'YOUR_USER_ID_HERE'` with an actual user ID:

```sql
-- First, get a user ID
SELECT id FROM auth.users LIMIT 1;

-- Then update the guides
UPDATE public.guides
SET author_id = 'actual-user-id-here'
WHERE author_id = 'YOUR_USER_ID_HERE';
```

### Step 3: Test the Routes

Visit:

- `/guides` - Should show list of guides
- `/guides/getting-started-vehicle-imports` - Should show first guide
- `/guides/understanding-import-costs` - Should show second guide
- `/guides/required-documentation` - Should show third guide

## Creating New Guides

### Option 1: Via Supabase Dashboard

1. Go to Table Editor → `guides`
2. Click "Insert" → "Insert row"
3. Fill in:
   - `slug`: URL-friendly identifier (e.g., `my-new-guide`)
   - `title`: Guide title
   - `content`: Markdown content
   - `author_id`: Your user ID
   - `published`: `true` to publish

### Option 2: Via SQL

```sql
INSERT INTO public.guides (slug, title, content, author_id, published)
VALUES (
  'my-new-guide',
  'My New Guide Title',
  '# My Guide

This is the content in markdown format.

## Section 1

Content here...
',
  'your-user-id',
  true
);
```

### Option 3: Programmatically

```typescript
import { createServerClient } from '@/lib/supabase-server';

const supabase = await createServerClient();

const { data, error } = await supabase
  .from('guides')
  .insert({
    slug: 'my-new-guide',
    title: 'My New Guide',
    content: '# Guide content in markdown',
    author_id: userId,
    published: true,
  })
  .select()
  .single();
```

## Markdown Writing Tips

### Headers

```markdown
# H1 - Main Title

## H2 - Section

### H3 - Subsection

#### H4 - Minor section
```

### Emphasis

```markdown
**Bold text**
_Italic text_
**_Bold and italic_**
```

### Lists

```markdown
Unordered:

- Item 1
- Item 2
  - Nested item

Ordered:

1. First
2. Second
3. Third
```

### Links

```markdown
[Link text](https://example.com)
[Internal link](/calculator)
```

### Code

```markdown
Inline: `code here`

Block:
\`\`\`javascript
const example = "code block";
\`\`\`
```

### Tables

```markdown
| Column 1 | Column 2 |
| -------- | -------- |
| Data 1   | Data 2   |
| Data 3   | Data 4   |
```

### Blockquotes

```markdown
> Important note or quote
> Can span multiple lines
```

### Images

```markdown
![Alt text](image-url.jpg)
```

## Styling Customization

Edit `src/components/MarkdownContent.tsx` to customize:

### Change Colors

```typescript
// Link color
a: ({ href, children }) => (
  <a className="text-blue-600 dark:text-blue-400">
    {children}
  </a>
),
```

### Change Code Block Style

```typescript
pre: ({ children }) => (
  <pre className="bg-gray-50 dark:bg-gray-900">
    {children}
  </pre>
),
```

### Change Heading Sizes

```typescript
h1: ({ children }) => (
  <h1 className="text-4xl font-bold">
    {children}
  </h1>
),
```

## SEO Optimization

The system automatically generates:

### Meta Tags

- Title from guide title
- Description from content preview
- Open Graph tags
- Twitter cards

### URL Structure

- Clean URLs: `/guides/slug-here`
- Descriptive slugs
- No query parameters

## Performance

### Server-Side Rendering

- Guides fetched at build time
- Instant page loads
- Better SEO

### Caching

- Static generation where possible
- Supabase query optimization
- Efficient markdown parsing

## Security

### Content Sanitization

- `rehype-sanitize` removes dangerous HTML
- XSS protection built-in
- Safe rendering of user content

### Authentication

- RLS policies enforce permissions
- Only published guides shown publicly
- Author-only unpublished access

## Troubleshooting

### Guides Not Showing

**Check:**

1. Guides exist in database
2. `published = true`
3. No SQL errors in logs
4. Supabase connection working

**Test Query:**

```sql
SELECT * FROM guides WHERE published = true;
```

### Markdown Not Rendering

**Check:**

1. Content field has markdown
2. No syntax errors in markdown
3. Console for React errors
4. MarkdownContent component imported

### 404 on Guide Pages

**Check:**

1. Slug matches database exactly
2. Guide is published
3. Dynamic route file exists
4. No typos in URL

### Styling Issues

**Check:**

1. Tailwind CSS working
2. Dark mode classes present
3. Prose plugin enabled
4. Custom styles not conflicting

## Mobile Responsiveness

All components are mobile-optimized:

### Guides List

- Single column on mobile
- Touch-friendly cards
- Readable text sizes

### Guide Detail

- Responsive padding
- Readable line lengths
- Touch-friendly buttons
- Sticky navigation

### Markdown Content

- Responsive images
- Horizontal scroll for tables/code
- Readable font sizes
- Touch-friendly links

## Best Practices

### Content

1. ✅ Use descriptive titles
2. ✅ Write clear, concise content
3. ✅ Include examples
4. ✅ Use proper markdown formatting
5. ✅ Add relevant images

### Technical

1. ✅ Use semantic slugs
2. ✅ Test on mobile
3. ✅ Check dark mode
4. ✅ Optimize images
5. ✅ Validate markdown

### SEO

1. ✅ Descriptive titles (50-60 chars)
2. ✅ Meta descriptions (150-160 chars)
3. ✅ Use headers hierarchically
4. ✅ Add alt text to images
5. ✅ Internal linking

## Future Enhancements

Potential additions:

- [ ] Search functionality
- [ ] Categories/tags
- [ ] Related guides
- [ ] Table of contents
- [ ] Reading time estimate
- [ ] Author profiles
- [ ] Comments section
- [ ] Like/bookmark features
- [ ] Print stylesheet
- [ ] PDF export
- [ ] Social sharing buttons
- [ ] Guide versioning

## Support

For issues or questions:

- Check this documentation
- Review component code
- Test with sample data
- Check Supabase logs
- Ask in community

## Related Files

- `src/lib/database.types.ts` - Type definitions
- `src/lib/db-helpers.ts` - Query helpers
- `supabase/migrations/20250101000000_initial_schema.sql` - Schema
- `supabase/README.md` - Database documentation
