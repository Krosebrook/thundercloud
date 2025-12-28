import { z } from 'zod';
import { router, protectedProcedure } from 'src/server/trpc';
import { runSEOAudit } from 'src/lib/seo/audit-engine';
// import { autoFixSEOIssues } from 'src/lib/seo/auto-fix';

export const seoRouter = router({
  audit: protectedProcedure
    .input(z.object({ websiteId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data: website } = await ctx.supabase
        .from('websites')
        .select('html_content, url')
        .eq('id', input.websiteId)
        .single();

      if (!website) {
        throw new Error('Website not found');
      }

      const auditResult = await runSEOAudit(website.html_content, website.url);

      const { data: audit } = await ctx.supabase
        .from('seo_audits')
        .insert({
          website_id: input.websiteId,
          user_id: ctx.session.user.id,
          total_score: auditResult.totalScore,
          technical_seo_score: auditResult.categoryScores.technical,
          onpage_seo_score: auditResult.categoryScores.onpage,
          content_quality_score: auditResult.categoryScores.content,
          mobile_seo_score: auditResult.categoryScores.mobile,
          performance_score: auditResult.categoryScores.performance,
          issues: auditResult.issues,
          recommendations: auditResult.recommendations,
          checks_performed: auditResult.checksPassed + auditResult.checksFailed + auditResult.checksWarned,
          checks_passed: auditResult.checksPassed,
          checks_failed: auditResult.checksFailed,
          checks_warned: auditResult.checksWarned,
        })
        .select()
        .single();

      return audit;
    }),

  autoFix: protectedProcedure
    .input(z.object({ auditId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
        // This is a placeholder for the auto-fix logic
        return { success: true };
    }),
});
