# Thundercloud - AI Website Builder

Generate production-quality websites in minutes using Claude Sonnet 4.5.

## 🎯 What is Thundercloud?

Thundercloud is an AI-powered website builder that creates professional, SEO-optimized, accessible websites using advanced AI. Unlike template-based builders, Thundercloud generates custom code tailored to your specific needs.

### Key Features (MVP)

- ✅ **AI Website Generation** - Claude Sonnet 4.5 creates custom HTML/CSS
- ✅ **Quality Validation** - 50+ automated quality checks (SEO, accessibility, performance)
- ✅ **Real-time Preview** - See your site on mobile, tablet, desktop
- ✅ **One-Click Deployment** - Publish instantly with preview URL
- ✅ **Type-Safe API** - End-to-end TypeScript with tRPC
- ✅ **Secure by Default** - Row-level security (RLS) on all data

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Supabase account (free tier works)
- Anthropic API key (Claude)

### 1. Clone & Install

```bash
git clone <your-repo-url> thundercloud-app
cd thundercloud-app
npm install
```

### 2. Environment Setup

Create `.env.local`:

```bash
# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (get from https://console.anthropic.com/)
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables created (21 tables total)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Your First Website

1. Sign up at `/signup`
2. Go to Dashboard
3. Click "Create Website"
4. Fill in details, click "Generate"
5. Wait 30-60 seconds
6. Preview and save!

## 📁 Project Structure

```
thundercloud-app/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── api/trpc/          # tRPC API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── auth/              # Auth components
│   │   └── websites/          # Website components
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── ai/                # AI generation & validation
│   │   ├── trpc/              # tRPC client setup
│   │   └── utils.ts           # Utilities
│   └── server/
│       ├── trpc.ts            # tRPC setup
│       └── routers/           # API routers
├── public/                     # Static files
├── supabase/
│   └── schema.sql             # Database schema
└── package.json
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key (public) |
| `ANTHROPIC_API_KEY` | ✅ | Claude API key (secret) |

**Security Notes:**
- ✅ `NEXT_PUBLIC_*` vars are safe in browser (public)
- ⚠️ `ANTHROPIC_API_KEY` is server-only (never exposed)
- ✅ All database access protected by RLS

## 🏗️ Tech Stack

| Layer | Technology | Why? |
|-------|------------|------|
| **Frontend** | Next.js 15 + React 19 | Server Components, App Router |
| **Backend** | tRPC + Next.js API | Type-safe APIs, no codegen |
| **Database** | Supabase (PostgreSQL) | Managed DB + Auth + RLS |
| **AI** | Anthropic Claude Sonnet 4.5 | Best-in-class code generation |
| **Auth** | Supabase Auth | JWT + RLS |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI** | shadcn/ui | Accessible components |
| **Deployment** | Vercel | Zero-config, edge functions |

## 📊 Database Schema

### Core Tables

**user_profiles** - User accounts
```sql
- id (uuid, PK)
- email (text)
- full_name (text)
- role (text) - 'user' | 'admin'
- subscription_tier (text) - 'free' | 'pro' | 'agency'
- created_date (timestamp)
```

**websites** - Generated websites
```sql
- id (uuid, PK)
- user_id (uuid, FK → user_profiles)
- title (text)
- description (text)
- slug (text, unique)
- html_content (text) - Full HTML output
- quality_score (integer) - 0-100
- seo_score (integer) - 0-100
- is_published (boolean)
- created_date (timestamp)
```

See `supabase/schema.sql` for complete schema (21 tables).

## 🔐 Security

### Authentication
- JWT tokens via Supabase Auth
- 30-day session expiry
- PKCE flow for OAuth (future)

### Authorization
- **Row Level Security (RLS)** on all tables
- Users can only access their own data
- Policy: `auth.uid() = user_id`

### Input Validation
- Zod schemas on all API inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (DOMPurify on HTML output)

### Rate Limiting
- 100 API requests/hour per user
- 10 website generations/hour per user
- Enforced at API gateway

## 🧪 Testing

### Run Type Checking
```bash
npm run type-check
```

### Run Linter
```bash
npm run lint
```

### Test API Endpoints (Manual)

1. Start dev server: `npm run dev`
2. Test generation:
   - Go to `/dashboard/websites/new`
   - Fill form, click "Generate"
   - Check console for errors
   - Verify website saved to dashboard

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repo
   - Add environment variables
   - Deploy!

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all 3 env vars from `.env.local`
   - Redeploy

### Deploy Database (Supabase)

Database is already deployed when you create Supabase project:
- ✅ Production PostgreSQL
- ✅ Automatic backups
- ✅ SSL encryption
- ✅ Global CDN

## 📈 Performance

### Targets (MVP)
- Dashboard load: < 2 seconds
- Website generation: < 60 seconds
- Preview load: < 3 seconds
- API response: < 500ms (p95)

### Optimization Tips
- Use React Query caching (already configured)
- Enable Next.js Image optimization for user uploads
- Add CDN caching for static assets
- Database indexes on `user_id`, `website_id` (already added)

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify anon key in `.env.local`
- Ensure RLS policies are created (run schema.sql)

### AI generation fails
- Check `ANTHROPIC_API_KEY` is valid
- Verify API key has credits
- Check Anthropic API status: https://status.anthropic.com/

### Auth redirect loop
- Clear browser cookies
- Check Supabase Auth settings
- Verify RLS policies allow user access

## 📚 API Documentation

### tRPC Routers

#### `websites` Router
```typescript
// List websites (paginated)
trpc.websites.list.useQuery({
  page: 1,
  pageSize: 10,
  sortBy: 'created_date',
  sortOrder: 'desc'
})

// Get single website
trpc.websites.getById.useQuery({ id: 'uuid' })

// Create website
trpc.websites.create.useMutation({
  title: 'My Site',
  slug: 'my-site',
  html_content: '<html>...',
  // ... other fields
})

// Update website
trpc.websites.update.useMutation({
  id: 'uuid',
  data: { title: 'New Title' }
})

// Delete website
trpc.websites.delete.useMutation({ id: 'uuid' })

// Toggle publish status
trpc.websites.togglePublish.useMutation({ id: 'uuid' })
```

#### `generation` Router
```typescript
// Generate new website
trpc.generation.generate.useMutation({
  title: 'My Business',
  description: 'Professional consulting...',
  category: 'business',
  theme: 'modern',
  colorScheme: 'Professional Blue',
  language: 'English'
})

// Regenerate existing
trpc.generation.regenerate.useMutation({
  id: 'uuid',
  prompt: { title: 'Updated Title' }
})

// Validate HTML
trpc.generation.validate.useMutation({
  html: '<html>...'
})
```

## 🎨 Customization

### Add New Website Category

1. Update prompt templates in `src/lib/ai/prompts.ts`:
```typescript
export const PRODUCTION_PROMPTS = {
  templates: {
    // Add new category
    nonprofit: {
      sections: [
        'Mission statement',
        'Impact metrics',
        // ...
      ]
    }
  }
}
```

2. Update form in `src/app/(dashboard)/websites/new/page.tsx`:
```typescript
const categories = [
  // Add to dropdown
  { value: 'nonprofit', label: 'Non-Profit' },
]
```

### Customize Quality Validation

Edit `src/lib/ai/quality-validator.ts`:
```typescript
private validateSEO(doc: Document, html: string): ValidationCheck {
  // Add custom checks
  if (!html.includes('custom-tag')) {
    issues.push('Missing custom tag');
    score -= 5;
  }
}
```

## 📖 Learn More

- **Next.js Docs**: https://nextjs.org/docs
- **tRPC Docs**: https://trpc.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Anthropic Docs**: https://docs.anthropic.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

## 🤝 Contributing

This is an MVP. Contributions welcome after initial launch.

## 📄 License

[Your License Here]

## 🆘 Support

- 📧 Email: support@thundercloud.com
- 💬 Discord: discord.gg/thundercloud
- 📚 Docs: docs.thundercloud.com

---

**Built with ❤️ using Claude Sonnet 4.5**
