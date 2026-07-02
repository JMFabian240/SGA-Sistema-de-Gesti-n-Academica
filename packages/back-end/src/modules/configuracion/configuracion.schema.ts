import { z } from 'zod';

export const updateConfigSchema = z.object({
  montoRecargoDefecto: z.number().min(0, 'El monto del recargo no puede ser negativo').optional(),
  diasGraciaRecargo: z.number().int().min(0, 'Los días de gracia no pueden ser negativos').optional(),
  plazoInscripcionDias: z.number().int().min(1, 'El plazo de inscripción debe ser al menos 1 día').optional(),
  umbralesSmtpDias: z.array(z.number().int().min(0)).max(5, 'Máximo 5 umbrales permitidos').optional(),
});

export type UpdateConfigInput = z.infer<typeof updateConfigSchema>;
