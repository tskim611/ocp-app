import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('');
  console.error('Required environment variables:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('To get your service role key:');
  console.error('1. Go to Supabase Dashboard → Settings → API');
  console.error('2. Copy the "service_role" key (NOT the anon key)');
  console.error('3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.error('');
  console.error('⚠️  WARNING: Keep the service_role key secret! Never commit it to git.');
  process.exit(1);
}

// Use service role key to bypass RLS policies
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// TODO: Replace this with your actual user ID from Supabase
const SEED_USER_ID = 'd6d3d34e-6e20-40aa-bd9f-223b0764d79b'; // Get this from Supabase Auth > Users

// Seed data: threads and their replies
const seedData = [
  {
    thread: {
      title: "What's the best shipping method for classic cars?",
      replies: [
        {
          body: "I used RoRo (Roll-on/Roll-off) from Long Beach to Incheon for my 1973 BMW 3.0CSi. It took about 6 weeks but cost only $2,000. The car arrived in perfect condition. Just make sure to remove all personal items and disconnect the battery."
        },
        {
          body: "Container shipping is safer but more expensive. I paid $3,500 for a 20ft container from the East Coast. Worth it for rare or valuable cars in my opinion. You can also share a container with someone else to split costs."
        },
        {
          body: "One tip: always get marine cargo insurance regardless of shipping method. It's cheap (usually 1-2% of car value) and gives peace of mind. My friend's car got damaged in transit and insurance covered everything."
        }
      ]
    }
  },
  {
    thread: {
      title: "How long did customs clearance take for you in Korea?",
      replies: [
        {
          body: "Mine cleared in just 2 days at Incheon. I had all my documents ready (invoice, B/L, title, ID) and used a customs broker. The broker fee was ₩500k but totally worth it for the speed and peace of mind."
        },
        {
          body: "Took me almost a week because I was missing the export certificate from the US port. Make sure you have EVERY document before the car arrives. The port storage fees add up quickly if there are delays."
        },
        {
          body: "Pro tip: contact your customs broker while the car is still in transit (at sea). They can pre-file a lot of the paperwork so clearance is faster when it arrives. Saved me 3-4 days."
        }
      ]
    }
  },
  {
    thread: {
      title: "Anyone imported through Busan port instead of Incheon?",
      replies: [
        {
          body: "Yes! I imported from Japan through Busan since it's closer. The process was similar to Incheon but the port fees were slightly lower. Good option if you're in the southern part of Korea."
        },
        {
          body: "Busan is fine but has fewer shipping options from the US compared to Incheon. Most US-Korea car shipments go through Incheon or Pyeongtaek. Check shipping availability first before committing to Busan."
        }
      ]
    }
  },
  {
    thread: {
      title: "Is Bring a Trailer trustworthy for Korean imports?",
      replies: [
        {
          body: "I've bought 2 cars from BaT and both went smoothly. The key is to always get a pre-purchase inspection (PPI) before bidding. Never trust photos alone. Also read ALL the comments on the listing - other users often spot issues."
        },
        {
          body: "BaT is legit but you're buying as-is with no returns. Use escrow for payment and verify the title is clean before wiring money. I almost bought a salvage title car that wasn't properly disclosed - dodged a bullet there."
        },
        {
          body: "The auction format can drive prices up quickly. Set a hard max budget and stick to it. Don't forget to add shipping, taxes, and fees to your total cost - the final landed price will be 30-40% higher than the hammer price."
        }
      ]
    }
  },
  {
    thread: {
      title: "TS inspection experience - how strict are they for older cars?",
      replies: [
        {
          body: "For my classic car (over 25 years old), I applied for 고전차 예외승인 (classic car exemption) and it made the process much easier. They still checked headlights, brakes, and basic safety but didn't require full emissions testing."
        },
        {
          body: "The inspection center in Hwaseong was very professional. They gave me a list of required modifications before I even showed up. Needed to adjust headlight aim and add a rear fog light. Total cost including modifications: about ₩800k."
        },
        {
          body: "My advice: find a shop that specializes in imported cars BEFORE you go to TS. They'll know exactly what modifications are needed and can do it cheaper than the inspection center. Saved me about ₩300k doing it this way."
        }
      ]
    }
  }
];

async function seedThreads() {
  console.log('🌱 Starting community seed...\n');

  if (!SEED_USER_ID || SEED_USER_ID === 'YOUR_USER_ID_HERE') {
    console.error('❌ Please set SEED_USER_ID in the script first.');
    console.error('');
    console.error('Steps:');
    console.error('1. Go to Supabase Dashboard');
    console.error('2. Authentication → Users');
    console.error('3. Copy your User ID (UUID)');
    console.error('4. Paste it in scripts/seed-threads.ts as SEED_USER_ID');
    process.exit(1);
  }

  const userId = SEED_USER_ID;
  console.log(`✅ Using user ID: ${userId}\n`);

  console.log('📋 Threads to seed:', seedData.length);
  console.log('📋 Thread titles:', seedData.map(d => d.thread.title));
  console.log('');

  // Now create threads and replies
  for (const item of seedData) {
    console.log(`📝 Creating thread: "${item.thread.title}"`);
    console.log(`   Query: INSERT into threads (title, author_id) VALUES (${item.thread.title}, ${userId})`);

    // Check if thread already exists
    const { data: existing } = await supabase
      .from('threads')
      .select('id')
      .eq('title', item.thread.title)
      .single();

    console.log(`   Existing check result:`, existing ? 'FOUND' : 'NOT FOUND');

    if (existing) {
      console.log(`   ⚠️  Thread already exists, skipping...`);
      continue;
    }

    // Create thread
    const { data: threadData, error: threadError } = await supabase
      .from('threads')
      .insert([
        {
          title: item.thread.title,
          author_id: userId,
        }
      ])
      .select()
      .single();

    if (threadError) {
      console.error(`   ❌ Error creating thread:`, threadError.message);
      continue;
    }

    console.log(`   ✅ Thread created with ID: ${threadData.id}`);

    // Create replies for this thread
    if (item.thread.replies && item.thread.replies.length > 0) {
      console.log(`   💬 Adding ${item.thread.replies.length} replies...`);

      for (const reply of item.thread.replies) {
        const { error: replyError } = await supabase
          .from('comments')
          .insert([
            {
              thread_id: threadData.id,
              author_id: userId,
              body: reply.body,
            }
          ]);

        if (replyError) {
          console.error(`      ❌ Error creating reply:`, replyError.message);
        } else {
          console.log(`      ✅ Reply added`);
        }
      }
    }

    console.log('');
  }

  console.log('✨ Community seed complete!\n');
  console.log('📊 Summary:');
  console.log(`   - ${seedData.length} threads created`);
  console.log(`   - ${seedData.reduce((sum, item) => sum + (item.thread.replies?.length || 0), 0)} replies added`);
  console.log('\n💡 Tip: You can delete these threads later from the community page if needed.\n');
}

// Run the seed function
seedThreads()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
