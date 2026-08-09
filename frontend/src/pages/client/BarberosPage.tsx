import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useReservaStore } from '@/store/reservaStore'
import { barberosApi } from '@/lib/api'

// Componente de tarjeta de barbero (Referencia: imagen de NUESTROS BARBEROS)
function BarberoCard({ barbero }: { barbero: any }) {
  const navigate = useNavigate()
  const { setBarbero, setPaso } = useReservaStore()
  const inicial = barbero.usuario?.nombre?.charAt(0).toUpperCase() || 'B'
  const nombre = barbero.usuario?.nombre || 'Barbero'
  const calificacion = barbero.calificacion || 4.9
  const totalResenas = barbero.totalResenas || 0

  const handleReservar = () => {
    setBarbero({
      id: barbero.id,
      nombre,
      especialidad: barbero.especialidad || 'Barbero Profesional',
      fotoUrl: barbero.fotoUrl || null,
      calificacionPromedio: barbero.calificacion || 4.9,
    })
    setPaso(2)
    navigate('/reservar')
  }

  const nombreCorto = nombre.split(' ').slice(0, 2).join(' ')

  return (
    <div className="border-2 border-white bg-[#141414] shadow-[5px_5px_0_#000] p-6 flex flex-col items-center text-center animate-fadeInUp">
      {/* Avatar con inicial */}
      <div
        className="w-20 h-20 rounded-full border-2 border-white bg-[#f5f5ef] flex items-center justify-center mb-5 shadow-[2px_2px_0_#000]"
      >
        {barbero.fotoUrl ? (
          <img
            src={barbero.fotoUrl}
            alt={nombre}
            className="w-full h-full object-cover rounded-full"
            style={{ filter: 'grayscale(100%) contrast(1.1)' }}
          />
        ) : (
          <span
            className="text-4xl font-black text-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {inicial}
          </span>
        )}
      </div>

      {/* Nombre */}
      <h3
        className="text-xl text-white font-black mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {nombre}
      </h3>

      {/* Especialidad */}
      <p
        className="text-xs text-[#8c8c87] uppercase tracking-[0.18em] font-mono font-bold mb-4"
      >
        {barbero.especialidad || 'Barbero Profesional'}
      </p>

      {/* Estrellas + Rating */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={i < Math.round(calificacion) ? '#f5f5ef' : 'none'}
            stroke="#f5f5ef"
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        ))}
        <span
          className="text-sm text-white font-black ml-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {calificacion.toFixed(1)}
        </span>
        {totalResenas > 0 && (
          <span className="text-xs text-[#8c8c87] font-mono">({totalResenas})</span>
        )}
      </div>

      {/* Botón RESERVAR CON ... */}
      <button
        onClick={handleReservar}
        className="w-full border-2 border-white text-white text-xs font-black uppercase tracking-[0.12em] py-3 shadow-[2px_2px_0_#000] hover:bg-white hover:text-black transition-all cursor-pointer"
        style={{ fontFamily: 'var(--font-label)' }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.classList.add('animate-squash')
          el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
        }}
      >
        RESERVAR CON {nombreCorto.split(' ')[0].toUpperCase()}
      </button>
    </div>
  )
}

export default function BarberosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['barberos'],
    queryFn: () => barberosApi.getAll(),
    select: (res) => res.data.barberos,
  })

  return (
    <div className="py-16" style={{ backgroundColor: 'var(--gray-900)' }}>
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="text-5xl md:text-7xl text-white font-black mb-4 text-ink-outline"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          >
            NUESTROS BARBEROS
          </h1>
          <p
            className="text-[#8c8c87] max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1rem' }}
          >
            Cada uno con su especialidad y su estilo. Elige con quién quieres sentarte en el sillón.
          </p>
        </div>

        {/* Grid de Barberos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-2 border-[#3d3d3d] bg-[#141414] h-80 animate-pulse"
              />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="text-6xl mb-4 font-black text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ✂
            </div>
            <p className="text-[#8c8c87]" style={{ fontFamily: 'var(--font-body)' }}>
              No hay barberos registrados aún.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((b: any, i: number) => (
              <div key={b.id} style={{ animationDelay: `${i * 80}ms` }}>
                <BarberoCard barbero={b} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
