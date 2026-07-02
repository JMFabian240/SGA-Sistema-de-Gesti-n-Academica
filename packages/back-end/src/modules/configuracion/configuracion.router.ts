import { router, protectedProcedure } from '../../trpc';
import { updateConfigSchema } from './configuracion.schema';
import { ConfiguracionService } from './configuracion.service';

export const configuracionRouter = router({
  /**
   * Obtener la configuración global del sistema
   */
  get: protectedProcedure
    .query(async () => {
      return ConfiguracionService.getConfiguracion();
    }),

  /**
   * Actualizar la configuración global del sistema
   */
  update: protectedProcedure
    .input(updateConfigSchema)
    .mutation(async ({ input }) => {
      return ConfiguracionService.updateConfiguracion(input);
    })
});
