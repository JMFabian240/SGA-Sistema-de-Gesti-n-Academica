import cron from 'node-cron';
import { prisma, EstadoCobro } from '@sga/data-access';

export function initCronRecargos() {
  // Correr todos los días a las 00:05 AM
  cron.schedule('5 0 * * *', async () => {
    console.log('[CRON] Iniciando cálculo automático de recargos...');
    try {
      const configuracionesRecargo = await prisma.configuracionRecargo.findMany({
        where: { activo: true }
      });

      if (configuracionesRecargo.length === 0) {
        console.log('[CRON] No hay reglas específicas de recargo configuradas. Abortando.');
        return;
      }

      const hoy = new Date();
      
      const adeudosVencidos = await prisma.calendarioPago.findMany({
        where: {
          estadoCobro: { in: [EstadoCobro.VENCIDO, EstadoCobro.PENDIENTE] },
          montoRecargo: 0, 
          eliminadoEn: null
        }
      });

      let aplicados = 0;
      for (const adeudo of adeudosVencidos) {
        // Buscar si existe una regla aplicable a este concepto
        const regla = configuracionesRecargo.find(r => 
          adeudo.concepto.toLowerCase().includes(r.conceptoPago.toLowerCase())
        );

        if (!regla) continue; // No hay regla específica para este concepto (ej. Uniforme)

        const fechaLimite = new Date(adeudo.fechaVencimiento);
        fechaLimite.setDate(fechaLimite.getDate() + regla.diasGracia);

        if (hoy > fechaLimite) {
          // Aplicar recargo
          const nuevoMontoRecargo = Number(adeudo.montoRecargo) + Number(regla.monto);
          const nuevoSaldoPendiente = Number(adeudo.saldoPendiente) + Number(regla.monto);
          
          await prisma.calendarioPago.update({
            where: { calendarioPagoId: adeudo.calendarioPagoId },
            data: {
              montoRecargo: nuevoMontoRecargo,
              saldoPendiente: nuevoSaldoPendiente,
              estadoCobro: EstadoCobro.VENCIDO
            }
          });
          aplicados++;
        }
      }

      console.log(`[CRON] Recargos automáticos aplicados a ${aplicados} adeudos (basado en reglas específicas).`);
    } catch (err) {
      console.error('[CRON] Error calculando recargos:', err);
    }
  }, {
    timezone: "America/Mexico_City"
  });
}
