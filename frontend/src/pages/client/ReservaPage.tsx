import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Loader2, Star, Clock, Scissors } from 'lucide-react'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { barberosApi, citasApi, serviciosApi } from '@/lib/api'
import { useReservaStore } from '@/store/reservaStore'
import { useAuth } from '@/contexts/AuthContext'
import StepIndicator from '@/components/client/StepIndicator'
import { formatCOP, formatDate } from '@/lib/utils'
import ServicioCard from '@/components/client/ServicioCard'

const TODAY = startOfDay(new Date())
const MAX_DAYS_AHEAD = 30

export default function ReservaPage() {
  const navigate = useNavigate()
  const { user, loginWithGoogle } = useAuth()
  const { paso, servicio, barbero, fecha, horaInicio, setPaso, setServicio, setBarbero, setFecha, setHoraInicio, reset } =
    useReservaStore()

  // ── PASO 1: Servicios ───────────────────────────────────────
  const { data: serviciosData, isLoading: loadingServicios } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios,
    enabled: paso === 1,
  })

  // ── PASO 2: Barberos ────────────────────────────────────────
  const { data: barberosData, isLoading: loadingBarberos } = useQuery({
    queryKey: ['barberos'],
    queryFn: () => barberosApi.getAll(),
    select: (res) => res.data.barberos,
    enabled: paso === 2,
  })

  // ── PASO 3: Disponibilidad ──────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(TODAY, 1))
  const fechaStr = format(selectedDate, 'yyyy-MM-dd')

  const { data: disponibilidad, isLoading: loadingSlots, refetch: refetchSlots } = useQuery({
    queryKey: ['disponibilidad', barbero?.id, fechaStr, servicio?.id],
    queryFn: () => barberosApi.getDisponibilidad(barbero!.id, fechaStr, servicio!.id),
    select: (res) => res.data,
    enabled: paso === 3 && !!barbero && !!servicio,
  })

  const slots: string[] = disponibilidad?.slots || []
  const mañana = slots.filter((s) => s < '12:00')
  const tarde = slots.filter((s) => s >= '12:30')

  // ── Crear Cita Mutation ─────────────────────────────────────
  const { mutate: crearCita, isPending: creandoCita, error: errorCita } = useMutation({
    mutationFn: () =>
      citasApi.crear({
        barberoId: barbero!.id,
        servicioId: servicio!.id,
        fecha: fechaStr,
        horaInicio: horaInicio!,
      }),
    onSuccess: () => {
      reset()
      navigate('/perfil?tab=proximas')
    },
  })

  const handleConfirmar = () => {
    if (!user) {
      loginWithGoogle()
      return
    }
    crearCita()
  }

  // ── Navigate days ───────────────────────────────────────────
  const prevDay = () => {
    const prev = addDays(selectedDate, -1)
    if (!isBefore(prev, addDays(TODAY, 1))) {
      setSelectedDate(prev)
      setFecha(format(prev, 'yyyy-MM-dd'))
      setHoraInicio('')
    }
  }

  const nextDay = () => {
    const next = addDays(selectedDate, 1)
    if (isBefore(next, addDays(TODAY, MAX_DAYS_AHEAD))) {
      setSelectedDate(next)
      setFecha(format(next, 'yyyy-MM-dd'))
      setHoraInicio('')
    }
  }

  useEffect(() => {
    if (paso === 3) {
      setFecha(fechaStr)
    }
  }, [paso])

  return (
    <div className="py-16 min-h-screen">
      <div className="page-container max-w-4xl">
        <div className="text-center mb-8">
          <h1 style={{ color: 'var(--color-cream)' }}>Reservar cita</h1>
          <p className="text-[var(--color-gray)] mt-2">
            {paso === 1 && 'Selecciona el servicio que deseas'}
            {paso === 2 && 'Elige tu barbero'}
            {paso === 3 && 'Confirma día y hora'}
          </p>
        </div>

        <StepIndicator pasoActual={paso} />

        {/* ── PASO 1: Seleccionar servicio ──────────────────── */}
        {paso === 1 && (
          <div className="animate-fadeInUp">
            {loadingServicios ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 skeleton rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviciosData?.map((s: any) => (
                  <div
                    key={s.id}
                    onClick={() => { setServicio(s); setPaso(2) }}
                    className={`card cursor-pointer border-2 transition-all ${
                      servicio?.id === s.id
                        ? 'border-[var(--color-red)] shadow-[0_0_0_3px_rgba(200,20,30,0.2)]'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">✂</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-[var(--color-cream)]">{s.nombre}</h3>
                        <p className="text-sm text-[var(--color-gray)] mt-0.5">{s.descripcion.slice(0, 70)}...</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-[var(--color-gray)] flex items-center gap-1">
                            <Clock size={11} /> {s.duracionMinutos} min
                          </span>
                          <span className="font-black text-[var(--color-cream)]">{formatCOP(s.precio)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PASO 2: Seleccionar barbero ───────────────────── */}
        {paso === 2 && (
          <div className="animate-fadeInUp">
            <button onClick={() => setPaso(1)} className="btn btn-ghost mb-6 flex items-center gap-1">
              <ChevronLeft size={16} /> Volver
            </button>

            {loadingBarberos ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-[var(--color-sepia)]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barberosData?.map((b: any) => (
                  <div
                    key={b.id}
                    onClick={() => { setBarbero(b); setPaso(3) }}
                    className={`card cursor-pointer border-2 transition-all flex items-center gap-4 ${
                      barbero?.id === b.id
                        ? 'border-[var(--color-red)] shadow-[0_0_0_3px_rgba(200,20,30,0.2)]'
                        : ''
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-full border-2 border-[var(--color-border)] overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'var(--color-bg)' }}
                    >
                      {b.fotoUrl ? (
                        <img src={b.fotoUrl} alt={b.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">💈</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--color-cream)]">{b.nombre}</h3>
                      <p className="text-sm text-[var(--color-gray)]">{b.especialidad}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} fill="#c8a96e" className="text-[var(--color-sepia)]" />
                        <span className="text-sm font-semibold text-[var(--color-sepia)]">
                          {b.calificacionPromedio || 'Nuevo'}
                        </span>
                        {b.totalResenas > 0 && (
                          <span className="text-xs text-[var(--color-gray)]">({b.totalResenas} reseñas)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PASO 3: Seleccionar horario ───────────────────── */}
        {paso === 3 && (
          <div className="animate-fadeInUp">
            <button onClick={() => setPaso(2)} className="btn btn-ghost mb-6 flex items-center gap-1">
              <ChevronLeft size={16} /> Volver
            </button>

            {/* Resumen */}
            <div className="card mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex-1">
                <p className="text-xs text-[var(--color-gray)] uppercase tracking-wider mb-1">Servicio</p>
                <p className="font-bold text-[var(--color-cream)]">{servicio?.nombre}</p>
                <p className="text-sm text-[var(--color-sepia)]">{formatCOP(servicio?.precio || 0)}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-gray)] uppercase tracking-wider mb-1">Barbero</p>
                <p className="font-bold text-[var(--color-cream)]">{barbero?.nombre}</p>
                <p className="text-sm text-[var(--color-gray)]">{barbero?.especialidad}</p>
              </div>
            </div>

            {/* Date picker */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevDay} className="btn btn-ghost p-2">
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <p
                  className="text-xl font-bold capitalize"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
                >
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <button onClick={nextDay} className="btn btn-ghost p-2">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Slots */}
            {loadingSlots ? (
              <div className="flex justify-center py-8">
                <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
              </div>
            ) : (
              <div className="space-y-6">
                {mañana.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-sepia)] mb-3">
                      ☀ Mañana
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mañana.map((slot) => (
                        <button
                          key={slot}
                          className={`slot-btn ${horaInicio === slot ? 'selected' : ''}`}
                          onClick={() => setHoraInicio(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tarde.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-sepia)] mb-3">
                      🌇 Tarde
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tarde.map((slot) => (
                        <button
                          key={slot}
                          className={`slot-btn ${horaInicio === slot ? 'selected' : ''}`}
                          onClick={() => setHoraInicio(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {slots.length === 0 && (
                  <div className="text-center py-8 text-[var(--color-gray)]">
                    No hay horarios disponibles para este día.
                  </div>
                )}
              </div>
            )}

            {/* Confirm */}
            {horaInicio && (
              <div className="mt-8 card ink-border">
                <p className="text-center text-sm text-[var(--color-gray)] mb-4">
                  Confirma tu cita para el{' '}
                  <strong className="text-[var(--color-cream)]">
                    {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </strong>{' '}
                  a las <strong className="text-[var(--color-cream)]">{horaInicio}</strong>
                </p>

                {errorCita && (
                  <p className="text-center text-sm text-[var(--color-red)] mb-4">
                    ⚠ El horario seleccionado ya fue ocupado. Por favor elige otro.
                  </p>
                )}

                <button
                  onClick={handleConfirmar}
                  disabled={creandoCita}
                  className="btn btn-primary w-full text-base py-3"
                >
                  {creandoCita ? (
                    <><Loader2 size={18} className="animate-spin" /> Reservando...</>
                  ) : (
                    <><Check size={18} /> Confirmar cita</>
                  )}
                </button>
                <p className="text-center text-xs text-[var(--color-gray)] mt-3">
                  El pago se realiza en caja el día de tu visita
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
