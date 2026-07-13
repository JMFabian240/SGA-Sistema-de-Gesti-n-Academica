import { PrismaClient } from '@prisma/client';
import { InscripcionesService } from '../../../../back-end/src/modules/inscripciones/inscripciones.service';

export const seedPlanesPago = async (prisma: PrismaClient) => {
  console.log('--- 01 Creando Planes de Pago ---');
  let plan10 = await prisma.planPago.findFirst({ where: { meses: 10 } });
  if (!plan10) {
    await InscripcionesService.createPlanPago({
      nombre: 'Plan 10 Meses',
      meses: 10,
      montoMensual: 2500,
      activo: true
    });
  }

  let plan12 = await prisma.planPago.findFirst({ where: { meses: 12 } });
  if (!plan12) {
    await InscripcionesService.createPlanPago({
      nombre: 'Plan 12 Meses',
      meses: 12,
      montoMensual: 2200,
      activo: true
    });
  }
};
