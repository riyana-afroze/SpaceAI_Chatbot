# SpaceAI Chatbot Setup Guide

## Overview
Your SpaceAI Chatbot now includes:
- ✅ ChatGPT-like sidebar with conversation history
- ✅ Supabase integration for persistent chat storage
- ✅ User authentication with Clerk
- ✅ Responsive design with mobile support
- ✅ Real-time chat with OpenAI GPT-4

## Prerequisites
1. **Supabase Account**: Go to [supabase.com](https://supabase.com) and create a new project
2. **OpenAI API Key**: Get your API key from [OpenAI](https://platform.openai.com)
3. **Clerk Account**: Set up authentication at [clerk.com](https://clerk.com)

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key
```

### 2. Database Setup
1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and run the SQL from `supabase_schema.sql`**

The schema creates:
- `conversations` table for chat sessions
- `messages` table for individual messages
- Row Level Security (RLS) policies
- Proper indexes for performance

### 3. Authentication Setup
1. **In your Supabase project:**
   - Go to Authentication > Settings
   - Enable "Use custom SMTP server" if you want custom emails
   - Configure any OAuth providers you want

2. **In your Clerk dashboard:**
   - Add your domain to allowed origins
   - Configure sign-in/sign-up options

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Run Development Server
```bash
pnpm dev
```

## Features

### Chat Interface
- **Real-time messaging** with OpenAI GPT-4 Turbo
- **Message persistence** in Supabase
- **Conversation management** (create, delete, switch)
- **Responsive design** for mobile and desktop

### Sidebar Features
- **Conversation history** with titles
- **New chat** button to start fresh conversations
- **Delete conversations** with confirmation
- **Auto-generated titles** from first message
- **Mobile-friendly** with slide-out menu

### Security
- **User authentication** required for all chat features
- **Row Level Security** ensures users only see their own data
- **API rate limiting** with proper error handling

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Check that CLERK_SECRET_KEY is set correctly
   - Verify user is signed in

2. **Database connection errors**
   - Verify SUPABASE_URL and SUPABASE_ANON_KEY
   - Check if RLS policies are properly set up

3. **Chat not responding**
   - Verify OPENAI_API_KEY is valid
   - Check API quota and billing

4. **Conversations not saving**
   - Check Supabase database schema
   - Verify RLS policies allow INSERT/UPDATE

### Development Tips

1. **View database data** in Supabase dashboard
2. **Check logs** in Supabase for query errors
3. **Use browser dev tools** to debug API calls
4. **Test authentication** in incognito mode

## File Structure
```
app/
├── api/chat/route.ts          # Chat API endpoint
├── chat/page.tsx              # Chat page component
components/
├── chat-interface.tsx         # Main chat component with sidebar
hooks/
├── use-conversations.ts       # Conversation management hook
lib/
├── supabase.ts               # Supabase configuration
```

## Next Steps
- Add conversation search functionality
- Implement message editing/deletion
- Add file upload capabilities
- Implement conversation sharing
- Add conversation export feature
