import { prisma } from '@sga/data-access';
import { TRPCError } from '@trpc/server';
import type { 
  CreatePlanPagoInput, UpdatePlanPagoInput, 
  CreateVentanaInscripcionInput, UpdateVentanaInscripcionInput, 
  CreateInscripcionInput, UpdateInscripcionInput 
} from './inscripciones.schema';
import { InscripcionesRepository } from './inscripciones.repository';

export class InscripcionesService {
  // --- Planes de Pago ---
  static async getPlanesPago() {
    return InscripcionesRepository.getPlanesPago();
  }

  static async createPlanPago(input: CreatePlanPagoInput) {
    return InscripcionesRepository.createPlanPago(input);
  }

  static async updatePlanPago(input: UpdatePlanPagoInput) {
    const { planPagoId, ...data } = input;
    return InscripcionesRepository.updatePlanPago(planPagoId, { ...data, actualizadoEn: new Date() });
  }

  static async deletePlanPago(planPagoId: number) {
    return InscripcionesRepository.deletePlanPago(planPagoId);
  }

  // --- Ventanas de Inscripción Temprana ---
  static async getVentanas() {
    return InscripcionesRepository.getVentanas();
  }

  static async createVentana(input: CreateVentanaInscripcionInput) {
    return InscripcionesRepository.createVentana({
      ...input,
      fechaInicio: new Date(input.fechaInicio),
      fechaFin: new Date(input.fechaFin)
    });
  }

  static async updateVentana(input: UpdateVentanaInscripcionInput) {
    const { ventanaId, fechaInicio, fechaFin, ...data } = input;
    return InscripcionesRepository.updateVentana(ventanaId, {
      ...data,
      ...(fechaInicio && { fechaInicio: new Date(fechaInicio) }),
      ...(fechaFin && { fechaFin: new Date(fechaFin) }),
      actualizadoEn: new Date()
    });
  }

  static async deleteVentana(ventanaId: number) {
    return InscripcionesRepository.deleteVentana(ventanaId);
  }

  // --- Inscripciones de Alumnos ---
  static async getInscripciones(cicloId?: number) {
    return InscripcionesRepository.getInscripciones(cicloId);
  }

  static async createInscripcion(input: CreateInscripcionInput) {
    const existente = await InscripcionesRepository.findInscripcionUnique(input.alumnoId, input.cicloId);

    if (existente && !existente.eliminadoEn) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'El alumno ya se encuentra inscrito en este ciclo escolar.'
      });
    }

    // GAP 3: Validar materias reprobadas del ciclo anterior
    const reprobadas = await prisma.calificacion.findFirst({
      where: {
        alumnoId: input.alumnoId,
        OR: [
          { valorNumerico: { lt: 6.0 } },
          { valorCualitativo: 'NA' }
        ]
      }
    });

    if (reprobadas) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'El alumno tiene materias reprobadas y no puede ser inscrito.'
      });
    }

    // Validar cupo del grupo si se proporciona grupoId
    if (input.grupoId) {
      const grupo = await prisma.grupo.findUnique({
        where: { grupoId: input.grupoId },
        include: {
          inscripciones: {
            where: { eliminadoEn: null }
          }
        }
      });

      if (!grupo || grupo.eliminadoEn) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'El grupo seleccionado no existe o ha sido eliminado.'
        });
      }

      if (grupo.inscripciones.length >= grupo.cupoMaximo) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `El grupo ${grupo.nombre} ya ha alcanzado su cupo máximo de ${grupo.cupoMaximo} alumnos.`
        });
      }
    }

    const planPago = await prisma.planPago.findUnique({ where: { planPagoId: input.planPagoId } });
    if (!planPago || planPago.eliminadoEn) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Plan de pago no encontrado.' });
    }

    return prisma.$transaction(async (tx) => {
      // 1. Crear Inscripcion
      const inscripcion = await tx.inscripcionCiclo.create({
        data: {
          ...input,
          fechaIngreso: new Date(input.fechaIngreso)
        },
        include: { alumno: true, grupo: true }
      });

      // 2. Generar Adeudos (GAP 2)
      const meses10 = ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
      const meses12 = ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];
      
      const mesesToUse = planPago.meses === 12 ? meses12 : meses10;
      const adeudos = [];
      
      for (let i = 0; i < mesesToUse.length; i++) {
        const mesStr = mesesToUse[i];
        let monto = Number(planPago.montoMensual);
        
        if (planPago.meses === 12) {
          if (mesStr === 'Diciembre') {
            monto = planPago.montoDiciembre ? Number(planPago.montoDiciembre) : monto * 2;
          } else if (mesStr === 'Julio') {
            monto = 0;
          }
        }
        
        const fechaVencimiento = new Date(input.fechaIngreso);
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i + 1);
        
        adeudos.push({
          alumnoId: input.alumnoId,
          cicloId: input.cicloId,
          concepto: `Colegiatura ${mesStr}`,
          mes: mesStr,
          fechaVencimiento,
          montoOriginal: monto,
          saldoPendiente: monto,
          estadoCobro: monto === 0 ? 'PAGADO' : 'PENDIENTE'
        });
      }
      
      await tx.calendarioPago.createMany({ data: adeudos as any });
      
      return inscripcion;
    });
  }

  static async updateInscripcion(input: UpdateInscripcionInput) {
    const { inscripcionId, fechaIngreso, ...data } = input;
    
    const inscripcion = await InscripcionesRepository.findInscripcionById(inscripcionId);

    if (!inscripcion || inscripcion.eliminadoEn) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Inscripción no encontrada' });
    }

    return InscripcionesRepository.updateInscripcion(inscripcionId, {
      ...data,
      ...(fechaIngreso && { fechaIngreso: new Date(fechaIngreso) }),
      actualizadoEn: new Date()
    });
  }

  static async deleteInscripcion(inscripcionId: number) {
    return InscripcionesRepository.deleteInscripcion(inscripcionId);
  }
}
