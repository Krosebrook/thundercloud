# Feature Specification: Custom Domain Support
## Priority: P0 - CRITICAL (Build First)

**Version:** 1.0  
**Status:** Ready for Development  
**Estimated Build Time:** 8-12 hours  
**Revenue Impact:** CRITICAL - Blocks all paid conversions

---

## Executive Summary

### Problem
Users won't pay $29/month for a website that lives on `yoursite.thundercloud.app`. Custom domains (e.g., `mycompany.com`) are a **hard requirement** for paid tiers and professional credibility.

### Solution
Integrate with Vercel's domain API to allow users to:
1. Add custom domains (purchased elsewhere or via Vercel)
2. Configure DNS with guided setup
3. Auto-provision SSL certificates (HTTPS)
4. Support subdomains (blog.mycompany.com)

### Success Metrics
- **Adoption:** 40% of Pro users configure custom domain
- **Success Rate:** 90% of domain setups complete successfully
- **Time to Setup:** < 15 minutes (median)
- **Support Tickets:** < 5% require human help

---

## User Stories

### US1: Add Custom Domain (Primary Flow)
**As a** business owner  
**I want to** connect my custom domain to my website  
**So that** my site appears professional (mycompany.com not thundercloud.app)

**Acceptance Criteria:**
- [ ] User can enter domain name in settings
- [ ] System validates domain format
- [ ] System provides DNS configuration instructions
- [ ] User can verify DNS propagation
- [ ] Domain automatically gets HTTPS certificate
- [ ] Website is accessible via custom domain
- [ ] Preview URL still works (for staging)

**User Flow:**
```
1. Dashboard → Select Website → Settings → Domains
2. Click "Add Custom Domain"
3. Enter "mycompany.com"
4. See DNS configuration:
   • Add CNAME: www → cname.vercel-dns.com
   • Add A: @ → 76.76.21.21
5. Copy DNS records to domain provider (GoDaddy, Namecheap, etc.)
6. Click "Verify DNS"
7. Wait for propagation (0-48 hours)
8. See "✓ Active" status
9. Website accessible at mycompany.com
```

---

### US2: Manage Multiple Domains
**As a** agency owner  
**I want to** add multiple domains to one website  
**So that** I can have www.example.com and example.com both work

**Acceptance Criteria:**
- [ ] User can add up to 5 domains per website (Pro tier)
- [ ] Can set primary domain (canonical URL)
- [ ] Can add redirects (www → non-www or vice versa)
- [ ] All domains get SSL certificates

---

### US3: Subdomain Support
**As a** SaaS founder  
**I want to** use subdomains for different purposes  
**So that** blog.mycompany.com goes to my blog page

**Acceptance Criteria:**
- [ ] User can add subdomain.domain.com
- [ ] Subdomain can point to specific page (future)
- [ ] Subdomain gets own SSL certificate

---

### US4: Domain Transfer/Update
**As a** user  
**I want to** remove or change my custom domain  
**So that** I can switch providers or correct mistakes

**Acceptance Criteria:**
- [ ] User can remove custom domain
- [ ] Confirmation required before removal
- [ ] Website falls back to .thundercloud.app URL
- [ ] User can add new domain after removing old one

---

## Technical Specification

### Architecture

```
┌─────────────────────────────────────────┐
│ User enters domain: mycompany.com       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Frontend validates format               │
│ (domain regex, no spaces, etc.)         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ tRPC: domains.add({ websiteId, domain })│
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Backend: Check domain availability      │
│ - Not already in use                    │
│ - User owns website                     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Vercel API: Add domain to project       │
│ POST /v10/projects/:id/domains          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Database: Save domain record            │
│ - domain_name, website_id, status       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Return DNS configuration to user        │
│ - CNAME: www → cname.vercel-dns.com     │
│ - A: @ → 76.76.21.21                    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ User adds records to DNS provider       │
│ (GoDaddy, Namecheap, Cloudflare, etc.)  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ User clicks "Verify DNS"                │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Backend: Check DNS propagation          │
│ - Query A/CNAME records                 │
│ - Verify pointing to Vercel IPs         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Vercel: Auto-provision SSL (Let's Enc)  │
│ - Status: pending → active              │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Update database: status = 'active'      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Website accessible at mycompany.com! ✓  │
└─────────────────────────────────────────┘
```

### Database Schema

**New Table: `custom_domains`**

```sql
CREATE TABLE custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', 
  -- 'pending', 'verifying', 'active', 'failed', 'removed'
  is_primary BOOLEAN DEFAULT false,
  vercel_domain_id TEXT, -- Vercel's internal domain ID
  ssl_status TEXT DEFAULT 'pending',
  -- 'pending', 'provisioning', 'active', 'failed'
  dns_verification_attempted_at TIMESTAMP,
  dns_verified_at TIMESTAMP,
  ssl_provisioned_at TIMESTAMP,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  UNIQUE(domain_name),
  UNIQUE(website_id, is_primary) WHERE is_primary = true
);

-- Index for fast lookups
CREATE INDEX idx_custom_domains_website ON custom_domains(website_id);
CREATE INDEX idx_custom_domains_user ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);

-- RLS policies
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
```

### API Design (tRPC Router)

**File:** `src/server/routers/domains.ts`

```typescript
export const domainsRouter = router({
  // List domains for a website
  list: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      // Query custom_domains where website_id = input.websiteId
      // Return list with status, SSL info, verification state
    }),

  // Add a new custom domain
  add: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      domainName: z.string().regex(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i),
      isPrimary: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Validate user owns website
      // 2. Check domain not already in use
      // 3. Call Vercel API to add domain
      // 4. Save to database
      // 5. Return DNS configuration
    }),

  // Verify DNS configuration
  verify: protectedProcedure
    .input(z.object({
      domainId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Get domain from database
      // 2. Check DNS records (A/CNAME)
      // 3. Update status based on verification
      // 4. Trigger SSL provisioning if verified
    }),

  // Remove custom domain
  remove: protectedProcedure
    .input(z.object({
      domainId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Validate ownership
      // 2. Call Vercel API to remove domain
      // 3. Update database status = 'removed'
      // 4. Return success
    }),

  // Get DNS configuration instructions
  getDnsConfig: protectedProcedure
    .input(z.object({
      domainId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      // Return DNS records needed:
      // - CNAME for www
      // - A record for root
      // - Instructions by provider (GoDaddy, Namecheap, etc.)
    }),

  // Check verification status (polling)
  checkStatus: protectedProcedure
    .input(z.object({
      domainId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      // 1. Query Vercel API for domain status
      // 2. Update local database
      // 3. Return current status
    }),
});
```

### Vercel API Integration

**File:** `src/lib/vercel/domains.ts`

```typescript
import { fetch } from 'undici';

const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

interface VercelDomain {
  name: string;
  verified: boolean;
  verification: Array<{
    type: 'TXT' | 'CNAME';
    domain: string;
    value: string;
    reason: string;
  }>;
}

export async function addDomainToVercel(domain: string): Promise<VercelDomain> {
  const response = await fetch(
    `${VERCEL_API}/v10/projects/${VERCEL_PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Vercel API error: ${error.message}`);
  }

  return response.json();
}

export async function removeDomainFromVercel(domain: string): Promise<void> {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to remove domain from Vercel');
  }
}

export async function getDomainConfig(domain: string) {
  const response = await fetch(
    `${VERCEL_API}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/config`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    }
  );

  return response.json();
}

export async function verifyDomain(domain: string): Promise<boolean> {
  // Check DNS records
  const dnsCheck = await checkDNSRecords(domain);
  return dnsCheck.verified;
}

async function checkDNSRecords(domain: string) {
  // Use DNS lookup to verify A/CNAME records point to Vercel
  // Implementation using dns.promises.resolve()
}
```

---

## UI Specifications

### 1. Domain Settings Page

**Location:** `/dashboard/websites/[id]/settings/domains`

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back to Website                                        │
├──────────────────────────────────────────────────────────┤
│ Custom Domains                                           │
│ Connect your own domain to this website                 │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Default Domain                                     │ │
│ │ https://mysite.thundercloud.app                    │ │
│ │ ✓ Active                                           │ │
│ └────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Custom Domains (0/3)                   [+ Add Domain]│ │
│ │                                                     │ │
│ │ No custom domains yet.                              │ │
│ │ Add your first domain to make your site professional│ │
│ └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 2. Add Domain Modal

```
┌──────────────────────────────────────────────────────────┐
│ Add Custom Domain                                    [×] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Domain Name                                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ mycompany.com                                      │  │
│ └────────────────────────────────────────────────────┘  │
│ Enter your domain without http:// or www               │
│                                                          │
│ ☐ Set as primary domain                                 │
│   (Redirects will point here)                            │
│                                                          │
│ [Cancel]                              [Continue →]      │
└──────────────────────────────────────────────────────────┘
```

### 3. DNS Configuration View

```
┌──────────────────────────────────────────────────────────┐
│ Configure DNS for mycompany.com                      [×] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Add these records to your DNS provider:                 │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 1. CNAME Record                                    │  │
│ │    Name:  www                                      │  │
│ │    Value: cname.vercel-dns.com         [Copy]     │  │
│ │    TTL:   3600 (1 hour)                            │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 2. A Record                                        │  │
│ │    Name:  @                                        │  │
│ │    Value: 76.76.21.21                  [Copy]     │  │
│ │    TTL:   3600 (1 hour)                            │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Need help? [GoDaddy] [Namecheap] [Cloudflare]          │
│                                                          │
│ ⏱ DNS changes can take up to 48 hours                   │
│                                                          │
│ [I'll do this later]              [Verify DNS →]        │
└──────────────────────────────────────────────────────────┘
```

### 4. Verification Status

```
┌──────────────────────────────────────────────────────────┐
│ Verifying mycompany.com...                           [×] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ⏳ Checking DNS configuration...                         │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ✓ CNAME record found                               │  │
│ │ ✓ A record found                                   │  │
│ │ ⏳ SSL certificate provisioning...                  │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ This usually takes 1-5 minutes.                          │
│                                                          │
│                                [Refresh Status]          │
└──────────────────────────────────────────────────────────┘
```

### 5. Active Domain List

```
┌──────────────────────────────────────────────────────────┐
│ Custom Domains (2/3)                       [+ Add Domain]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ mycompany.com                           ⭐ Primary │  │
│ │ ✓ Active  •  🔒 HTTPS                              │  │
│ │ Added 2 days ago                                   │  │
│ │ [View DNS] [Remove]                                │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ www.mycompany.com                                   │  │
│ │ ✓ Active  •  🔒 HTTPS  •  Redirects to primary    │  │
│ │ Added 2 days ago                                   │  │
│ │ [View DNS] [Remove]                                │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Backend Setup (3-4 hours)

1. **Database Migration** (30 min)
   - Create `custom_domains` table
   - Add RLS policies
   - Create indexes

2. **Vercel API Integration** (1.5 hours)
   - Create `src/lib/vercel/domains.ts`
   - Implement add/remove/verify functions
   - Test with Vercel API

3. **tRPC Router** (1.5 hours)
   - Create `src/server/routers/domains.ts`
   - Implement all endpoints
   - Add input validation (Zod)
   - Add error handling

### Phase 2: Frontend UI (4-5 hours)

4. **Domain Settings Page** (2 hours)
   - Create `/dashboard/websites/[id]/settings/domains/page.tsx`
   - List existing domains
   - Add domain button
   - Remove domain flow

5. **Add Domain Modal** (1.5 hours)
   - Domain input with validation
   - DNS configuration display
   - Copy buttons for DNS records
   - Provider-specific help links

6. **Verification Flow** (1.5 hours)
   - DNS verification UI
   - Real-time status polling
   - Success/error states
   - Retry mechanism

### Phase 3: Polish & Testing (1-2 hours)

7. **Error Handling** (30 min)
   - Domain already in use
   - Verification timeout
   - SSL provisioning failures
   - Network errors

8. **Loading States** (30 min)
   - Skeleton loaders
   - Progress indicators
   - Disable buttons during operations

9. **Testing** (1 hour)
   - Test with real domain
   - Test DNS verification
   - Test SSL provisioning
   - Test error cases

---

## Testing Requirements

### Unit Tests

```typescript
describe('domainsRouter', () => {
  it('validates domain format', () => {
    expect(validateDomain('example.com')).toBe(true);
    expect(validateDomain('invalid')).toBe(false);
    expect(validateDomain('http://example.com')).toBe(false);
  });

  it('prevents duplicate domains', async () => {
    await addDomain('example.com', websiteId);
    await expect(
      addDomain('example.com', otherWebsiteId)
    ).rejects.toThrow('Domain already in use');
  });

  it('enforces domain limits', async () => {
    // Add 3 domains (free tier limit)
    await addDomain('one.com', websiteId);
    await addDomain('two.com', websiteId);
    await addDomain('three.com', websiteId);
    
    // 4th should fail
    await expect(
      addDomain('four.com', websiteId)
    ).rejects.toThrow('Domain limit reached');
  });
});
```

### Integration Tests

```typescript
describe('Custom Domains E2E', () => {
  it('completes full domain setup flow', async () => {
    // 1. Add domain
    const domain = await addDomain({
      websiteId: testWebsite.id,
      domainName: 'test.example.com',
    });
    expect(domain.status).toBe('pending');

    // 2. Get DNS config
    const dns = await getDnsConfig(domain.id);
    expect(dns.records).toHaveLength(2); // CNAME + A

    // 3. Mock DNS verification
    mockDNSLookup('test.example.com', '76.76.21.21');

    // 4. Verify DNS
    const verified = await verifyDomain(domain.id);
    expect(verified.status).toBe('active');
    expect(verified.sslStatus).toBe('provisioning');

    // 5. Check final status
    await waitFor(() => {
      const status = getDomain(domain.id);
      expect(status.sslStatus).toBe('active');
    });
  });
});
```

### Manual Test Cases

1. **Happy Path:**
   - Add domain mytest.com
   - Configure DNS at registrar
   - Verify DNS
   - Wait for SSL
   - Visit mytest.com
   - See website with HTTPS

2. **Wrong DNS:**
   - Add domain wrongdns.com
   - Don't configure DNS
   - Click verify
   - See error: "DNS not configured"

3. **Already Used:**
   - Add domain duplicate.com
   - Try to add duplicate.com again
   - See error: "Domain already in use"

4. **Remove Domain:**
   - Add domain remove-me.com
   - Wait for activation
   - Click remove
   - Confirm removal
   - Domain no longer accessible
   - Falls back to .thundercloud.app

---

## Environment Variables

**Add to `.env.example`:**

```bash
# Vercel Integration (for custom domains)
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_TEAM_ID=your_team_id_here # optional
```

**Getting Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create new token with scope: "Full Account"
3. Copy token to `.env.local`

**Getting Project ID:**
1. Go to your Vercel project settings
2. Copy Project ID from General tab

---

## Error Handling

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `domain_already_exists` | Domain in use by another user | Show error, suggest alternatives |
| `dns_not_configured` | DNS records not set | Show DNS instructions again |
| `ssl_provisioning_failed` | Let's Encrypt rate limit hit | Retry after 1 hour |
| `vercel_api_error` | Vercel API down | Show error, allow retry later |
| `domain_limit_reached` | User hit domain limit (3 for free) | Prompt upgrade to Pro |

---

## Success Metrics

### Track These KPIs:

**Adoption Metrics:**
- % of Pro users who add custom domain: Target 40%
- Time from signup to domain added: Target < 7 days
- Domains per Pro user (avg): Target 1.5

**Success Metrics:**
- Domain setup success rate: Target 90%
- DNS verification success (first try): Target 70%
- SSL provisioning success: Target 95%
- Time to active domain: Target < 15 minutes (median)

**Support Metrics:**
- % users requiring support: Target < 5%
- Common issues: Track and fix top 3
- Documentation clarity: User survey

---

## Pricing Integration

### Domain Limits by Tier:

```typescript
const DOMAIN_LIMITS = {
  free: 0,      // No custom domains
  pro: 3,       // 3 domains per website
  premium: 10,  // 10 domains per website
  agency: 50,   // 50 domains per website
};
```

### Enforcement:

```typescript
async function canAddDomain(userId: string): Promise<boolean> {
  const user = await getUser(userId);
  const currentDomains = await countUserDomains(userId);
  const limit = DOMAIN_LIMITS[user.subscription_tier];
  
  if (currentDomains >= limit) {
    throw new Error('Domain limit reached. Upgrade to add more domains.');
  }
  
  return true;
}
```

---

## Documentation

### User-Facing Docs:

**Help Article: "How to Connect a Custom Domain"**

```markdown
# Connecting Your Custom Domain

Follow these steps to connect your domain:

## Step 1: Purchase a Domain
Buy a domain from:
- GoDaddy
- Namecheap  
- Google Domains
- Cloudflare

## Step 2: Add Domain in Thundercloud
1. Go to Dashboard → Your Website → Settings → Domains
2. Click "Add Custom Domain"
3. Enter your domain (e.g., mycompany.com)
4. Click Continue

## Step 3: Configure DNS
Add these DNS records at your registrar:

**CNAME Record:**
- Name: www
- Value: cname.vercel-dns.com
- TTL: 3600

**A Record:**
- Name: @
- Value: 76.76.21.21
- TTL: 3600

[Provider-specific guides: GoDaddy | Namecheap | Cloudflare]

## Step 4: Verify
1. Wait 5-10 minutes for DNS propagation
2. Click "Verify DNS"
3. Wait for SSL certificate (1-5 minutes)
4. Done! Your site is live at your custom domain

## Troubleshooting
- DNS not found: Wait longer (up to 48 hours)
- SSL failed: Contact support
- Domain already in use: Domain is connected elsewhere
```

---

## Launch Checklist

### Pre-Launch:
- [ ] Database migration run on production
- [ ] Vercel token configured in env vars
- [ ] tRPC router tested locally
- [ ] UI tested with real domain
- [ ] Error handling tested
- [ ] Documentation written
- [ ] Support trained on common issues

### Launch:
- [ ] Deploy to production
- [ ] Test with real domain
- [ ] Monitor error rates
- [ ] Watch support tickets
- [ ] Gather user feedback

### Post-Launch (Week 1):
- [ ] Track adoption metrics
- [ ] Fix top 3 issues
- [ ] Update documentation
- [ ] Email users about new feature
- [ ] Blog post announcement

---

## Future Enhancements

### V2 Features (Later):

1. **Domain Purchase** (in-app)
   - Buy domains directly in Thundercloud
   - Auto-configure DNS
   - One-click setup

2. **Advanced DNS Management**
   - Edit DNS records in-app
   - Email forwarding
   - Subdomain routing

3. **Domain Transfer**
   - Transfer domains to Vercel
   - Consolidated management

4. **Bulk Domain Management**
   - Import multiple domains
   - Bulk DNS configuration
   - Agency tools

---

## Build Time Estimate

| Phase | Task | Time |
|-------|------|------|
| **Phase 1** | Database + Vercel API + Router | 3-4h |
| **Phase 2** | Frontend UI + Modals | 4-5h |
| **Phase 3** | Testing + Polish | 1-2h |
| **Total** | | **8-12h** |

---

## Revenue Impact

### Unlocks:
- **$29/mo Pro tier** - Custom domains required
- **$79/mo Premium tier** - More domains (10 vs 3)
- **$249/mo Agency tier** - Bulk domains (50)

### Expected Revenue Lift:
- Free → Pro conversion: +15% (custom domains)
- Pro → Premium: +5% (domain limit)
- Total MRR increase: +$1,200/month (100 users)

---

**Status:** Ready to build  
**Priority:** P0 - CRITICAL  
**Build next:** YES - This unlocks all paid revenue

**Want me to start building this now?** 🚀
