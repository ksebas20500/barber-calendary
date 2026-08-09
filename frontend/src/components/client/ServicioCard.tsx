import { useNavigate } from 'react-router-dom'
import { Clock, Star, Scissors } from 'lucide-react'
import { formatCOP, truncate } from '@/lib/utils'
import { useReservaStore } from '@/store/reservaStore'

interface ServicioCardProps {
  servicio: {
    id: string
    nombre: string
    precio: number
    descripcion: string
    duracionMinutos: number
    categoria: string
    imagenUrl?: string | null
    popular?: boolean
  }
}

const categoryIcons: Record<string, string> = {
  CORTE: '✂',
  PREMIUM: '⭐',
  CEJAS: '👁',
  BARBA: '🪒',
  COMBO: '💎',
}

export default function ServicioCard({ servicio }: ServicioCardProps) {
  const navigate = useNavigate()
  const { setServicio, setPaso } = useReservaStore()

  const handleReservar = () => {
    setServicio({
      id: servicio.id,
      nombre: servicio.nombre,
      precio: servicio.precio,
      duracionMinutos: servicio.duracionMinutos,
      categoria: servicio.categoria,
    })
    setPaso(2)
    navigate('/reservar')
  }

  const SHORT_DESC = 90

  return (
    <div className="card flex flex-col group animate-fadeInUp">
      {/* Image / Category Icon B&W */}
      <div
        className="relative w-full h-44 rounded-lg mb-4 flex items-center justify-center overflow-hidden border-2 border-white bg-black shadow-[3px_3px_0px_#000000]"
      >
        {servicio.imagenUrl ? (
          <img
            src={servicio.imagenUrl}
            alt={servicio.nombre}
            className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {categoryIcons[servicio.categoria] || '✂'}
          </span>
        )}

        {/* Popular badge cartoon */}
        {servicio.popular && (
          <div className="absolute top-2 right-2 badge badge-popular flex items-center gap-1">
            <Star size={10} fill="white" className="stroke-black stroke-2" />
            POPULAR
          </div>
        )}

        {/* Category tag */}
        <div
          className="absolute bottom-2 left-2 px-2.5 py-1 rounded border border-white text-[10px] font-extrabold uppercase tracking-widest bg-black text-white"
        >
          {servicio.categoria}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <h3
          className="text-lg font-black mb-1.5 text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {servicio.nombre}
        </h3>

        <p className="text-xs md:text-sm mb-4 flex-1 text-[var(--ink-muted)] leading-relaxed font-medium">
          {truncate(servicio.descripcion, SHORT_DESC)}
        </p>

        {/* Duration Meta */}
        <div className="flex items-center justify-between mb-4 text-xs font-bold text-[var(--ink-muted)]">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-white" />
            <span>A partir de {servicio.duracionMinutos} min</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#262626]">
          <div>
            <span
              className="text-xl md:text-2xl font-black text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {formatCOP(servicio.precio)}
            </span>
          </div>
          <button
            onClick={handleReservar}
            className="btn btn-primary text-xs px-4 py-2"
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.classList.add('animate-squash')
              el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
            }}
          >
            <Scissors size={14} />
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}

