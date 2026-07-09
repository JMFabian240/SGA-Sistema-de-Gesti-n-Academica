import { router, protectedProcedure, hasModulePermission } from '../../trpc';
import { z } from 'zod';
import { BecasService } from './becas.service';
import { 
  createBecaSchema, updateBecaSchema, 
  createSolicitudBecaSchema, resolverSolicitudBecaSchema, 
  assignBecaSchema 
} from './becas.schema';

const lectura = protectedProcedure.use(hasModulePermission('Becas', false));
const escritura = protectedProcedure.use(hasModulePermission('Becas', true));

export const becasRouter = router({
  // --- Catálogo de Becas ---
  getBecas: lectura.query(() => {
    return BecasService.getBecas();
  }),

  createBeca: escritura
    .input(createBecaSchema)
    .mutation(({ input }) => BecasService.createBeca(input)),

  updateBeca: escritura
    .input(updateBecaSchema)
    .mutation(({ input }) => BecasService.updateBeca(input)),

  deleteBeca: escritura
    .input(z.number().int().positive())
    .mutation(({ input }) => BecasService.deleteBeca(input)),

  // --- Solicitudes de Becas ---
  getSolicitudes: lectura
    .input(z.object({
      cicloId: z.number().int().positive().optional(),
      alumnoId: z.number().int().positive().optional()
    }).optional())
    .query(({ input }) => BecasService.getSolicitudes(input?.cicloId, input?.alumnoId)),

  createSolicitud: escritura
    .input(createSolicitudBecaSchema)
    .mutation(({ input, ctx }) => {
      const solicitadorId = (ctx as any).user?.usuarioId;
      if (!solicitadorId) throw new Error("No user in context");
      return BecasService.createSolicitud(input, solicitadorId);
    }),

  resolverSolicitud: escritura
    .input(resolverSolicitudBecaSchema)
    .mutation(({ input, ctx }) => {
      const resolvedorId = (ctx as any).user?.usuarioId;
      if (!resolvedorId) throw new Error("No user in context");
      return BecasService.resolverSolicitud(input, resolvedorId);
    }),

  // --- Asignación Directa ---
  assignBeca: escritura
    .input(assignBecaSchema)
    .mutation(({ input, ctx }) => {
      const asignadorId = (ctx as any).user?.usuarioId;
      if (!asignadorId) throw new Error("No user in context");
      return BecasService.assignBeca(input, asignadorId);
    })
});
