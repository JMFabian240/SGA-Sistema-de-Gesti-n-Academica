import { router, protectedProcedure, hasModulePermission } from '../../trpc';
import { z } from 'zod';
import { PagosService } from './pagos.service';
import { 
  createTarifaSchema, updateTarifaSchema, 
  createCalendarioPagoSchema, updateCalendarioPagoSchema, 
  registrarPagoSchema 
} from './pagos.schema';

const lectura = protectedProcedure.use(hasModulePermission('Pagos', false));
const escritura = protectedProcedure.use(hasModulePermission('Pagos', true));

export const pagosRouter = router({
  
  // --- Tarifas ---
  getTarifas: lectura
    .input(z.object({
      cicloId: z.number().int().positive().optional(),
      nivelId: z.number().int().positive().optional()
    }).optional())
    .query(({ input }) => {
      return PagosService.getTarifas(input?.cicloId, input?.nivelId);
    }),

  createTarifa: escritura
    .input(createTarifaSchema)
    .mutation(({ input }) => PagosService.createTarifa(input)),

  updateTarifa: escritura
    .input(updateTarifaSchema)
    .mutation(({ input }) => PagosService.updateTarifa(input)),

  deleteTarifa: escritura
    .input(z.number().int().positive())
    .mutation(({ input }) => PagosService.deleteTarifa(input)),

  // --- Adeudos (Calendario de Pagos) ---
  getAdeudos: lectura
    .input(z.object({
      alumnoId: z.number().int().positive(),
      estadoCobro: z.enum(['PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO']).optional()
    }))
    .query(({ input }) => PagosService.getAdeudosAlumno(input.alumnoId, input.estadoCobro)),

  createAdeudo: escritura
    .input(createCalendarioPagoSchema)
    .mutation(({ input }) => PagosService.createAdeudo(input)),

  updateAdeudo: escritura
    .input(updateCalendarioPagoSchema)
    .mutation(({ input }) => PagosService.updateAdeudo(input)),

  // --- Registro de Pagos ---
  registrarPago: escritura
    .input(registrarPagoSchema)
    .mutation(({ input, ctx }) => {
      // Tomar el registradorId directamente del token JWT decodificado en ctx
      const registradorId = (ctx as any).user?.usuarioId;
      if (!registradorId) throw new Error("No user in context");
      
      return PagosService.registrarPago(input, registradorId);
    })
});
