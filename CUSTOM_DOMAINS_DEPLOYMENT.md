# Custom Domains Feature - Deployment Checklist ✅

**Status:** 100% COMPLETE - Ready to Deploy  
**Build Time:** Already built (0h required)  
**Estimated Setup Time:** 15-20 minutes

---

## What's Been Built

### ✅ Backend (Complete)

**1. Database Migration**
- File: `/supabase/migrations/004_custom_domains.sql`
- Features:
  - `custom_domains` table with full schema
  - Row Level Security (RLS) policies
  - Triggers for auto-update and primary domain enforcement
  - Helper functions (get_primary_domain, can_add_domain)
  - Indexes for performance
  - Tier-based domain limits (Free: 0, Pro: 3, Enterprise: 50)

**2. Vercel API Integration**
- File: `/src/lib/vercel/domains.ts`
- Features:
  - Add domains to Vercel project
  - Verify DNS configuration
  - Remove domains
  - Get domain configuration & DNS records
  - SSL certificate status tracking
  - Error handling & validation

**3. tRPC Router**
- File: `/src/server/routers/domains.ts`
- Endpoints:
  - `list` - Get all domains for website
  - `add` - Add new custom domain
  - `verify` - Verify DNS configuration
  - `remove` - Remove domain
  - `setAsPrimary` - Set primary domain
  - `getDnsConfig` - Get DNS setup instructions
  - `checkStatus` - Poll domain status
- Features:
  - Full authentication & authorization
  - Tier-based limits enforcement
  - Error handling with user-friendly messages

**4. Router Registration**
- File: `/src/server/routers/_app.ts`
- Status: ✅ Registered and exported

---

### ✅ Frontend (Complete)

**1. Domain Settings Page**
- File: `/src/app/(dashboard)/websites/[id]/settings/domains/page.tsx`
- Features:
  - List all domains with status badges
  - Add domain modal with validation
  - DNS configuration viewer
  - Verify DNS button
  - Set as primary functionality
  - Remove domain with confirmation
  - Real-time status updates
  - Error messages & alerts
  - SSL certificate status
  - Copy-to-clipboard for DNS records

**2. UI Components**
- All required components exist:
  - ✅ Button (`button.tsx`)
  - ✅ Card (`card.tsx`)
  - ✅ Dialog (`dialog.tsx`)
  - ✅ Input (`input.tsx`)
  - ✅ Label (`label.tsx`)
  - ✅ Badge (`badge.tsx`)
  - ✅ Alert (`alert.tsx`)

---

## Deployment Steps

### Step 1: Environment Variables (5 minutes)

Add these to your `.env` file:

```bash
# Vercel API Credentials (Required)
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_vercel_project_id_here
```

**How to Get These:**

1. **VERCEL_TOKEN:**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name: "Thundercloud Custom Domains"
   - Scope: Full Account
   - Copy token (save it - you won't see it again!)

2. **VERCEL_PROJECT_ID:**
   - Go to: https://vercel.com/dashboard
   - Click on your Thundercloud project
   - Go to Settings
   - Copy "Project ID" from General section

---

### Step 2: Run Database Migration (2 minutes)

**Option A: Supabase Dashboard (Recommended)**
1. Go to: https://supabase.com/dashboard
2. Select your Thundercloud project
3. Go to: SQL Editor
4. Click "New Query"
5. Copy contents of `/supabase/migrations/004_custom_domains.sql`
6. Click "Run"
7. Verify success message: ✅ "Custom Domains Migration Complete"

**Option B: Supabase CLI**
```bash
supabase db push
```

---

### Step 3: Update Environment (Local) (2 minutes)

```bash
# Add to .env.local
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxxx

# Restart dev server
npm run dev
```

---

### Step 4: Update Environment (Production) (3 minutes)

**Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Select your Thundercloud project
3. Go to: Settings > Environment Variables
4. Add:
   - `VERCEL_TOKEN` = your token
   - `VERCEL_PROJECT_ID` = your project ID
5. Click "Save"
6. Redeploy: Deployments > Latest > "..." > Redeploy

---

### Step 5: Test the Feature (5 minutes)

**1. Navigate to Domain Settings:**
```
https://your-site.vercel.app/websites/{website-id}/settings/domains
```

**2. Test Add Domain:**
- Click "Add Custom Domain"
- Enter: `test.yourdomain.com`
- Click "Add Domain"
- Should see: Success message + DNS instructions

**3. Test DNS Config:**
- Click "View DNS Config" on added domain
- Should see: A/CNAME records with copy buttons

**4. Test Verification:**
- Configure actual DNS (or skip for now)
- Click "Verify DNS"
- Should see: Status update (verified or pending)

**5. Test Remove:**
- Click trash icon
- Confirm deletion
- Should see: Domain removed from list

---

## Feature Navigation

### User Flow:

1. **Dashboard** → Click website
2. **Website Details** → Click "Settings" tab (or add to navigation)
3. **Settings** → Click "Domains"
4. **Domains Page** → Manage custom domains

### Current URL:
```
/websites/{id}/settings/domains
```

**TODO:** Add "Settings" link to website navigation (optional)

---

## Tier Limits (As Built)

| Tier       | Max Domains | Monthly Cost |
|------------|-------------|--------------|
| Free       | 0           | $0           |
| Pro        | 3           | $29          |
| Enterprise | 50          | $249         |

**Enforced At:**
- Database level (RLS + trigger)
- API level (tRPC router check)
- UI level (error message shown)

---

## DNS Configuration (User Instructions)

When users add a domain, they'll see these instructions:

### For Apex Domains (example.com):

**A Record:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`
- TTL: `3600`

### For Subdomains (www.example.com):

**CNAME Record:**
- Type: `CNAME`
- Name: `www` (or subdomain)
- Value: `cname.vercel-dns.com`
- TTL: `3600`

**Propagation Time:** 5-10 minutes (usually faster)

---

## Verification Flow

### Automatic Verification:

1. User adds domain → Status: `pending`
2. User configures DNS at registrar
3. User clicks "Verify DNS" → Status: `verifying`
4. Vercel checks DNS → Status: `active` (if verified)
5. SSL auto-provisions → SSL Status: `active` (2-5 minutes)

### Status Badges:

- 🟡 **Pending** - Waiting for DNS configuration
- 🟡 **Verifying** - Checking DNS records
- 🟢 **Active** - DNS verified, domain working
- 🔴 **Failed** - DNS verification failed

---

## API Endpoints (Built)

All endpoints require authentication (`protectedProcedure`):

### `domains.list({ websiteId })`
**Returns:** Array of domains for website

### `domains.add({ websiteId, domainName, setAsPrimary? })`
**Returns:** Domain + DNS records + instructions

### `domains.verify({ domainId })`
**Returns:** Verification status + updated domain

### `domains.remove({ domainId })`
**Returns:** Success confirmation

### `domains.setAsPrimary({ domainId })`
**Returns:** Updated domain (primary = true)

### `domains.getDnsConfig({ domainId })`
**Returns:** DNS records + setup instructions

### `domains.checkStatus({ domainId })`
**Returns:** Current domain status + Vercel status

---

## Error Handling (Built-In)

### User-Friendly Error Messages:

**Tier Limit Exceeded:**
> "You've reached the maximum of 3 domains for your Pro plan. Upgrade to add more domains."

**Domain Already Exists:**
> "This domain is already added to one of your websites"

**Invalid Domain:**
> "Invalid domain format. Use format like 'example.com' or 'www.example.com'"

**Vercel Not Configured:**
> "VERCEL_TOKEN environment variable is not set. Add it to your .env file."

**DNS Verification Failed:**
> "DNS not verified yet. Please check your DNS configuration and try again."

---

## Security (Built-In)

### Row Level Security (RLS):

- ✅ Users can only view own domains
- ✅ Users can only add domains to own websites
- ✅ Users can only update own domains
- ✅ Users can only delete own domains

### API Validation:

- ✅ Authentication required (all endpoints)
- ✅ Website ownership verified
- ✅ Domain format validated
- ✅ Tier limits enforced
- ✅ Unique domain constraint (global)

### Vercel Integration:

- ✅ API token stored in env (not DB)
- ✅ All Vercel calls authenticated
- ✅ Error handling (failed API calls)
- ✅ Cleanup on failure (rollback)

---

## Performance Optimizations (Built-In)

### Database:

- ✅ Indexes on: user_id, website_id, domain_name, status
- ✅ Partial index on: status (for pending/verifying)
- ✅ Unique constraints (prevent duplicates)

### Frontend:

- ✅ Real-time queries (tRPC)
- ✅ Optimistic updates
- ✅ Error boundaries
- ✅ Loading states

### Vercel API:

- ✅ Async operations (non-blocking)
- ✅ Error retry logic
- ✅ Rate limiting handled

---

## Monitoring & Debugging

### Database Queries:

```sql
-- Check all domains
SELECT * FROM custom_domains 
ORDER BY created_date DESC;

-- Check pending domains
SELECT domain_name, status, verification_attempts 
FROM custom_domains 
WHERE status IN ('pending', 'verifying');

-- Check tier usage
SELECT 
  up.subscription_tier,
  COUNT(cd.id) as domain_count
FROM user_profiles up
LEFT JOIN custom_domains cd ON cd.user_id = up.id
GROUP BY up.subscription_tier;
```

### Vercel API Logs:

- Check: Vercel Dashboard > Project > Logs
- Filter: "domain" keyword
- Look for: 403 (auth), 404 (not found), 500 (error)

---

## Common Issues & Solutions

### Issue 1: "Vercel API error (401)"
**Cause:** Invalid `VERCEL_TOKEN`  
**Solution:** Generate new token, update .env, restart

### Issue 2: "Domain not verifying"
**Cause:** DNS not configured correctly  
**Solution:** 
- Check DNS records at registrar
- Wait 10-15 minutes for propagation
- Use `dig example.com` or `nslookup example.com`

### Issue 3: "SSL certificate failed"
**Cause:** DNS not pointing to Vercel  
**Solution:**
- Verify DNS with `dig` command
- Ensure A record points to 76.76.21.21
- Or CNAME points to cname.vercel-dns.com

### Issue 4: "Can't add domain (tier limit)"
**Cause:** User on Free tier  
**Solution:** Upgrade to Pro ($29/mo) or Enterprise ($249/mo)

---

## Next Steps (Optional Enhancements)

### Phase 1 Extension (Nice to Have):

1. **Auto-DNS Verification**
   - Poll Vercel API every 30s
   - Auto-update status when verified
   - Show toast notification

2. **Domain Transfer Wizard**
   - Guide users through registrar setup
   - Provider-specific instructions (GoDaddy, Namecheap, etc.)
   - Video tutorials

3. **SSL Certificate Info**
   - Show expiry date
   - Auto-renewal status
   - Certificate details

### Phase 2 Features (Later):

4. **Redirect Rules**
   - 301/302 redirects
   - WWW → non-WWW (or vice versa)
   - Custom redirect paths

5. **Email Notifications**
   - Domain verified ✅
   - SSL provisioned ✅
   - Domain expiring soon ⚠️

6. **Bulk Domain Management**
   - CSV import
   - Bulk verification
   - Bulk removal

---

## Success Metrics (To Track)

### Conversion:
- % of Pro users who add domain: **Target 40%**
- % of domains verified successfully: **Target 90%**
- Median time to verification: **Target <15 min**

### Support:
- % of users needing support: **Target <5%**
- Common error types
- Registrar breakdown (which registrars cause issues?)

### Revenue:
- Conversions from Free → Pro (for domains)
- Upgrade reason: "Custom domains"

---

## Deployment Checklist Summary

- [ ] Add `VERCEL_TOKEN` to .env (local + production)
- [ ] Add `VERCEL_PROJECT_ID` to .env (local + production)
- [ ] Run database migration (`004_custom_domains.sql`)
- [ ] Restart dev server (local)
- [ ] Redeploy on Vercel (production)
- [ ] Test add domain
- [ ] Test verify domain
- [ ] Test remove domain
- [ ] Test tier limits
- [ ] Update user documentation
- [ ] Add "Settings" nav link (optional)

---

## 🎉 Ready to Ship!

The Custom Domains feature is **100% complete** and **ready to deploy**.

**Total Build Time:** Already done (0h)  
**Setup Time:** 15-20 minutes  
**Revenue Impact:** **CRITICAL** - Unlocks all paid tiers

**Just need:**
1. Vercel API credentials
2. Database migration
3. Deploy!

**Then:** Start making money! 💰

---

**Questions?** Check the code:
- Backend: `/src/server/routers/domains.ts`
- Frontend: `/src/app/(dashboard)/websites/[id]/settings/domains/page.tsx`
- Vercel API: `/src/lib/vercel/domains.ts`
- Migration: `/supabase/migrations/004_custom_domains.sql`
