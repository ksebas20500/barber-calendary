import { useQuery } from '@tanstack/react-query'
import { Scissors, Users, Calendar, Star, TrendingUp } from 'lucide-react'
import { serviciosApi, barberosApi, citasApi } from '@/lib/api'

export default function AdminDashboardPage() {
  const { data: servicios } = useQuery({
    queryKey: ['admin-servicios'],
    queryFn: () => serviciosApi.adminGetAll(),
    select: (res) => res.data.servicios,
  })

  const { data: barberos } = useQuery({
    queryKey: ['admin-barberos'],
    queryFn: () => barberosApi.adminGetAll(),
    select: (res) => res.data.barberos,
  })

  const { data: citas } = useQuery({
    queryKey: ['admin-citas-dash'],
    queryFn: () => citasApi.adminGetAll(),
    select: (res) => res.data.citas,
  })

  const totalCitas = citas?.length || 0
  const citasCompletadas = citas?.filter((c: any) => c.estado === 'COMPLETADA').length || 0
  const citasCanceladas = citas?.filter((c: any) => c.estado === 'CANCELADA').length || 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>Panel de Administración</h1>
        <p className="text-sm text-[var(--color-gray)]">Resumen general de Barbería Denver</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Servicios Activos', value: servicios?.filter((s: any) => s.activo).length || 0, icon: <Scissors size={20} /> },
          { label: 'Barberos en Equipo', value: barberos?.filter((b: any) => b.activo).length || 0, icon: <Users size={20} /> },
          { label: 'Citas Totales', value: totalCitas, icon: <Calendar size={20} /> },
          { label: 'Citas Completadas', value: citasCompletadas, icon: <TrendingUp size={20} /> },
        ].map((m) => (
          <div key={m.label} className="card flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--color-gray)] mb-1">{m.label}</p>
              <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-title)', color: 'var(--color-cream)' }}>
                {m.value}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(200,169,110,0.1)] text-[var(--color-sepia)]">
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-[var(--color-cream)] mb-4">Métricas de Citas</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-gray)]">Completadas:</span>
              <span className="font-bold text-emerald-400">{citasCompletadas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-gray)]">Canceladas:</span>
              <span className="font-bold text-red-400">{citasCanceladas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--color-gray)]">Pendientes / Confirmadas:</span>
              <span className="font-bold text-[var(--color-sepia)]">
                {citas?.filter((c: any) => c.estado === 'CONFIRMADA').length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-[var(--color-cream)] mb-4">Información del Negocio</h3>
          <p className="text-xs text-[var(--color-gray)] leading-relaxed">
            Todas las citas y cobros son gestionados de forma presencial en la caja física de la barbería.
            Los recordatorios y disponibilidad en tiempo real están sincronizados en la base de datos Neon.
          </p>
        </div>
      </div>
    </div>
  )
}
