import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { format, addDays, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { barberosApi, citasApi, serviciosApi } from '@/lib/api'
import { useReservaStore } from '@/store/reservaStore'
import { useAuth } from '@/contexts/AuthContext'
import { formatCOP } from '@/lib/utils'

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

  const { data: disponibilidad, isLoading: loadingSlots } = useQuery({
    queryKey: ['disponibilidad', barbero?.id, fechaStr, servicio?.id],
    queryFn: () => barberosApi.getDisponibilidad(barbero!.id, fechaStr, servicio!.id),
    select: (res) => res.data,
    enabled: paso === 3 && !!barbero && !!servicio,
  })

  const slots: string[] = disponibilidad?.slots || ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00']

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
    <div className="bg-[#eae5d8] min-h-screen py-16 text-[#1a1a1a]">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header estilo Foto 4 */}
        <div className="text-center mb-10">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 block mb-2">
            RESERVA TU LUGAR
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold text-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Agenda tu cita
          </h1>
        </div>

        {/* ── PASO 1: Seleccionar Servicio ──────────────────────── */}
        {paso === 1 && (
          <div className="space-y-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-black text-center mb-6">
              1. SELECCIONA EL SERVICIO
            </h2>
            {loadingServicios ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-44 bg-[#e2ded2] animate-pulse border-2 border-black" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviciosData?.map((s: any, idx: number) => (
                  <div
                    key={s.id}
                    onClick={() => { setServicio(s); setPaso(2) }}
                    className="card-servicio-vintage cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        className="text-2xl font-bold text-black"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {s.nombre}
                      </h3>
                      <span
                        className="text-2xl font-bold text-black"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {formatCOP(s.precio)}
                      </span>
                    </div>
                    <div className="border-b-2 border-dotted border-black/40 my-3" />
                    <p className="font-mono text-xs text-black/80 mb-3">{s.descripcion}</p>
                    <div className="font-mono text-[0.7rem] font-bold text-black/70 uppercase">
                      DURACIÓN · {s.duracionMinutos} MIN
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PASO 2: Seleccionar Barbero ───────────────────────── */}
        {paso === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setPaso(1)}
              className="btn-vintage-outline text-xs py-2 px-4 mb-4"
            >
              ← VOLVER A SERVICIOS
            </button>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-black text-center mb-6">
              2. ELIGE TU BARBERO
            </h2>
            {loadingBarberos ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-black" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {barberosData?.map((b: any) => {
                  const nombreB = b.usuario?.nombre || b.nombre || 'Barbero'
                  const inicial = nombreB.charAt(0).toUpperCase()
                  return (
                    <div
                      key={b.id}
                      onClick={() => { setBarbero(b); setPaso(3) }}
                      className="card-barbero-vintage cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-4 border-2 border-black font-mono font-bold text-2xl">
                        {inicial}
                      </div>
                      <h3
                        className="text-xl font-bold text-black mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {nombreB}
                      </h3>
                      <p className="font-mono text-[0.65rem] font-bold text-black/70 uppercase">
                        {b.especialidad || 'BARBERO'}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PASO 3: Confirmar Fecha y Hora (Foto 4) ──────────── */}
        {paso === 3 && (
          <div className="bg-[#eae5d8] border-2 border-black p-6 md:p-10 shadow-[8px_8px_0_#000]">
            <button
              onClick={() => setPaso(2)}
              className="btn-vintage-outline text-xs py-1.5 px-3 mb-6"
            >
              ← CAMBIAR SELECCIÓN
            </button>

            {/* Resumen de Selección */}
            <div className="border-2 border-black bg-[#f4efe4] p-5 mb-8 flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-black/50 block font-bold">SERVICIO SELECCIONADO</span>
                <span className="text-black font-bold text-base">{servicio?.nombre}</span>
                <span className="block text-black/70">{formatCOP(servicio?.precio || 0)}</span>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-black/20 pt-3 sm:pt-0 sm:pl-4">
                <span className="text-black/50 block font-bold">BARBERO</span>
                <span className="text-black font-bold text-base">{(barbero as any)?.usuario?.nombre || barbero?.nombre}</span>
                <span className="block text-black/70">{barbero?.especialidad}</span>
              </div>
            </div>

            {/* Selector de Fecha */}
            <div className="flex items-center justify-between mb-8 border-b-2 border-dotted border-black/40 pb-6">
              <button onClick={prevDay} className="btn-vintage-outline p-2">
                <ChevronLeft size={18} />
              </button>
              <div className="text-center">
                <p
                  className="text-2xl font-bold capitalize text-black"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                </p>
              </div>
              <button onClick={nextDay} className="btn-vintage-outline p-2">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Grid de Horarios */}
            <div className="mb-8">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-3 text-black">
                SELECCIONA LA HORA
              </label>
              {loadingSlots ? (
                <div className="flex justify-center py-6">
                  <Loader2 size={24} className="animate-spin text-black" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setHoraInicio(slot)}
                      className={`py-2.5 font-mono text-xs font-bold border-1.5 border-black transition-colors ${
                        horaInicio === slot
                          ? 'bg-black text-white'
                          : 'bg-[#e2ded2] text-black hover:bg-black/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón Confirmar Cita (Foto 4) */}
            {horaInicio && (
              <div>
                {errorCita && (
                  <p className="text-center text-xs font-mono text-red-600 font-bold mb-4">
                    ⚠ El horario seleccionado ya fue ocupado. Por favor elige otro.
                  </p>
                )}

                <button
                  onClick={handleConfirmar}
                  disabled={creandoCita}
                  className="w-full bg-black text-white py-4 border-2 border-black font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-[4px_4px_0_#000] hover:bg-neutral-800 transition-colors"
                >
                  {creandoCita ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> RESERVANDO...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={16} /> CONFIRMAR CITA
                    </span>
                  )}
                </button>
                <p className="text-center font-mono text-[0.7rem] text-black/60 mt-3 font-bold">
                  Pagos exclusivamente en caja el día de tu cita
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
