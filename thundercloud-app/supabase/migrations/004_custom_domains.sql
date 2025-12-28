CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  is_primary BOOLEAN DEFAULT false,
  vercel_domain_id TEXT,
  ssl_status TEXT DEFAULT 'pending',
  dns_verification_attempted_at TIMESTAMP,
  dns_verified_at TIMESTAMP,
  ssl_provisioned_at TIMESTAMP,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(domain_name),
  UNIQUE(website_id, is_primary) WHERE is_primary = true
);

CREATE INDEX idx_custom_domains_website ON custom_domains(website_id);
CREATE INDEX idx_custom_domains_user ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);

ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own domains"
  ON custom_domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own domains"
  ON custom_domains FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domains"
  ON custom_domains FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own domains"
  ON custom_domains FOR DELETE
  USING (auth.uid() = user_id);
