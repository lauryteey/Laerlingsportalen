// Database setup script to create the users table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz' // Service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🔧 Setting up database...\n')

  // Create users table using SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Add index on email
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

      -- Enable RLS
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      -- Allow anonymous read access for testing
      DROP POLICY IF EXISTS "Allow anonymous select" ON users;
      CREATE POLICY "Allow anonymous select" ON users
        FOR SELECT
        USING (true);
    `
  })

  if (error) {
    console.error('❌ Error creating table:', error.message)
    console.log('\n💡 Creating table via direct SQL...\n')
    
    // Alternative: Try using the REST API's raw SQL endpoint
    const response = await fetch('http://127.0.0.1:54321/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
          ALTER TABLE users ENABLE ROW LEVEL SECURITY;
          DROP POLICY IF EXISTS "Allow anonymous select" ON users;
          CREATE POLICY "Allow anonymous select" ON users FOR SELECT USING (true);
        `
      })
    })
    
    if (!response.ok) {
      console.error('❌ Still failed. Please use Supabase Studio to create the table.')
      console.log('\n📝 Go to: http://127.0.0.1:54323')
      console.log('   Click "SQL Editor" and run the migration file.')
      process.exit(1)
    }
  }

  console.log('✅ Database setup complete!')
  console.log('\n📊 Verifying table exists...')

  // Verify the table was created
  const { data: tables, error: checkError } = await supabase
    .from('users')
    .select('count')

  if (checkError) {
    console.error('⚠️  Verification failed:', checkError.message)
  } else {
    console.log('✅ Users table is ready!\n')
  }
}

setupDatabase().catch(console.error)
