import { router, protectedProcedure } from '../../trpc';
import { DashboardService } from './dashboard.service';

export const dashboardRouter = router({
  obtenerMetricasInscripcion: protectedProcedure
    .query(async () => {
      return DashboardService.obtenerMetricasInscripcion();
    }),

  obtenerKpisFinancieros: protectedProcedure
    .query(async () => {
      return DashboardService.obtenerKpisFinancieros();
    }),
});
