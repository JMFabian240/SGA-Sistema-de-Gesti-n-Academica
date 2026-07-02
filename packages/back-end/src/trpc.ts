import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import jwt from 'jsonwebtoken';

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware de autenticación
export const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'No se proporcionó un token de acceso' });
  }
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
    // Se espera que el token tenga un identificador único jti
    const decoded = jwt.verify(ctx.token, JWT_SECRET) as { usuarioId: number, jti: string };
    
    // Verificar si el token (jti) fue revocado
    if (decoded.jti) {
      const isRevoked = await ctx.prisma.tokenRevocado.findUnique({
        where: { jti: decoded.jti }
      });
      
      if (isRevoked) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'El token ha sido revocado' });
      }
    }

    return next({
      ctx: {
        ...ctx,
        user: decoded,
      },
    });
  } catch (error) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Token inválido o expirado' });
  }
});

export const protectedProcedure = t.procedure.use(isAuthed);
