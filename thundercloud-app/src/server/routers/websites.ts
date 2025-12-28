import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const websiteSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  category: z.string().optional(),
  slug: z.string().min(1).max(100),
  html_content: z.string().min(1),
  css_content: z.string().optional(),
  js_content: z.string().optional(),
  is_published: z.boolean().optional(),
});

export const websitesRouter = router({
  // List all websites for current user
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        sortBy: z.enum(['created_date', 'updated_date', 'title']).default('created_date'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, sortBy, sortOrder } = input;
      const skip = (page - 1) * pageSize;

      const { data, error, count } = await ctx.supabase
        .from('websites')
        .select('*', { count: 'exact' })
        .eq('user_id', ctx.user.id)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(skip, skip + pageSize - 1);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return {
        data: data || [],
        pagination: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
        },
      };
    }),

  // Get single website by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('websites')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Website not found',
        });
      }

      return data;
    }),

  // Create new website
  create: protectedProcedure
    .input(websiteSchema)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('websites')
        .insert({
          ...input,
          user_id: ctx.user.id,
        })
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data;
    }),

  // Update existing website
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: websiteSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const { data: existing } = await ctx.supabase
        .from('websites')
        .select('id')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Website not found',
        });
      }

      const { data, error } = await ctx.supabase
        .from('websites')
        .update(input.data)
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data;
    }),

  // Delete website
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from('websites')
        .delete()
        .eq('id', input.id)
        .eq('user_id', ctx.user.id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    }),

  // Publish/unpublish website
  togglePublish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Get current state
      const { data: existing } = await ctx.supabase
        .from('websites')
        .select('is_published')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Website not found',
        });
      }

      const { data, error } = await ctx.supabase
        .from('websites')
        .update({
          is_published: !existing.is_published,
          published_at: !existing.is_published ? new Date().toISOString() : null,
        })
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data;
    }),
});
