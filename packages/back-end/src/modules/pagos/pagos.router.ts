import { router, protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { PagosService } from './pagos.service';
import { 
  createTarifaSchema, updateTarifaSchema, 
  createCalendarioPagoSchema, updateCalendarioPagoSchema, 
  registrarPagoSchema 
} from './pagos.schema';

export const pagosRouter = router({
  
  // --- Tarifas ---
  getTarifas: protectedProcedure
    .input(z.object({
      cicloId: z.number().int().positive().optional(),
      nivelId: z.number().int().positive().optional()
    }).optional())
    .query(({ input }) => {
      return PagosService.getTarifas(input?.cicloId, input?.nivelId);
    }),

  createTarifa: protectedProcedure
    .input(createTarifaSchema)
    .mutation(({ input }) => PagosService.createTarifa(input)),

  updateTarifa: protectedProcedure
    .input(updateTarifaSchema)
    .mutation(({ input }) => PagosService.updateTarifa(input)),

  deleteTarifa: protectedProcedure
    .input(z.number().int().positive())
    .mutation(({ input }) => PagosService.deleteTarifa(input)),

  // --- Adeudos (Calendario de Pagos) ---
  getAdeudos: protectedProcedure
    .input(z.object({
      alumnoId: z.number().int().positive(),
      estadoCobro: z.enum(['PENDIENTE', 'PAGADO', 'VENCIDO', 'CANCELADO']).optional()
    }))
    .query(({ input }) => PagosService.getAdeudosAlumno(input.alumnoId, input.estadoCobro)),

  createAdeudo: protectedProcedure
    .input(createCalendarioPagoSchema)
    .mutation(({ input }) => PagosService.createAdeudo(input)),

  updateAdeudo: protectedProcedure
    .input(updateCalendarioPagoSchema)
    .mutation(({ input }) => PagosService.updateAdeudo(input)),

  // --- Registro de Pagos ---
  registrarPago: protectedProcedure
    .input(registrarPagoSchema)
    .mutation(({ input, ctx }) => {
      // Tomar el registradorId directamente del token JWT decodificado en ctx
      const registradorId = ctx.user?.usuarioId;
      if (!registradorId) throw new Error("No user in context");
      
      return PagosService.registrarPago(input, registradorId);
    })
});
