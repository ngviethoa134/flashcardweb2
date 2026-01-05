# Quick Setup Guide

Follow these steps to get your flashcard website running:

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "flashcard-app")
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be ready

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long JWT token)
3. Copy both values

## Step 3: Create Environment File

1. In your project root directory, create a file named `.env`
2. Add these two lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Replace `xxxxxxxxxxxxx` with your actual project URL
- Replace the `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual anon key
- Don't add quotes around the values
- Make sure there are no spaces around the `=` sign

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. Copy **ALL** the SQL code from that file
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
7. You should see "Success. No rows returned" - this is correct!

## Step 5: Start the Website

1. Make sure you have Node.js installed (check with `node --version`)
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (usually `http://localhost:5173`)

## Step 6: Test It Out!

1. Click "Sign up" to create an account
2. Create your first deck
3. Add some cards
4. Start studying!

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the root directory (same folder as `package.json`)
- Make sure the file is named exactly `.env` (not `.env.txt` or `.env.local`)
- Restart your dev server after creating/editing `.env`

### "Error loading user" or authentication issues
- Make sure you ran the SQL schema (Step 4)
- Check that the `profiles` table exists in your Supabase dashboard (Table Editor)

### Database connection errors
- Double-check your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces or quotes
- Verify your Supabase project is active (not paused)

### Can't see tables in Supabase
- Go to **Table Editor** in Supabase dashboard
- You should see: `profiles`, `decks`, `cards`, `study_sessions`
- If not, re-run the SQL schema

## That's It! 🎉

Your flashcard website should now be fully functional with:
- ✅ User authentication
- ✅ Database storage
- ✅ Spaced repetition learning
- ✅ All features working!

