import { TRPCError } from '@trpc/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@sga/data-access';
import type {
  CreateTarifaInput, UpdateTarifaInput,
  CreateCalendarioPagoInput, UpdateCalendarioPagoInput,
  RegistrarPagoInput, CreateCargoExtraordinarioInput,
  AdjuntarComprobanteInput
} from './pagos.schema';
import { PagosRepository } from './pagos.repository';

export class PagosService {

  // --- Tarifas ---
  static async getTarifas(cicloId?: number, nivelId?: number) {
    return PagosRepository.getTarifas(cicloId, nivelId);
  }

  static async createTarifa(input: CreateTarifaInput) {
    return PagosRepository.createTarifa(input);
  }

  static async updateTarifa(input: UpdateTarifaInput) {
    const { tarifaId, ...data } = input;
    return PagosRepository.updateTarifa(tarifaId, { ...data, actualizadoEn: new Date() });
  }

  static async deleteTarifa(tarifaId: number) {
    return PagosRepository.deleteTarifa(tarifaId);
  }

  // --- Calendario de Pagos (Adeudos) ---
  static calcularEstadoAbono(adeudo: any) {
    if (adeudo.estadoCobro === 'PENDIENTE' && Number(adeudo.montoPagado) > 0 && Number(adeudo.saldoPendiente) > 0) {
      return { ...adeudo, estadoCobro: 'ABONO' };
    }
    return adeudo;
  }

  static async getAdeudosAlumno(alumnoId: number, estadoCobro?: 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'CANCELADO' | 'ABONO') {
    let dbEstado = estadoCobro;
    if (estadoCobro === 'ABONO') {
      dbEstado = 'PENDIENTE';
    }
    const adeudos = await PagosRepository.getAdeudosAlumno(alumnoId, dbEstado as any);
    const adeudosMapeados = adeudos.map(this.calcularEstadoAbono);
    
    if (estadoCobro === 'ABONO') {
      return adeudosMapeados.filter((a: any) => a.estadoCobro === 'ABONO');
    }
    return adeudosMapeados;
  }

  static async createAdeudo(input: CreateCalendarioPagoInput) {
    return PagosRepository.createAdeudo({
      ...input,
      fechaVencimiento: new Date(input.fechaVencimiento),
      estadoCobro: input.saldoPendiente > 0 ? 'PENDIENTE' : 'PAGADO'
    });
  }

  static async updateAdeudo(input: UpdateCalendarioPagoInput) {
    const { calendarioPagoId, fechaVencimiento, ...data } = input;
    return PagosRepository.updateAdeudo(calendarioPagoId, {
      ...data,
      ...(fechaVencimiento && { fechaVencimiento: new Date(fechaVencimiento) }),
      actualizadoEn: new Date()
    });
  }

  // --- Registro de Pagos y Cargos Extraordinarios ---
  static async createCargoExtraordinario(input: CreateCargoExtraordinarioInput) {
    return PagosRepository.createAdeudo({
      alumnoId: input.alumnoId,
      cicloId: input.cicloId,
      concepto: input.concepto,
      mes: null, // Los cargos extra no están ligados a un mes específico
      fechaVencimiento: new Date(input.fechaVencimiento),
      montoOriginal: input.monto,
      saldoPendiente: input.monto,
      estadoCobro: 'PENDIENTE'
    });
  }

  static async registrarPago(input: RegistrarPagoInput, registradorId: number) {
    // Calcular suma de aplicaciones para validar contra el monto total
    const totalAplicado = input.aplicaciones.reduce((acc, app) => acc + app.montoAplicado, 0);

    // Buscar todos los adeudos pendientes del alumno para aplicar excedentes si los hay
    let surplus = input.montoTotal - totalAplicado;
    
    if (surplus < 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'El monto total del pago es menor que la suma de las aplicaciones indicadas.'
      });
    }

    if (surplus > 0) {
      // Buscar adeudos pendientes ordenados por fecha
      const pendientes = await prisma.calendarioPago.findMany({
        where: {
          alumnoId: input.alumnoId,
          eliminadoEn: null,
          estadoCobro: 'PENDIENTE'
        },
        orderBy: { fechaVencimiento: 'asc' }
      });

      for (const adeudo of pendientes) {
        if (surplus <= 0) break;

        // Verificar si ya viene en las aplicaciones explícitas y cuánto se le aplicó
        const appImplicita = input.aplicaciones.find(a => a.calendarioPagoId === adeudo.calendarioPagoId);
        const yaAplicado = appImplicita ? appImplicita.montoAplicado : 0;
        
        // Cuánto le falta por pagar a este adeudo
        const faltaPorPagar = Number(adeudo.saldoPendiente) - yaAplicado;

        if (faltaPorPagar > 0) {
          const aplicarAhora = Math.min(surplus, faltaPorPagar);
          
          if (appImplicita) {
            appImplicita.montoAplicado += aplicarAhora;
          } else {
            input.aplicaciones.push({
              calendarioPagoId: adeudo.calendarioPagoId,
              montoAplicado: aplicarAhora,
              aplicadoA: 'CAPITAL' // Concepto por defecto para excedentes automáticos
            });
          }
          surplus -= aplicarAhora;
        }
      }

      // Si aún sobra dinero después de cubrir todos los adeudos
      if (surplus > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El pago excede el total de todas las deudas pendientes del alumno.'
        });
      }
    }

    // Por regla de negocio impuesta, el saldo a favor generado será siempre 0
    const saldoAFavorGenerado = 0;

    // Delegar transacción al repositorio
    const resultadoPago = await PagosRepository.registrarPagoTransaccion({
      pagoData: {
        alumnoId: input.alumnoId,
        tutorId: input.tutorId,
        fechaPago: new Date(input.fechaPago),
        montoTotal: input.montoTotal,
        metodoPago: input.metodoPago,
        aplicadoASaldo: input.aplicadoASaldo,
        // @ts-ignore - requiereFactura existe en el esquema Prisma, el cliente podría requerir re-generación
        requiereFactura: input.requiereFactura,
        observaciones: input.observaciones,
        registradoPor: registradorId
      },
      aplicaciones: input.aplicaciones,
      saldoAFavorGenerado,
      tutorId: input.tutorId,
      registradorId
    });

    // Si viene comprobante adjunto
    if (input.comprobanteBase64 && input.comprobanteNombre && input.comprobanteMime) {
      try {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'comprobantes');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Limpiar el base64 si trae prefijo 'data:image/jpeg;base64,'
        const base64Data = input.comprobanteBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${Date.now()}-${input.comprobanteNombre}`;
        const rutaCompleta = path.join(uploadsDir, filename);

        fs.writeFileSync(rutaCompleta, buffer);

        // Guardar el registro Documento en BD
        await prisma.documento.create({
          data: {
            tipoDocumento: 'COMPROBANTE_PAGO',
            nombreOriginal: input.comprobanteNombre,
            rutaAlmacen: `uploads/comprobantes/${filename}`,
            mimeType: input.comprobanteMime,
            tamanoBytes: buffer.length,
            pagoId: resultadoPago.pagoId,
            alumnoId: input.alumnoId,
            subidoPor: registradorId
          }
        });
      } catch (error) {
        console.error('Error al guardar el comprobante adjunto:', error);
        // Podríamos fallar o dejarlo pasar. Siendo opcional, lo registramos como error sin tirar la tx.
      }
    }

    return resultadoPago;
  }

  static async getReciboPago(pagoId: number) {
    const pago = await PagosRepository.getReciboPago(pagoId);
    if (!pago) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Recibo de pago no encontrado.'
      });
    }
    return pago;
  }

  static async adjuntarComprobante(input: AdjuntarComprobanteInput, subidoPorId: number) {
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'comprobantes');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const base64Data = input.comprobanteBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${Date.now()}-${input.comprobanteNombre}`;
      const rutaCompleta = path.join(uploadsDir, filename);

      fs.writeFileSync(rutaCompleta, buffer);

      const documento = await prisma.documento.create({
        data: {
          tipoDocumento: 'COMPROBANTE_PAGO',
          nombreOriginal: input.comprobanteNombre,
          rutaAlmacen: `uploads/comprobantes/${filename}`,
          mimeType: input.comprobanteMime,
          tamanoBytes: buffer.length,
          pagoId: input.pagoId,
          alumnoId: input.alumnoId,
          subidoPor: subidoPorId
        }
      });
      return { success: true, documentoId: documento.documentoId };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'No se pudo guardar el comprobante.'
      });
    }
  }

  static async getComprobanteBase64(pagoId: number) {
    const documento = await prisma.documento.findFirst({
      where: { pagoId, tipoDocumento: 'COMPROBANTE_PAGO' },
      orderBy: { documentoId: 'desc' }
    });

    if (!documento) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'No hay comprobante asociado.' });
    }

    try {
      const rutaCompleta = path.join(process.cwd(), documento.rutaAlmacen);
      const buffer = fs.readFileSync(rutaCompleta);
      const base64 = buffer.toString('base64');
      return {
        base64: `data:${documento.mimeType};base64,${base64}`,
        nombre: documento.nombreOriginal,
        mime: documento.mimeType
      };
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'No se pudo leer el archivo físico.' });
    }
  }
}
