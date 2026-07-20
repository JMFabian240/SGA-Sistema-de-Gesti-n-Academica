import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.usuario.findMany({
  select: { nombreUsuario: true }
}).then(u => console.dir(u, { depth: null })).finally(() => prisma.$disconnect());
