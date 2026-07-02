import { router, protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { AlumnosService } from './alumnos.service';
import { createAlumnoSchema, updateAlumnoSchema, linkTutorSchema, unlinkTutorSchema } from './alumnos.schema';

export const alumnosRouter = router({
  /**
   * Obtener todos los alumnos
   */
  getAll: protectedProcedure.query(() => {
    return AlumnosService.getAlumnos();
  }),

  /**
   * Obtener detalle de un alumno por ID
   */
  getById: protectedProcedure
    .input(z.number().int().positive())
    .query(({ input }) => {
      return AlumnosService.getAlumnoById(input);
    }),

  /**
   * Crear un nuevo alumno
   */
  create: protectedProcedure
    .input(createAlumnoSchema)
    .mutation(({ input }) => {
      return AlumnosService.createAlumno(input);
    }),

  /**
   * Actualizar un alumno existente
   */
  update: protectedProcedure
    .input(updateAlumnoSchema)
    .mutation(({ input }) => {
      return AlumnosService.updateAlumno(input);
    }),

  /**
   * Realizar Soft Delete de un alumno
   */
  delete: protectedProcedure
    .input(z.number().int().positive())
    .mutation(({ input }) => {
      return AlumnosService.deleteAlumno(input);
    }),

  /**
   * Vincular un tutor a un alumno
   */
  linkTutor: protectedProcedure
    .input(linkTutorSchema)
    .mutation(({ input }) => {
      return AlumnosService.linkTutor(input);
    }),

  /**
   * Desvincular un tutor de un alumno
   */
  unlinkTutor: protectedProcedure
    .input(unlinkTutorSchema)
    .mutation(({ input }) => {
      return AlumnosService.unlinkTutor(input);
    })
});
