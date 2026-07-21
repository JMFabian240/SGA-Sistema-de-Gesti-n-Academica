import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Iniciando saneamiento de recargos...');

  // 1. Obtener todas las configuraciones de recargos activas
  const configuracionesRecargo = await prisma.configuracionRecargo.findMany({
    where: { activo: true }
  });

  console.log(`Se encontraron ${configuracionesRecargo.length} reglas específicas de recargo.`);

  // 2. Obtener todos los adeudos que actualmente tienen recargo > 0
  const adeudosConRecargo = await prisma.calendarioPago.findMany({
    where: {
      montoRecargo: { gt: 0 },
      eliminadoEn: null
    }
  });

  console.log(`Se encontraron ${adeudosConRecargo.length} adeudos con recargo aplicado actualmente.`);

  let revertidos = 0;
  let reajustados = 0;

  for (const adeudo of adeudosConRecargo) {
    // Revisar si el concepto del adeudo hace match con alguna regla específica
    const reglaAplicable = configuracionesRecargo.find(r => 
      adeudo.concepto.toLowerCase().includes(r.conceptoPago.toLowerCase())
    );

    if (!reglaAplicable) {
      // Si no hay regla aplicable para este concepto (ej. "Uniforme"), revertir el recargo a 0.
      const montoRecargoRestar = Number(adeudo.montoRecargo);
      const nuevoSaldoPendiente = Number(adeudo.saldoPendiente) - montoRecargoRestar;

      await prisma.calendarioPago.update({
        where: { calendarioPagoId: adeudo.calendarioPagoId },
        data: {
          montoRecargo: 0,
          saldoPendiente: nuevoSaldoPendiente
        }
      });
      revertidos++;
    } else {
      // Opcional: si queremos asegurar que el recargo sea el configurado,
      // podríamos hacerlo aquí, pero asumiendo que el cron falló globalmente,
      // y si aplicó 400 y la regla dice 400, está bien por ahora.
      // Aquí nos enfocamos en limpiar los "falsos positivos" (conceptos sin reglas).
      reajustados++;
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Resultado: ${revertidos} adeudos fueron revertidos (no tenían regla específica).`);
  console.log(`Resultado: ${reajustados} adeudos mantuvieron su recargo (coincidían con regla específica).`);
  console.log('Saneamiento completado.');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
