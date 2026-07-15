import { useState } from 'react';
import { trpc } from '../../../lib/trpc'; 
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { PlanPagoFormModal } from './PlanPagoFormModal';

export function PlanesPagoPanel() {
  const { data: planes, isLoading } = trpc.inscripciones.getPlanesPago.useQuery();
  const utils = trpc.useContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const deletePlanMutation = trpc.inscripciones.deletePlanPago.useMutation({
    onSuccess: () => {
      utils.inscripciones.getPlanesPago.invalidate();
    }
  });

  const handleOpenNew = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este plan de pago de forma lógica?')) {
      deletePlanMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="font-bold text-navy-800 text-lg">Planes de Pago</h3>
          <p className="text-xs text-gray-500">
            Configura los planes de financiamiento (meses, monto base, mensualidades) disponibles para asignar a los alumnos.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nuevo Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={18} /> Cargando planes de pago...
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nombre del Plan</th>
                  <th className="px-6 py-4 font-semibold text-center">Meses</th>
                  <th className="px-6 py-4 font-semibold text-right">Monto Mensual ($)</th>
                  <th className="px-6 py-4 font-semibold text-center">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {planes?.map((p: any) => (
                  <tr key={p.planPagoId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-navy-800">
                      {p.nombre}
                      {p.descripcion && <p className="text-xs text-gray-500 font-normal mt-1">{p.descripcion}</p>}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 font-medium">
                      {p.meses}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700 font-medium">
                      ${Number(p.montoMensual).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.activo 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-navy-600 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar Plan"
                        >
                          <Edit2 size={15} />
                        </button>
                        {p.activo && (
                          <button
                            onClick={() => handleDelete(p.planPagoId)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="Desactivar Plan"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {planes?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No hay planes de pago registrados. Crea uno nuevo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PlanPagoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planPagoId={editingPlan?.planPagoId}
        initialData={editingPlan ? {
          nombre: editingPlan.nombre,
          meses: editingPlan.meses,
          montoMensual: Number(editingPlan.montoMensual),
          montoDiciembre: editingPlan.montoDiciembre ? Number(editingPlan.montoDiciembre) : undefined,
          descripcion: editingPlan.descripcion || '',
          activo: editingPlan.activo
        } : undefined}
      />
    </div>
  );
}
