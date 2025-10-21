-- ============================================
-- ADD SAMPLE CONTENT - SIMPLE VERSION
-- ============================================
-- This script adds sample guides and community posts
-- Run this in Supabase SQL Editor
-- ============================================

-- First, let's get or create a demo user ID
DO $$
DECLARE
  demo_user_id UUID;
  getting_started_cat_id UUID;
  taxes_cat_id UUID;
  shipping_cat_id UUID;
  general_forum_cat_id UUID;
  success_forum_cat_id UUID;
  shipping_forum_cat_id UUID;
BEGIN
  -- Try to get the first existing user, or use a fixed demo UUID
  SELECT id INTO demo_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;

  IF demo_user_id IS NULL THEN
    demo_user_id := 'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f';
    -- Insert demo user
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (demo_user_id, 'demo@ocpapp.com', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RAISE NOTICE 'Using user ID: %', demo_user_id;

  -- Get category IDs
  SELECT id INTO getting_started_cat_id FROM guide_categories WHERE slug = 'getting-started' LIMIT 1;
  SELECT id INTO taxes_cat_id FROM guide_categories WHERE slug = 'taxes-fees' LIMIT 1;
  SELECT id INTO shipping_cat_id FROM guide_categories WHERE slug = 'shipping' LIMIT 1;
  SELECT id INTO general_forum_cat_id FROM forum_categories WHERE slug = 'general' LIMIT 1;
  SELECT id INTO success_forum_cat_id FROM forum_categories WHERE slug = 'success-stories' LIMIT 1;
  SELECT id INTO shipping_forum_cat_id FROM forum_categories WHERE slug = 'shipping' LIMIT 1;

  -- ============================================
  -- ADD SAMPLE GUIDES
  -- ============================================

  -- Guide 1: Getting Started
  INSERT INTO guides (
    title,
    slug,
    content,
    category_id,
    author_id,
    published,
    view_count
  ) VALUES (
    'Getting Started: How to Import a Car to Korea',
    'getting-started-import-car-korea',
    E'# Getting Started: How to Import a Car to Korea\n\nImporting a vehicle to Korea can seem daunting, but with the right preparation, it''s manageable!\n\n## Why Import a Car to Korea?\n\n- **Unique Models**: Access to cars not available in the Korean market\n- **Better Pricing**: Sometimes foreign markets offer better deals  \n- **Personal Connection**: Bringing your car from your home country\n\n## The Import Process Overview\n\n1. **Research & Planning** (1-2 weeks)\n2. **Purchase & Documentation** (2-4 weeks)\n3. **Shipping** (4-8 weeks)\n4. **Customs Clearance** (1-2 weeks)\n5. **Registration** (1-2 weeks)\n\n**Total Timeline**: Expect 2-4 months from start to finish.\n\n## Key Requirements\n\n### Documentation Needed:\n- Original vehicle title\n- Bill of sale\n- Export certificate\n- Shipping documents\n- Insurance proof\n\n### Costs to Consider:\n- Purchase price\n- Shipping (RORO or Container)\n- Import duties (0-8%)\n- VAT (10%)\n- Special consumption tax\n- Education tax\n- Registration fees\n\n## Free Trade Agreement (FTA) Benefits\n\nVehicles from FTA countries (USA, EU, etc.) may qualify for:\n- **0% import duty** instead of 8%\n- Significant cost savings\n\n## Next Steps\n\n1. Use our [Import Cost Calculator](/tools/calculator) to estimate costs\n2. Read our detailed guides\n3. Join our [Community Forum](/community)\n\n💡 **Pro Tip**: Start your research 3 months before you need the car in Korea!',
    getting_started_cat_id,
    demo_user_id,
    true,
    247
  ) ON CONFLICT (slug) DO NOTHING;

  -- Guide 2: Taxes and Duties
  INSERT INTO guides (
    title,
    slug,
    content,
    category_id,
    author_id,
    published,
    view_count
  ) VALUES (
    'Understanding Korean Import Taxes and Duties',
    'understanding-korean-import-taxes',
    E'# Understanding Korean Import Taxes and Duties\n\nThe tax structure for importing vehicles is complex. Here''s a breakdown:\n\n## Overview of Taxes\n\n1. **Import Duty** - 0% to 8% (FTA dependent)\n2. **Special Consumption Tax** - Varies by engine size\n3. **Education Tax** - 30% of special consumption tax\n4. **VAT** - 10% of total value\n5. **Registration Tax** - Varies by region\n\n## Import Duty Details\n\n**Standard Rate**: 8% of CIF value\n\n**FTA Rate**: 0% for vehicles from:\n- United States\n- European Union\n- Chile, Turkey, and other FTA partners\n\n## Special Consumption Tax\n\n| Engine Size | Tax Rate |\n|------------|----------|\n| Under 1000cc | Exempt |\n| 1000-2000cc | 5% |\n| Over 2000cc | 5% |\n\n## Example Calculation\n\nFor a **2020 Ford Mustang (2.3L)** at **$30,000**:\n\n```\nPurchase: $30,000\nShipping: $2,500\nInsurance: $450\nCIF Total: $32,950 = ₩44,482,500\n\nImport Duty (0% FTA): ₩0\nSpecial Consumption Tax: ₩2,224,125\nEducation Tax: ₩667,238\nVAT: ₩4,737,386\nRegistration: ₩3,113,775\nFees: ₩1,500,000\n\nTotal: ₩56,725,024 ($42,018)\n```\n\n## Use Our Calculator\n\nGet accurate estimates with our [Import Cost Calculator](/tools/calculator)!\n\n📊 Budget an extra 10-20% for unexpected fees.',
    taxes_cat_id,
    demo_user_id,
    true,
    189
  ) ON CONFLICT (slug) DO NOTHING;

  -- Guide 3: Shipping Methods
  INSERT INTO guides (
    title,
    slug,
    content,
    category_id,
    author_id,
    published,
    view_count
  ) VALUES (
    'Shipping Methods: RORO vs Container',
    'shipping-methods-roro-vs-container',
    E'# Shipping Methods: RORO vs Container\n\nChoosing the right shipping method is crucial.\n\n## RORO (Roll-on/Roll-off)\n\n### How It Works\n- Vehicle driven onto ship\n- Parked in cargo hold\n- Driven off at destination\n\n### Pros ✅\n- **Cost-effective**: $1,500-$2,500 (USA to Korea)\n- Faster processing\n- Widely available\n\n### Cons ❌\n- Exposed to elements\n- Can''t ship personal items\n- Less security\n\n## Container Shipping\n\n### Types\n1. **Exclusive** - Your vehicle only\n2. **Shared** - Multiple vehicles\n\n### Pros ✅\n- Maximum protection\n- Can ship personal items\n- Better for valuable cars\n\n### Cons ❌\n- Higher cost: $2,500-$5,000+\n- Slower loading\n\n## Comparison Table\n\n| Feature | RORO | Container |\n|---------|------|----------|\n| Cost | $1,500-2,500 | $2,500-7,000 |\n| Protection | Moderate | Excellent |\n| Speed | Faster | Slower |\n| Personal Items | No | Yes |\n\n## Recommendation\n\n**Choose RORO if:**\n- Car worth less than $30,000\n- Budget is priority\n- Daily driver vehicle\n\n**Choose Container if:**\n- Car worth more than $50,000\n- Classic/exotic vehicle\n- Need maximum protection\n\n🚢 **Pro Tip**: For $30-50k vehicles, compare costs - sometimes container is only a few hundred dollars more!',
    shipping_cat_id,
    demo_user_id,
    true,
    156
  ) ON CONFLICT (slug) DO NOTHING;

  -- ============================================
  -- ADD SAMPLE COMMUNITY THREADS
  -- ============================================

  -- Thread 1: Success Story
  INSERT INTO threads (
    title,
    body,
    category_id,
    author_id
  ) VALUES (
    'Just imported my 2018 Mustang GT - Here''s what I learned!',
    E'Hey everyone! 👋\n\nI just successfully imported my 2018 Mustang GT from California to Seoul!\n\n**Timeline:** About 11 weeks from purchase to driving!\n\n**Total landed cost:** $46,650\n\nUsing the calculator on this site helped me budget accurately - I was only off by about $300!\n\n**Would I do it again?** Absolutely! I saved about $15,000 compared to buying the same car in Korea.\n\nHappy to answer any questions!',
    success_forum_cat_id,
    demo_user_id
  ) ON CONFLICT DO NOTHING;

  -- Thread 2: General Question
  INSERT INTO threads (
    title,
    body,
    category_id,
    author_id
  ) VALUES (
    'FTA certificate question - BMW from Germany',
    E'Hi everyone,\n\nI''m looking to import a 2020 BMW M4 from Germany to Korea. I know the EU has an FTA with Korea.\n\nMy questions:\n1. Do I need to get the FTA certificate before shipping?\n2. Where exactly do I get this certificate?\n3. Has anyone here imported from Germany recently?\n\nThe car costs €65,000. Thanks in advance!',
    general_forum_cat_id,
    demo_user_id
  ) ON CONFLICT DO NOTHING;

  -- Thread 3: Shipping Discussion
  INSERT INTO threads (
    title,
    body,
    category_id,
    author_id
  ) VALUES (
    'RORO vs Container for a Porsche 911?',
    E'Planning to import a 2019 Porsche 911 Carrera S from the US (purchase price around $85,000).\n\nThe price difference is about $2,000 ($2,300 for RORO vs $4,300 for exclusive container).\n\nWhat would you do? Is the container worth it for a car this expensive?\n\nI''ve read mixed reviews about RORO. Appreciate any insights!',
    shipping_forum_cat_id,
    demo_user_id
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Sample content added successfully!';
  RAISE NOTICE '📚 Added 3 guide articles';
  RAISE NOTICE '💬 Added 3 community threads';
  RAISE NOTICE '';
  RAISE NOTICE 'Visit your app to see the content:';
  RAISE NOTICE 'Guides: http://localhost:3005/guides';
  RAISE NOTICE 'Community: http://localhost:3005/community';
END $$;
