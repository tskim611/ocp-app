#!/usr/bin/env node

/**
 * Add Sample Content Script
 * Loads sample guides and community discussions into the database
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addSampleContent() {
  console.log('🚀 Adding sample content to database...\n');

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, '..', 'supabase', 'migrations', 'sample_content.sql');
    const sql = readFileSync(sqlPath, 'utf8');

    // Note: We can't execute raw SQL through the Supabase client in the same way
    // Instead, we'll insert the data programmatically

    console.log('📚 Creating sample guides...');

    // Create demo user first
    const demoUserId = 'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f';

    // Ensure user exists in public.users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: demoUserId,
        email: 'demo@ocpapp.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (userError) {
      console.log('ℹ️  Note: Could not create demo user (may already exist or need auth setup)');
    }

    // Get category IDs
    const { data: categories } = await supabase
      .from('guide_categories')
      .select('id, slug');

    const getCategoryId = (slug) => {
      const cat = categories?.find(c => c.slug === slug);
      return cat?.id;
    };

    // Insert guides
    const guides = [
      {
        title: 'Getting Started: How to Import a Car to Korea',
        slug: 'getting-started-import-car-korea',
        content: `# Getting Started: How to Import a Car to Korea

Importing a vehicle to Korea can seem daunting, but with the right preparation, it's a manageable process. This comprehensive guide will walk you through every step.

## Why Import a Car to Korea?

Many people choose to import vehicles for several reasons:
- **Unique Models**: Access to cars not available in the Korean market
- **Better Pricing**: Sometimes foreign markets offer better deals
- **Personal Connection**: Bringing your car from your home country
- **Classic/Vintage Cars**: Finding rare models abroad

## The Import Process Overview

The import process involves several key stages:

1. **Research & Planning** (1-2 weeks)
2. **Purchase & Documentation** (2-4 weeks)
3. **Shipping** (4-8 weeks)
4. **Customs Clearance** (1-2 weeks)
5. **Registration** (1-2 weeks)

## Total Timeline

Expect the entire process to take **2-4 months** from start to finish.

## Next Steps

1. Use our [Import Cost Calculator](/tools/calculator) to estimate your total costs
2. Read our detailed guides on each stage of the process
3. Join our [Community Forum](/community) to connect with experienced importers

💡 **Pro Tip**: Start your research at least 3 months before you plan to have the car in Korea!`,
        category_id: getCategoryId('getting-started'),
        author_id: demoUserId,
        published: true,
        view_count: 247
      },
      {
        title: 'Understanding Korean Import Taxes and Duties',
        slug: 'understanding-korean-import-taxes',
        content: `# Understanding Korean Import Taxes and Duties

One of the most complex aspects of importing a vehicle to Korea is understanding the tax structure.

## Overview of Taxes

When you import a vehicle to Korea, you'll pay several different taxes:

1. **Import Duty** - 0% to 8% (depends on FTA status)
2. **Special Consumption Tax** - Varies by engine size
3. **Education Tax** - 30% of special consumption tax
4. **Value Added Tax (VAT)** - 10% of total value
5. **Registration Tax** - Varies by engine size and region

## Use Our Calculator

Use our [Import Cost Calculator](/tools/calculator) to get accurate estimates for your specific vehicle!

📊 **Remember**: Budget an extra 10-20% for unexpected fees!`,
        category_id: getCategoryId('taxes-fees'),
        author_id: demoUserId,
        published: true,
        view_count: 189
      },
      {
        title: 'Shipping Methods: RORO vs Container Shipping',
        slug: 'shipping-methods-roro-vs-container',
        content: `# Shipping Methods: RORO vs Container Shipping

Choosing the right shipping method is crucial for your import. This guide compares the two main options.

## RORO (Roll-on/Roll-off)

**Pros:**
- Cost-effective ($1,500 - $2,500)
- Faster processing
- Widely available

**Cons:**
- Exposed to elements
- Can't ship personal items
- Less security

## Container Shipping

**Pros:**
- Maximum protection
- Can ship personal items
- Better for valuable cars

**Cons:**
- Higher cost ($2,500 - $5,000+)
- Slower loading

🚢 **Pro Tip**: For vehicles worth $30,000-$50,000, compare the cost difference - sometimes the extra protection is worth just a few hundred dollars more!`,
        category_id: getCategoryId('shipping'),
        author_id: demoUserId,
        published: true,
        view_count: 156
      }
    ];

    for (const guide of guides) {
      const { error } = await supabase
        .from('guides')
        .insert(guide);

      if (error) {
        console.error(`Error adding guide "${guide.title}":`, error.message);
      } else {
        console.log(`✅ Added guide: ${guide.title}`);
      }
    }

    console.log('\n💬 Creating sample community threads...');

    // Get forum category IDs
    const { data: forumCategories } = await supabase
      .from('forum_categories')
      .select('id, slug');

    const getForumCategoryId = (slug) => {
      const cat = forumCategories?.find(c => c.slug === slug);
      return cat?.id;
    };

    // Insert threads
    const threads = [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'Just imported my 2018 Mustang GT - Here\'s what I learned!',
        content: `Hey everyone! 👋

I just successfully imported my 2018 Mustang GT from California to Seoul!

**Total time: About 11 weeks from purchase to driving!**

**Total landed cost: $46,650**

Using the calculator on this site helped me budget accurately - I was only off by about $300!

**Would I do it again?** Absolutely! I saved about $15,000 compared to buying the same car in Korea.

Happy to answer any questions!`,
        category_id: getForumCategoryId('success-stories'),
        author_id: demoUserId
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        title: 'FTA certificate question - BMW from Germany',
        content: `Hi everyone,

I'm looking to import a 2020 BMW M4 from Germany to Korea. I know the EU has an FTA with Korea.

My questions:
1. Do I need to get the FTA certificate before shipping?
2. Where exactly do I get this certificate?
3. Has anyone here imported from Germany recently?

Thanks in advance!`,
        category_id: getForumCategoryId('general'),
        author_id: demoUserId
      },
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        title: 'RORO vs Container for a Porsche 911?',
        content: `Planning to import a 2019 Porsche 911 Carrera S from the US.

The price difference is about $2,000 ($2,300 for RORO vs $4,300 for exclusive container).

What would you do? Is the container worth it for a car this expensive?

Appreciate any insights!`,
        category_id: getForumCategoryId('shipping'),
        author_id: demoUserId
      }
    ];

    for (const thread of threads) {
      const { error } = await supabase
        .from('threads')
        .insert(thread);

      if (error) {
        console.error(`Error adding thread "${thread.title}":`, error.message);
      } else {
        console.log(`✅ Added thread: ${thread.title}`);
      }
    }

    console.log('\n💭 Creating sample comments...');

    // Insert comments
    const comments = [
      {
        thread_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        author_id: demoUserId,
        content: 'Congratulations! 🎉 That\'s awesome that you saved $15k. The Mustang GT is a beast!\n\nQuick question - did you have any issues with the emissions testing in Korea?'
      },
      {
        thread_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        author_id: demoUserId,
        content: 'Great write-up! I\'m planning to import a Ford F-150 from Texas.\n\nDid you use the calculator here to estimate costs? How accurate was it?'
      },
      {
        thread_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        author_id: demoUserId,
        content: 'For an $85k Porsche, I\'d 100% go with container shipping. The $2k difference is only 2.3% of the car\'s value - totally worth it for peace of mind!'
      },
      {
        thread_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        author_id: demoUserId,
        content: 'Container 100%. I did RORO with my Audi and regretted it. Got some minor scratches.\n\nFor a Porsche at that price point, protect your investment!'
      }
    ];

    for (const comment of comments) {
      const { error } = await supabase
        .from('comments')
        .insert(comment);

      if (error) {
        console.error('Error adding comment:', error.message);
      } else {
        console.log('✅ Added comment');
      }
    }

    console.log('\n✅ Sample content added successfully!');
    console.log('📚 Added 3 guide articles');
    console.log('💬 Added 3 community threads');
    console.log('💭 Added 4 comments\n');
    console.log('🌐 Visit your app to see the sample content!');
    console.log('   Guides: http://localhost:3005/guides');
    console.log('   Community: http://localhost:3005/community');

  } catch (error) {
    console.error('❌ Error adding sample content:', error);
    process.exit(1);
  }
}

addSampleContent();
