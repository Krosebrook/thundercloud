-- Create seo_audits table
CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  technical_seo_score INTEGER,
  onpage_seo_score INTEGER,
  content_quality_score INTEGER,
  mobile_seo_score INTEGER,
  performance_score INTEGER,
  issues JSONB,
  recommendations JSONB,
  audit_duration_ms INTEGER,
  checks_performed INTEGER,
  checks_passed INTEGER,
  checks_failed INTEGER,
  checks_warned INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_website_audits ON seo_audits(website_id, created_at DESC);
CREATE INDEX idx_user_audits ON seo_audits(user_id, created_at DESC);

-- Create seo_keywords table
CREATE TABLE seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  competition TEXT,
  difficulty INTEGER,
  target_url TEXT,
  current_rank INTEGER,
  is_primary BOOLEAN DEFAULT false,
  added_at TIMESTAMP DEFAULT NOW(),
  last_checked_at TIMESTAMP,
  UNIQUE(website_id, keyword)
);
CREATE INDEX idx_website_keywords ON seo_keywords(website_id);

-- Create seo_meta_tags table
CREATE TABLE seo_meta_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  og_url TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  schema_org JSONB,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(website_id)
);

-- RLS Policies
ALTER TABLE seo_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own audits" ON seo_audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audits" ON seo_audits FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE seo_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own keywords" ON seo_keywords FOR ALL USING (auth.uid() = user_id);

ALTER TABLE seo_meta_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own meta tags" ON seo_meta_tags FOR ALL USING (auth.uid() = user_id);