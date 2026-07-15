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
        <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {submitError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
              <span className="font-bold flex-shrink-0">Error:</span> {submitError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Nombre del Plan</label>
            <Input
              {...register('nombre')}
              placeholder="Ej. Plan 10 Meses Especial"
              className="rounded-xl"
            />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Meses</label>
            <Input
              type="number"
              {...register('meses', { valueAsNumber: true })}
              placeholder="Ej. 10 o 12"
              className="rounded-xl"
            />
            {errors.meses && <p className="text-xs text-red-500">{errors.meses.message}</p>}
            <p className="text-xs text-gray-500 mt-1">Cantidad de meses a dividir la colegiatura anual.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">Descripción (Opcional)</label>
            <textarea
              {...register('descripcion')}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-500 outline-none text-sm min-h-[80px]"
              placeholder="Detalles adicionales del plan..."
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
