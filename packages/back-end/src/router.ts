import { router } from './trpc';
import { authRouter } from './modules/auth/auth.router';
import { configuracionRouter } from './modules/configuracion/configuracion.router';
import { gruposRouter } from './modules/grupos/grupos.router';
import { tutoresRouter } from './modules/tutores/tutores.router';
import { alumnosRouter } from './modules/alumnos/alumnos.router';

export const appRouter = router({
  auth: authRouter,
  configuracion: configuracionRouter,
  grupos: gruposRouter,
  tutores: tutoresRouter,
  alumnos: alumnosRouter,
  // Otros módulos se agregarán aquí...
});

export type AppRouter = typeof appRouter;
