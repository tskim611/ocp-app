-- ============================================
-- SAMPLE CONTENT - Add realistic data to showcase the app
-- ============================================
-- This adds sample guides and community discussions
-- Run this after COMPLETE_SETUP.sql
-- ============================================

-- First, we need a sample user for the author
-- Note: In production, users would sign up through the auth system
-- For demo purposes, we'll insert a user directly

-- Insert a demo user (this simulates what Supabase Auth would create)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@ocpapp.com',
  crypt('DemoPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- The trigger should automatically create the public.users record
-- But let's make sure it exists
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES (
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  'demo@ocpapp.com',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE GUIDES
-- ============================================

-- Guide 1: Getting Started with Vehicle Imports
INSERT INTO public.guides (
  id,
  title,
  slug,
  content,
  category_id,
  author_id,
  published,
  view_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Getting Started: How to Import a Car to Korea',
  'getting-started-import-car-korea',
  E'# Getting Started: How to Import a Car to Korea\n\nImporting a vehicle to Korea can seem daunting, but with the right preparation, it\'s a manageable process. This comprehensive guide will walk you through every step.\n\n## Why Import a Car to Korea?\n\nMany people choose to import vehicles for several reasons:\n- **Unique Models**: Access to cars not available in the Korean market\n- **Better Pricing**: Sometimes foreign markets offer better deals\n- **Personal Connection**: Bringing your car from your home country\n- **Classic/Vintage Cars**: Finding rare models abroad\n\n## The Import Process Overview\n\nThe import process involves several key stages:\n\n1. **Research & Planning** (1-2 weeks)\n2. **Purchase & Documentation** (2-4 weeks)\n3. **Shipping** (4-8 weeks)\n4. **Customs Clearance** (1-2 weeks)\n5. **Registration** (1-2 weeks)\n\n## Total Timeline\n\nExpect the entire process to take **2-4 months** from start to finish.\n\n## Key Requirements\n\n### Documentation Needed:\n- Original vehicle title\n- Bill of sale\n- Export certificate from origin country\n- Shipping documents\n- Insurance proof\n\n### Costs to Consider:\n- Purchase price\n- Shipping (RORO or Container)\n- Import duties (varies by country, 0-8%)\n- VAT (10%)\n- Special consumption tax (varies by engine size)\n- Education tax (30% of special consumption tax)\n- Registration fees\n- Broker fees\n\n## Free Trade Agreement (FTA) Benefits\n\nIf your vehicle is from an FTA partner country (USA, EU, etc.), you may qualify for:\n- **0% import duty** (instead of 8%)\n- Significant cost savings\n- Faster processing\n\n## Next Steps\n\n1. Use our [Import Cost Calculator](/tools/calculator) to estimate your total costs\n2. Read our detailed guides on each stage of the process\n3. Join our [Community Forum](/community) to connect with experienced importers\n4. Find a reputable customs broker\n\n## Common Pitfalls to Avoid\n\n⚠️ **Warning**: Don\'t skip these important steps:\n- Always verify the vehicle\'s history and condition\n- Ensure all documentation is properly notarized\n- Budget 20% extra for unexpected costs\n- Don\'t underestimate shipping time\n- Check Korean emissions and safety standards\n\n## Need Help?\n\nOur community is here to help! Ask questions in the [Community Forum](/community) and get answers from people who have successfully imported their vehicles.\n\n---\n\n💡 **Pro Tip**: Start your research at least 3 months before you plan to have the car in Korea. This gives you time to handle any unexpected issues.\n\nGood luck with your import journey! 🚗',
  (SELECT id FROM public.guide_categories WHERE slug = 'getting-started' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  true,
  247,
  now() - interval '15 days',
  now() - interval '15 days'
);

-- Guide 2: Understanding Korean Import Taxes
INSERT INTO public.guides (
  id,
  title,
  slug,
  content,
  category_id,
  author_id,
  published,
  view_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Understanding Korean Import Taxes and Duties',
  'understanding-korean-import-taxes',
  E'# Understanding Korean Import Taxes and Duties\n\nOne of the most complex aspects of importing a vehicle to Korea is understanding the tax structure. This guide breaks down each tax and fee you\'ll encounter.\n\n## Overview of Taxes\n\nWhen you import a vehicle to Korea, you\'ll pay several different taxes:\n\n1. **Import Duty** - 0% to 8% (depends on FTA status)\n2. **Special Consumption Tax** - Varies by engine size\n3. **Education Tax** - 30% of special consumption tax\n4. **Value Added Tax (VAT)** - 10% of total value\n5. **Registration Tax** - Varies by engine size and region\n\n## Detailed Breakdown\n\n### 1. Import Duty\n\n**Standard Rate**: 8% of CIF value (Cost + Insurance + Freight)\n\n**FTA Rate**: 0% for vehicles from:\n- United States\n- European Union countries\n- Chile\n- Turkey\n- And other FTA partner nations\n\n**How to Qualify for FTA**:\n- Vehicle must be manufactured in the FTA country\n- Need certificate of origin\n- Proper documentation required\n\n### 2. Special Consumption Tax\n\nThis tax is based on your engine displacement:\n\n| Engine Size | Tax Rate |\n|------------|----------|\n| Under 1000cc | Exempt |\n| 1000cc - 2000cc | 5% |\n| Over 2000cc | 5% |\n\n**Note**: Hybrid and electric vehicles may have reduced rates or exemptions.\n\n### 3. Education Tax\n\nSimple calculation:\n- **30% of the Special Consumption Tax**\n- Example: If special consumption tax is ₩1,000,000, education tax is ₩300,000\n\n### 4. Value Added Tax (VAT)\n\nThe VAT is **10%** of the sum of:\n- CIF value\n- Import duty\n- Special consumption tax\n- Education tax\n\n### 5. Registration Tax\n\nVaries by:\n- Engine size\n- Vehicle age\n- Region of registration\n\nTypical rates: **5-7% of vehicle value**\n\n## Example Calculation\n\nLet\'s calculate taxes for a **2020 Ford Mustang (2.3L engine)** purchased for **$30,000**:\n\n```\nPurchase Price: $30,000\nShipping (RORO): $2,500\nInsurance: $450\n-----------------\nCIF Total: $32,950 = ₩44,482,500 (at 1,350 KRW/USD)\n\nImport Duty (0% - USA FTA): ₩0\nSpecial Consumption Tax (5%): ₩2,224,125\nEducation Tax (30% of SCT): ₩667,238\nVAT (10%): ₩4,737,386\nRegistration Tax (~7%): ₩3,113,775\nPort & Broker Fees: ₩1,500,000\n\n=================================\nTotal Landed Cost: ₩56,725,024\n(approximately $42,018 USD)\n```\n\n## Tips to Minimize Taxes\n\n1. **Choose FTA Countries**: Saves 8% import duty\n2. **Consider Engine Size**: Smaller engines = lower special consumption tax\n3. **Look at Hybrid/Electric**: May qualify for tax incentives\n4. **Accurate Valuation**: Don\'t overstate vehicle value\n5. **Proper Documentation**: Avoid delays and fees\n\n## Use Our Calculator\n\nCalculating these taxes manually is complex! Use our [Import Cost Calculator](/tools/calculator) to get accurate estimates for your specific vehicle.\n\nThe calculator includes:\n- Real-time exchange rates\n- Automatic FTA detection\n- All tax calculations\n- Port and broker fees\n- Total landed cost estimation\n\n## Common Questions\n\n**Q: Can I claim a tax refund if my car was previously exported from Korea?**\nA: Yes, under certain conditions. Consult with a customs broker.\n\n**Q: Do I pay taxes in my home country AND Korea?**\nA: You typically pay export fees in your home country and import taxes in Korea.\n\n**Q: Are there tax breaks for eco-friendly vehicles?**\nA: Yes! Hybrid and electric vehicles often qualify for reduced rates.\n\n## Need Professional Help?\n\nTax calculations can be tricky. Consider hiring:\n- Licensed customs broker\n- Import specialist\n- Tax consultant familiar with vehicle imports\n\n---\n\n📊 **Remember**: Use our calculator to estimate costs before committing to a purchase. Budget an extra 10-20% for unexpected fees!',
  (SELECT id FROM public.guide_categories WHERE slug = 'taxes-fees' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  true,
  189,
  now() - interval '10 days',
  now() - interval '10 days'
);

-- Guide 3: Shipping Methods Comparison
INSERT INTO public.guides (
  id,
  title,
  slug,
  content,
  category_id,
  author_id,
  published,
  view_count,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Shipping Methods: RORO vs Container Shipping',
  'shipping-methods-roro-vs-container',
  E'# Shipping Methods: RORO vs Container Shipping\n\nChoosing the right shipping method is crucial for your import. This guide compares the two main options.\n\n## Overview\n\nThere are two primary ways to ship a vehicle internationally:\n\n1. **RORO (Roll-on/Roll-off)** - Drive on, drive off\n2. **Container Shipping** - Enclosed in a container\n\n## RORO (Roll-on/Roll-off)\n\n### How It Works\n\n- Vehicle is driven onto a specialized ship\n- Parked in the ship\'s cargo hold\n- Driven off at destination port\n- Exposed to elements during transit\n\n### Pros ✅\n\n- **Cost-effective**: Usually $1,500 - $2,500 from USA to Korea\n- **Faster loading/unloading**: Quicker port processing\n- **No crating needed**: Vehicle drives right on\n- **Widely available**: Many shipping lines offer RORO\n- **Good for standard vehicles**: Most common method\n\n### Cons ❌\n\n- **Exposed to elements**: Salt air, rain, temperature changes\n- **Limited to driveable vehicles**: Car must be able to roll\n- **Can\'t ship personal items**: Empty the car completely\n- **Less security**: Open parking area\n- **Potential cosmetic damage**: Minor scratches possible\n\n### Best For:\n\n- Daily driver vehicles\n- Budget-conscious imports\n- Standard, driveable cars\n- Short-to-medium distance shipping\n\n### Cost Estimate (USA to Korea):\n\n- West Coast: $1,500 - $2,000\n- East Coast: $2,000 - $2,500\n\n## Container Shipping\n\n### How It Works\n\n- Vehicle is loaded into a 20ft or 40ft container\n- Container is sealed and loaded onto ship\n- Complete protection during transit\n- Vehicle is unloaded at destination\n\n### Types of Container Shipping:\n\n**1. Exclusive Container (FCL)**\n- Your vehicle only\n- Most protection\n- Most expensive\n\n**2. Shared Container (LCL)**\n- Multiple vehicles or cargo\n- Lower cost\n- Still well protected\n\n### Pros ✅\n\n- **Maximum protection**: Sealed from elements\n- **Ship personal items**: Can include belongings (check regulations)\n- **Works for non-running vehicles**: Can use loading equipment\n- **Better for valuable cars**: Classic, exotic, luxury vehicles\n- **Enhanced security**: Locked container\n- **Insurance coverage**: Often better rates\n\n### Cons ❌\n\n- **Higher cost**: $2,500 - $5,000+ from USA to Korea\n- **Slower loading**: Container packing takes time\n- **Size limitations**: Must fit in container\n- **Availability**: May need to wait for container space\n- **Additional fees**: Container deposit, handling charges\n\n### Best For:\n\n- Classic/vintage cars\n- Exotic/luxury vehicles\n- Non-running vehicles\n- When shipping personal items\n- Maximum protection needs\n\n### Cost Estimate (USA to Korea):\n\n- Shared 20ft: $2,500 - $3,500\n- Exclusive 20ft: $3,500 - $5,000\n- Exclusive 40ft: $5,000 - $7,000\n\n## Side-by-Side Comparison\n\n| Feature | RORO | Container |\n|---------|------|----------|\n| **Cost** | $1,500-$2,500 | $2,500-$7,000 |\n| **Protection** | Moderate | Excellent |\n| **Speed** | Faster | Slower |\n| **Personal Items** | No | Yes* |\n| **Non-running Cars** | No | Yes |\n| **Insurance Cost** | Higher | Lower |\n| **Best for** | Daily drivers | Valuable cars |\n\n*Subject to customs regulations\n\n## Insurance Considerations\n\n### RORO Insurance\n\n- Typically covers total loss only\n- Minor damage may not be covered\n- Higher premiums due to exposure\n- Document existing condition before shipping\n\n### Container Insurance\n\n- Comprehensive coverage available\n- Lower premiums\n- Better protection against claims\n- Covers both vehicle and contents\n\n## My Recommendation\n\n### Choose RORO if:\n\n- Your car is worth less than $30,000\n- It\'s a daily driver, not a collector car\n- Budget is a primary concern\n- Vehicle is in good running condition\n- You don\'t need to ship personal items\n\n### Choose Container if:\n\n- Your car is worth more than $50,000\n- It\'s a classic, vintage, or exotic vehicle\n- You need maximum protection\n- You want to ship personal belongings\n- Vehicle is not running\n- Peace of mind is worth the extra cost\n\n## Booking Tips\n\n1. **Book early**: 6-8 weeks in advance\n2. **Get multiple quotes**: Compare at least 3 shipping companies\n3. **Read reviews**: Check company reputation\n4. **Understand insurance**: Know what\'s covered\n5. **Document everything**: Photos, condition reports\n6. **Check port requirements**: Some ports have restrictions\n\n## Transit Times\n\n**From USA (West Coast)**\n- RORO: 3-4 weeks\n- Container: 3-5 weeks\n\n**From USA (East Coast)**\n- RORO: 5-6 weeks\n- Container: 5-7 weeks\n\n**From Europe**\n- RORO: 4-5 weeks\n- Container: 5-6 weeks\n\n## Questions to Ask Shippers\n\n1. What\'s included in the quote?\n2. What insurance coverage is provided?\n3. What are the port-to-port times?\n4. Are there any hidden fees?\n5. What documentation do I need to provide?\n6. How is the vehicle secured during transit?\n7. What happens if there\'s damage?\n8. Can I track the shipment?\n\n## Next Steps\n\n1. Determine your vehicle value\n2. Assess your protection needs\n3. Get shipping quotes for both methods\n4. Factor shipping costs into our [Import Cost Calculator](/tools/calculator)\n5. Ask questions in our [Community Forum](/community)\n\n---\n\n🚢 **Pro Tip**: For vehicles worth $30,000-$50,000, compare the cost difference between RORO and container. Sometimes the extra protection is worth just a few hundred dollars more!',
  (SELECT id FROM public.guide_categories WHERE slug = 'shipping' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  true,
  156,
  now() - interval '5 days',
  now() - interval '5 days'
);

-- ============================================
-- SAMPLE COMMUNITY THREADS
-- ============================================

-- Thread 1: First import experience
INSERT INTO public.threads (
  id,
  title,
  content,
  category_id,
  author_id,
  created_at,
  updated_at,
  last_activity_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Just imported my 2018 Mustang GT - Here''s what I learned!',
  E'Hey everyone! 👋\n\nI just successfully imported my 2018 Mustang GT from California to Seoul, and I wanted to share my experience to help others who are considering importing.\n\n**Timeline:**\n- Found the car: March 1st\n- Purchased: March 15th\n- Shipped (RORO): April 1st\n- Arrived in Busan: May 3rd\n- Cleared customs: May 15th\n- Registered: May 22nd\n\n**Total time: About 11 weeks from purchase to driving!**\n\n**Costs:**\n- Purchase price: $35,000\n- RORO shipping: $2,200\n- Insurance: $500\n- Import duties: $0 (USA FTA!)\n- Special consumption tax: $1,850\n- VAT: $4,200\n- Registration: $2,100\n- Broker fees: $800\n- **Total landed cost: $46,650**\n\nUsing the calculator on this site helped me budget accurately - I was only off by about $300!\n\n**What went well:**\n1. FTA saved me thousands in import duty\n2. RORO shipping was smooth\n3. My broker was excellent (DM me for recommendations)\n4. Documentation was straightforward\n\n**What was challenging:**\n1. Waiting for the ship was nerve-wracking\n2. Customs inspection took longer than expected\n3. Had to get the car detailed after shipping (salt residue)\n\n**Would I do it again?** Absolutely! I saved about $15,000 compared to buying the same car in Korea.\n\n**My advice:**\n1. Use the cost calculator BEFORE you buy\n2. Budget extra for unexpected fees\n3. Hire a good customs broker\n4. Be patient - it takes time\n5. Document EVERYTHING\n\nHappy to answer any questions!',
  (SELECT id FROM public.forum_categories WHERE slug = 'success-stories' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  now() - interval '2 days',
  now() - interval '2 days',
  now() - interval '2 days'
);

-- Thread 2: Question about FTA
INSERT INTO public.threads (
  id,
  title,
  content,
  category_id,
  author_id,
  created_at,
  updated_at,
  last_activity_at
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'FTA certificate question - BMW from Germany',
  E'Hi everyone,\n\nI''m looking to import a 2020 BMW M4 from Germany to Korea. I know the EU has an FTA with Korea, which should mean 0% import duty.\n\nMy questions:\n\n1. Do I need to get the FTA certificate before shipping, or can I get it after?\n2. Where exactly do I get this certificate?\n3. Are there any specific requirements for German cars?\n4. Has anyone here imported from Germany recently?\n\nThe car costs €65,000 and I want to make sure I''m not paying unnecessary duties if I can avoid them.\n\nThanks in advance!',
  (SELECT id FROM public.forum_categories WHERE slug = 'general' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  now() - interval '5 hours',
  now() - interval '5 hours',
  now() - interval '5 hours'
);

-- Thread 3: Shipping damage concern
INSERT INTO public.threads (
  id,
  title,
  content,
  category_id,
  author_id,
  created_at,
  updated_at,
  last_activity_at
) VALUES (
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'RORO vs Container for a Porsche 911?',
  E'Planning to import a 2019 Porsche 911 Carrera S from the US (purchase price around $85,000).\n\nI''m torn between RORO and container shipping:\n\n**RORO pros:**\n- $2,000 cheaper\n- Faster\n- More departure dates\n\n**Container pros:**\n- Better protection\n- Can ship some personal items\n- Less worried about damage\n\nThe price difference is about $2,000 ($2,300 for RORO vs $4,300 for exclusive container).\n\nWhat would you do? Is the container worth it for a car this expensive?\n\nI''ve read mixed reviews about RORO - some say it''s fine, others say they got minor scratches and salt damage.\n\nAppreciate any insights!',
  (SELECT id FROM public.forum_categories WHERE slug = 'shipping' LIMIT 1),
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  now() - interval '1 day',
  now() - interval '1 day',
  now() - interval '1 day'
);

-- ============================================
-- SAMPLE COMMENTS
-- ============================================

-- Comments for Thread 1 (Mustang success story)
INSERT INTO public.comments (
  id,
  thread_id,
  author_id,
  content,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  E'Congratulations! 🎉 That''s awesome that you saved $15k. The Mustang GT is a beast!\n\nQuick question - did you have any issues with the emissions testing in Korea? I heard they can be strict about American muscle cars.',
  now() - interval '1 day 20 hours',
  now() - interval '1 day 20 hours'
);

INSERT INTO public.comments (
  id,
  thread_id,
  author_id,
  content,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  E'Great write-up! I''m planning to import a Ford F-150 from Texas. Your timeline is really helpful.\n\nDid you use the calculator here to estimate costs? How accurate was it compared to your actual costs?',
  now() - interval '1 day 18 hours',
  now() - interval '1 day 18 hours'
);

-- Comments for Thread 3 (Porsche shipping question)
INSERT INTO public.comments (
  id,
  thread_id,
  author_id,
  content,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  E'For an $85k Porsche, I''d 100% go with container shipping. The $2k difference is only 2.3% of the car''s value - totally worth it for peace of mind.\n\nI shipped my BMW M3 in a container and it arrived in perfect condition. Plus I was able to include some tools and car parts I had in the US.',
  now() - interval '20 hours',
  now() - interval '20 hours'
);

INSERT INTO public.comments (
  id,
  thread_id,
  author_id,
  content,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'c0e1d2f3-4a5b-6c7d-8e9f-0a1b2c3d4e5f',
  E'Container 100%. I did RORO with my Audi and regretted it. Got some minor scratches and the car needed a full detail when it arrived. Salt water exposure is real.\n\nFor a Porsche at that price point, protect your investment!',
  now() - interval '18 hours',
  now() - interval '18 hours'
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

-- Print success message
DO $$
BEGIN
  RAISE NOTICE '✅ Sample content added successfully!';
  RAISE NOTICE '📚 Added 3 guide articles';
  RAISE NOTICE '💬 Added 3 community threads';
  RAISE NOTICE '💭 Added 4 comments';
  RAISE NOTICE '';
  RAISE NOTICE '👤 Demo user created:';
  RAISE NOTICE '   Email: demo@ocpapp.com';
  RAISE NOTICE '   Password: DemoPassword123!';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Visit your app to see the sample content!';
END $$;
