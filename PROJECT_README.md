# Thundercloud - AI Website Builder Migration

**Status:** 🚧 Migration in Progress (Base44 → Next.js 15 + Supabase + tRPC)

---

## 📁 Project Structure

```
.
├── thundercloud-main/          # Base44 export (402 components, 21 entities)
│   ├── src/components/        # Original React components
│   ├── src/pages/            # 24 pages
│   ├── functions/            # 20 serverless functions
│   └── package.json
│
├── thundercloud-app/          # New Next.js 15 application (MVP)
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── server/          # tRPC routers
│   │   ├── lib/             # Utilities (Supabase, helpers)
│   │   └── components/      # React components
│   └── package.json
│
└── Documentation/
    ├── GITHUB_SETUP.md       # Push Base44 export to GitHub
    ├── SUPABASE_SETUP.md     # Database schema + RLS policies
    ├── MVP_QUICK_START.md    # 3-step quick start
    └── MVP_IMPLEMENTATION.md # Complete MVP code (Day 1-7)
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Push Base44 Export to GitHub

```bash
cd thundercloud-main
git branch -M main
git remote add origin https://github.com/Krosebrook/thundercloud.git
git push -u origin main
```

**Or create repo manually:** See `GITHUB_SETUP.md`

### 2. Set Up Supabase

1. Create project at https://supabase.com
2. Run SQL schema from `SUPABASE_SETUP.md`
3. Enable RLS on all 21 tables
4. Copy API keys

### 3. Initialize Next.js MVP

```bash
cd thundercloud-app
npm install
cp .env.example .env.local
# Fill in Supabase + Anthropic API keys
npm run dev
```

Visit http://localhost:3000

---

## 🎯 MVP Success Criteria

**Week 1 Goal: Working Auth + AI Generation**

- ✅ User can sign up / log in (Supabase Auth)
- ✅ User can list their websites (tRPC + RLS)
- ✅ User can generate website with AI (Anthropic Claude)
- ✅ User can preview generated HTML
- ✅ User can save and publish

---

## 📊 Architecture Overview

### Base44 → Next.js Migration

| Layer | Base44 | Next.js/Supabase |
|-------|--------|------------------|
| **Frontend** | React 18 + Vite | Next.js 15 App Router |
| **API** | Base44 SDK (ORM) | tRPC (type-safe) |
| **Database** | Base44 Query entities | Supabase Postgres + RLS |
| **Auth** | base44.auth | Supabase Auth |
| **AI** | base44.integrations.InvokeLLM | Anthropic SDK direct |
| **Storage** | Base44 storage | Supabase Storage + Cloudinary |
| **Deploy** | Unknown | Vercel |

### Data Model (21 Tables)

**Core:**
- `websites` - AI-generated sites
- `website_versions` - History/rollback
- `website_deployments` - Deployment tracking
- `website_templates` - Reusable templates

**A/B Testing:**
- `ab_tests` - Test campaigns
- `ab_test_variants` - Variations

**Analytics:**
- `analytics_events` - Raw event data
- `analytics_insights` - AI insights
- `behavior_events` - User behavior
- `behavior_patterns` - Clustering
- `custom_attributes` - Custom tracking
- `segment_analytics` - Performance metrics

**SEO:**
- `seo_audits` - Basic audits
- `comprehensive_seo_audits` - Advanced audits

**Personalization:**
- `user_segments` - User segments
- `personalization_rules` - Rules
- `personalization_tests` - A/B for personalization
- `discovered_segments` - AI-discovered

**Content:**
- `content_blocks` - Modular CMS

**E-commerce:**
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Line items

---

## 📝 Documentation Index

1. **GITHUB_SETUP.md** - Push code to GitHub
2. **SUPABASE_SETUP.md** - Complete database setup (SQL schema, RLS, triggers)
3. **MVP_QUICK_START.md** - 3-step quick start
4. **MVP_IMPLEMENTATION.md** - Full MVP code (coming next)

---

## 🗓️ Implementation Timeline

### Week 1: MVP (Current)
- Day 1-2: Supabase + tRPC + Auth ✅
- Day 3-4: Dashboard + Website List
- Day 5-6: AI Generation + Preview
- Day 7: Testing + Polish

### Week 2-3: Core Features
- Multi-page support
- SEO tools
- Website editor
- Version history

### Week 4-5: Advanced Features
- A/B testing
- Analytics dashboard
- Team collaboration
- Personalization

### Week 6+: E-commerce & Automation
- Product catalog
- Stripe integration
- n8n workflows
- Deployment automation

---

## 🛡️ Security Checklist

**MVP (Must Have):**
- ✅ RLS enabled on all tables
- ✅ JWT validation in tRPC middleware
- ✅ Input validation (Zod schemas)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (DOMPurify on HTML content)
- ✅ Rate limiting (Vercel + Upstash Redis)
- ✅ Environment variables for secrets

**Phase 2 (Nice to Have):**
- Content Security Policy headers
- Helmet.js security headers
- CSRF protection
- OAuth 2.0 flows
- Webhook signature verification

---

## 📦 Tech Stack

### MVP Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui
- **API:** tRPC v11, Zod validation
- **Database:** Supabase (Postgres 15 + RLS)
- **Auth:** Supabase Auth (Email + OAuth)
- **AI:** Anthropic Claude Sonnet 4.5
- **Deploy:** Vercel

### Phase 2 Additions
- **Storage:** Cloudinary (image optimization)
- **Email:** Resend (transactional emails)
- **Analytics:** PostHog (user analytics)
- **Monitoring:** Sentry (error tracking)
- **Workflows:** n8n (automation)
- **Payment:** Stripe (e-commerce)

---

## 🤝 Contributing

This is a migration project. Current phase: **MVP Development**.

**How to contribute:**
1. Read `MVP_IMPLEMENTATION.md`
2. Pick a component from the MVP checklist
3. Implement following the tRPC + Supabase patterns
4. Test with RLS policies enabled
5. Submit PR

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

---

## 📄 License

MIT License - See LICENSE file

---

## 🎯 Next Steps

1. **✅ GitHub:** Push Base44 export → `GITHUB_SETUP.md`
2. **✅ Supabase:** Set up database → `SUPABASE_SETUP.md`
3. **🚧 Next.js:** Build MVP → `MVP_QUICK_START.md` → `MVP_IMPLEMENTATION.md`
4. **🔜 Deploy:** Push to Vercel staging
5. **🔜 Test:** 10 beta users + 48hr soak test

---

**Last Updated:** December 23, 2025
**Current Phase:** MVP Week 1
**Status:** Base44 export completed, Supabase schema ready, Next.js scaffolding done
