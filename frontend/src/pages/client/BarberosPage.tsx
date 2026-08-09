import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useReservaStore } from '@/store/reservaStore'
import { barberosApi } from '@/lib/api'

function BarberoCard({ barbero }: { barbero: any }) {
  const navigate = useNavigate()
  const { setBarbero, setPaso } = useReservaStore()
  const nombre = barbero.usuario?.nombre || barbero.nombre || 'Barbero'
  const inicial = nombre.charAt(0).toUpperCase()
  const calificacion = barbero.calificacionPromedio || 4.9

  const handleReservar = () => {
    setBarbero({
      id: barbero.id,
      nombre,
      especialidad: barbero.especialidad || 'BARBERO PROFESIONAL',
      fotoUrl: barbero.fotoUrl || null,
      calificacionPromedio: calificacion,
    })
    setPaso(2)
    navigate('/reservar')
  }

  const nombreCorto = nombre.split(' ')[0].toUpperCase()

  return (
    <div className="card-barbero-vintage bg-[#eae5d8] shadow-[5px_5px_0_#000] flex flex-col justify-between h-full">
      <div className="flex flex-col items-center">
        {/* Círculo Inicial Negro */}
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mb-5 border-2 border-black shadow-[2px_2px_0_#000]">
          <span
            className="text-3xl font-bold font-mono"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {inicial}
          </span>
        </div>

        {/* Nombre */}
        <h3
          className="text-2xl font-bold text-black mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {nombre}
        </h3>

        {/* Especialidad Monospace */}
        <p className="font-mono text-[0.7rem] font-bold text-black/70 uppercase tracking-[0.18em] mb-3">
          {barbero.especialidad || 'BARBERO PROFESIONAL'}
        </p>

        {/* Descripción / Años de oficio */}
        <p className="font-mono text-xs text-black/80 mb-6">
          Especialista en corte clásico, barba & afeitado a navaja.
        </p>
      </div>

      {/* Botón Reservar Con X */}
      <button
        onClick={handleReservar}
        className="w-full btn-vintage-black py-3 text-xs"
      >
        RESERVAR CON {nombreCorto}
      </button>
    </div>
  )
}

export default function BarberosPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['barberos'],
    queryFn: () => barberosApi.getAll(),
    select: (res) => res.data.barberos,
  })

  return (
    <div className="bg-[#eae5d8] text-[#1a1a1a] min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 block mb-2">
            LA CUADRILLA
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold text-black mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nuestros barberos
          </h1>
          <p className="font-mono text-xs text-black/70 max-w-md mx-auto">
            Cada uno con su especialidad y su estilo. Elige con quién quieres sentarte en el sillón.
          </p>
        </div>

        {/* Grid de Barberos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#e2ded2] border-2 border-black h-80 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 border-2 border-black bg-[#eae5d8] p-8 max-w-lg mx-auto shadow-[4px_4px_0_#000]">
            <div className="text-3xl mb-3 text-black font-bold font-mono">⚠️ ERROR DE CONEXIÓN</div>
            <p className="text-black/80 text-xs mb-6 font-mono">
              No se pudo obtener la lista de barberos del servidor backend.
            </p>
            <button
              onClick={() => refetch()}
              className="btn-vintage-black"
            >
              Reintentar
            </button>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 text-black">✂</div>
            <p className="font-mono text-sm text-black/60">No hay barberos registrados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.map((b: any) => (
              <BarberoCard key={b.id} barbero={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
