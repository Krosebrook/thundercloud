# Thundercloud AI Website Builder
## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** December 2024  
**Status:** Active Development  
**Document Owner:** Product Team

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [User Personas](#user-personas)
4. [Core Features](#core-features)
5. [User Stories & Acceptance Criteria](#user-stories)
6. [Technical Specifications](#technical-specifications)
7. [Success Metrics](#success-metrics)
8. [MVP Scope](#mvp-scope)
9. [Future Roadmap](#future-roadmap)
10. [Competitive Analysis](#competitive-analysis)

---

## Executive Summary

### Problem Statement
Small businesses, entrepreneurs, and creators need professional websites but lack:
- **Time**: Building quality websites takes weeks/months
- **Budget**: Hiring agencies costs $5,000-$50,000
- **Skills**: Learning web development takes months
- **Quality**: DIY solutions look amateur

### Solution
Thundercloud is an AI-powered website builder that generates production-quality, SEO-optimized, accessible websites in minutes using advanced AI (Claude Sonnet 4.5).

### Unique Value Proposition
1. **Studio-Quality Output**: Not templates—fully custom, production-ready websites
2. **Built-in Best Practices**: SEO, PWA, accessibility, performance optimization
3. **Quality Validation**: Every site scored on 50+ quality signals
4. **Iterative Refinement**: AI improves based on feedback
5. **One-Click Deploy**: Instant publishing to custom domains

### Target Market
- **Primary**: Small business owners (1-50 employees)
- **Secondary**: Freelancers, consultants, content creators
- **Tertiary**: Agencies building client sites at scale

### Business Model
- **Freemium**: 3 free websites, then $29/month
- **Pro**: $79/month (unlimited sites, A/B testing, analytics)
- **Agency**: $249/month (team features, white-label, API access)

---

## Product Vision

### Mission Statement
"Democratize professional web design by making studio-quality websites accessible to anyone, powered by AI."

### 3-Year Vision
By 2027, Thundercloud will:
- Power 100,000+ active websites
- Be the #1 AI website builder for small businesses
- Generate $10M+ ARR
- Support 50+ languages
- Have 95%+ customer satisfaction

### Core Principles
1. **Quality First**: Never sacrifice output quality for speed
2. **User Empowerment**: Users own their code, no vendor lock-in
3. **Continuous Innovation**: Ship weekly improvements
4. **Transparency**: Show AI decision-making, validation scores
5. **Accessibility**: WCAG AA minimum on all generated sites

---

## User Personas

### Primary Persona: Sarah the Solopreneur
**Demographics:**
- Age: 32
- Role: Independent consultant
- Tech Savvy: Medium (uses SaaS tools, not a developer)
- Budget: $50-100/month for all tools

**Goals:**
- Launch professional website in < 1 day
- Rank on Google for "business consultant [city]"
- Capture leads via contact forms
- Look credible to Fortune 500 prospects

**Pain Points:**
- Tried Wix/Squarespace—looks "templated"
- Can't afford $10K agency quote
- No time to learn WordPress
- Needs SEO but doesn't know how

**Success Criteria:**
- Website live in 24 hours
- 3+ leads per month from website
- Ranks on page 1 for target keywords within 90 days
- Professional appearance matching competitors

### Secondary Persona: Mike the Agency Owner
**Demographics:**
- Age: 41
- Role: Digital agency owner (5 employees)
- Tech Savvy: High (former developer)
- Budget: $500-2000/month for tools

**Goals:**
- Build client sites 10x faster
- Maintain quality while scaling
- Reduce junior developer hours
- White-label solution for clients

**Pain Points:**
- Junior devs spend weeks on basic sites
- Clients expect fast turnaround
- Hard to scale without hiring
- Quality inconsistent across team

**Success Criteria:**
- Reduce site build time from 40 hours to 4 hours
- Maintain 95%+ quality scores
- Support 20+ concurrent client projects
- White-label interface and domains

### Tertiary Persona: Lisa the E-commerce Creator
**Demographics:**
- Age: 28
- Role: Etsy seller expanding to own site
- Tech Savvy: Low-Medium (uses Shopify)
- Budget: $30-80/month

**Goals:**
- Professional storefront without Shopify fees
- Integrate with existing tools (Stripe, Printful)
- Mobile-first design (80% of traffic)
- Drive organic traffic via SEO

**Pain Points:**
- Shopify fees eating into margins (2.9% + $0.30)
- Limited design customization
- Wants more control over customer data
- Needs better SEO than marketplace

**Success Criteria:**
- Save $200+/month on fees
- Increase conversion rate by 20%
- Own customer email list
- Rank for product keywords

---

## Core Features

### Phase 1: MVP (Weeks 1-4)

#### F1.1: AI Website Generation
**Description**: Generate complete, production-ready HTML websites using Claude Sonnet 4.5.

**Capabilities:**
- Single-page website generation
- 5 categories: Landing, Business, E-commerce, Portfolio, SaaS
- Customizable: title, description, category, theme, color scheme, language
- Embedded CSS (no external stylesheets)
- Responsive design (mobile, tablet, desktop)
- SEO optimized (meta tags, structured data, semantic HTML)
- Accessibility compliant (WCAG AA minimum)
- Performance optimized (lazy loading, async scripts, critical CSS)

**Technical Details:**
- Model: Claude Sonnet 4.5 (claude-sonnet-4-20250514)
- Max tokens: 4096
- Prompt engineering: Production-grade templates (ported from Base44)
- Validation: 50+ quality checks before marking complete

**Acceptance Criteria:**
- [ ] User can input website requirements (title, description, category)
- [ ] System generates HTML in < 60 seconds
- [ ] Generated site passes 75% quality threshold
- [ ] Site includes all required sections for category
- [ ] Site is mobile-responsive (tested on 3 breakpoints)
- [ ] Site scores 90+ on Lighthouse Performance
- [ ] Site has valid HTML (no errors in W3C validator)

**Edge Cases:**
- Timeout after 90 seconds → show partial result + retry option
- Quality score < 75% → auto-regenerate with refined prompt
- Profanity in input → content filter blocks generation
- Rate limit exceeded → queue request, notify user of wait time

**User Flow:**
1. Click "Create New Website"
2. Fill form: Title, Description, Category, Color Scheme
3. Click "Generate"
4. See progress indicator (15-60 seconds)
5. View preview of generated site
6. Save to dashboard

---

#### F1.2: Quality Validation System
**Description**: Automated quality scoring on 5 dimensions with actionable recommendations.

**Validation Dimensions:**
1. **SEO (20%)**: Meta tags, structured data, heading hierarchy, alt text
2. **Performance (20%)**: CSS size, lazy loading, async scripts
3. **Accessibility (20%)**: ARIA labels, form labels, lang attribute, viewport
4. **Design (20%)**: CSS variables, media queries, modern features, animations
5. **Content (20%)**: Word count, CTAs, no placeholders

**Scoring System:**
- 90-100: Excellent (production-ready)
- 75-89: Good (minor improvements suggested)
- 60-74: Fair (significant improvements needed)
- < 60: Poor (regenerate recommended)

**Acceptance Criteria:**
- [ ] Every generated site receives quality score
- [ ] Score includes breakdown by dimension
- [ ] Issues are specific and actionable ("Add 'alt' text to 3 images")
- [ ] Recommendations are ranked by impact
- [ ] User can regenerate if score < 75%

**User Flow:**
1. Site generated
2. Validation runs automatically (< 5 seconds)
3. Score displayed: 87/100 (Good)
4. View breakdown: SEO 95, Performance 80, Accessibility 90, Design 85, Content 85
5. See 5 specific recommendations
6. Click "Regenerate with Improvements" or "Accept & Save"

---

#### F1.3: Website Management Dashboard
**Description**: Central hub to view, manage, and organize all websites.

**Capabilities:**
- Grid view of all websites (card layout)
- Pagination (10 per page)
- Sort by: Created, Updated, Title
- Filter by: Published, Draft, Category
- Quick actions: Preview, Edit, Delete, Publish, Duplicate
- Empty state with CTA for first website
- Responsive layout (grid → list on mobile)

**Data Displayed Per Website:**
- Thumbnail preview (screenshot or placeholder)
- Title
- Category badge
- Quality score badge
- Created date
- Updated date
- Published status (green dot if live)
- Custom domain (if configured)

**Acceptance Criteria:**
- [ ] Dashboard loads in < 2 seconds
- [ ] User can view all their websites
- [ ] Pagination works for 100+ websites
- [ ] Filters apply in real-time (no page reload)
- [ ] Quick actions work without navigating away
- [ ] Delete requires confirmation
- [ ] Empty state shown when no websites exist

**User Flow:**
1. Login → redirects to dashboard
2. See grid of website cards
3. Click sort dropdown → select "Updated (Newest First)"
4. Click website card → navigate to preview
5. Click "..." menu → select "Duplicate"
6. Duplicate created, appears at top of list

---

#### F1.4: Website Preview
**Description**: View generated website in iframe before publishing.

**Capabilities:**
- Full-screen preview in iframe
- Responsive preview modes:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1440px)
- View HTML source (formatted with syntax highlighting)
- Copy HTML to clipboard
- Download HTML file
- View validation report
- Edit HTML (advanced users)

**Acceptance Criteria:**
- [ ] Preview loads in < 3 seconds
- [ ] Responsive modes switch instantly
- [ ] HTML source is formatted and readable
- [ ] Copy to clipboard works in all browsers
- [ ] Download generates valid .html file
- [ ] Validation report matches generation result

**User Flow:**
1. Click website from dashboard
2. See full-screen preview
3. Toggle responsive mode → Mobile
4. Preview resizes to 375px width
5. Click "View HTML" → modal with formatted code
6. Click "Copy" → HTML copied to clipboard
7. Click "Download" → file saved as "[website-title].html"

---

#### F1.5: Authentication & User Management
**Description**: Secure user authentication via Supabase Auth.

**Capabilities:**
- Email + password signup/login
- OAuth providers: Google, GitHub (optional for MVP)
- Password reset via email
- Email verification (optional for MVP)
- Session management (30-day expiry)
- Protected routes (redirect to login if unauthenticated)

**User Profile:**
- Email (required)
- Full name (optional)
- Avatar URL (optional)
- Subscription tier (free, pro, agency)
- Onboarding status (completed/incomplete)

**Acceptance Criteria:**
- [ ] User can sign up with email + password
- [ ] User receives verification email (if enabled)
- [ ] User can log in with credentials
- [ ] User stays logged in for 30 days
- [ ] User can reset password via email
- [ ] Protected routes redirect to /login
- [ ] User can log out

**User Flow - Signup:**
1. Visit /signup
2. Enter email + password + full name
3. Click "Sign Up"
4. Receive verification email (optional)
5. Click verification link
6. Redirected to dashboard
7. See onboarding wizard (optional)

**User Flow - Login:**
1. Visit /login
2. Enter email + password
3. Click "Log In"
4. Redirected to dashboard
5. Session stored in cookie (30 days)

---

### Phase 2: Essential Features (Weeks 5-8)

#### F2.1: Multi-Page Website Support
**Description**: Generate and manage websites with multiple pages + navigation.

**Capabilities:**
- Generate navigation based on pages
- Add/remove pages dynamically
- Page types: Home, About, Services, Contact, Blog, Products, etc.
- Automatic internal linking
- Breadcrumb navigation
- Sitemap generation (XML)

**Acceptance Criteria:**
- [ ] User can add new pages to existing website
- [ ] Navigation menu updates automatically
- [ ] Pages link to each other correctly
- [ ] Sitemap.xml generated for SEO
- [ ] Max 20 pages per website (MVP limit)

---

#### F2.2: SEO Optimization Tools
**Description**: Built-in SEO tools to improve search rankings.

**Capabilities:**
- SEO audit (comprehensive 50+ checks)
- Keyword suggestions
- Meta tag optimization
- Schema.org markup generator
- Sitemap generation
- Robots.txt editor
- Real-time SEO score

**Acceptance Criteria:**
- [ ] User can run SEO audit on any website
- [ ] Audit identifies specific issues
- [ ] Recommendations ranked by impact
- [ ] User can apply fixes with one click
- [ ] SEO score improves after fixes applied

---

#### F2.3: Code Editor
**Description**: Visual and code editors for advanced customization.

**Capabilities:**
- Syntax-highlighted code editor (Monaco)
- Real-time preview
- HTML, CSS, JavaScript editing
- Auto-save (drafts)
- Undo/redo
- Format code (Prettier)
- Find & replace

**Acceptance Criteria:**
- [ ] User can edit HTML directly
- [ ] Changes reflect in preview within 2 seconds
- [ ] Syntax errors highlighted
- [ ] Auto-save every 30 seconds
- [ ] Undo/redo works for 50+ actions

---

#### F2.4: Version History & Rollback
**Description**: Track all changes and restore previous versions.

**Capabilities:**
- Auto-save every change as version
- View version history (list with timestamps)
- Compare versions (visual diff)
- Restore to any previous version
- Name versions (manual snapshots)
- Max 50 versions per website

**Acceptance Criteria:**
- [ ] Every edit creates new version
- [ ] User can view all versions
- [ ] User can preview any version
- [ ] User can restore previous version
- [ ] Restore takes < 3 seconds

---

#### F2.5: One-Click Deployment
**Description**: Publish websites to production with custom domains.

**Capabilities:**
- Deploy to Vercel via API
- Automatic SSL (HTTPS)
- Custom domain configuration
- DNS management (guided setup)
- Preview URLs (staging)
- Production URLs
- Deployment history
- Rollback deployments

**Acceptance Criteria:**
- [ ] User can deploy with one click
- [ ] Deployment completes in < 60 seconds
- [ ] Site is live with HTTPS
- [ ] User can configure custom domain
- [ ] DNS propagation status shown
- [ ] Deployment errors displayed clearly

---

### Phase 3: Advanced Features (Weeks 9-16)

#### F3.1: A/B Testing Engine
**Description**: Create and run A/B tests to optimize conversions.

**Capabilities:**
- Create tests (headline, CTA, layout variations)
- AI-generated variants (Claude creates alternatives)
- Traffic allocation (50/50 or custom split)
- Statistical significance calculation (chi-square test)
- Automatic winner deployment
- Test results dashboard
- Conversion tracking

**Acceptance Criteria:**
- [ ] User can create test with 2+ variants
- [ ] AI generates variants on request
- [ ] Traffic split correctly between variants
- [ ] Winner declared when 95% confidence reached
- [ ] Winner deployed automatically (if enabled)

---

#### F3.2: Analytics Dashboard
**Description**: Comprehensive website analytics and insights.

**Capabilities:**
- Real-time visitor tracking
- Page views, unique visitors, bounce rate
- Traffic sources (referrals, direct, search, social)
- Geographic distribution
- Device breakdown (mobile/desktop)
- Conversion funnel
- User journey mapping
- Heat maps (click tracking)
- Session replay (optional)

**Integration:** PostHog or custom analytics

**Acceptance Criteria:**
- [ ] Dashboard shows real-time visitors
- [ ] Charts load in < 2 seconds
- [ ] Data updates every 60 seconds
- [ ] User can filter by date range
- [ ] User can export data (CSV)

---

#### F3.3: Personalization Engine
**Description**: Dynamic content based on user segments.

**Capabilities:**
- User segmentation (manual rules)
- AI-discovered segments (clustering)
- Content variations per segment
- A/B testing per segment
- Performance tracking per segment
- Behavioral targeting
- Geographic targeting
- Device targeting

**Acceptance Criteria:**
- [ ] User can create segments with rules
- [ ] AI suggests segments based on data
- [ ] Content swaps based on segment match
- [ ] Performance tracked per segment
- [ ] Rules execute in < 100ms

---

#### F3.4: Team Collaboration
**Description**: Multi-user editing with permissions.

**Capabilities:**
- Team member management
- Role-based permissions (Owner, Editor, Viewer)
- Real-time collaboration (live cursors)
- Comments on pages/sections
- Version history per user
- Activity log
- Team workspace

**Acceptance Criteria:**
- [ ] Owner can invite team members
- [ ] Permissions enforced (Viewer can't edit)
- [ ] Multiple users can edit simultaneously
- [ ] Changes sync in < 2 seconds
- [ ] Comments thread per section

---

#### F3.5: E-commerce Integration
**Description**: Add shopping cart and checkout to websites.

**Capabilities:**
- Product catalog management
- Shopping cart
- Stripe checkout integration
- Order management
- Inventory tracking
- Email notifications (order confirmation, shipping)
- Discount codes
- Tax calculation
- Shipping rates

**Acceptance Criteria:**
- [ ] User can add products with variants
- [ ] Cart persists across sessions
- [ ] Checkout uses Stripe (PCI compliant)
- [ ] Orders stored in database
- [ ] Customer receives confirmation email

---

## User Stories & Acceptance Criteria

### Epic 1: Website Generation

#### US1.1: Generate My First Website
**As a** small business owner  
**I want to** generate a professional website in minutes  
**So that** I can establish an online presence without hiring a developer

**Acceptance Criteria:**
- Given I'm logged in
- When I click "Create Website" and fill out the form (title, description, category)
- Then I see a progress indicator
- And I receive a complete website in < 60 seconds
- And the website passes quality validation (score ≥ 75%)
- And I can preview the website in my browser

**Edge Cases:**
- Generation timeout (> 90s) → show error + retry button
- Quality score < 75% → auto-regenerate
- Profanity detected → block generation + show warning

**Success Metrics:**
- 95% of generations complete in < 60 seconds
- 90% of generated sites score ≥ 75% on first attempt
- < 5% timeout rate

---

#### US1.2: Customize Website Design
**As a** consultant  
**I want to** choose colors and theme for my website  
**So that** it matches my brand identity

**Acceptance Criteria:**
- Given I'm on the generation form
- When I select a color scheme (e.g., "Professional Blue")
- And I select a theme (e.g., "Modern")
- Then the generated website uses those colors consistently
- And the design matches the selected theme
- And color contrast meets WCAG AA standards

**Success Metrics:**
- Users who customize colors have 20% higher satisfaction
- 80% of users choose custom colors (vs default)

---

#### US1.3: Understand Website Quality
**As a** entrepreneur  
**I want to** see a quality score and specific issues  
**So that** I know if my website meets professional standards

**Acceptance Criteria:**
- Given my website is generated
- When I view the quality report
- Then I see a score out of 100
- And I see scores for 5 dimensions (SEO, Performance, Accessibility, Design, Content)
- And I see a list of specific issues (e.g., "Missing alt text on 3 images")
- And I see recommendations ranked by impact

**Success Metrics:**
- 90% of users view quality report
- 70% of users with score < 75% regenerate
- Average score improves from 78 → 87 after 1 iteration

---

### Epic 2: Website Management

#### US2.1: View All My Websites
**As a** freelancer  
**I want to** see all my websites in one dashboard  
**So that** I can manage multiple client sites efficiently

**Acceptance Criteria:**
- Given I'm logged in
- When I navigate to the dashboard
- Then I see all my websites in a grid
- And each card shows: title, category, quality score, updated date, published status
- And I can sort by created date, updated date, or title
- And I can filter by published/draft status
- And pagination appears if I have > 10 websites

**Success Metrics:**
- Dashboard loads in < 2 seconds
- 80% of users with > 5 websites use sorting/filtering

---

#### US2.2: Preview Website Before Publishing
**As a** business owner  
**I want to** see how my website looks on mobile and desktop  
**So that** I can ensure it works well on all devices

**Acceptance Criteria:**
- Given I have a generated website
- When I click "Preview"
- Then I see the website in an iframe
- And I can toggle between mobile (375px), tablet (768px), and desktop (1440px) views
- And the layout responds correctly to each viewport
- And I can view the HTML source code
- And I can download the HTML file

**Success Metrics:**
- 95% of users preview before publishing
- 60% of users test multiple viewport sizes

---

#### US2.3: Delete Website I No Longer Need
**As a** creator  
**I want to** delete old websites  
**So that** my dashboard stays organized

**Acceptance Criteria:**
- Given I'm on the dashboard
- When I click "Delete" on a website
- Then I see a confirmation dialog ("Are you sure?")
- And I must confirm before deletion
- Then the website is permanently deleted
- And it no longer appears in my dashboard
- And I receive a success message

**Edge Cases:**
- Published website → additional warning: "This site is live"
- Accidental deletion → no undo (future: soft delete + 30-day recovery)

---

### Epic 3: Deployment & Publishing

#### US3.1: Publish My Website
**As a** solopreneur  
**I want to** make my website live with one click  
**So that** customers can find me online

**Acceptance Criteria:**
- Given I have a generated website
- When I click "Publish"
- Then my website deploys to a unique URL (e.g., mysite.thundercloud.app)
- And deployment completes in < 60 seconds
- And the site is accessible via HTTPS
- And I receive a link to share
- And the site shows in search engines (if indexed)

**Success Metrics:**
- 80% of generated websites are published
- 95% of deployments succeed on first attempt
- < 5% deployment errors

---

#### US3.2: Use My Own Domain
**As a** business owner  
**I want to** use my company domain (e.g., mycompany.com)  
**So that** my website looks professional

**Acceptance Criteria:**
- Given my website is published
- When I click "Add Custom Domain"
- Then I enter my domain name
- And I see DNS configuration instructions
- And I can verify DNS propagation status
- Then my website is accessible via my custom domain
- And HTTPS is automatically configured

**Success Metrics:**
- 40% of pro users configure custom domain
- 90% of domain setups succeed within 24 hours

---

## Technical Specifications

### Architecture

**Stack:**
- Frontend: Next.js 15 + React 19 + TypeScript
- Backend: Next.js API Routes + tRPC
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- AI: Anthropic Claude Sonnet 4.5
- Deployment: Vercel
- Storage: Supabase Storage
- Analytics: PostHog (optional)

**Key Design Decisions:**
1. **Why Next.js 15?** Server Components, App Router, built-in optimization
2. **Why tRPC?** End-to-end type safety, no API documentation needed
3. **Why Supabase?** Managed PostgreSQL + Auth + Storage, RLS for security
4. **Why Claude Sonnet 4.5?** Best-in-class code generation, 200K context window
5. **Why Vercel?** Zero-config deployment, edge functions, automatic HTTPS

---

### Database Schema

**Core Tables:**
1. `user_profiles` - User accounts and settings
2. `websites` - Generated websites and metadata
3. `website_versions` - Version history for rollback
4. `website_deployments` - Deployment history and status
5. `website_templates` - Custom templates (future)

**See SUPABASE_SETUP.md for complete schema (21 tables)**

---

### API Endpoints (tRPC Routers)

**websites router:**
- `list()` - Paginated list of user's websites
- `getById(id)` - Single website details
- `create(data)` - Create new website
- `update(id, data)` - Update existing website
- `delete(id)` - Delete website
- `togglePublish(id)` - Publish/unpublish website

**generation router:**
- `generate(input)` - Generate new website with AI
- `regenerate(id, prompt)` - Regenerate existing website
- `validate(html)` - Validate HTML quality

**Future routers:**
- `versions` - Version management
- `deployments` - Deployment operations
- `seo` - SEO analysis and optimization
- `analytics` - Analytics queries
- `team` - Team collaboration

---

### Security

**Authentication:**
- JWT tokens via Supabase Auth
- 30-day session expiry
- Refresh token rotation
- PKCE flow for OAuth

**Authorization:**
- Row Level Security (RLS) on all tables
- User can only access own data
- Policy: `auth.uid() = user_id`

**Input Validation:**
- Zod schemas on all API inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (DOMPurify on HTML output)
- Rate limiting (100 requests/hour per user)

**Content Safety:**
- Profanity filter on user inputs
- Content moderation (optional)
- DMCA takedown process

---

### Performance

**Targets:**
- Dashboard load: < 2 seconds
- Website generation: < 60 seconds
- Preview load: < 3 seconds
- Deployment: < 60 seconds
- API response: < 500ms (p95)

**Optimization:**
- React Query caching (5-minute stale time)
- Next.js Image optimization
- Edge caching (Vercel CDN)
- Database indexing on user_id, website_id
- Lazy loading for website previews

---

### Scalability

**Current Capacity:**
- 10,000 concurrent users
- 100 websites generated/minute
- 1M websites stored
- 10M page views/month

**Bottlenecks:**
- Anthropic API rate limits (4,000 RPM)
- Supabase connection pool (100 connections)
- Vercel function execution time (10s max)

**Scaling Strategy:**
- Queue generation requests (BullMQ + Redis)
- Database read replicas for analytics
- CDN for static assets
- Separate inference server for AI (future)

---

## Success Metrics

### North Star Metric
**Active Websites Published Per Month**

- Month 1: 100
- Month 3: 500
- Month 6: 2,000
- Month 12: 10,000

---

### Key Performance Indicators (KPIs)

**Acquisition:**
- Signups per week: 100 → 500 → 2,000
- Conversion rate (visitor → signup): 5% → 10%
- Cost per acquisition (CPA): $50 → $20
- Viral coefficient (k-factor): 0.2 → 0.5

**Activation:**
- First website generated: 80% of signups
- Time to first generation: < 10 minutes (median)
- Quality score on first generation: 78 (median)
- Websites published: 60% of generated

**Engagement:**
- DAU/MAU ratio: 20% → 40%
- Websites per user: 2 → 5 (median)
- Sessions per week: 2 → 4
- Time in product: 15 min → 30 min per session

**Retention:**
- Day 1 retention: 60%
- Day 7 retention: 40%
- Day 30 retention: 25%
- Churn rate: 5% per month

**Revenue:**
- Free → Paid conversion: 10% → 20%
- ARPU (Average Revenue Per User): $15 → $35
- MRR (Monthly Recurring Revenue): $10K → $100K → $500K
- LTV:CAC ratio: 3:1 → 5:1

**Product Quality:**
- Generation success rate: 95%
- Average quality score: 78 → 87
- Support tickets per 100 users: 5 → 2
- NPS (Net Promoter Score): 40 → 60
- CSAT (Customer Satisfaction): 4.2 → 4.7 / 5.0

---

### Success Criteria by Phase

**MVP Success (Week 4):**
- ✅ 50 beta users signed up
- ✅ 100 websites generated
- ✅ 60 websites published
- ✅ 85% generation success rate
- ✅ Average quality score ≥ 75
- ✅ < 10 critical bugs
- ✅ NPS ≥ 40

**Phase 2 Success (Week 8):**
- ✅ 200 active users
- ✅ 500 websites generated
- ✅ 10% free → paid conversion
- ✅ $2K MRR
- ✅ 30-day retention ≥ 25%
- ✅ CSAT ≥ 4.2

**Phase 3 Success (Week 16):**
- ✅ 1,000 active users
- ✅ 5,000 websites generated
- ✅ $20K MRR
- ✅ Product-market fit validated
- ✅ NPS ≥ 50

---

## MVP Scope

### In Scope (MVP)
✅ **Must Have:**
1. AI website generation (5 categories)
2. Quality validation (50+ checks)
3. Website dashboard (list, sort, filter)
4. Preview (mobile, tablet, desktop)
5. Authentication (email + password)
6. Basic publishing (preview URL)

### Out of Scope (Post-MVP)
❌ **Later:**
1. Multi-page websites → Phase 2
2. Code editor → Phase 2
3. Custom domains → Phase 2
4. A/B testing → Phase 3
5. Analytics → Phase 3
6. Team collaboration → Phase 3
7. E-commerce → Phase 3
8. OAuth (Google, GitHub) → Phase 2
9. Email verification → Phase 2
10. Mobile app → Phase 4

---

## Future Roadmap

### Phase 4: Scale (Months 5-6)
- Mobile app (React Native)
- API for developers
- Zapier/Make integrations
- White-label solution (agencies)
- Multi-language support (10+ languages)

### Phase 5: Ecosystem (Months 7-12)
- Template marketplace
- Plugin system
- Component library
- AI design assistant (chat interface)
- Brand kit import (Figma, Sketch)
- CMS integration (WordPress, Contentful)

### Phase 6: Enterprise (Year 2)
- On-premise deployment
- SSO (SAML, Okta)
- Advanced permissions (RBAC)
- Audit logs
- SLA guarantees
- Dedicated support

---

## Competitive Analysis

### Direct Competitors

**1. Wix ADI**
- Pros: Established brand, large template library
- Cons: Templated look, limited customization, expensive ($16-45/month)
- Differentiation: Thundercloud generates custom code, not templates

**2. 10Web AI Builder**
- Pros: WordPress integration, decent AI
- Cons: Requires WordPress knowledge, slow generation
- Differentiation: Thundercloud is faster, simpler, better quality

**3. Durable AI**
- Pros: Fast generation (30 seconds)
- Cons: Generic output, no customization, no validation
- Differentiation: Thundercloud has quality validation, higher output quality

**4. Hostinger AI Website Builder**
- Pros: Cheap ($2.99/month), easy to use
- Cons: Very basic, limited AI capability
- Differentiation: Thundercloud uses Claude Sonnet 4.5 (best AI)

### Indirect Competitors

**5. Squarespace**
- Strength: Beautiful templates
- Weakness: Not AI-powered, manual building
- Opportunity: Position as "AI-powered Squarespace"

**6. Webflow**
- Strength: Full control, powerful CMS
- Weakness: Steep learning curve, expensive
- Opportunity: "Webflow-quality without the complexity"

**7. WordPress + Elementor**
- Strength: Maximum flexibility, huge ecosystem
- Weakness: Technical overhead, hosting required
- Opportunity: "WordPress-quality, 10x faster"

---

### Competitive Advantages

**1. Quality of Output**
- Claude Sonnet 4.5 (best-in-class AI)
- Production-grade prompts (battle-tested)
- 50+ quality checks
- Average score: 87/100 (competitors: 65-75)

**2. Speed**
- Generate in 30-60 seconds (competitors: 2-10 minutes)
- One-click deployment (competitors: 5-10 steps)

**3. Transparency**
- Show quality scores (competitors: hide quality)
- Explain AI decisions (competitors: black box)
- View/edit source code (competitors: locked in)

**4. Value**
- $29/month for unlimited (competitors: $16-45 for limited)
- No vendor lock-in (export HTML)
- No transaction fees (competitors: 3% on e-commerce)

---

## Pricing Strategy

### Free Tier
**Target:** Hobbyists, students, individuals testing the product

**Limits:**
- 3 websites max
- 1 generation per website
- Preview URL only (no custom domain)
- Thundercloud branding
- Community support

**Conversion Goal:** 10% → Paid within 30 days

---

### Pro Tier - $29/month
**Target:** Solopreneurs, freelancers, small businesses

**Includes:**
- Unlimited websites
- Unlimited regenerations
- Custom domains (3 included)
- Remove branding
- Priority support (24-hour response)
- SEO tools
- Multi-page sites
- Code editor
- Version history (50 versions)
- Analytics (basic)

**Value Prop:** "Everything you need to run a professional online presence"

---

### Agency Tier - $249/month
**Target:** Agencies, consultants building client sites

**Includes:**
- Everything in Pro
- Team collaboration (10 seats)
- Client management
- White-label interface
- API access (10,000 requests/month)
- Priority generation queue
- Dedicated account manager
- SLA (99.9% uptime)
- Advanced analytics
- A/B testing
- Personalization

**Value Prop:** "Scale your agency 10x without hiring"

---

## Go-to-Market Strategy

### Phase 1: Private Beta (Weeks 1-4)
**Goal:** Validate MVP, gather feedback

**Tactics:**
- Invite 50 beta users (personal network)
- Weekly feedback calls (10 users)
- Rapid iteration (ship fixes daily)
- Build testimonial library
- Create case studies (3 success stories)

**Success Metric:** NPS ≥ 40

---

### Phase 2: Public Launch (Weeks 5-8)
**Goal:** Acquire first 200 paying customers

**Tactics:**
- Product Hunt launch (aim for #1 Product of the Day)
- Indie Hackers post
- Reddit threads (r/Entrepreneur, r/SaaS, r/smallbusiness)
- Twitter launch thread
- Lifetime deal (AppSumo) - $79 one-time
- Affiliate program (20% commission)
- Content marketing (10 blog posts on SEO, web design)

**Success Metric:** 200 signups, $2K MRR

---

### Phase 3: Growth (Months 3-6)
**Goal:** Scale to 1,000 users, $20K MRR

**Tactics:**
- SEO (rank for "AI website builder", "free website builder")
- YouTube tutorials (20 videos)
- Comparison pages (vs Wix, vs Squarespace)
- Integrations (Zapier, Make, WordPress)
- Partner with agencies (20% revenue share)
- Paid ads (Google, Meta) - $5K/month budget

**Success Metric:** 1,000 active users, $20K MRR, CAC < $50

---

## Risk Analysis

### Technical Risks

**R1: AI Quality Degrades**
- Risk: Claude updates reduce output quality
- Mitigation: Pin model version, extensive testing before upgrades
- Backup: Maintain multiple model versions, allow user selection

**R2: Anthropic API Downtime**
- Risk: Cannot generate websites during outages
- Mitigation: Queue requests, show ETA, retry automatically
- Backup: Secondary provider (OpenAI GPT-4)

**R3: Database Scalability**
- Risk: Supabase hits limits at 10K+ users
- Mitigation: Optimize queries, add read replicas, cache aggressively
- Backup: Migrate to self-hosted PostgreSQL

### Business Risks

**R4: Low Conversion Rate**
- Risk: Free users don't convert to paid
- Mitigation: Limit free tier (3 websites), add paywall features
- Backup: Freemium + usage-based pricing

**R5: High Churn**
- Risk: Users cancel after 1-2 months
- Mitigation: Improve product, add sticky features (analytics, domains)
- Backup: Annual plans (2 months free), lifetime deals

**R6: Competitor Copycat**
- Risk: Wix/Squarespace launches AI builder
- Mitigation: Innovate faster, build moat (quality, integrations)
- Backup: Position as "best AI" vs "easiest builder"

### Legal Risks

**R7: Copyright Infringement**
- Risk: AI generates copyrighted content
- Mitigation: Content filter, DMCA process, user agreements
- Backup: Disable generation, manual review

**R8: Data Breach**
- Risk: User data exposed
- Mitigation: SOC 2 compliance, penetration testing, encryption
- Backup: Cyber insurance, incident response plan

---

## Appendices

### Appendix A: Glossary

**Terms:**
- **MVP**: Minimum Viable Product
- **RLS**: Row Level Security
- **tRPC**: TypeScript Remote Procedure Call
- **PWA**: Progressive Web App
- **WCAG**: Web Content Accessibility Guidelines
- **SEO**: Search Engine Optimization
- **NPS**: Net Promoter Score
- **CSAT**: Customer Satisfaction Score
- **MRR**: Monthly Recurring Revenue
- **ARR**: Annual Recurring Revenue
- **ARPU**: Average Revenue Per User
- **CAC**: Customer Acquisition Cost
- **LTV**: Lifetime Value

### Appendix B: Technical Resources

**Code Repositories:**
- Frontend: github.com/thundercloud/app
- Backend: github.com/thundercloud/api
- Docs: github.com/thundercloud/docs

**Design Assets:**
- Figma: figma.com/thundercloud-design-system
- Brand Kit: thundercloud.com/brand

**Documentation:**
- API Docs: docs.thundercloud.com
- User Guide: help.thundercloud.com
- Developer Portal: developers.thundercloud.com

### Appendix C: Support Resources

**Support Channels:**
- Email: support@thundercloud.com
- Discord: discord.gg/thundercloud
- Docs: help.thundercloud.com
- Status: status.thundercloud.com

**SLAs:**
- Free: Best effort (community support)
- Pro: 24-hour response
- Agency: 4-hour response + 99.9% uptime

---

**Document End**

This PRD is a living document. Updates will be versioned and communicated to all stakeholders.

**Next Review Date:** End of MVP (Week 4)
