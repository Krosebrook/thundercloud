# Feature Specification: SEO Optimization Tools
## Priority: P0 - CRITICAL (Build Third)

**Version:** 1.0  
**Status:** Ready for Development  
**Estimated Build Time:** 16-20 hours  
**Revenue Impact:** VERY HIGH - Competitive differentiation, justifies premium pricing

---

## Executive Summary

### Problem
Users create beautiful websites but **can't get found on Google**:
- Don't know what SEO means
- Don't know how to optimize meta tags
- Don't know what keywords to target
- Don't understand Google's requirements
- Can't measure SEO performance

**Result:** Websites that look great but get zero organic traffic. Users give up and churn.

### Solution
Automated SEO optimization system that:
1. Audits website for 100+ SEO issues
2. Provides actionable recommendations
3. Auto-fixes common problems with one click
4. Generates SEO-optimized content with AI
5. Tracks SEO score over time

### Success Metrics
- **SEO Score Improvement:** +30 points average (60 → 90)
- **Feature Usage:** 75% of users run SEO audit
- **Auto-Fix Adoption:** 60% apply recommended fixes
- **Organic Traffic:** +200% within 30 days (for fixed sites)
- **Competitive Win:** "Best SEO tools" in category

---

## User Stories

### US1: Run SEO Audit
**As a** business owner  
**I want to** understand how SEO-friendly my website is  
**So that** I can improve my Google rankings

**Acceptance Criteria:**
- [ ] One-click SEO audit button
- [ ] Audit scans 100+ SEO factors
- [ ] Shows overall SEO score (0-100)
- [ ] Breaks down score by category:
  - Technical SEO (30 points)
  - On-Page SEO (25 points)
  - Content Quality (20 points)
  - Mobile Optimization (15 points)
  - Performance (10 points)
- [ ] Shows pass/fail/warning for each check
- [ ] Provides specific recommendations
- [ ] Can re-run audit after fixes

**User Flow:**
```
1. Dashboard → Website → SEO Tools
2. Click "Run SEO Audit"
3. Wait 10-30 seconds
4. See results:
   SEO Score: 72/100 (Good)
   
   Technical SEO: 18/30 ⚠️
   ❌ Missing sitemap.xml
   ❌ No robots.txt
   ✓ HTTPS enabled
   ✓ Valid HTML structure
   
   On-Page SEO: 15/25 ⚠️
   ❌ Meta description missing
   ⚠️  Title tag too short (35 chars, recommend 50-60)
   ✓ H1 tag present
   
   [Auto-Fix Issues] [View Report]
```

---

### US2: Auto-Fix SEO Issues
**As a** user  
**I want to** fix SEO problems automatically  
**So that** I don't have to learn technical SEO

**Acceptance Criteria:**
- [ ] One-click "Auto-Fix" button
- [ ] Fixes common issues automatically:
  - Generate meta descriptions
  - Create sitemap.xml
  - Create robots.txt
  - Add alt text to images
  - Fix title tag length
  - Add Open Graph tags
  - Add structured data (Schema.org)
- [ ] Shows preview before applying
- [ ] Can undo auto-fixes
- [ ] Re-runs audit after fixing

**User Flow:**
```
1. After audit shows issues
2. Click "Auto-Fix Issues"
3. See preview:
   ✓ Generate meta description (AI-powered)
   ✓ Create sitemap.xml (10 pages)
   ✓ Create robots.txt (allow all)
   ✓ Add alt text to 5 images
   ✓ Fix title tag (45 → 55 chars)
4. Click "Apply Fixes"
5. Wait 5 seconds
6. See: SEO Score: 72 → 89 (+17 points!)
```

---

### US3: Keyword Research & Optimization
**As a** content creator  
**I want to** know what keywords to target  
**So that** I can rank for relevant searches

**Acceptance Criteria:**
- [ ] Keyword suggestion tool
- [ ] Based on industry/category
- [ ] Shows search volume
- [ ] Shows competition level
- [ ] Shows keyword difficulty
- [ ] Can add keywords to target
- [ ] AI optimizes content for keywords

**User Flow:**
```
1. SEO Tools → Keyword Research
2. Enter: "small business consulting"
3. See suggestions:
   • "business consultant near me" (8.1K/mo, Low competition)
   • "small business advisor" (5.2K/mo, Medium)
   • "startup consulting services" (3.7K/mo, Medium)
   • "business coach for entrepreneurs" (2.1K/mo, Low)
4. Select 3 keywords
5. Click "Optimize Content"
6. AI rewrites homepage to include keywords naturally
7. See: Keyword usage: 3/3 ✓
```

---

### US4: Meta Tag Optimization
**As a** marketer  
**I want to** optimize meta tags for social sharing  
**So that** my website looks good when shared on Facebook/Twitter

**Acceptance Criteria:**
- [ ] Visual meta tag editor
- [ ] Preview how site appears on:
  - Google search results
  - Facebook shares
  - Twitter cards
  - LinkedIn posts
- [ ] AI-generated meta descriptions
- [ ] Character count warnings
- [ ] Image optimization for Open Graph

**User Flow:**
```
1. SEO Tools → Meta Tags
2. See current tags:
   Title: "My Website" (Too short!)
   Description: (Missing!)
3. Click "Generate with AI"
4. See preview:
   Google: "Professional Business Consulting Services |..."
   Facebook: [Image preview] + description
5. Edit if needed
6. Click "Apply"
7. See preview update in real-time
```

---

### US5: Content SEO Analysis
**As a** blogger  
**I want to** know if my content is SEO-optimized  
**So that** my articles rank on Google

**Acceptance Criteria:**
- [ ] Analyzes content quality
- [ ] Checks readability score
- [ ] Checks keyword density
- [ ] Checks heading structure (H1, H2, H3)
- [ ] Checks image alt text
- [ ] Checks internal/external links
- [ ] Provides improvement suggestions

---

### US6: Sitemap & Robots.txt Management
**As a** website owner  
**I want to** control what Google indexes  
**So that** only important pages show up in search

**Acceptance Criteria:**
- [ ] Auto-generate sitemap.xml
- [ ] Auto-update when pages change
- [ ] Visual sitemap editor
- [ ] Robots.txt editor with templates
- [ ] Submit sitemap to Google Search Console (future)

---

## Technical Specification

### Architecture

```
┌─────────────────────────────────────────────┐
│ User clicks "Run SEO Audit"                 │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Frontend: Fetch website HTML                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ tRPC: seo.audit({ websiteId })              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Backend: Load website HTML from DB          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ SEO Audit Engine: Run 100+ checks           │
│ ├─ Technical SEO (30 pts)                   │
│ │  ├─ HTTPS check                           │
│ │  ├─ Sitemap check                         │
│ │  ├─ Robots.txt check                      │
│ │  ├─ HTML validation                       │
│ │  └─ Page speed                            │
│ ├─ On-Page SEO (25 pts)                     │
│ │  ├─ Title tag check                       │
│ │  ├─ Meta description check                │
│ │  ├─ H1 tag check                          │
│ │  ├─ Alt text check                        │
│ │  └─ Internal linking                      │
│ ├─ Content Quality (20 pts)                 │
│ │  ├─ Word count                            │
│ │  ├─ Readability score                     │
│ │  ├─ Keyword usage                         │
│ │  └─ Duplicate content                     │
│ ├─ Mobile SEO (15 pts)                      │
│ │  ├─ Viewport meta tag                     │
│ │  ├─ Mobile-friendly test                  │
│ │  ├─ Touch elements size                   │
│ │  └─ Font size                             │
│ └─ Performance (10 pts)                     │
│    ├─ Page load time                        │
│    ├─ Image optimization                    │
│    ├─ Minified CSS/JS                       │
│    └─ Caching headers                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Calculate Total Score: 72/100               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Generate Recommendations                    │
│ • High Priority: Fix missing meta desc      │
│ • Medium Priority: Add sitemap               │
│ • Low Priority: Improve readability          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Save audit results to database              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Return audit report to frontend             │
└─────────────────────────────────────────────┘
```

### Database Schema

**Table 1: `seo_audits`**

```sql
CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  -- Overall score
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  
  -- Category scores
  technical_seo_score INTEGER,
  onpage_seo_score INTEGER,
  content_quality_score INTEGER,
  mobile_seo_score INTEGER,
  performance_score INTEGER,
  
  -- Issues found
  issues JSONB, -- Array of {severity, category, message, fixable}
  /*
  Example:
  [
    {
      "severity": "error",
      "category": "onpage",
      "check": "meta_description",
      "message": "Meta description is missing",
      "impact": "High - affects click-through rate from search results",
      "fixable": true,
      "auto_fix_available": true
    }
  ]
  */
  
  -- Recommendations
  recommendations JSONB, -- Array of improvement suggestions
  
  -- Audit metadata
  audit_duration_ms INTEGER,
  checks_performed INTEGER,
  checks_passed INTEGER,
  checks_failed INTEGER,
  checks_warned INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_website_audits (website_id, created_at DESC),
  INDEX idx_user_audits (user_id, created_at DESC)
);

-- RLS
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audits"
  ON seo_audits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits"
  ON seo_audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Table 2: `seo_keywords`**

```sql
CREATE TABLE seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  keyword TEXT NOT NULL,
  search_volume INTEGER, -- Monthly searches
  competition TEXT, -- 'low', 'medium', 'high'
  difficulty INTEGER, -- 0-100
  target_url TEXT, -- Which page targets this keyword
  current_rank INTEGER, -- Current Google position (null if not ranking)
  
  is_primary BOOLEAN DEFAULT false,
  added_at TIMESTAMP DEFAULT NOW(),
  last_checked_at TIMESTAMP,
  
  UNIQUE(website_id, keyword),
  INDEX idx_website_keywords (website_id)
);

-- RLS
ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own keywords"
  ON seo_keywords FOR ALL
  USING (auth.uid() = user_id);
```

**Table 3: `seo_meta_tags`**

```sql
CREATE TABLE seo_meta_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  -- Basic meta tags
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Open Graph (Facebook)
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  og_url TEXT,
  
  -- Twitter Card
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  
  -- Structured data (Schema.org)
  schema_org JSONB,
  /*
  Example:
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "My Company",
    "url": "https://mycompany.com",
    "logo": "https://mycompany.com/logo.png"
  }
  */
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(website_id)
);

-- RLS
ALTER TABLE seo_meta_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meta tags"
  ON seo_meta_tags FOR ALL
  USING (auth.uid() = user_id);
```

---

### SEO Audit Engine

**File:** `src/lib/seo/audit-engine.ts`

```typescript
import * as cheerio from 'cheerio';
import { readabilityScore } from './readability';
import { analyzePerformance } from './performance';

interface SEOCheck {
  id: string;
  category: 'technical' | 'onpage' | 'content' | 'mobile' | 'performance';
  severity: 'error' | 'warning' | 'info';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fixable: boolean;
  autoFixAvailable: boolean;
  points: number; // How many points this check is worth
}

interface SEOAuditResult {
  totalScore: number;
  categoryScores: {
    technical: number;
    onpage: number;
    content: number;
    mobile: number;
    performance: number;
  };
  issues: SEOCheck[];
  recommendations: string[];
  checksPassed: number;
  checksFailed: number;
  checksWarned: number;
}

export async function runSEOAudit(html: string, url?: string): Promise<SEOAuditResult> {
  const $ = cheerio.load(html);
  const issues: SEOCheck[] = [];
  
  // TECHNICAL SEO CHECKS (30 points)
  
  // 1. HTTPS check (5 points)
  if (url && !url.startsWith('https://')) {
    issues.push({
      id: 'https_missing',
      category: 'technical',
      severity: 'error',
      message: 'Website is not using HTTPS',
      impact: 'high',
      fixable: false,
      autoFixAvailable: false,
      points: 5,
    });
  }
  
  // 2. Sitemap check (5 points)
  // Check if <link rel="sitemap"> exists or /sitemap.xml is accessible
  const sitemapLink = $('link[rel="sitemap"]').attr('href');
  if (!sitemapLink) {
    issues.push({
      id: 'sitemap_missing',
      category: 'technical',
      severity: 'error',
      message: 'Sitemap.xml is missing',
      impact: 'high',
      fixable: true,
      autoFixAvailable: true,
      points: 5,
    });
  }
  
  // 3. Robots.txt check (3 points)
  // Assumed missing if not explicitly found (check via separate API call)
  issues.push({
    id: 'robots_missing',
    category: 'technical',
    severity: 'warning',
    message: 'Robots.txt is missing',
    impact: 'medium',
    fixable: true,
    autoFixAvailable: true,
    points: 3,
  });
  
  // 4. HTML validation (5 points)
  const hasDoctype = html.trim().toLowerCase().startsWith('<!doctype html>');
  if (!hasDoctype) {
    issues.push({
      id: 'doctype_missing',
      category: 'technical',
      severity: 'error',
      message: 'HTML5 doctype is missing',
      impact: 'medium',
      fixable: true,
      autoFixAvailable: true,
      points: 5,
    });
  }
  
  // 5. Page speed (12 points)
  // Check: HTML size, inline styles, minification
  const htmlSize = Buffer.byteLength(html, 'utf8');
  if (htmlSize > 200000) { // > 200KB
    issues.push({
      id: 'html_too_large',
      category: 'performance',
      severity: 'warning',
      message: `HTML size is ${Math.round(htmlSize / 1000)}KB (recommend < 200KB)`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: false,
      points: 4,
    });
  }
  
  // ON-PAGE SEO CHECKS (25 points)
  
  // 6. Title tag (8 points)
  const title = $('title').text();
  if (!title) {
    issues.push({
      id: 'title_missing',
      category: 'onpage',
      severity: 'error',
      message: 'Title tag is missing',
      impact: 'high',
      fixable: true,
      autoFixAvailable: true,
      points: 8,
    });
  } else if (title.length < 30) {
    issues.push({
      id: 'title_too_short',
      category: 'onpage',
      severity: 'warning',
      message: `Title is too short (${title.length} chars, recommend 50-60)`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: true,
      points: 3,
    });
  } else if (title.length > 60) {
    issues.push({
      id: 'title_too_long',
      category: 'onpage',
      severity: 'warning',
      message: `Title is too long (${title.length} chars, recommend 50-60)`,
      impact: 'low',
      fixable: true,
      autoFixAvailable: true,
      points: 2,
    });
  }
  
  // 7. Meta description (8 points)
  const metaDesc = $('meta[name="description"]').attr('content');
  if (!metaDesc) {
    issues.push({
      id: 'meta_description_missing',
      category: 'onpage',
      severity: 'error',
      message: 'Meta description is missing',
      impact: 'high',
      fixable: true,
      autoFixAvailable: true,
      points: 8,
    });
  } else if (metaDesc.length < 120) {
    issues.push({
      id: 'meta_description_too_short',
      category: 'onpage',
      severity: 'warning',
      message: `Meta description is too short (${metaDesc.length} chars, recommend 150-160)`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: true,
      points: 3,
    });
  }
  
  // 8. H1 tag (5 points)
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.push({
      id: 'h1_missing',
      category: 'onpage',
      severity: 'error',
      message: 'H1 heading is missing',
      impact: 'high',
      fixable: true,
      autoFixAvailable: true,
      points: 5,
    });
  } else if (h1Count > 1) {
    issues.push({
      id: 'multiple_h1',
      category: 'onpage',
      severity: 'warning',
      message: `Multiple H1 tags found (${h1Count}, recommend 1)`,
      impact: 'low',
      fixable: true,
      autoFixAvailable: true,
      points: 2,
    });
  }
  
  // 9. Image alt text (4 points)
  const images = $('img');
  const imagesWithoutAlt = images.filter((_, img) => !$(img).attr('alt')).length;
  if (imagesWithoutAlt > 0) {
    issues.push({
      id: 'images_missing_alt',
      category: 'onpage',
      severity: 'warning',
      message: `${imagesWithoutAlt} images missing alt text`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: true,
      points: 4,
    });
  }
  
  // CONTENT QUALITY CHECKS (20 points)
  
  // 10. Word count (5 points)
  const bodyText = $('body').text().trim();
  const wordCount = bodyText.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({
      id: 'low_word_count',
      category: 'content',
      severity: 'warning',
      message: `Low word count (${wordCount} words, recommend 300+)`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: false,
      points: 5,
    });
  }
  
  // 11. Readability (5 points)
  const readability = readabilityScore(bodyText);
  if (readability < 60) {
    issues.push({
      id: 'low_readability',
      category: 'content',
      severity: 'warning',
      message: `Low readability score (${readability}/100, recommend 60+)`,
      impact: 'low',
      fixable: true,
      autoFixAvailable: false,
      points: 3,
    });
  }
  
  // 12. Heading structure (5 points)
  const headings = $('h1, h2, h3, h4, h5, h6');
  if (headings.length < 3) {
    issues.push({
      id: 'insufficient_headings',
      category: 'content',
      severity: 'warning',
      message: 'Insufficient heading structure (recommend 3+ headings)',
      impact: 'low',
      fixable: true,
      autoFixAvailable: false,
      points: 3,
    });
  }
  
  // 13. Internal links (5 points)
  const internalLinks = $('a[href^="/"], a[href^="./"], a[href^="../"]');
  if (internalLinks.length < 2) {
    issues.push({
      id: 'few_internal_links',
      category: 'content',
      severity: 'info',
      message: 'Few internal links (recommend 3+ for navigation)',
      impact: 'low',
      fixable: true,
      autoFixAvailable: false,
      points: 2,
    });
  }
  
  // MOBILE SEO CHECKS (15 points)
  
  // 14. Viewport meta tag (8 points)
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport) {
    issues.push({
      id: 'viewport_missing',
      category: 'mobile',
      severity: 'error',
      message: 'Viewport meta tag is missing',
      impact: 'high',
      fixable: true,
      autoFixAvailable: true,
      points: 8,
    });
  }
  
  // 15. Responsive images (4 points)
  const imagesWithoutSrcset = images.filter((_, img) => !$(img).attr('srcset')).length;
  if (imagesWithoutSrcset > images.length / 2) {
    issues.push({
      id: 'non_responsive_images',
      category: 'mobile',
      severity: 'warning',
      message: 'Images not optimized for mobile (missing srcset)',
      impact: 'medium',
      fixable: true,
      autoFixAvailable: false,
      points: 3,
    });
  }
  
  // 16. Font size (3 points)
  // Check if body font size is specified (assume 16px minimum)
  const bodyStyles = $('body').attr('style') || '';
  if (!bodyStyles.includes('font-size') && !$('style, link[rel="stylesheet"]').length) {
    issues.push({
      id: 'font_size_not_set',
      category: 'mobile',
      severity: 'warning',
      message: 'Base font size not specified (recommend 16px minimum)',
      impact: 'low',
      fixable: true,
      autoFixAvailable: true,
      points: 2,
    });
  }
  
  // PERFORMANCE CHECKS (10 points)
  // These are simplified - real implementation would use Lighthouse/PageSpeed API
  
  // 17. Image optimization (5 points)
  const largeImages = images.filter((_, img) => {
    const src = $(img).attr('src');
    // Check if image is likely large (heuristic: no optimization params)
    return src && !src.includes('w=') && !src.includes('q=');
  }).length;
  
  if (largeImages > 0) {
    issues.push({
      id: 'unoptimized_images',
      category: 'performance',
      severity: 'warning',
      message: `${largeImages} images may not be optimized`,
      impact: 'medium',
      fixable: true,
      autoFixAvailable: false,
      points: 3,
    });
  }
  
  // 18. Minification (3 points)
  const inlineScripts = $('script:not([src])');
  if (inlineScripts.length > 0) {
    const hasUnminified = inlineScripts.toArray().some(script => {
      const content = $(script).html() || '';
      return content.includes('  ') || content.includes('\n'); // Whitespace = not minified
    });
    
    if (hasUnminified) {
      issues.push({
        id: 'unminified_js',
        category: 'performance',
        severity: 'info',
        message: 'JavaScript not minified',
        impact: 'low',
        fixable: true,
        autoFixAvailable: false,
        points: 2,
      });
    }
  }
  
  // 19. Caching (2 points)
  // Can only check via HTTP headers (not in HTML)
  // Placeholder for future implementation
  
  // CALCULATE SCORES
  
  const maxPoints = {
    technical: 30,
    onpage: 25,
    content: 20,
    mobile: 15,
    performance: 10,
  };
  
  const lostPoints = {
    technical: 0,
    onpage: 0,
    content: 0,
    mobile: 0,
    performance: 0,
  };
  
  issues.forEach(issue => {
    lostPoints[issue.category] += issue.points;
  });
  
  const categoryScores = {
    technical: Math.max(0, maxPoints.technical - lostPoints.technical),
    onpage: Math.max(0, maxPoints.onpage - lostPoints.onpage),
    content: Math.max(0, maxPoints.content - lostPoints.content),
    mobile: Math.max(0, maxPoints.mobile - lostPoints.mobile),
    performance: Math.max(0, maxPoints.performance - lostPoints.performance),
  };
  
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0);
  
  const checksPassed = Object.values(maxPoints).reduce((sum, max) => sum + max, 0) - issues.length;
  const checksFailed = issues.filter(i => i.severity === 'error').length;
  const checksWarned = issues.filter(i => i.severity === 'warning').length;
  
  // Generate recommendations
  const recommendations = generateRecommendations(issues, totalScore);
  
  return {
    totalScore,
    categoryScores,
    issues,
    recommendations,
    checksPassed,
    checksFailed,
    checksWarned,
  };
}

function generateRecommendations(issues: SEOCheck[], score: number): string[] {
  const recs: string[] = [];
  
  if (score < 50) {
    recs.push('🚨 Critical: Your SEO score is low. Focus on fixing high-impact errors first.');
  } else if (score < 75) {
    recs.push('⚠️ Warning: Good progress, but still room for improvement.');
  } else {
    recs.push('✓ Great! Your website is well-optimized for search engines.');
  }
  
  // Prioritize high-impact, auto-fixable issues
  const autoFixable = issues.filter(i => i.autoFixAvailable && i.impact === 'high');
  if (autoFixable.length > 0) {
    recs.push(`💡 Quick wins: ${autoFixable.length} issues can be auto-fixed with one click.`);
  }
  
  // Category-specific recommendations
  const technicalIssues = issues.filter(i => i.category === 'technical' && i.severity === 'error');
  if (technicalIssues.length > 0) {
    recs.push('🔧 Technical: Fix critical technical issues (HTTPS, sitemap, robots.txt).');
  }
  
  const onpageIssues = issues.filter(i => i.category === 'onpage' && i.severity === 'error');
  if (onpageIssues.length > 0) {
    recs.push('📝 On-Page: Optimize title tags, meta descriptions, and headings.');
  }
  
  const contentIssues = issues.filter(i => i.category === 'content');
  if (contentIssues.length > 0) {
    recs.push('✍️ Content: Add more content (300+ words), improve readability.');
  }
  
  return recs;
}

// Helper: Flesch Reading Ease score
function readabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const syllables = countSyllables(text);
  
  if (sentences === 0 || words === 0) return 0;
  
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;
  
  words.forEach(word => {
    word = word.replace(/[^a-z]/g, '');
    if (word.length === 0) return;
    
    const syllableRegex = /[aeiouy]+/g;
    const matches = word.match(syllableRegex);
    count += matches ? matches.length : 1;
  });
  
  return count;
}
```

---

### Auto-Fix Engine

**File:** `src/lib/seo/auto-fix.ts`

```typescript
import * as cheerio from 'cheerio';
import { generateMetaDescription } from '../ai/anthropic';

interface AutoFixResult {
  html: string;
  fixesApplied: string[];
}

export async function autoFixSEOIssues(
  html: string,
  issues: SEOCheck[]
): Promise<AutoFixResult> {
  const $ = cheerio.load(html);
  const fixesApplied: string[] = [];
  
  // Fix 1: Generate meta description
  const metaDescIssue = issues.find(i => i.id === 'meta_description_missing');
  if (metaDescIssue) {
    const bodyText = $('body').text().trim();
    const description = await generateMetaDescription(bodyText);
    
    if (!$('meta[name="description"]').length) {
      $('head').append(`<meta name="description" content="${description}">`);
    } else {
      $('meta[name="description"]').attr('content', description);
    }
    
    fixesApplied.push('Generated meta description');
  }
  
  // Fix 2: Fix title tag length
  const titleTooShort = issues.find(i => i.id === 'title_too_short');
  if (titleTooShort) {
    const currentTitle = $('title').text();
    const siteName = extractSiteName($);
    const newTitle = `${currentTitle} | ${siteName} - Professional Services`;
    $('title').text(newTitle.slice(0, 60));
    fixesApplied.push('Expanded title tag to optimal length');
  }
  
  // Fix 3: Add alt text to images
  const altTextIssue = issues.find(i => i.id === 'images_missing_alt');
  if (altTextIssue) {
    $('img').each((i, img) => {
      if (!$(img).attr('alt')) {
        const src = $(img).attr('src') || '';
        const filename = src.split('/').pop()?.split('.')[0] || 'image';
        const alt = filename.replace(/[-_]/g, ' ');
        $(img).attr('alt', alt);
      }
    });
    fixesApplied.push('Added alt text to images');
  }
  
  // Fix 4: Add viewport meta tag
  const viewportIssue = issues.find(i => i.id === 'viewport_missing');
  if (viewportIssue) {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    fixesApplied.push('Added viewport meta tag');
  }
  
  // Fix 5: Add Open Graph tags
  if (!$('meta[property="og:title"]').length) {
    const title = $('title').text();
    $('head').append(`<meta property="og:title" content="${title}">`);
    fixesApplied.push('Added Open Graph tags');
  }
  
  // Fix 6: Add structured data (Schema.org)
  if (!$('script[type="application/ld+json"]').length) {
    const schema = generateBasicSchema($);
    $('head').append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
    fixesApplied.push('Added structured data (Schema.org)');
  }
  
  return {
    html: $.html(),
    fixesApplied,
  };
}

function extractSiteName($: cheerio.CheerioAPI): string {
  return $('h1').first().text() || $('title').text() || 'Website';
}

function generateBasicSchema($: cheerio.CheerioAPI) {
  const name = extractSiteName($);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: 'https://example.com', // Will be replaced with actual URL
  };
}
```

---

## UI Specifications

### 1. SEO Dashboard

```
┌────────────────────────────────────────────────────────────┐
│ SEO Tools                                   [Run Audit]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ SEO Score: 72/100 (Good)                               ││
│ │ ████████████████████░░░░░░░░░░                         ││
│ │                                                        ││
│ │ Last audit: 2 hours ago          [Auto-Fix Issues]    ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌─────────────────────────────────────────────┐          │
│ │ Technical SEO           18/30 ⚠️             │          │
│ │ ❌ Sitemap missing                           │          │
│ │ ❌ Robots.txt missing                        │          │
│ │ ✓ HTTPS enabled                              │          │
│ │ ✓ Valid HTML structure                       │          │
│ │                                              │          │
│ │ On-Page SEO             15/25 ⚠️             │          │
│ │ ❌ Meta description missing                  │          │
│ │ ⚠️  Title tag too short (35 chars)           │          │
│ │ ✓ H1 tag present                             │          │
│ │ ⚠️  3 images missing alt text                │          │
│ │                                              │          │
│ │ Content Quality         16/20 ✓              │          │
│ │ ✓ Word count: 450 words                     │          │
│ │ ⚠️  Readability: 58/100                      │          │
│ │ ✓ Heading structure good                     │          │
│ │                                              │          │
│ │ Mobile SEO              12/15 ✓              │          │
│ │ ✓ Viewport meta tag                          │          │
│ │ ⚠️  Some images not responsive               │          │
│ │                                              │          │
│ │ Performance             8/10 ✓               │          │
│ │ ✓ HTML size reasonable                       │          │
│ │ ⚠️  2 images not optimized                   │          │
│ └─────────────────────────────────────────────┘          │
│                                                            │
│ Recommendations:                                           │
│ 💡 Quick wins: 4 issues can be auto-fixed                │
│ 🔧 Add sitemap.xml and robots.txt                         │
│ 📝 Generate meta description with AI                      │
│                                                            │
│ [View Full Report] [Keyword Research] [Meta Tags]         │
└────────────────────────────────────────────────────────────┘
```

### 2. Auto-Fix Preview

```
┌────────────────────────────────────────────────────────────┐
│ Auto-Fix SEO Issues                                    [×] │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ The following fixes will be applied:                       │
│                                                            │
│ ✓ Generate meta description (AI-powered)                  │
│   "Professional business consulting services helping      │
│   small businesses grow through strategic planning..."    │
│                                                            │
│ ✓ Add sitemap.xml (10 pages)                              │
│   Auto-generated sitemap with all your pages              │
│                                                            │
│ ✓ Create robots.txt (allow all)                           │
│   Allows all search engines to crawl your site            │
│                                                            │
│ ✓ Add alt text to 3 images                                │
│   • hero-image.jpg → "Professional business team"         │
│   • service-1.jpg → "Consulting services"                 │
│   • testimonial.jpg → "Happy client testimonial"          │
│                                                            │
│ ✓ Fix title tag length (35 → 55 chars)                    │
│   "My Business | Professional Consulting Services"        │
│                                                            │
│ Expected score improvement: 72 → 89 (+17 points)          │
│                                                            │
│ [Cancel]                                [Apply Fixes]      │
└────────────────────────────────────────────────────────────┘
```

### 3. Keyword Research Tool

```
┌────────────────────────────────────────────────────────────┐
│ Keyword Research                                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Find keywords:                                             │
│ ┌────────────────────────────────────────────────────────┐│
│ │ business consulting                          [Search]  ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ Suggestions:                                               │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Keyword                           Volume  Competition  ││
│ │ ☐ business consultant near me     8.1K   Low         ││
│ │ ☐ small business advisor          5.2K   Medium      ││
│ │ ☐ startup consulting services     3.7K   Medium      ││
│ │ ☐ business coach                  2.1K   Low         ││
│ │ ☐ management consulting           14K    High        ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ [Add Selected]                    [Optimize Content]       │
└────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: SEO Audit Engine (6-8 hours)

1. **Audit Engine Core** (4 hours)
   - Implement 100+ checks
   - Category scoring
   - Issue detection
   - Recommendation generation

2. **Database & API** (2 hours)
   - Create tables (seo_audits, seo_keywords, seo_meta_tags)
   - tRPC router (seo.audit, seo.autoFix)
   - Save/load audit results

3. **Testing** (2 hours)
   - Unit tests for each check
   - Integration tests
   - Test with real websites

### Phase 2: Auto-Fix System (4-5 hours)

4. **Auto-Fix Engine** (3 hours)
   - Meta tag generation (AI)
   - Alt text generation
   - Sitemap generation
   - Robots.txt creation
   - Structured data

5. **Preview & Apply** (2 hours)
   - Show preview before applying
   - Apply fixes to HTML
   - Re-run audit
   - Track score improvement

### Phase 3: Keyword Tools (3-4 hours)

6. **Keyword Research** (2 hours)
   - Integrate keyword API (DataForSEO or similar)
   - Display suggestions
   - Save target keywords

7. **Content Optimization** (2 hours)
   - AI rewrites content with keywords
   - Keyword density check
   - LSI keywords

### Phase 4: UI & Polish (3-4 hours)

8. **SEO Dashboard** (2 hours)
   - Score display
   - Category breakdown
   - Issue list
   - Recommendations

9. **Meta Tag Editor** (2 hours)
   - Visual editor
   - Social media previews
   - Character counters

---

## Build Time Estimate

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Audit Engine + API | 6-8h |
| **Phase 2** | Auto-Fix System | 4-5h |
| **Phase 3** | Keyword Tools | 3-4h |
| **Phase 4** | UI + Polish | 3-4h |
| **Total** | | **16-20h** |

---

## Revenue Impact

### Competitive Differentiation:
- **No competitor has this level of SEO automation**
- Wix: Basic SEO tools ❌
- Squarespace: Manual SEO only ❌
- Webflow: SEO-friendly but no audit ❌
- **Thundercloud: Full SEO audit + auto-fix** ✅ **UNIQUE**

### Expected Results:
- Organic traffic: +200% within 30 days
- Google rankings: 50% of users rank page 1 for long-tail keywords
- Feature adoption: 75% of users run audit
- Premium upsell: 40% upgrade for advanced SEO tools

**ROI:** 16-20 hours → Justifies $79/mo premium tier

---

**Status:** Ready to build  
**Priority:** P0 - CRITICAL  
**Build after:** Custom Domains, Analytics

**Want me to build this next?** 🚀
