import { z } from 'zod';
import { router, protectedProcedure } from 'src/server/trpc';

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
