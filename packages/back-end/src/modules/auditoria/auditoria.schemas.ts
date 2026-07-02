import { z } from 'zod';

export const ObtenerLogsSchema = z.object({
  pagina: z.number().min(1).default(1),
  limite: z.number().min(1).max(100).default(50),
  usuarioId: z.number().optional(),
  tablaAfectada: z.string().optional(),
  accion: z.enum(['INSERT', 'UPDATE', 'DELETE']).optional(),
  fechaInicio: z.string().datetime().optional(),
  fechaFin: z.string().datetime().optional(),
});
