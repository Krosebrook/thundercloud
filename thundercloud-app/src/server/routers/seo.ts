import { z } from 'zod';
import { router, protectedProcedure } from 'src/server/trpc';
import { runSEOAudit, runHighLevelAudit, runLowLevelAudit, AuditScope } from 'src/lib/seo/audit-engine';
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

  auditWithScope: protectedProcedure
    .input(z.object({ 
      websiteId: z.string().uuid(),
      scope: z.enum(['high-level', 'low-level']).default('high-level')
    }))
    .mutation(async ({ input, ctx }) => {
      const { data: website } = await ctx.supabase
        .from('websites')
        .select('html_content, url')
        .eq('id', input.websiteId)
        .single();

      if (!website) {
        throw new Error('Website not found');
      }

      // Run the appropriate audit based on scope
      const startTime = Date.now();
      const auditResult = input.scope === 'high-level' 
        ? await runHighLevelAudit(website.html_content, website.url)
        : await runLowLevelAudit(website.html_content, website.url);
      const auditDuration = Date.now() - startTime;

      // For high-level audits, use the simple seo_audits table
      if (input.scope === 'high-level') {
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
            audit_duration_ms: auditDuration,
            checks_performed: auditResult.checksPassed + auditResult.checksFailed + auditResult.checksWarned,
            checks_passed: auditResult.checksPassed,
            checks_failed: auditResult.checksFailed,
            checks_warned: auditResult.checksWarned,
          })
          .select()
          .single();

        return {
          ...audit,
          scope: 'high-level',
          audit_type: 'quick',
        };
      }

      // For low-level audits, use the comprehensive_seo_audits table
      const comprehensiveResult = auditResult as any; // Type assertion for comprehensive result
      
      const { data: audit } = await ctx.supabase
        .from('comprehensive_seo_audits')
        .insert({
          website_id: input.websiteId,
          technical_seo: {
            score: auditResult.categoryScores.technical,
            details: comprehensiveResult.technicalDetails,
          },
          content_quality: {
            score: auditResult.categoryScores.content,
            details: comprehensiveResult.contentDetails,
          },
          user_experience: {
            mobileScore: auditResult.categoryScores.mobile,
            performanceScore: auditResult.categoryScores.performance,
          },
          mobile_optimization: {
            score: auditResult.categoryScores.mobile,
          },
          performance_metrics: {
            score: auditResult.categoryScores.performance,
          },
          overall_score: auditResult.totalScore,
        })
        .select()
        .single();

      return {
        ...audit,
        scope: 'low-level',
        audit_type: 'comprehensive',
        issues: auditResult.issues,
        recommendations: auditResult.recommendations,
        checks_performed: auditResult.checksPassed + auditResult.checksFailed + auditResult.checksWarned,
        checks_passed: auditResult.checksPassed,
        checks_failed: auditResult.checksFailed,
        checks_warned: auditResult.checksWarned,
        audit_duration_ms: auditDuration,
      };
    }),

  autoFix: protectedProcedure
    .input(z.object({ auditId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
        // This is a placeholder for the auto-fix logic
        return { success: true };
    }),
});
