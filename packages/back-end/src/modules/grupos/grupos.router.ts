import { router, protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { GruposService } from './grupos.service';
import {
  createNivelEducativoSchema, updateNivelEducativoSchema,
  createCicloEscolarSchema, updateCicloEscolarSchema,
  createMateriaSchema, updateMateriaSchema,
  createGrupoSchema, updateGrupoSchema,
  assignMateriaGrupoSchema, unassignMateriaGrupoSchema
} from './grupos.schema';

export const gruposRouter = router({
  // --- Niveles Educativos ---
  getNiveles: protectedProcedure.query(() => GruposService.getNiveles()),
  createNivel: protectedProcedure.input(createNivelEducativoSchema).mutation(({ input }) => GruposService.createNivel(input)),
  updateNivel: protectedProcedure.input(updateNivelEducativoSchema).mutation(({ input }) => GruposService.updateNivel(input)),
  deleteNivel: protectedProcedure.input(z.number().int().positive()).mutation(({ input }) => GruposService.deleteNivel(input)),

  // --- Ciclos Escolares ---
  getCiclos: protectedProcedure.query(() => GruposService.getCiclos()),
  createCiclo: protectedProcedure.input(createCicloEscolarSchema).mutation(({ input }) => GruposService.createCiclo(input)),
  updateCiclo: protectedProcedure.input(updateCicloEscolarSchema).mutation(({ input }) => GruposService.updateCiclo(input)),
  deleteCiclo: protectedProcedure.input(z.number().int().positive()).mutation(({ input }) => GruposService.deleteCiclo(input)),

  // --- Materias ---
  getMaterias: protectedProcedure.query(() => GruposService.getMaterias()),
  createMateria: protectedProcedure.input(createMateriaSchema).mutation(({ input }) => GruposService.createMateria(input)),
  updateMateria: protectedProcedure.input(updateMateriaSchema).mutation(({ input }) => GruposService.updateMateria(input)),
  deleteMateria: protectedProcedure.input(z.number().int().positive()).mutation(({ input }) => GruposService.deleteMateria(input)),

  // --- Grupos ---
  getGrupos: protectedProcedure
    .input(z.object({ cicloId: z.number().int().positive().optional() }).optional())
    .query(({ input }) => GruposService.getGrupos(input?.cicloId)),
  createGrupo: protectedProcedure.input(createGrupoSchema).mutation(({ input }) => GruposService.createGrupo(input)),
  updateGrupo: protectedProcedure.input(updateGrupoSchema).mutation(({ input }) => GruposService.updateGrupo(input)),
  deleteGrupo: protectedProcedure.input(z.number().int().positive()).mutation(({ input }) => GruposService.deleteGrupo(input)),

  // --- Asignación Materias a Grupos ---
  assignMateria: protectedProcedure.input(assignMateriaGrupoSchema).mutation(({ input }) => GruposService.assignMateriaToGrupo(input)),
  unassignMateria: protectedProcedure.input(unassignMateriaGrupoSchema).mutation(({ input }) => GruposService.unassignMateriaFromGrupo(input)),
});
