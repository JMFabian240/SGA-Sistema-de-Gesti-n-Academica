import { router } from './trpc';
import { authRouter } from './modules/auth/auth.router';

export const appRouter = router({
  auth: authRouter,
  // Otros módulos se agregarán aquí...
});

export type AppRouter = typeof appRouter;
