import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string().email({ message: 'Debe ser un correo electrónico válido' }),
  contrasena: z.string().min(1, { message: 'La contraseña es requerida' })
});

export const tokenSchema = z.object({
  token: z.string().min(1, { message: 'El token es requerido' })
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TokenInput = z.infer<typeof tokenSchema>;
