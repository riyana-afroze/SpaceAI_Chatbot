# 🚀 SUPABASE SETUP - MAKE IT WORK NOW!

## Step 1: Set Up Database Tables (REQUIRED)

**You MUST do this step for Supabase to work:**

1. **Open your Supabase dashboard**: https://supabase.com/dashboard/project/dfubyvplzppqhjbetquh

2. **Go to SQL Editor** (in the left sidebar)

3. **Copy and paste this ENTIRE SQL script**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Disable RLS for simplicity (we handle auth in app)
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON conversations TO anon, authenticated;
GRANT ALL ON messages TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Test insert
INSERT INTO conversations (user_id, title) VALUES ('test-user', 'Test Conversation') 
ON CONFLICT DO NOTHING;

-- Verify
SELECT 'Setup completed! Found ' || count(*) || ' test conversations' as result 
FROM conversations WHERE user_id = 'test-user';

-- Clean up
DELETE FROM conversations WHERE user_id = 'test-user';
```

4. **Click "Run" to execute the SQL**

5. **You should see a success message**

## Step 2: Test the Setup

1. **Start your dev server**: `pnpm dev`

2. **Go to the debug page**: http://localhost:3000/debug

3. **Click "🚀 Setup Supabase Database"** to test the connection

4. **Click "Run Database Test"** to verify everything works

## Step 3: Use the Full Chat Interface

1. **Go to**: http://localhost:3000/chat

2. **Sign in with Clerk**

3. **Start chatting** - conversations should now be saved!

4. **Check the sidebar** - you should see conversation history

## Troubleshooting

### If you get "relation does not exist" errors:
- Make sure you ran the SQL in Step 1
- Check the Supabase dashboard to see if tables were created

### If you get permission errors:
- The SQL script disables RLS, so this shouldn't happen
- Make sure your Supabase keys are correct in `.env`

### If chat doesn't respond:
- Check your OpenAI API key
- Check browser console for errors

## What This Does

✅ **Creates database tables** for conversations and messages
✅ **Disables Row Level Security** (simplifies setup)
✅ **Grants proper permissions** for your app to work
✅ **Creates indexes** for good performance
✅ **Tests the setup** automatically

The chat will now:
- 💾 **Save all conversations** to Supabase
- 📱 **Show conversation history** in the sidebar
- 🔄 **Switch between conversations**
- 🗑️ **Delete conversations**
- 📝 **Auto-generate conversation titles**

**Run the SQL now and your Supabase integration will work!** 🎉
