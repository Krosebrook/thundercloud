# Supabase Setup Guide - Thundercloud

## Step 1: Create Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** thundercloud
   - **Database Password:** (generate strong password - save this!)
   - **Region:** Choose closest to your users (e.g., US East, EU West)
   - **Pricing Plan:** Free tier (sufficient for MVP)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

## Step 2: Configure Auth Providers

Navigate to **Authentication > Providers**:

### Email Auth (Required for MVP)
1. **Email** - Already enabled by default
2. Enable **"Confirm email"** for production
3. For MVP, disable email confirmation (Settings > Auth > Email Auth > Require email confirmation = OFF)

### OAuth Providers (Optional - Phase 2)
1. **Google OAuth**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID & Secret to Supabase

2. **GitHub OAuth**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth app
   - Add callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID & Secret to Supabase

## Step 3: Run Database Schema

Navigate to **SQL Editor** and run this complete schema:

### 3.1 Enable Extensions

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostgreSQL pg_trgm for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### 3.2 Create Schema (All 21 Tables)

```sql
-- ============================================================================
-- USER PROFILES (Extends Supabase auth.users)
-- ============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Role & Subscription
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  
  -- Preferences
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WEBSITES (Core Entity)
-- ============================================================================

CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  slug TEXT NOT NULL,
  
  -- Content
  html_content TEXT NOT NULL,
  css_content TEXT,
  js_content TEXT,
  
  -- Metadata
  seo_score NUMERIC(5,2),
  quality_score NUMERIC(5,2),
  key_features JSONB,
  ai_generation_metadata JSONB,
  
  -- Deployment Status
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  preview_url TEXT,
  production_url TEXT,
  custom_domain TEXT,
  
  -- Timestamps
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_slug UNIQUE (user_id, slug)
);

-- ============================================================================
-- WEBSITE VERSIONS (History/Rollback)
-- ============================================================================

CREATE TABLE website_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  version_number INTEGER NOT NULL,
  
  -- Content Snapshot
  html_content TEXT NOT NULL,
  css_content TEXT,
  js_content TEXT,
  
  -- Metadata
  change_summary TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  
  created_by UUID REFERENCES auth.users(id),
  created_date TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_website_version UNIQUE (website_id, version_number)
);

-- ============================================================================
-- WEBSITE DEPLOYMENTS
-- ============================================================================

CREATE TABLE website_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  deployment_type TEXT NOT NULL CHECK (deployment_type IN ('preview', 'production')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'building', 'ready', 'failed')),
  
  deployment_url TEXT,
  provider TEXT DEFAULT 'vercel',
  
  -- Build Info
  build_logs TEXT,
  error_message TEXT,
  deployment_metadata JSONB,
  
  deployed_at TIMESTAMPTZ,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WEBSITE TEMPLATES
-- ============================================================================

CREATE TABLE website_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  -- Template Content
  html_template TEXT NOT NULL,
  css_template TEXT,
  js_template TEXT,
  
  -- Metadata
  thumbnail_url TEXT,
  tags TEXT[],
  
  -- Usage Tracking
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Owner
  created_by UUID REFERENCES auth.users(id),
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- A/B TESTS
-- ============================================================================

CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Configuration
  element_selector TEXT NOT NULL,
  test_type TEXT CHECK (test_type IN ('visual', 'content', 'layout')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  
  -- Scheduling
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Configuration
  traffic_allocation NUMERIC(5,2) DEFAULT 50.00,
  confidence_level NUMERIC(5,2) DEFAULT 95.00,
  
  -- Results
  winner_variant_id UUID,
  statistical_significance NUMERIC(5,2),
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  
  variant_name TEXT NOT NULL,
  is_control BOOLEAN DEFAULT FALSE,
  
  -- Content
  html_content TEXT NOT NULL,
  
  -- Metrics
  impressions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0.00,
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  
  -- Event Details
  event_type TEXT NOT NULL,
  event_data JSONB,
  
  -- Session Tracking
  session_id TEXT,
  visitor_id TEXT,
  
  -- User Tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Device/Browser
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  
  -- Location
  ip_address INET,
  country TEXT,
  city TEXT,
  
  -- Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE analytics_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  insight_type TEXT NOT NULL,
  insight_title TEXT NOT NULL,
  insight_description TEXT,
  
  -- AI-Generated
  confidence_score NUMERIC(5,2),
  supporting_data JSONB,
  recommendations JSONB,
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE behavior_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  visitor_id TEXT NOT NULL,
  
  -- Behavior
  page_url TEXT,
  action TEXT,
  element_selector TEXT,
  context_data JSONB,
  
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE behavior_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  visitor_id TEXT NOT NULL,
  pattern_type TEXT,
  pattern_data JSONB,
  
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE custom_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  visitor_id TEXT NOT NULL,
  attribute_key TEXT NOT NULL,
  attribute_value TEXT,
  attribute_type TEXT,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_visitor_attribute UNIQUE (website_id, visitor_id, attribute_key)
);

-- ============================================================================
-- SEO
-- ============================================================================

CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  seo_score NUMERIC(5,2) NOT NULL,
  audit_data JSONB NOT NULL,
  
  -- Issues
  critical_issues INTEGER DEFAULT 0,
  warnings INTEGER DEFAULT 0,
  recommendations INTEGER DEFAULT 0,
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comprehensive_seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  -- Detailed Audit
  technical_seo JSONB,
  content_quality JSONB,
  user_experience JSONB,
  mobile_optimization JSONB,
  performance_metrics JSONB,
  
  overall_score NUMERIC(5,2),
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PERSONALIZATION
-- ============================================================================

CREATE TABLE user_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  segment_name TEXT NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE personalization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  segment_id UUID REFERENCES user_segments(id) ON DELETE CASCADE,
  
  rule_name TEXT NOT NULL,
  element_selector TEXT NOT NULL,
  content_variations JSONB NOT NULL,
  
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE personalization_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  test_name TEXT NOT NULL,
  variants JSONB NOT NULL,
  status TEXT CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  
  winner_variant_id TEXT,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE discovered_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  segment_name TEXT NOT NULL,
  characteristics JSONB NOT NULL,
  
  estimated_size INTEGER,
  discovery_date TIMESTAMPTZ DEFAULT NOW(),
  confidence_score NUMERIC(5,2),
  
  is_promoted BOOLEAN DEFAULT FALSE,
  promoted_segment_id UUID REFERENCES user_segments(id),
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE segment_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id UUID NOT NULL REFERENCES user_segments(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  
  unique_visitors INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0.00,
  personalized_interactions INTEGER DEFAULT 0,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_segment_date UNIQUE (segment_id, date)
);

-- ============================================================================
-- CONTENT MANAGEMENT
-- ============================================================================

CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  
  block_name TEXT NOT NULL,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL,
  
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- E-COMMERCE
-- ============================================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  sku TEXT,
  inventory_quantity INTEGER DEFAULT 0,
  
  images JSONB,
  metadata JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) DEFAULT 0.00,
  shipping NUMERIC(10,2) DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Payment
  stripe_payment_intent_id TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT DEFAULT 'unfulfilled',
  
  created_date TIMESTAMPTZ DEFAULT NOW(),
  updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  
  created_date TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Create Indexes for Performance

```sql
-- Websites
CREATE INDEX idx_websites_user_id ON websites(user_id);
CREATE INDEX idx_websites_slug ON websites(user_id, slug);
CREATE INDEX idx_websites_published ON websites(is_published);
CREATE INDEX idx_websites_created_date ON websites(created_date DESC);

-- Analytics Events
CREATE INDEX idx_analytics_events_website_id ON analytics_events(website_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);

-- Deployments
CREATE INDEX idx_deployments_website_id ON website_deployments(website_id);
CREATE INDEX idx_deployments_status ON website_deployments(status);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_created_date ON orders(created_date DESC);
```

### 3.4 Create Triggers

```sql
-- Auto-update updated_date trigger
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_date
CREATE TRIGGER websites_updated_date
  BEFORE UPDATE ON websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_date();

CREATE TRIGGER user_profiles_updated_date
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_date();

CREATE TRIGGER website_templates_updated_date
  BEFORE UPDATE ON website_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_date();

-- Auto-increment version_number trigger
CREATE OR REPLACE FUNCTION auto_increment_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.version_number IS NULL THEN
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO NEW.version_number
    FROM website_versions
    WHERE website_id = NEW.website_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER website_versions_auto_increment
  BEFORE INSERT ON website_versions
  FOR EACH ROW
  EXECUTE FUNCTION auto_increment_version();
```

### 3.5 Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprehensive_seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalization_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovered_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

### 3.6 Create RLS Policies

```sql
-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Websites: Users can CRUD their own websites
CREATE POLICY "Users can view own websites"
  ON websites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own websites"
  ON websites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites"
  ON websites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites"
  ON websites FOR DELETE
  USING (auth.uid() = user_id);

-- Website Versions: Access via website ownership
CREATE POLICY "Users can view versions of owned websites"
  ON website_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_versions.website_id 
      AND websites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert versions for owned websites"
  ON website_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_versions.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Website Deployments: Similar to versions
CREATE POLICY "Users can manage deployments of owned websites"
  ON website_deployments
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = website_deployments.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Templates: Public read, owner write
CREATE POLICY "Anyone can view public templates"
  ON website_templates FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can manage own templates"
  ON website_templates
  USING (auth.uid() = created_by);

-- A/B Tests: Via website ownership
CREATE POLICY "Users can manage AB tests of owned websites"
  ON ab_tests
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = ab_tests.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- AB Test Variants: Via test ownership
CREATE POLICY "Users can manage variants of owned tests"
  ON ab_test_variants
  USING (
    EXISTS (
      SELECT 1 FROM ab_tests 
      JOIN websites ON websites.id = ab_tests.website_id
      WHERE ab_tests.id = ab_test_variants.ab_test_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Analytics: Read-only for website owners
CREATE POLICY "Users can view analytics of owned websites"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM websites 
      WHERE websites.id = analytics_events.website_id 
      AND websites.user_id = auth.uid()
    )
  );

-- Products: Users can CRUD own products
CREATE POLICY "Users can manage own products"
  ON products
  USING (auth.uid() = user_id);

-- Orders: Users can view own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Order Items: Via order ownership
CREATE POLICY "Users can view items of owned orders"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Service Role Bypass (for backend operations)
CREATE POLICY "Service role can bypass RLS"
  ON websites
  USING (auth.jwt()->>'role' = 'service_role');
```

## Step 4: Get API Keys

Navigate to **Settings > API**:

1. Copy **Project URL** (format: `https://<project-ref>.supabase.co`)
2. Copy **anon public** key
3. Copy **service_role secret** key (keep this SECRET!)

Save these in your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 5: Verify Setup

Run this query in SQL Editor to verify:

```sql
-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return 21 tables:
-- ab_test_variants
-- ab_tests
-- analytics_events
-- analytics_insights
-- behavior_events
-- behavior_patterns
-- comprehensive_seo_audits
-- content_blocks
-- custom_attributes
-- discovered_segments
-- order_items
-- orders
-- personalization_rules
-- personalization_tests
-- products
-- segment_analytics
-- seo_audits
-- user_profiles
-- user_segments
-- website_deployments
-- website_templates
-- website_versions
-- websites
```

## Step 6: Test Auth

Navigate to **Authentication > Users**:

1. Click **"Add user"** (manual)
2. Email: `test@example.com`
3. Password: `TestPassword123!`
4. Auto confirm: YES
5. Click **"Create user"**

This creates your first test user. You'll use this to test the MVP.

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran all SQL scripts in order
- Check SQL Editor > History for failed queries

### Error: "permission denied for table"
- RLS policies may be blocking access
- For testing, temporarily disable RLS: `ALTER TABLE websites DISABLE ROW LEVEL SECURITY;`
- Re-enable after testing

### Error: "duplicate key value violates unique constraint"
- Check for existing data in tables
- Drop and recreate tables if needed

## Next Steps

✅ Supabase project created
✅ Database schema deployed
✅ RLS policies enabled
✅ Auth configured
✅ API keys saved

→ Continue to `MVP_IMPLEMENTATION.md` to build the Next.js app
