import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { buildGenerationPrompt } from '@/lib/ai/prompts';
import { generateWebsite } from '@/lib/ai/anthropic';
import { validator } from '@/lib/ai/quality-validator';

const generationInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(1000),
  category: z.enum(['landing', 'business', 'ecommerce', 'portfolio', 'saas']),
  theme: z.string().optional().default('modern'),
  colorScheme: z.string().optional().default('professional blue'),
  language: z.string().optional().default('English'),
});

export const generationRouter = router({
  // Generate new website with AI
  generate: protectedProcedure
    .input(generationInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Build production prompt using Base44 templates
        const prompt = buildGenerationPrompt({
          title: input.title,
          description: input.description,
          category: input.category,
          theme: input.theme,
          colorScheme: input.colorScheme,
          language: input.language,
        });

        // Generate website with Claude
        const result = await generateWebsite({
          prompt,
          maxTokens: 4096,
        });

        // Validate quality
        const validation = validator.validate(result.html);

        // Generate slug from title
        const slug = input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Save to database
        const { data: website, error } = await ctx.supabase
          .from('websites')
          .insert({
            user_id: ctx.user.id,
            title: input.title,
            description: input.description,
            category: input.category,
            slug: `${slug}-${Date.now()}`, // Ensure uniqueness
            html_content: result.html,
            css_content: null, // CSS is embedded in HTML
            js_content: null, // JS is embedded in HTML
            seo_score: validation.checks.seo.score,
            quality_score: validation.score,
            key_features: null,
            ai_generation_metadata: {
              model: result.metadata.model,
              tokensUsed: result.metadata.tokensUsed,
              finishReason: result.metadata.finishReason,
              theme: input.theme,
              colorScheme: input.colorScheme,
              validation: {
                passed: validation.passed,
                score: validation.score,
                issues: validation.issues,
                recommendations: validation.recommendations,
              },
            },
            is_published: false,
          })
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        return {
          website,
          validation,
        };
      } catch (error) {
        console.error('Generation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate website',
        });
      }
    }),

  // Regenerate existing website (uses same validation)
  regenerate: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        prompt: generationInputSchema.partial(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Get existing website
      const { data: existing } = await ctx.supabase
        .from('websites')
        .select('*')
        .eq('id', input.id)
        .eq('user_id', ctx.user.id)
        .single();

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Website not found',
        });
      }

      // Merge with existing data
      const generationInput = {
        title: input.prompt.title || existing.title,
        description: input.prompt.description || existing.description || '',
        category:
          input.prompt.category ||
          (existing.category as typeof generationInputSchema._type.category) ||
          'landing',
        theme: input.prompt.theme || 'modern',
        colorScheme: input.prompt.colorScheme || 'professional blue',
        language: input.prompt.language || 'English',
      };

      // Build prompt
      const prompt = buildGenerationPrompt(generationInput);

      // Generate
      const result = await generateWebsite({
        prompt,
        maxTokens: 4096,
      });

      // Validate
      const validation = validator.validate(result.html);

      // Update database
      const { data: updated, error } = await ctx.supabase
        .from('websites')
        .update({
          html_content: result.html,
          seo_score: validation.checks.seo.score,
          quality_score: validation.score,
          ai_generation_metadata: {
            model: result.metadata.model,
            tokensUsed: result.metadata.tokensUsed,
            finishReason: result.metadata.finishReason,
            theme: generationInput.theme,
            colorScheme: generationInput.colorScheme,
            validation: {
              passed: validation.passed,
              score: validation.score,
              issues: validation.issues,
              recommendations: validation.recommendations,
            },
          },
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

      return {
        website: updated,
        validation,
      };
    }),

  // Validate existing HTML (without generating)
  validate: protectedProcedure
    .input(
      z.object({
        html: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const validation = validator.validate(input.html);
      return validation;
    }),
});
