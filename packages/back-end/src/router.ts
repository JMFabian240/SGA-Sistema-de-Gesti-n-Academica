import { router } from './trpc';
import { authRouter } from './modules/auth/auth.router';
import { configuracionRouter } from './modules/configuracion/configuracion.router';

export const appRouter = router({
  auth: authRouter,
  configuracion: configuracionRouter,
  // Otros módulos se agregarán aquí...
});

export type AppRouter = typeof appRouter;
