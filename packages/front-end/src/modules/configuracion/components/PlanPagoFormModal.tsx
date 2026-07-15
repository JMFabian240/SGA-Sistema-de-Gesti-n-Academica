import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../../lib/trpc'; 
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const planPagoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  meses: z.number().min(1, 'Debe ser al menos 1 mes').max(12, 'Máximo 12 meses'),
  montoMensual: z.number().min(0, 'No puede ser negativo'),
  montoDiciembre: z.number().min(0, 'No puede ser negativo').optional().nullable().transform(val => val === null ? undefined : val),
  descripcion: z.string().optional(),
  activo: z.boolean()
});

type PlanPagoForm = z.infer<typeof planPagoSchema>;

interface PlanPagoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  planPagoId?: number;
  initialData?: PlanPagoForm;
}

export function PlanPagoFormModal({ isOpen, onClose, planPagoId, initialData }: PlanPagoFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const utils = trpc.useContext();
  const createMutation = trpc.inscripciones.createPlanPago.useMutation();
  const updateMutation = trpc.inscripciones.updatePlanPago.useMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PlanPagoForm>({
    resolver: zodResolver(planPagoSchema),
    defaultValues: initialData || {
      nombre: '',
      meses: 10,
      montoMensual: 0,
      descripcion: '',
      activo: true
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          nombre: '',
          meses: 10,
          montoMensual: 0,
          descripcion: '',
          activo: true
        });
      }
      setSubmitError(null);
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: PlanPagoForm) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (planPagoId) {
        await updateMutation.mutateAsync({
          planPagoId,
          ...data
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      utils.inscripciones.getPlanesPago.invalidate();
      onClose();
    } catch (error: any) {
      setSubmitError(error.message || 'Error al guardar el plan de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800">
            {planPagoId ? 'Editar Plan de Pago' : 'Nuevo Plan de Pago'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {submitError}
            </div>
          )}

          <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre del Plan <span className="text-red-500">*</span></label>
              <Input
                {...register('nombre')}
                placeholder="Ej. Plan 10 Meses Base"
                className={errors.nombre ? 'border-red-300' : ''}
              />
              {errors.nombre && <span className="text-xs text-red-500 mt-1">{errors.nombre.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Número de Meses <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  {...register('meses', { valueAsNumber: true })}
                  className={errors.meses ? 'border-red-300' : ''}
                />
                {errors.meses && <span className="text-xs text-red-500 mt-1">{errors.meses.message}</span>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Monto Mensual Base <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('montoMensual', { valueAsNumber: true })}
                  className={errors.montoMensual ? 'border-red-300' : ''}
                />
                {errors.montoMensual && <span className="text-xs text-red-500 mt-1">{errors.montoMensual.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Monto Diciembre (Opcional)</label>
              <Input
                type="number"
                step="0.01"
                {...register('montoDiciembre', { 
                  setValueAs: v => v === "" ? undefined : parseFloat(v)
                })}
                placeholder="Ej. Si diciembre es distinto"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Descripción</label>
              <Input
                {...register('descripcion')}
                placeholder="Detalles adicionales"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activo"
                {...register('activo')}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="activo" className="text-sm text-gray-700 font-medium">
                Plan de pago activo
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-5 py-2"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="plan-form"
            isLoading={isSubmitting}
            variant="primary"
            className="rounded-xl px-5 py-2 font-medium"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
