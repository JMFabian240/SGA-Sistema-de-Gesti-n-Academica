import { router, protectedProcedure } from '../../trpc';
import { ReporteFechasSchema, ReporteAsistenciaSchema } from './reportes.schemas';
import { ReportesService } from './reportes.service';

export const reportesRouter = router({
  reporteDeudores: protectedProcedure
    .query(async () => {
      return ReportesService.getReporteDeudores();
    }),

  reporteIngresos: protectedProcedure
    .input(ReporteFechasSchema)
    .query(async ({ input }) => {
      return ReportesService.getReporteIngresos(input);
    }),

  listaAsistencia: protectedProcedure
    .input(ReporteAsistenciaSchema)
    .query(async ({ input }) => {
      return ReportesService.getListaAsistencia(input);
    })
});
