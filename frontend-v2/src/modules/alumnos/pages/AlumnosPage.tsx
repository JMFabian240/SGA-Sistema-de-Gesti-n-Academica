import { Plus, Search } from 'lucide-react';
import { trpc } from '../../../lib/trpc';
import { useNavigate } from 'react-router-dom';

export function AlumnosPage() {
  const navigate = useNavigate();
  const { data: alumnos, isLoading } = trpc.alumnos.getAll.useQuery();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Alumnos</h2>
          <p className="text-gray-500">Gestión de estudiantes matriculados</p>
        </div>
        <button
          onClick={() => { }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Nuevo Alumno
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Cargando alumnos...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">CURP</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnos?.map((a: any) => (
                  <tr key={a.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer" onClick={() => navigate(`/alumnos/${a.id}`)}>
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {a.nombre.charAt(0)}
                      </div>
                      {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{a.curp}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${a.estado === 'ACTIVO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {a.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
