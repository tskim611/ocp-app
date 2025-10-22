import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// System user ID for guide authorship
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const SYSTEM_EMAIL = 'system@ocp-app.com';

interface GuideFile {
  slug: string;
  title: string;
  content: string;
}

/**
 * Extract title from markdown content
 * Looks for first # heading
 */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled Guide';
}

/**
 * Read all markdown files from content/guides/
 */
function readGuideFiles(): GuideFile[] {
  const guidesDir = path.join(process.cwd(), 'content', 'guides');

  if (!fs.existsSync(guidesDir)) {
    console.error(`❌ Error: Directory not found: ${guidesDir}`);
    return [];
  }

  const files = fs.readdirSync(guidesDir);
  const mdFiles = files.filter(file => file.endsWith('.md'));

  console.log(`📚 Found ${mdFiles.length} markdown files in content/guides/\n`);

  return mdFiles.map(file => {
    const filePath = path.join(guidesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = file.replace('.md', '');
    const title = extractTitle(content);

    return { slug, title, content };
  });
}

/**
 * Ensure system user exists
 */
async function ensureSystemUser() {
  console.log('👤 Checking for system user...');

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', SYSTEM_USER_ID)
    .single();

  if (existingUser) {
    console.log('✅ System user already exists\n');
    return;
  }

  console.log('Creating system user...');
  const { error } = await supabase
    .from('users')
    .insert({
      id: SYSTEM_USER_ID,
      email: SYSTEM_EMAIL,
    });

  if (error) {
    console.error('❌ Error creating system user:', error.message);
    throw error;
  }

  console.log('✅ System user created\n');
}

async function seedGuides() {
  console.log('🌱 Starting guide seeding process...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Ensure system user exists
    await ensureSystemUser();

    // 2. Read guide files
    const guides = readGuideFiles();

    if (guides.length === 0) {
      console.log('⚠️  No markdown files found. Nothing to seed.');
      return;
    }

    // 3. Upsert each guide
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    let successCount = 0;
    let failCount = 0;

    for (const guide of guides) {
      console.log(`📝 Processing: ${guide.slug}`);
      console.log(`   Title: ${guide.title}`);
      console.log(`   Content length: ${guide.content.length} characters`);

      const { error } = await supabase
        .from('guides')
        .upsert(
          {
            slug: guide.slug,
            title: guide.title,
            content: guide.content,
            author_id: SYSTEM_USER_ID,
            published: true,
          },
          {
            onConflict: 'slug',
          }
        )
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
        failCount++;
      } else {
        console.log(`   ✅ Success!\n`);
        successCount++;
      }
    }

    // 4. Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📊 Seeding Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📚 Total: ${guides.length}\n`);

    if (failCount > 0) {
      console.log('⚠️  Some guides failed to seed. Check errors above.');
      process.exit(1);
    }

    console.log('🎉 All guides seeded successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Visit /ko/guides to see your guides');
    console.log('   2. Check Supabase Dashboard → Table Editor → guides');
    console.log('   3. Test viewing individual guides: /ko/guides/[slug]\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedGuides()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
