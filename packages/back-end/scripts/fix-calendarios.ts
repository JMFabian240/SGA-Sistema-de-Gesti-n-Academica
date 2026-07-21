import { PrismaClient } from '@prisma/client';
import { CalculadoraPagos } from '../src/modules/inscripciones/inscripciones.utils';

const prisma = new PrismaClient();

async function fixCalendarios() {
  console.log('Iniciando corrección de calendarios de pago...');
  
  // 1. Encontrar inscripciones con planPagoId asignado
  const inscripciones = await prisma.inscripcionCiclo.findMany({
    where: {
      planPagoId: { not: null }
    },
    include: {
      alumno: true,
      ciclo: true,
      planPago: true
    }
  });

  console.log(`Se encontraron ${inscripciones.length} inscripciones con plan de pago.`);
  
  const configGlobal = await prisma.configuracionGlobal.findFirst({ where: { configuracionId: 1 } });
  const diaVencimiento = configGlobal?.diaVencimientoMensual || 1;

  let corregidos = 0;

  for (const inscripcion of inscripciones) {
    if (!inscripcion.planPago || inscripcion.planPago.eliminadoEn) continue;

    // 2. Comprobar si ya tiene calendario (adeudos) generados para ese ciclo
    const countAdeudos = await prisma.calendarioPago.count({
      where: {
        alumnoId: inscripcion.alumnoId,
        cicloId: inscripcion.cicloId,
        eliminadoEn: null
      }
    });

    // 3. Si no tiene, generarlos
    if (countAdeudos === 0) {
      const tarifas = await prisma.tarifa.findMany({
        where: {
          cicloId: inscripcion.cicloId,
          nivelId: inscripcion.alumno.nivelId,
          activa: true,
          eliminadoEn: null
        }
      });
      
      const tarifasParaCalculadora = tarifas.map(t => ({ concepto: t.concepto, monto: Number(t.monto) }));
      const planBase = { meses: inscripcion.planPago.meses };
      const añoInicio = new Date(inscripcion.ciclo.fechaInicio).getFullYear();
      
      const adeudosCalculados = CalculadoraPagos.generarCalendario(
        planBase, 
        tarifasParaCalculadora, 
        new Date(inscripcion.fechaIngreso), 
        diaVencimiento, 
        null, 
        añoInicio
      );
      
      const adeudosParaInsertar = adeudosCalculados.map((a: any) => ({
        alumnoId: inscripcion.alumnoId,
        cicloId: inscripcion.cicloId,
        ...a
      }));
      
      await prisma.calendarioPago.createMany({ data: adeudosParaInsertar as any });
      console.log(`Calendario generado para el alumno: ${inscripcion.alumno.nombreCompleto} (Ciclo ID: ${inscripcion.cicloId})`);
      corregidos++;
    }
  }

  console.log(`================================`);
  console.log(`Proceso completado. Se corrigieron ${corregidos} alumnos.`);
}

fixCalendarios()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
