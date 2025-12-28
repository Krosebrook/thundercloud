# 🚀 Thundercloud - Quick Start (5 Minutes)

Get your AI website builder live in 5 minutes.

## Step 1: Install Dependencies (1 min)

```bash
cd thundercloud-app
npm install
```

## Step 2: Setup Supabase (2 min)

1. **Create account:** https://supabase.com/dashboard
2. **Create project:** Click "New Project"
   - Name: thundercloud
   - Database Password: (generate strong password)
   - Region: (closest to you)
3. **Get credentials:**
   - Project Settings → API
   - Copy `URL` and `anon/public` key

4. **Setup database:**
   - SQL Editor → New Query
   - Copy SQL from previous session's `SUPABASE_SETUP.md`
   - Run query
   - Verify: See 21 tables in Table Editor

## Step 3: Get Anthropic API Key (1 min)

1. **Create account:** https://console.anthropic.com/
2. **Get API key:** 
   - Settings → API Keys
   - Create Key
   - Copy `sk-ant-...` key
3. **Add credits:** $5 minimum (enough for 100+ websites)

## Step 4: Configure Environment (30 sec)

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Step 5: Run Locally (30 sec)

```bash
npm run dev
```

Open http://localhost:3000

✅ **Test it:**
1. Sign up at `/signup`
2. Create website at `/dashboard/websites/new`
3. Wait 30-60 seconds
4. See your generated website!

## Step 6: Deploy to Production (Optional)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Add environment variables in Vercel:**
- Project Settings → Environment Variables
- Add all 3 from `.env.local`
- Redeploy

**Done!** Your app is live at `https://your-project.vercel.app`

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
- Check Supabase URL is correct (no trailing slash)
- Verify anon key (starts with `eyJ`)
- Run database schema SQL

### Generation fails
- Check Anthropic API key is valid
- Verify you have API credits ($5 minimum)
- Check console for errors

### Auth doesn't work
- Clear browser cookies
- Check Supabase Auth is enabled (Settings → Authentication)
- Verify RLS policies exist (run schema.sql)

---

## 📚 Next Steps

- **Full Docs:** See `README.md`
- **Product Spec:** See `PRODUCT_REQUIREMENTS.md`  
- **API Reference:** See README "API Documentation" section
- **Deploy Guide:** See `MVP_COMPLETE.md`

---

## ✅ Checklist

- [ ] `npm install` completed
- [ ] Supabase project created
- [ ] Database schema ran (21 tables)
- [ ] Anthropic API key obtained  
- [ ] `.env.local` created with 3 vars
- [ ] `npm run dev` works
- [ ] Can sign up and log in
- [ ] Can generate website
- [ ] Website appears in dashboard

**All checked?** You're ready to ship! 🎉

---

**Questions?** Check README.md or PRODUCT_REQUIREMENTS.md
