import { router, protectedProcedure } from '../../trpc';
import { CalificacionesService } from './calificaciones.service';
import { 
  getCalificacionesGrupoSchema, 
  getCalificacionesAlumnoSchema, 
  upsertCalificacionSchema, 
  deleteCalificacionSchema 
} from './calificaciones.schema';

export const calificacionesRouter = router({
  
  /**
   * Obtiene la boleta/registro de calificaciones para un grupo (vista docente)
   */
  getPorGrupo: protectedProcedure
    .input(getCalificacionesGrupoSchema)
    .query(({ input }) => {
      return CalificacionesService.getCalificacionesGrupo(input);
    }),

  /**
   * Obtiene el kárdex completo de un alumno (vista administrativo/tutor)
   */
  getPorAlumno: protectedProcedure
    .input(getCalificacionesAlumnoSchema)
    .query(({ input }) => {
      return CalificacionesService.getCalificacionesAlumno(input);
    }),

  /**
   * Inserta o actualiza una calificación de un alumno
   */
  upsert: protectedProcedure
    .input(upsertCalificacionSchema)
    .mutation(({ input, ctx }) => {
      const registradorId = ctx.user?.usuarioId;
      if (!registradorId) throw new Error("No user in context");
      return CalificacionesService.upsertCalificacion(input, registradorId);
    }),

  /**
   * Elimina una calificación registrada por error
   */
  delete: protectedProcedure
    .input(deleteCalificacionSchema)
    .mutation(({ input }) => {
      return CalificacionesService.deleteCalificacion(input);
    })
});
