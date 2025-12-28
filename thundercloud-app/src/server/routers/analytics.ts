import { z } from 'zod';
import { router, protectedProcedure } from 'src/server/trpc';

const calculateStartDate = (period: string) => {
    const now = new Date();
    if (period === '7d') {
        now.setDate(now.getDate() - 7);
    } else if (period === '30d') {
        now.setDate(now.getDate() - 30);
    } else {
        now.setFullYear(now.getFullYear() - 10);
    }
    return now.toISOString();
}

export const analyticsRouter = router({
  getOverview: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      const startDate = calculateStartDate(input.period);
      const { data } = await ctx.supabase
        .from('analytics_summary')
        .select('*')
        .eq('website_id', input.websiteId)
        .gte('date', startDate)
        .order('date', { ascending: false });
      
      const totalVisitors = data?.reduce((sum, d) => sum + d.total_visitors, 0) || 0;
      const totalPageviews = data?.reduce((sum, d) => sum + d.total_pageviews, 0) || 0;
      
      return {
        visitors: totalVisitors,
        visitorChange: 0,
        pageviews: totalPageviews,
        pageviewChange: 0,
        bounceRate: 0,
        avgTimeOnSite: 0,
      };
    }),

  getTrafficSources: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
      const { data } = await ctx.supabase.rpc('get_traffic_sources', {
        p_website_id: input.websiteId,
        p_start_date: calculateStartDate(input.period),
      });
      
      return {
        sources: data?.map(row => ({
          source: row.traffic_source,
          visitors: row.visitor_count,
          percentage: row.percentage,
        })) || [],
      };
    }),

  getTopPages: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input, ctx }) => {
        const { data } = await ctx.supabase.rpc('get_top_pages', {
            p_website_id: input.websiteId,
            p_start_date: calculateStartDate(input.period),
            p_limit: input.limit,
        });

        return {
            pages: data?.map(row => ({
                url: row.page_url,
                pageviews: row.pageview_count,
                uniqueVisitors: row.unique_visitor_count,
                avgTimeOnPage: row.avg_time_on_page,
                bounceRate: row.bounce_rate,
            })) || [],
        };
    }),

  getGeography: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
        return { countries: [] };
    }),

  getDevices: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
      period: z.enum(['7d', '30d', 'all']).default('7d'),
    }))
    .query(async ({ input, ctx }) => {
        return {
            devices: { mobile: 0, desktop: 0, tablet: 0 },
            browsers: [],
            operatingSystems: [],
        };
    }),

  getRealtime: protectedProcedure
    .input(z.object({
      websiteId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
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
