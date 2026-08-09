import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Navigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Star, Clock, X, ChevronRight, Loader2 } from 'lucide-react'
import { citasApi, resenasApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { formatCOP, formatDate, formatTime } from '@/lib/utils'

type Tab = 'proximas' | 'pasadas'

interface ResenaForm { estrellas: number; comentario: string }

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) || 'proximas')
  const [resenaModal, setResenaModal] = useState<{ citaId: string; barberoNombre: string } | null>(null)
  const [resenaForm, setResenaForm] = useState<ResenaForm>({ estrellas: 5, comentario: '' })
  const qc = useQueryClient()

  if (!loading && !user) return <Navigate to="/" replace />

  const { data: citasProximas } = useQuery({
    queryKey: ['mis-citas', 'proximas'],
    queryFn: () => citasApi.misCitas('CONFIRMADA'),
    select: (res) => res.data.citas,
    enabled: !!user,
  })

  const { data: citasPasadas } = useQuery({
    queryKey: ['mis-citas', 'pasadas'],
    queryFn: () => citasApi.misCitas(),
    select: (res) => res.data.citas.filter((c: any) => c.estado !== 'CONFIRMADA'),
    enabled: !!user,
  })

  const { mutate: cancelarCita, isPending: cancelando } = useMutation({
    mutationFn: (id: string) => citasApi.cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mis-citas'] }),
  })

  const { mutate: crearResena, isPending: enviandoResena } = useMutation({
    mutationFn: () => resenasApi.crear({ citaId: resenaModal!.citaId, ...resenaForm }),
    onSuccess: () => {
      setResenaModal(null)
      qc.invalidateQueries({ queryKey: ['mis-citas'] })
    },
  })

  const estadoBadge = (estado: string) => {
    const map: Record<string, { label: string; color: string }> = {
      CONFIRMADA: { label: 'Confirmada', color: '#4ade80' },
      COMPLETADA: { label: 'Completada', color: 'var(--color-sepia)' },
      CANCELADA: { label: 'Cancelada', color: 'var(--color-red)' },
      NO_SHOW: { label: 'No asistió', color: 'var(--color-gray)' },
    }
    const item = map[estado] || { label: estado, color: 'gray' }
    return (
      <span className="badge text-xs" style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}>
        {item.label}
      </span>
    )
  }

  const citas = tab === 'proximas' ? citasProximas : citasPasadas

  return (
    <div className="py-16 min-h-screen">
      <div className="page-container max-w-3xl">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-10">
          {user?.firebaseUser.photoURL ? (
            <img
              src={user.firebaseUser.photoURL}
              alt={user.firebaseUser.displayName || 'Usuario'}
              className="w-16 h-16 rounded-full border-2 border-[var(--color-sepia)]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-[var(--color-sepia)] flex items-center justify-center bg-[var(--color-bg-card)] text-3xl">
              👤
            </div>
          )}
          <div>
            <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>
              {user?.firebaseUser.displayName || 'Mi perfil'}
            </h1>
            <p className="text-[var(--color-gray)] text-sm">{user?.firebaseUser.email}</p>
            {user?.dbUser?.rol && (
              <span className="badge badge-active mt-1">{user.dbUser.rol}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-lg border border-[var(--color-border)] w-fit">
          {[
            { key: 'proximas', label: 'Próximas citas' },
            { key: 'pasadas', label: 'Historial' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`px-4 py-2 rounded text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-[var(--color-red)] text-white'
                  : 'text-[var(--color-gray)] hover:text-[var(--color-cream)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Citas */}
        {!citas ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
          </div>
        ) : citas.length === 0 ? (
          <div className="text-center py-16 card">
            <Calendar size={40} className="mx-auto mb-4 text-[var(--color-gray)]" />
            <p className="text-[var(--color-gray)]">
              {tab === 'proximas' ? 'No tienes citas próximas.' : 'No tienes citas anteriores.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {citas.map((cita: any) => (
              <div key={cita.id} className="card flex flex-col md:flex-row gap-4 items-start">
                {/* Date column */}
                <div className="flex-shrink-0 text-center w-14">
                  <div
                    className="text-2xl font-black leading-none"
                    style={{ fontFamily: 'var(--font-title)', color: 'var(--color-red)' }}
                  >
                    {format(new Date(cita.horaInicio), 'd')}
                  </div>
                  <div className="text-xs text-[var(--color-gray)] uppercase">
                    {format(new Date(cita.horaInicio), 'MMM', { locale: es })}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[var(--color-cream)]">{cita.servicio.nombre}</h3>
                      <p className="text-sm text-[var(--color-gray)]">
                        Con {cita.barbero.usuario.nombre}
                      </p>
                    </div>
                    {estadoBadge(cita.estado)}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-gray)]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {formatTime(cita.horaInicio)}
                    </span>
                    <span className="font-semibold text-[var(--color-sepia)]">
                      {formatCOP(cita.servicio.precio)}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {cita.estado === 'CONFIRMADA' && (
                      <button
                        onClick={() => cancelarCita(cita.id)}
                        disabled={cancelando}
                        className="btn btn-ghost text-xs text-[var(--color-red)] hover:bg-red-900/20 py-1 px-3"
                      >
                        {cancelando ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        Cancelar
                      </button>
                    )}
                    {cita.estado === 'COMPLETADA' && !cita.resena && (
                      <button
                        onClick={() => setResenaModal({ citaId: cita.id, barberoNombre: cita.barbero.usuario.nombre })}
                        className="btn btn-secondary text-xs py-1 px-3"
                      >
                        <Star size={12} /> Calificar
                      </button>
                    )}
                    {cita.resena && (
                      <div className="flex items-center gap-1 text-xs text-[var(--color-sepia)]">
                        <Star size={11} fill="currentColor" />
                        <span>{cita.resena.estrellas}/5 — Calificado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Review Modal ─────────────────────────────────────── */}
      {resenaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setResenaModal(null)}
        >
          <div
            className="card max-w-md w-full animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-cream)]">
                Calificar a {resenaModal.barberoNombre}
              </h3>
              <button onClick={() => setResenaModal(null)} className="text-[var(--color-gray)] hover:text-[var(--color-cream)]">
                <X size={18} />
              </button>
            </div>

            {/* Star selector */}
            <div className="flex gap-2 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setResenaForm((f) => ({ ...f, estrellas: star }))}
                  className={`text-3xl transition-transform hover:scale-125 ${
                    star <= resenaForm.estrellas ? 'text-[var(--color-sepia)]' : 'text-[var(--color-border)]'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="input mb-4 h-24 resize-none"
              placeholder="Comentario (opcional)"
              value={resenaForm.comentario}
              onChange={(e) => setResenaForm((f) => ({ ...f, comentario: e.target.value }))}
            />

            <button
              onClick={() => crearResena()}
              disabled={enviandoResena}
              className="btn btn-primary w-full"
            >
              {enviandoResena ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
              Enviar calificación
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
