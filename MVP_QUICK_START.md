# MVP Quick Start Guide - Thundercloud

## Overview

This guide walks you through building the MVP: Auth + Website List + AI Generation + Preview.

**Timeline:** 1 week
**Success Criteria:**
- ✅ User can sign up/log in
- ✅ User can list their websites
- ✅ User can create website with AI
- ✅ User can preview generated website
- ✅ All operations protected by RLS

---

## Step 1: Install Dependencies

```bash
cd thundercloud-app
npm install
```

**Expected output:**
```
added 423 packages in 45s
```

---

## Step 2: Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:
1. **Supabase credentials** (from Supabase dashboard > API settings)
2. **Anthropic API key** (from https://console.anthropic.com/settings/keys)

---

## Step 3: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

You should see a blank Next.js page (we'll build the UI next).

---

## Next Steps

The complete implementation guide is in `MVP_IMPLEMENTATION.md`. It includes:

1. Supabase client setup (`src/lib/supabase/`)
2. tRPC router setup (`src/server/`)
3. Auth pages (`src/app/(auth)/`)
4. Dashboard (`src/app/(dashboard)/`)
5. Website generation (`src/app/(dashboard)/websites/new/`)
6. Preview component (`src/components/websites/`)

**Implementation order:**
Day 1-2: Supabase + tRPC + Auth
Day 3-4: Dashboard + Website List
Day 5-6: AI Generation + Preview
Day 7: Testing + Polish

Start with `MVP_IMPLEMENTATION.md` for the full code.
