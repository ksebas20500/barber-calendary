import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Loader2, Plus, X, Check } from 'lucide-react'
import { citasApi, barberosApi, serviciosApi } from '@/lib/api'
import { formatCOP, formatTime } from '@/lib/utils'

export default function AdminCalendarioPage() {
  const qc = useQueryClient()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [barberoFiltro, setBarberoFiltro] = useState<string>('TODOS')
  const [modalNuevaCita, setModalNuevaCita] = useState(false)

  const fechaStr = format(selectedDate, 'yyyy-MM-dd')

  const { data: barberos } = useQuery({
    queryKey: ['admin-barberos'],
    queryFn: () => barberosApi.adminGetAll(),
    select: (res) => res.data.barberos,
  })

  const { data: servicios } = useQuery({
    queryKey: ['admin-servicios'],
    queryFn: () => serviciosApi.adminGetAll(),
    select: (res) => res.data.servicios,
  })

  const { data: citas, isLoading } = useQuery({
    queryKey: ['admin-citas', fechaStr, barberoFiltro],
    queryFn: () => citasApi.adminGetAll({ fecha: fechaStr, barberoId: barberoFiltro !== 'TODOS' ? barberoFiltro : undefined }),
    select: (res) => res.data.citas,
  })

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      citasApi.adminUpdate(id, { estado }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-citas'] }),
  })

  const { mutate: crearCitaManual, isPending: creandoManual } = useMutation({
    mutationFn: (data: any) => citasApi.adminCreate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-citas'] })
      setModalNuevaCita(false)
    },
  })

  const [formManual, setFormManual] = useState({
    clienteId: '',
    barberoId: '',
    servicioId: '',
    fecha: fechaStr,
    horaInicio: '10:00',
    notas: '',
  })

  // Week days for top navigator
  const startWeek = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startWeek, i))

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
      case 'COMPLETADA': return 'border-amber-500 bg-amber-950/30 text-amber-300'
      case 'CANCELADA': return 'border-red-500 bg-red-950/30 text-red-300'
      case 'NO_SHOW': return 'border-stone-500 bg-stone-900/50 text-stone-400'
      default: return 'border-stone-600 bg-stone-900 text-stone-300'
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>Calendario de citas</h1>
          <p className="text-sm text-[var(--color-gray)]">Vista completa de agendamiento</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Barber filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[var(--color-sepia)]" />
            <select
              value={barberoFiltro}
              onChange={(e) => setBarberoFiltro(e.target.value)}
              className="input py-1.5 px-3 text-xs w-44"
            >
              <option value="TODOS" style={{ background: 'var(--color-bg)' }}>Todos los barberos</option>
              {barberos?.map((b: any) => (
                <option key={b.id} value={b.id} style={{ background: 'var(--color-bg)' }}>
                  {b.usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <button onClick={() => setModalNuevaCita(true)} className="btn btn-primary text-xs py-2">
            <Plus size={14} /> Nueva Cita
          </button>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="card p-3 mb-6 flex items-center justify-between">
        <button
          onClick={() => setSelectedDate(subDays(selectedDate, 7))}
          className="btn btn-ghost p-2"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="grid grid-cols-7 gap-2 flex-1 max-w-2xl mx-4 text-center">
          {weekDays.map((d) => {
            const isSelected = isSameDay(d, selectedDate)
            return (
              <button
                key={d.toString()}
                onClick={() => setSelectedDate(d)}
                className={`py-2 px-1 rounded-lg transition-all text-xs font-semibold ${
                  isSelected
                    ? 'bg-[var(--color-red)] text-white shadow-md'
                    : 'text-[var(--color-cream)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <div className="uppercase opacity-70 text-[10px]">{format(d, 'EEE', { locale: es })}</div>
                <div className="text-base font-bold">{format(d, 'd')}</div>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 7))}
          className="btn btn-ghost p-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Selected day header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold capitalize text-[var(--color-cream)]">
          {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </h2>
        <span className="text-xs text-[var(--color-gray)]">
          {citas?.length || 0} cita(s) agendada(s)
        </span>
      </div>

      {/* Citas Timeline / Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
        </div>
      ) : !citas || citas.length === 0 ? (
        <div className="card text-center py-16">
          <CalendarIcon size={36} className="mx-auto mb-3 text-[var(--color-gray)]" />
          <p className="text-[var(--color-gray)]">No hay citas programadas para este día.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citas.map((c: any) => (
            <div
              key={c.id}
              className={`p-4 rounded-lg border-l-4 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${getEstadoColor(
                c.estado
              )}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-center font-bold min-w-[70px]">
                  <div className="text-lg leading-tight">{formatTime(c.horaInicio)}</div>
                  <div className="text-[10px] opacity-70">a {formatTime(c.horaFin)}</div>
                </div>

                <div>
                  <div className="font-bold text-sm text-[var(--color-cream)]">
                    {c.cliente.nombre} <span className="font-normal opacity-70">({c.cliente.telefono || 'Sin tel'})</span>
                  </div>
                  <div className="text-xs text-[var(--color-cream)] opacity-90 mt-0.5">
                    {c.servicio.nombre} • <span className="font-semibold text-[var(--color-sepia)]">{formatCOP(c.servicio.precio)}</span>
                  </div>
                  <div className="text-[11px] opacity-70 mt-0.5">
                    Barbero: <strong>{c.barbero.usuario.nombre}</strong>
                  </div>
                </div>
              </div>

              {/* Status selector */}
              <div className="flex items-center gap-2">
                <select
                  value={c.estado}
                  onChange={(e) => cambiarEstado({ id: c.id, estado: e.target.value })}
                  className="input py-1 px-2 text-xs w-36 bg-black/40 border-stone-700"
                >
                  <option value="CONFIRMADA" style={{ background: 'var(--color-bg)' }}>Confirmada</option>
                  <option value="COMPLETADA" style={{ background: 'var(--color-bg)' }}>Completada</option>
                  <option value="CANCELADA" style={{ background: 'var(--color-bg)' }}>Cancelada</option>
                  <option value="NO_SHOW" style={{ background: 'var(--color-bg)' }}>No Asistió</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Nueva Cita Manual ────────────────────────────── */}
      {modalNuevaCita && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModalNuevaCita(false)}
        >
          <div
            className="card max-w-md w-full animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--color-cream)]">Agendar Cita Manual (Teléfono / Presencial)</h2>
              <button onClick={() => setModalNuevaCita(false)} className="text-[var(--color-gray)] hover:text-[var(--color-cream)]">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                crearCitaManual({ ...formManual, fecha: fechaStr })
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-sepia)] mb-1">ID Cliente (Usuario)</label>
                <input
                  type="text"
                  required
                  className="input text-xs"
                  placeholder="ID del cliente registrado"
                  value={formManual.clienteId}
                  onChange={(e) => setFormManual({ ...formManual, clienteId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-sepia)] mb-1">Barbero</label>
                <select
                  required
                  className="input text-xs"
                  value={formManual.barberoId}
                  onChange={(e) => setFormManual({ ...formManual, barberoId: e.target.value })}
                >
                  <option value="">Seleccionar barbero</option>
                  {barberos?.map((b: any) => (
                    <option key={b.id} value={b.id} style={{ background: 'var(--color-bg)' }}>{b.usuario.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-sepia)] mb-1">Servicio</label>
                <select
                  required
                  className="input text-xs"
                  value={formManual.servicioId}
                  onChange={(e) => setFormManual({ ...formManual, servicioId: e.target.value })}
                >
                  <option value="">Seleccionar servicio</option>
                  {servicios?.map((s: any) => (
                    <option key={s.id} value={s.id} style={{ background: 'var(--color-bg)' }}>
                      {s.nombre} ({formatCOP(s.precio)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--color-sepia)] mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    className="input text-xs"
                    value={formManual.fecha}
                    onChange={(e) => setFormManual({ ...formManual, fecha: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--color-sepia)] mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    className="input text-xs"
                    value={formManual.horaInicio}
                    onChange={(e) => setFormManual({ ...formManual, horaInicio: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalNuevaCita(false)} className="btn btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" disabled={creandoManual} className="btn btn-primary flex-1">
                  {creandoManual ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
