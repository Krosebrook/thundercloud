-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'pageview',
  page_url TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  referrer TEXT,
  referrer_domain TEXT,
  traffic_source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  city TEXT,
  region TEXT,
  time_on_page INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_website_created ON analytics_events(website_id, created_at DESC);
CREATE INDEX idx_session ON analytics_events(session_id);
CREATE INDEX idx_visitor ON analytics_events(visitor_id);
CREATE INDEX idx_traffic_source ON analytics_events(traffic_source);

-- Create analytics_summary table
CREATE TABLE analytics_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_visitors INTEGER DEFAULT 0,
  total_pageviews INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_time_on_site INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  organic_visitors INTEGER DEFAULT 0,
  direct_visitors INTEGER DEFAULT 0,
  social_visitors INTEGER DEFAULT 0,
  referral_visitors INTEGER DEFAULT 0,
  mobile_visitors INTEGER DEFAULT 0,
  desktop_visitors INTEGER DEFAULT 0,
  tablet_visitors INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(website_id, date)
);
CREATE INDEX idx_website_date ON analytics_summary(website_id, date DESC);

-- Create analytics_realtime table
CREATE TABLE analytics_realtime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  last_seen TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id)
);
CREATE INDEX idx_website_lastseen ON analytics_realtime(website_id, last_seen DESC);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Website owners can view analytics" ON analytics_events FOR SELECT
  USING ( website_id IN ( SELECT id FROM websites WHERE user_id = auth.uid() ) );

ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Website owners can view summary" ON analytics_summary FOR SELECT
  USING ( website_id IN ( SELECT id FROM websites WHERE user_id = auth.uid() ) );

-- Functions
CREATE OR REPLACE FUNCTION get_traffic_sources(p_website_id UUID, p_start_date TIMESTAMP)
RETURNS TABLE (traffic_source TEXT, visitor_count BIGINT, percentage DECIMAL) AS $$
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

CREATE OR REPLACE FUNCTION get_top_pages(p_website_id UUID, p_start_date TIMESTAMP, p_limit INTEGER)
RETURNS TABLE (page_url TEXT, pageview_count BIGINT, unique_visitor_count BIGINT, avg_time_on_page INTEGER, bounce_rate DECIMAL) AS $$
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