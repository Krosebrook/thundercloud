import { router } from '../trpc';
import { websitesRouter } from './websites';
import { generationRouter } from './generation';

export const appRouter = router({
  websites: websitesRouter,
  generation: generationRouter,
});

export type AppRouter = typeof appRouter;
