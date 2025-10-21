import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n');

  // Check guides table
  console.log('📋 Checking guides table...');
  const { data: guides, error: guidesError } = await supabase
    .from('guides')
    .select('*')
    .limit(1);

  if (guidesError) {
    console.log('   ❌ Guides table does not exist');
    console.log('   Error:', guidesError.message);
    console.log('\n💡 You need to run the database migration first.');
    console.log('   See SETUP_DATABASE.md for instructions.\n');
    return false;
  } else {
    console.log('   ✅ Guides table exists');
    console.log(`   Found ${guides?.length || 0} guide(s)`);
  }

  // Check threads table
  console.log('\n📋 Checking threads table...');
  const { data: threads, error: threadsError } = await supabase
    .from('threads')
    .select('*')
    .limit(1);

  if (threadsError) {
    console.log('   ❌ Threads table does not exist');
  } else {
    console.log('   ✅ Threads table exists');
  }

  // Check comments table
  console.log('\n📋 Checking comments table...');
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .limit(1);

  if (commentsError) {
    console.log('   ❌ Comments table does not exist');
  } else {
    console.log('   ✅ Comments table exists');
  }

  console.log('\n✨ Database check complete!\n');

  if (!guidesError && !threadsError && !commentsError) {
    console.log('✅ All tables exist. You can now run:');
    console.log('   npm run seed:guides\n');
    return true;
  } else {
    console.log('⚠️  Some tables are missing. Please run the migration first.');
    console.log('   See SETUP_DATABASE.md for instructions.\n');
    return false;
  }
}

checkDatabase()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error('💥 Check failed:', error);
    process.exit(1);
  });
