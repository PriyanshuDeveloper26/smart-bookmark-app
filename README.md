# Smart Bookmark App

A simple bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Features

-> Google OAuth login (No email/password)
-> Add bookmarks (title + URL)
-> Private bookmarks per user
-> Real-time updates across tabs
-> Delete own bookmarks
-> Deployed on Vercel

## Tech Stack

-> Next.js 14 (App Router)
-> Supabase (Auth + Database + Realtime)
-> Tailwind CSS
-> Vercel

## Database Schema

bookmarks:
-> id (uuid)
-> user_id (uuid)
-> title (text)
-> url (text)
-> created_at (timestamp)

## Problems Faced

1. Google OAuth redirect issues
   -> Fixed by correctly adding Supabase callback URL in Google Console.

2. Row Level Security blocking inserts
   -> Added proper RLS policies using auth.uid().

3. Realtime not working
   -> Enabled replication for bookmarks table.

## Setup Instructions

1. Clone repo
2. Add .env.local
3. npm install
4. npm run dev

## Live Demo

Deployed on Vercel.