import { Users, AlertTriangle, TrendingUp, Award, CreditCard, BarChart3, Clock, UserPlus, GraduationCap, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useAuthStore } from '../../../store/useAuthStore';
import { trpc } from '../../../lib/trpc';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role?.toUpperCase() || '';
  const isDocente = role == 'DOCENTE';
  const isAdmin = role === 'ADMIN' || role === 'ADMINISTRADOR';

  // Obtener datos vía tRPC
  const { data: metricasInscripcion, isLoading: loadingInscripcion } = trpc.dashboard.obtenerMetricasInscripcion.useQuery(undefined, { enabled: isAdmin });
  const { data: kpisFinancieros, isLoading: loadingKpis } = trpc.dashboard.obtenerKpisFinancieros.useQuery(undefined, { enabled: isAdmin });

  const loading = loadingInscripcion || loadingKpis;

  // Mock data for charts since backend only gives aggregated KPI
  const chartData = [
    { name: 'Lun', total: 1500 },
    { name: 'Mar', total: 2300 },
    { name: 'Mié', total: 800 },
    { name: 'Jue', total: 3500 },
    { name: 'Vie', total: 4200 },
    { name: 'Sáb', total: 0 },
    { name: 'Dom', total: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Panel Administrativo</h2>
          <p className="text-gray-500">Resumen operativo {isDocente ? 'académico' : 'y financiero del día'}</p>
        </div>
        {!isDocente && (
          <button
            onClick={() => navigate('/pagos')}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            <CreditCard size={18} /> Pago Rápido
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isDocente ? 'lg:grid-cols-1' : 'lg:grid-cols-4'} gap-6`}>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-0.5">Total Alumnos</h3>
            <p className="text-2xl font-bold text-gray-800">
              {loading ? '...' : (metricasInscripcion?.alumnosActivos || 0)}
            </p>
          </div>
        </div>

        {!isDocente && (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-0.5">Ingresos del Mes</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : `$${Number(kpisFinancieros?.ingresosMesActual || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-0.5">Deuda Pendiente</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : `$${Number(kpisFinancieros?.deudaPendienteTotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium mb-0.5">Cupos Totales</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : (metricasInscripcion?.cuposTotales || 0)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {!isDocente && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-gray-600" size={20} />
              <h3 className="font-bold text-lg text-gray-800">Ingresos de la Semana</h3>
            </div>
            <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 'Total']}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.total > 0 ? '#10b981' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="text-gray-600" size={20} />
              <h3 className="font-bold text-lg text-gray-800">Actividad Reciente</h3>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <UserPlus size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Nuevo alumno inscrito</p>
                  <p className="text-xs text-gray-500 mt-0.5">Hace 2 horas</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pago de colegiatura recibido</p>
                  <p className="text-xs text-gray-500 mt-0.5">Hace 5 horas</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Evaluaciones actualizadas</p>
                  <p className="text-xs text-gray-500 mt-0.5">Ayer</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
              Ver todo el historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

