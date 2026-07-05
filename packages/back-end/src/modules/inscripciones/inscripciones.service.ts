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

    if (existente) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'El alumno ya se encuentra inscrito en este ciclo escolar.'
      });
    }

    return InscripcionesRepository.createInscripcion({
      ...input,
      fechaIngreso: new Date(input.fechaIngreso)
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
