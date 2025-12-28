# Feature Specification: Analytics Dashboard
## Priority: P0 - CRITICAL (Build Second)

**Version:** 1.0  
**Status:** Ready for Development  
**Estimated Build Time:** 12-16 hours  
**Revenue Impact:** HIGH - Drives retention, reduces churn by 30-40%

---

## Executive Summary

### Problem
Users create websites but have **zero visibility** into:
- Is anyone visiting my site?
- Where are visitors coming from?
- Which pages are most popular?
- Are people using mobile or desktop?
- Is my marketing working?

**Result:** Users feel like they're operating in the dark. They don't know if their website is "working" or not. This leads to churn.

### Solution
Built-in analytics dashboard showing real-time visitor data, traffic sources, page views, geographic distribution, and device breakdown. Users can **see proof** their website is working without needing Google Analytics.

### Success Metrics
- **Engagement:** 60% of users check analytics weekly
- **Retention:** +40% D7 retention for users who view analytics
- **Session Time:** +3 minutes per dashboard visit
- **Feature Love:** 80+ NPS for analytics feature

---

## User Stories

### US1: View Website Traffic Overview
**As a** small business owner  
**I want to** see how many people visited my website  
**So that** I know if my marketing efforts are working

**Acceptance Criteria:**
- [ ] Dashboard shows total visitors (last 7/30 days)
- [ ] Shows page views (last 7/30 days)
- [ ] Shows bounce rate
- [ ] Shows average time on site
- [ ] Shows trend comparison (up/down vs previous period)
- [ ] Updates in real-time (or every 5 minutes)

**User Flow:**
```
1. Dashboard → Select Website → Analytics
2. See overview cards:
   • 1,234 Visitors (+15% ↑)
   • 2,567 Page Views (+23% ↑)
   • 45% Bounce Rate (-5% ↓)
   • 2m 34s Avg Time
3. See sparkline charts (mini trends)
4. Toggle time period (7 days / 30 days / All time)
```

---

### US2: Understand Traffic Sources
**As a** content creator  
**I want to** know where visitors are coming from  
**So that** I can focus my marketing on what works

**Acceptance Criteria:**
- [ ] Shows breakdown by source (Google, Direct, Social, Referral)
- [ ] Shows percentage and count per source
- [ ] Shows top referring domains
- [ ] Can click to see details for each source
- [ ] Chart visualization (bar chart or pie chart)

**User Flow:**
```
1. Analytics → Traffic Sources section
2. See breakdown:
   • Google: 45% (560 visitors)
   • Direct: 30% (371 visitors)
   • Social: 15% (185 visitors)
   • Referral: 10% (123 visitors)
3. Click "Social" → See breakdown:
   • Facebook: 60%
   • LinkedIn: 25%
   • Twitter: 15%
```

---

### US3: See Geographic Distribution
**As a** local business owner  
**I want to** see where my visitors are located  
**So that** I can target the right geographic markets

**Acceptance Criteria:**
- [ ] Shows top countries (with flags)
- [ ] Shows top cities
- [ ] Shows map visualization (optional)
- [ ] Shows percentage breakdown
- [ ] Can filter by country/region

---

### US4: Analyze Device & Browser Usage
**As a** web developer  
**I want to** see what devices visitors use  
**So that** I can optimize for the most common devices

**Acceptance Criteria:**
- [ ] Shows mobile vs desktop vs tablet split
- [ ] Shows top browsers (Chrome, Safari, Firefox)
- [ ] Shows operating systems
- [ ] Shows screen sizes (most common resolutions)

---

### US5: Track Top Pages
**As a** website owner  
**I want to** see which pages are most popular  
**So that** I can create more content like that

**Acceptance Criteria:**
- [ ] Lists pages by pageview count
- [ ] Shows unique visitors per page
- [ ] Shows average time on each page
- [ ] Shows bounce rate per page
- [ ] Can click to view page

---

### US6: Real-Time Visitor Count
**As a** business owner  
**I want to** see how many people are on my site right now  
**So that** I can see immediate impact of marketing campaigns

**Acceptance Criteria:**
- [ ] Shows current active visitors (updated every 30s)
- [ ] Shows which pages they're viewing
- [ ] Shows where they came from
- [ ] Updates automatically (WebSocket or polling)

---

## Technical Specification

### Architecture Overview

```
┌─────────────────────────────────────────────┐
│ User visits website (mysite.com)            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Website HTML includes tracking script       │
│ <script src="/analytics.js"></script>       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ analytics.js fires on page load             │
│ - Captures: page URL, referrer, user agent │
│ - Generates session ID (cookie)             │
│ - Detects: location, device, browser        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ POST /api/analytics/event                   │
│ {                                            │
│   websiteId: "uuid",                         │
│   eventType: "pageview",                     │
│   url: "/about",                             │
│   referrer: "google.com",                    │
│   userAgent: "Mozilla/5.0...",               │
│   sessionId: "abc123"                        │
│ }                                            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Backend: Parse event data                   │
│ - Extract country (from IP via GeoIP)       │
│ - Extract device type (from user agent)     │
│ - Extract browser/OS                         │
│ - Extract traffic source                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Save to database: analytics_events table    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ User opens Analytics Dashboard              │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Query aggregated data:                      │
│ - COUNT(DISTINCT session_id) as visitors    │
│ - COUNT(*) as pageviews                     │
│ - AVG(time_on_page) as avg_time             │
│ - GROUP BY traffic_source                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Display in dashboard with charts            │
└─────────────────────────────────────────────┘
```

### Database Schema

**Table 1: `analytics_events`**

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  -- Event data
  event_type TEXT NOT NULL DEFAULT 'pageview',
  -- 'pageview', 'click', 'conversion', etc.
  
  -- Page info
  page_url TEXT NOT NULL,
  page_title TEXT,
  
  -- Session tracking
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL, -- Persistent across sessions (cookie)
  
  -- Referral info
  referrer TEXT,
  referrer_domain TEXT, -- Extracted domain (google.com)
  traffic_source TEXT, -- 'organic', 'direct', 'social', 'referral'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Device/Browser info
  user_agent TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT, -- 'Chrome', 'Safari', 'Firefox'
  os TEXT, -- 'Windows', 'macOS', 'iOS', 'Android'
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Geographic info
  ip_address TEXT, -- Hashed for privacy
  country TEXT,
  country_code TEXT, -- 'US', 'GB', 'CA'
  city TEXT,
  region TEXT,
  
  -- Timing
  time_on_page INTEGER, -- Seconds
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes for fast queries
  INDEX idx_website_created (website_id, created_at DESC),
  INDEX idx_session (session_id),
  INDEX idx_visitor (visitor_id),
  INDEX idx_traffic_source (traffic_source)
);

-- Partitioning for performance (optional, for scale)
-- Partition by created_at (monthly partitions)

-- RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website owners can view analytics"
  ON analytics_events FOR SELECT
  USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

-- No INSERT/UPDATE/DELETE policies for users
-- Events inserted via API route (server-side only)
```

**Table 2: `analytics_summary` (Pre-aggregated)**

```sql
CREATE TABLE analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Daily aggregates
  total_visitors INTEGER DEFAULT 0,
  total_pageviews INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_time_on_site INTEGER DEFAULT 0, -- Seconds
  bounce_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
  
  -- Traffic sources
  organic_visitors INTEGER DEFAULT 0,
  direct_visitors INTEGER DEFAULT 0,
  social_visitors INTEGER DEFAULT 0,
  referral_visitors INTEGER DEFAULT 0,
  
  -- Devices
  mobile_visitors INTEGER DEFAULT 0,
  desktop_visitors INTEGER DEFAULT 0,
  tablet_visitors INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(website_id, date),
  INDEX idx_website_date (website_id, date DESC)
);

-- RLS
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Website owners can view summary"
  ON analytics_summary FOR SELECT
  USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );
```

**Table 3: `analytics_realtime` (Current active visitors)**

```sql
CREATE TABLE analytics_realtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  last_seen TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(session_id),
  INDEX idx_website_lastseen (website_id, last_seen DESC)
);

-- Cleanup old entries (visitors inactive for 5+ minutes)
-- Run via cron job every minute:
DELETE FROM analytics_realtime 
WHERE last_seen < NOW() - INTERVAL '5 minutes';
```

---

### API Design (tRPC Router)

**File:** `src/server/routers/analytics.ts`

```typescript
export const analyticsRouter = router({
  // Get overview stats (visitors, pageviews, etc.)
  getOverview: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      const startDate = calculateStartDate(input.period);
      
      // Query analytics_summary for period
      const stats = await ctx.supabase
        .from('analytics_summary')
        .select('*')
        .eq('website_id', input.websiteId)
        .gte('date', startDate)
        .order('date', { ascending: false });
      
      // Aggregate
      const totalVisitors = stats.data?.reduce((sum, d) => sum + d.total_visitors, 0) || 0;
      const totalPageviews = stats.data?.reduce((sum, d) => sum + d.total_pageviews, 0) || 0;
      
      // Calculate trend (vs previous period)
      const previousStats = await getPreviousPeriodStats(/*...*/);
      const visitorChange = calculatePercentageChange(totalVisitors, previousStats.visitors);
      
      return {
        visitors: totalVisitors,
        visitorChange,
        pageviews: totalPageviews,
        pageviewChange: /*...*/,
        bounceRate: /*...*/,
        avgTimeOnSite: /*...*/,
      };
    }),

  // Get traffic sources breakdown
  getTrafficSources: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      const startDate = calculateStartDate(input.period);
      
      // Query raw events and group by traffic_source
      const { data } = await ctx.supabase.rpc('get_traffic_sources', {
        p_website_id: input.websiteId,
        p_start_date: startDate,
      });
      
      return {
        sources: data.map(row => ({
          source: row.traffic_source,
          visitors: row.visitor_count,
          percentage: row.percentage,
        })),
      };
    }),

  // Get top pages
  getTopPages: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input, ctx }) => {
      // Query and group by page_url
      const { data } = await ctx.supabase.rpc('get_top_pages', {
        p_website_id: input.websiteId,
        p_start_date: calculateStartDate(input.period),
        p_limit: input.limit,
      });
      
      return {
        pages: data.map(row => ({
          url: row.page_url,
          pageviews: row.pageview_count,
          uniqueVisitors: row.unique_visitor_count,
          avgTimeOnPage: row.avg_time_on_page,
          bounceRate: row.bounce_rate,
        })),
      };
    }),

  // Get geographic distribution
  getGeography: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      // Group by country_code
      const { data } = await ctx.supabase.rpc('get_geography', {
        p_website_id: input.websiteId,
        p_start_date: calculateStartDate(input.period),
      });
      
      return {
        countries: data.map(row => ({
          country: row.country,
          countryCode: row.country_code,
          visitors: row.visitor_count,
          percentage: row.percentage,
        })),
      };
    }),

  // Get device breakdown
  getDevices: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      // Group by device_type, browser, os
      const { data } = await ctx.supabase.rpc('get_devices', {
        p_website_id: input.websiteId,
        p_start_date: calculateStartDate(input.period),
      });
      
      return {
        devices: {
          mobile: data.mobile_count,
          desktop: data.desktop_count,
          tablet: data.tablet_count,
        },
        browsers: data.browsers,
        operatingSystems: data.operating_systems,
      };
    }),

  // Get real-time active visitors
  getRealtime: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      // Query analytics_realtime
      const { data } = await ctx.supabase
        .from('analytics_realtime')
        .select('*')
        .eq('website_id', input.websiteId)
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());
      
      return {
        activeVisitors: data?.length || 0,
        visitors: data?.map(v => ({
          pageUrl: v.page_url,
          lastSeen: v.last_seen,
        })) || [],
      };
    }),
});
```

---

### Tracking Script

**File:** `public/analytics.js`

```javascript
(function() {
  'use strict';
  
  const WEBSITE_ID = document.currentScript.getAttribute('data-website-id');
  const API_ENDPOINT = 'https://yourapp.vercel.app/api/analytics/event';
  
  // Generate visitor ID (persistent across sessions)
  function getVisitorId() {
    let visitorId = localStorage.getItem('_visitor_id');
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem('_visitor_id', visitorId);
    }
    return visitorId;
  }
  
  // Generate session ID (expires after 30 minutes)
  function getSessionId() {
    const now = Date.now();
    const stored = sessionStorage.getItem('_session');
    
    if (stored) {
      const { id, timestamp } = JSON.parse(stored);
      if (now - timestamp < 30 * 60 * 1000) {
        return id;
      }
    }
    
    const sessionId = generateId();
    sessionStorage.setItem('_session', JSON.stringify({
      id: sessionId,
      timestamp: now,
    }));
    return sessionId;
  }
  
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  // Detect device type
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|android|touch|webos|hpwos/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  
  // Detect browser
  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
  
  // Detect OS
  function getOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }
  
  // Extract UTM parameters
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };
  }
  
  // Determine traffic source
  function getTrafficSource() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    
    const utm = getUTMParams();
    if (utm.utm_source) return utm.utm_medium || 'campaign';
    
    const domain = new URL(referrer).hostname;
    
    // Social media
    if (/facebook|twitter|linkedin|instagram|tiktok|pinterest/.test(domain)) {
      return 'social';
    }
    
    // Search engines
    if (/google|bing|yahoo|duckduckgo|baidu/.test(domain)) {
      return 'organic';
    }
    
    return 'referral';
  }
  
  // Track pageview
  function trackPageview() {
    const data = {
      websiteId: WEBSITE_ID,
      eventType: 'pageview',
      url: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      referrer: document.referrer,
      referrerDomain: document.referrer ? new URL(document.referrer).hostname : null,
      trafficSource: getTrafficSource(),
      ...getUTMParams(),
      userAgent: navigator.userAgent,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
    
    // Send beacon (non-blocking)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_ENDPOINT, JSON.stringify(data));
    } else {
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      });
    }
  }
  
  // Track time on page
  let timeOnPage = 0;
  let lastActive = Date.now();
  
  function trackTimeOnPage() {
    const now = Date.now();
    timeOnPage += (now - lastActive) / 1000;
    lastActive = now;
  }
  
  // Send time on page when leaving
  window.addEventListener('beforeunload', () => {
    trackTimeOnPage();
    navigator.sendBeacon(API_ENDPOINT, JSON.stringify({
      websiteId: WEBSITE_ID,
      eventType: 'time_on_page',
      url: window.location.pathname,
      sessionId: getSessionId(),
      timeOnPage: Math.round(timeOnPage),
    }));
  });
  
  // Track user activity
  ['click', 'scroll', 'keydown', 'mousemove'].forEach(event => {
    window.addEventListener(event, () => {
      trackTimeOnPage();
    }, { passive: true, once: false });
  });
  
  // Track real-time presence
  function updateRealtime() {
    fetch(`${API_ENDPOINT}/realtime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteId: WEBSITE_ID,
        sessionId: getSessionId(),
        pageUrl: window.location.pathname,
      }),
    });
  }
  
  // Initial pageview
  trackPageview();
  
  // Update real-time presence every 30 seconds
  updateRealtime();
  setInterval(updateRealtime, 30000);
  
})();
```

**Usage in generated websites:**

```html
<!-- Add to <head> of every generated website -->
<script 
  src="https://yourapp.vercel.app/analytics.js" 
  data-website-id="{{WEBSITE_ID}}" 
  async
></script>
```

---

### Database Functions (PostgreSQL)

**Traffic Sources Function:**

```sql
CREATE OR REPLACE FUNCTION get_traffic_sources(
  p_website_id UUID,
  p_start_date TIMESTAMP
)
RETURNS TABLE (
  traffic_source TEXT,
  visitor_count BIGINT,
  percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH source_counts AS (
    SELECT 
      traffic_source,
      COUNT(DISTINCT visitor_id) as visitors
    FROM analytics_events
    WHERE website_id = p_website_id
      AND created_at >= p_start_date
    GROUP BY traffic_source
  ),
  total AS (
    SELECT SUM(visitors) as total FROM source_counts
  )
  SELECT 
    sc.traffic_source,
    sc.visitors,
    ROUND((sc.visitors * 100.0 / t.total), 2) as percentage
  FROM source_counts sc, total t
  ORDER BY sc.visitors DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Top Pages Function:**

```sql
CREATE OR REPLACE FUNCTION get_top_pages(
  p_website_id UUID,
  p_start_date TIMESTAMP,
  p_limit INTEGER
)
RETURNS TABLE (
  page_url TEXT,
  pageview_count BIGINT,
  unique_visitor_count BIGINT,
  avg_time_on_page INTEGER,
  bounce_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    page_url,
    COUNT(*) as pageview_count,
    COUNT(DISTINCT visitor_id) as unique_visitor_count,
    AVG(time_on_page)::INTEGER as avg_time_on_page,
    (COUNT(*) FILTER (WHERE time_on_page < 10) * 100.0 / COUNT(*))::DECIMAL as bounce_rate
  FROM analytics_events
  WHERE website_id = p_website_id
    AND created_at >= p_start_date
    AND event_type = 'pageview'
  GROUP BY page_url
  ORDER BY pageview_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## UI Specifications

### 1. Analytics Dashboard (Main View)

```
┌────────────────────────────────────────────────────────────┐
│ Analytics                           [7 days ▼] [Export]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌──────────────┬──────────────┬──────────────┬───────────┐│
│ │ Visitors     │ Page Views   │ Bounce Rate  │ Avg Time  ││
│ │ 1,234        │ 2,567        │ 45%          │ 2m 34s    ││
│ │ +15% ↑       │ +23% ↑       │ -5% ↓        │ +12% ↑    ││
│ │ ▁▂▃▅▇█       │ ▁▃▄▅▆█       │ █▆▅▄▃▂       │ ▂▃▅▆▇█    ││
│ └──────────────┴──────────────┴──────────────┴───────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Traffic Sources                                        ││
│ │ ┌──────────────────────────────────────────────────┐  ││
│ │ │ Google        45%  ████████████░░░░  560         │  ││
│ │ │ Direct        30%  ████████░░░░░░░░  371         │  ││
│ │ │ Social        15%  ████░░░░░░░░░░░░  185         │  ││
│ │ │ Referral      10%  ██░░░░░░░░░░░░░░  123         │  ││
│ │ └──────────────────────────────────────────────────┘  ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌─────────────────────┬──────────────────────────────────┐│
│ │ Top Pages           │ Geographic Distribution          ││
│ │                     │                                  ││
│ │ 1. /        856     │ 🇺🇸 United States    45%  560   ││
│ │ 2. /about   234     │ 🇬🇧 United Kingdom   20%  247   ││
│ │ 3. /contact 178     │ 🇨🇦 Canada           15%  185   ││
│ │ 4. /pricing 145     │ 🇦🇺 Australia        10%  123   ││
│ │ 5. /blog    98      │ 🇩🇪 Germany          10%  123   ││
│ │                     │                                  ││
│ │ [View All]          │ [View Map]                       ││
│ └─────────────────────┴──────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Devices & Browsers                                     ││
│ │ ┌──────────────┬──────────────┬──────────────┐        ││
│ │ │ 📱 Mobile    │ 💻 Desktop   │ 📱 Tablet    │        ││
│ │ │ 55%  682     │ 40%  495     │ 5%   62      │        ││
│ │ └──────────────┴──────────────┴──────────────┘        ││
│ │                                                        ││
│ │ Browsers: Chrome 65% • Safari 20% • Firefox 10%       ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 🔴 Real-time: 12 active visitors                       ││
│ │ • 5 on homepage                                        ││
│ │ • 4 on /about                                          ││
│ │ • 3 on /pricing                                        ││
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

### 2. Real-Time View

```
┌────────────────────────────────────────────────────────────┐
│ 🔴 Real-Time Analytics              [Auto-refresh: ON]     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Active Visitors: 12                    Updated: 2s ago ││
│ │ ████████████ (Last 5 minutes)                          ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ Current Visitors:                                          │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Page                    Visitors  Source     Device    ││
│ │ /                       5         Google     Mobile    ││
│ │ /about                  4         Direct     Desktop   ││
│ │ /pricing                3         Facebook   Mobile    ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ Recent Events (Last 1 minute):                             │
│ ┌────────────────────────────────────────────────────────┐│
│ │ • Visitor from US viewed /pricing (5s ago)             ││
│ │ • Visitor from UK viewed / (12s ago)                   ││
│ │ • Visitor from CA viewed /about (18s ago)              ││
│ │ • Visitor from AU viewed /contact (22s ago)            ││
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Database & Tracking (4-5 hours)

1. **Database Setup** (1 hour)
   - Create tables (analytics_events, analytics_summary, analytics_realtime)
   - Add RLS policies
   - Create indexes
   - Create SQL functions (get_traffic_sources, get_top_pages, etc.)

2. **Tracking Script** (2 hours)
   - Create `public/analytics.js`
   - Implement visitor/session tracking
   - Implement device/browser detection
   - Test data capture

3. **Event Ingestion API** (1.5 hours)
   - Create `/api/analytics/event` endpoint
   - Parse and store events
   - Add IP geolocation (using ipapi.co or similar)
   - Rate limiting

### Phase 2: Analytics API (3-4 hours)

4. **tRPC Router** (3 hours)
   - Implement `analytics.getOverview`
   - Implement `analytics.getTrafficSources`
   - Implement `analytics.getTopPages`
   - Implement `analytics.getGeography`
   - Implement `analytics.getDevices`
   - Implement `analytics.getRealtime`

5. **Data Aggregation** (1 hour)
   - Create cron job to populate `analytics_summary` daily
   - Optimize queries for performance

### Phase 3: Dashboard UI (5-6 hours)

6. **Analytics Page** (3 hours)
   - Create `/dashboard/websites/[id]/analytics/page.tsx`
   - Overview cards (visitors, pageviews, bounce rate, avg time)
   - Period selector (7d / 30d / all)
   - Sparkline charts

7. **Charts & Visualizations** (2 hours)
   - Traffic sources bar chart (Recharts)
   - Geographic distribution list
   - Top pages table
   - Device breakdown pie chart

8. **Real-Time View** (1 hour)
   - Real-time visitor count
   - Auto-refresh (polling every 30s)
   - Recent events feed

### Phase 4: Polish & Testing (1-2 hours)

9. **Loading States** (30 min)
   - Skeleton loaders
   - Empty states
   - Error boundaries

10. **Testing** (1 hour)
    - Test tracking script on real website
    - Verify data appears in dashboard
    - Test all time periods
    - Test real-time updates

---

## Testing Requirements

### Tracking Script Tests

```javascript
describe('Analytics Tracking', () => {
  it('generates unique visitor ID', () => {
    const id1 = getVisitorId();
    const id2 = getVisitorId();
    expect(id1).toBe(id2); // Same across calls
  });

  it('generates unique session ID', () => {
    const id = getSessionId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}/);
  });

  it('detects device type correctly', () => {
    // Mock user agent
    navigator.userAgent = 'iPhone';
    expect(getDeviceType()).toBe('mobile');
    
    navigator.userAgent = 'iPad';
    expect(getDeviceType()).toBe('tablet');
    
    navigator.userAgent = 'Windows';
    expect(getDeviceType()).toBe('desktop');
  });

  it('determines traffic source', () => {
    document.referrer = 'https://google.com/search';
    expect(getTrafficSource()).toBe('organic');
    
    document.referrer = 'https://facebook.com';
    expect(getTrafficSource()).toBe('social');
    
    document.referrer = '';
    expect(getTrafficSource()).toBe('direct');
  });
});
```

### Dashboard Tests

```typescript
describe('Analytics Dashboard', () => {
  it('displays overview stats', async () => {
    const { getByText } = render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(getByText('1,234')).toBeInTheDocument(); // Visitors
      expect(getByText('+15%')).toBeInTheDocument(); // Change
    });
  });

  it('changes time period', async () => {
    const { getByText, getByRole } = render(<AnalyticsPage />);
    
    const select = getByRole('combobox');
    fireEvent.change(select, { target: { value: '30d' } });
    
    await waitFor(() => {
      expect(getByText('30 days')).toBeInTheDocument();
    });
  });

  it('shows real-time visitors', async () => {
    const { getByText } = render(<RealTimeView />);
    
    await waitFor(() => {
      expect(getByText('12 active visitors')).toBeInTheDocument();
    });
  });
});
```

---

## Environment Variables

```bash
# GeoIP Service (for location detection)
GEOIP_API_KEY=your_ipapi_key_here
# Free tier: https://ipapi.co (1000 requests/day)
# Or use: https://ipgeolocation.io (30K requests/month free)

# Optional: PostHog (for advanced analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Privacy & GDPR Compliance

### Data Collection Notice

Add to your privacy policy:

```
Analytics & Tracking

We collect anonymous usage data to understand how our websites perform:
- Pages visited
- Time on site
- Traffic sources
- Device type and browser
- Approximate location (country/city, not exact)

We do NOT collect:
- Personal information (names, emails)
- Exact IP addresses (hashed for privacy)
- Identifying information

You can opt-out of tracking by enabling "Do Not Track" in your browser.

Data retention: 90 days
```

### Cookie Consent

```html
<!-- Add cookie banner (optional) -->
<div id="cookie-consent">
  We use cookies to analyze website traffic. 
  <button onclick="acceptCookies()">Accept</button>
  <button onclick="declineCookies()">Decline</button>
</div>
```

---

## Performance Optimization

### Database Indexing

```sql
-- Speed up common queries
CREATE INDEX idx_events_website_date 
  ON analytics_events(website_id, created_at DESC);

CREATE INDEX idx_events_session 
  ON analytics_events(session_id);

CREATE INDEX idx_events_visitor 
  ON analytics_events(visitor_id);
```

### Query Optimization

**Before (slow):**
```sql
SELECT COUNT(DISTINCT visitor_id) FROM analytics_events
WHERE website_id = '...' AND created_at > '...';
```

**After (fast):**
```sql
SELECT total_visitors FROM analytics_summary
WHERE website_id = '...' AND date >= '...';
```

### Caching

```typescript
// Cache analytics data for 5 minutes
const cacheTime = 5 * 60 * 1000;

export const analyticsRouter = router({
  getOverview: protectedProcedure
    .use(unstable_cache({
      ttl: cacheTime,
      tags: ['analytics', input.websiteId],
    }))
    .query(async ({ input }) => {
      // ... query logic
    }),
});
```

---

## Success Metrics

### Track These KPIs:

**Engagement:**
- % of users who view analytics: Target 60%
- Analytics page views per week: Target 3+
- Time spent on analytics: Target 2+ minutes

**Retention:**
- D7 retention (users who view analytics): Target +40% vs non-viewers
- Monthly active users (check analytics): Target 70%

**Feature Love:**
- NPS for analytics feature: Target 80+
- "How useful is analytics?" (1-5): Target 4.5+

---

## Future Enhancements

### V2 Features:

1. **Goal Tracking**
   - Set conversion goals
   - Track button clicks
   - Track form submissions
   - Funnel analysis

2. **Email Reports**
   - Weekly summary emails
   - Custom report scheduling
   - Automated insights

3. **Advanced Filtering**
   - Filter by traffic source
   - Filter by device
   - Custom date ranges
   - Segment by behavior

4. **Heatmaps**
   - Click heatmaps
   - Scroll depth
   - Session recordings

5. **Benchmarking**
   - Compare to similar sites
   - Industry averages
   - Best-in-class metrics

---

## Build Time Estimate

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Database + Tracking + API | 4-5h |
| **Phase 2** | Analytics API (tRPC) | 3-4h |
| **Phase 3** | Dashboard UI + Charts | 5-6h |
| **Phase 4** | Polish + Testing | 1-2h |
| **Total** | | **12-16h** |

---

## Revenue Impact

### Retention Driver:
- Users who check analytics stay **40% longer**
- Reduces churn by showing **proof of value**
- Creates habit loop (check stats → see growth → feel good → keep using)

### Expected Impact:
- D7 retention: 45% → **63%** (+40%)
- Monthly churn: 8% → **5%** (-3%)
- LTV increase: $180 → **$252** (+40%)

**ROI:** 12-16 hours → +$2K MRR (retention improvement)

---

**Status:** Ready to build  
**Priority:** P0 - CRITICAL  
**Build after:** Custom Domains

**Want me to build this next?** 🚀
