import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Loader2, X, Check, Clock, Star } from 'lucide-react'
import { barberosApi } from '@/lib/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getDiaSemana } from '@/lib/utils'

const barberoSchema = z.object({
  usuarioId: z.string().min(1, 'El ID de usuario o email es requerido'),
  especialidad: z.string().min(2, 'Especialidad requerida'),
  fotoUrl: z.string().url().optional().or(z.literal('')),
  activo: z.boolean(),
})

type BarberoFormData = z.infer<typeof barberoSchema>

interface HorarioItem {
  diaSemana: number
  horaInicio: string
  horaFin: string
  disponible: boolean
}

export default function AdminBarberosPage() {
  const qc = useQueryClient()
  const [modalBarbero, setModalBarbero] = useState<{ mode: 'create' | 'edit'; barbero?: any } | null>(null)
  const [modalHorario, setModalHorario] = useState<{ barberoId: string; nombre: string; horarios: HorarioItem[] } | null>(null)

  const { data: barberos, isLoading } = useQuery({
    queryKey: ['admin-barberos'],
    queryFn: () => barberosApi.adminGetAll(),
    select: (res) => res.data.barberos,
  })

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm<BarberoFormData>({
    resolver: zodResolver(barberoSchema),
  })

  const { mutate: guardarBarbero, isPending: guardandoBarbero } = useMutation({
    mutationFn: (data: BarberoFormData) =>
      modalBarbero?.mode === 'edit'
        ? barberosApi.update(modalBarbero.barbero.id, data)
        : barberosApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-barberos'] })
      setModalBarbero(null)
      resetForm()
    },
  })

  const { mutate: desactivarBarbero } = useMutation({
    mutationFn: (id: string) => barberosApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-barberos'] }),
  })

  const { mutate: guardarHorarios, isPending: guardandoHorarios } = useMutation({
    mutationFn: (data: { barberoId: string; horarios: HorarioItem[] }) =>
      barberosApi.updateHorarios(data.barberoId, { horarios: data.horarios }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-barberos'] })
      setModalHorario(null)
    },
  })

  const openCreate = () => {
    resetForm({ usuarioId: '', especialidad: 'Barbero', fotoUrl: '', activo: true })
    setModalBarbero({ mode: 'create' })
  }

  const openEdit = (b: any) => {
    resetForm({ usuarioId: b.usuarioId, especialidad: b.especialidad, fotoUrl: b.fotoUrl || '', activo: b.activo })
    setModalBarbero({ mode: 'edit', barbero: b })
  }

  const openHorarios = (b: any) => {
    // Default 7 days if none exist
    const horariosBase: HorarioItem[] = Array.from({ length: 7 }).map((_, diaSemana) => {
      const hExistente = b.horarios?.find((h: any) => h.diaSemana === diaSemana)
      return (
        hExistente || {
          diaSemana,
          horaInicio: '09:00',
          horaFin: '17:00',
          disponible: diaSemana !== 0, // domingo libre por defecto
        }
      )
    })
    setModalHorario({ barberoId: b.id, nombre: b.usuario.nombre, horarios: horariosBase })
  }

  const toggleDiaDisponible = (index: number) => {
    if (!modalHorario) return
    const updated = [...modalHorario.horarios]
    updated[index].disponible = !updated[index].disponible
    setModalHorario({ ...modalHorario, horarios: updated })
  }

  const updateHora = (index: number, field: 'horaInicio' | 'horaFin', val: string) => {
    if (!modalHorario) return
    const updated = [...modalHorario.horarios]
    updated[index][field] = val
    setModalHorario({ ...modalHorario, horarios: updated })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>Gestión de barberos</h1>
          <p className="text-sm text-[var(--color-gray)]">{barberos?.length || 0} barberos en equipo</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={16} /> Agregar barbero
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barberos?.map((b: any) => (
            <div key={b.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] overflow-hidden flex items-center justify-center bg-[var(--color-bg)]"
                    >
                      {b.fotoUrl ? (
                        <img src={b.fotoUrl} alt={b.usuario.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">💈</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-cream)]">{b.usuario.nombre}</h3>
                      <p className="text-xs text-[var(--color-gray)]">{b.especialidad}</p>
                    </div>
                  </div>
                  <span className={`badge ${b.activo ? 'badge-active' : 'badge-inactive'}`}>
                    {b.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[var(--color-gray)] mb-4">
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="text-[var(--color-cream)]">{b.usuario.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Citas totales:</span>
                    <span className="text-[var(--color-cream)]">{b._count?.citas || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Calificación:</span>
                    <span className="flex items-center gap-1 text-[var(--color-sepia)] font-bold">
                      <Star size={12} fill="currentColor" />
                      {b.resenas?.length
                        ? (b.resenas.reduce((a: number, r: any) => a + r.estrellas, 0) / b.resenas.length).toFixed(1)
                        : 'Sin reseñas'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
                <button
                  onClick={() => openHorarios(b)}
                  className="btn btn-secondary text-xs flex-1 py-1.5"
                >
                  <Clock size={13} /> Horarios
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="p-2 rounded text-[var(--color-gray)] hover:text-[var(--color-sepia)] border border-[var(--color-border)]"
                  title="Editar"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => { if (window.confirm('¿Desactivar barbero?')) desactivarBarbero(b.id) }}
                  className="p-2 rounded text-[var(--color-gray)] hover:text-[var(--color-red)] border border-[var(--color-border)]"
                  title="Desactivar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Barbero ───────────────────────────────────────── */}
      {modalBarbero && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModalBarbero(null)}
        >
          <div
            className="card max-w-md w-full animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--color-cream)]">
                {modalBarbero.mode === 'create' ? 'Nuevo Barbero' : 'Editar Barbero'}
              </h2>
              <button onClick={() => setModalBarbero(null)} className="text-[var(--color-gray)] hover:text-[var(--color-cream)]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => guardarBarbero(data as BarberoFormData))} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">
                  ID de Usuario de la BD
                </label>
                <input
                  {...register('usuarioId')}
                  className="input"
                  placeholder="ID de usuario registrado"
                  disabled={modalBarbero.mode === 'edit'}
                />
                {errors.usuarioId && <p className="text-xs text-[var(--color-red)] mt-1">{errors.usuarioId.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">
                  Especialidad
                </label>
                <input {...register('especialidad')} className="input" placeholder="Ej: Especialista en Fades y Barba" />
                {errors.especialidad && <p className="text-xs text-[var(--color-red)] mt-1">{errors.especialidad.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">
                  URL Foto (opcional)
                </label>
                <input {...register('fotoUrl')} className="input" placeholder="https://..." />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('activo')} type="checkbox" className="w-4 h-4 accent-red-600" />
                <span className="text-sm text-[var(--color-cream)]">Barbero activo</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalBarbero(null)} className="btn btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" disabled={guardandoBarbero} className="btn btn-primary flex-1">
                  {guardandoBarbero ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Horarios ──────────────────────────────────────── */}
      {modalHorario && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModalHorario(null)}
        >
          <div
            className="card max-w-lg w-full animate-fadeInUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--color-cream)]">
                Horario laboral — {modalHorario.nombre}
              </h2>
              <button onClick={() => setModalHorario(null)} className="text-[var(--color-gray)] hover:text-[var(--color-cream)]">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[var(--color-gray)] mb-4">
              Configura los días disponibles y el rango de horas de atención de cada día.
            </p>

            <div className="space-y-3 mb-6">
              {modalHorario.horarios.map((h, i) => (
                <div key={h.diaSemana} className="flex items-center gap-3 p-2 rounded bg-[rgba(255,255,255,0.02)] border border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => toggleDiaDisponible(i)}
                    className={`w-24 px-2 py-1 rounded text-xs font-bold uppercase transition-colors ${
                      h.disponible ? 'bg-[var(--color-sepia-dk)] text-[var(--color-cream)]' : 'bg-stone-800 text-[var(--color-gray)]'
                    }`}
                  >
                    {getDiaSemana(h.diaSemana)}
                  </button>

                  {h.disponible ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={h.horaInicio}
                        onChange={(e) => updateHora(i, 'horaInicio', e.target.value)}
                        className="input text-xs py-1 px-2"
                      />
                      <span className="text-xs text-[var(--color-gray)]">a</span>
                      <input
                        type="time"
                        value={h.horaFin}
                        onChange={(e) => updateHora(i, 'horaFin', e.target.value)}
                        className="input text-xs py-1 px-2"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--color-gray)] italic">Día de descanso</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setModalHorario(null)} className="btn btn-secondary flex-1">
                Cancelar
              </button>
              <button
                onClick={() => guardarHorarios({ barberoId: modalHorario.barberoId, horarios: modalHorario.horarios })}
                disabled={guardandoHorarios}
                className="btn btn-primary flex-1"
              >
                {guardandoHorarios ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Guardar horarios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
