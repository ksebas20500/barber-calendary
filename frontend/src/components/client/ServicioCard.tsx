import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
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

// SVG custom de tijeras con trazo de tinta variable (NO Lucide uniforme)
const ScissorsInkSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M8 5 C9 4.2, 11 4.8, 12 6.5 L18.5 17.5"
      stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <path d="M24 5 C23 4.2, 21 4.8, 20 6.5 L13.5 17.5"
      stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <circle cx="16" cy="16.8" r="2.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <ellipse cx="10" cy="25" rx="4.5" ry="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <ellipse cx="22" cy="25" rx="4.5" ry="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <line x1="12.8" y1="18.8" x2="9.5" y2="21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="19.2" y1="18.8" x2="22.5" y2="21.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const StarInkSVG = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke="currentColor" strokeWidth="2" fill="currentColor" strokeLinejoin="round"
    />
  </svg>
)

// Iconos de categoría — dibujados a mano, NO emoji
const CategoryIconSVG = ({ cat, size = 42 }: { cat: string; size?: number }) => {
  if (cat === 'CORTE') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M12 8 C13 7, 15 7.5, 16 9.5 L27 28"
        stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M36 8 C35 7, 33 7.5, 32 9.5 L21 28"
        stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="27" r="3.5" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <ellipse cx="15" cy="37" rx="6" ry="5" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <ellipse cx="33" cy="37" rx="6" ry="5" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <line x1="19" y1="29.5" x2="14" y2="32.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="29" y1="29.5" x2="34" y2="32.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
  if (cat === 'BARBA') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Navaja de afeitar estilo 1930s */}
      <rect x="8" y="10" width="32" height="16" rx="3" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="26" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M16 32 Q24 40 32 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="15" r="2.5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  )
  if (cat === 'PREMIUM') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Corona de cartel de circo */}
      <path d="M8 36 L8 20 L16 28 L24 12 L32 28 L40 20 L40 36Z"
        stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
      <rect x="6" y="36" width="36" height="6" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  )
  if (cat === 'CEJAS') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Ojo con ceja exagerada 1930s */}
      <path d="M10 18 Q24 8 38 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="24" cy="26" rx="12" ry="9" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <circle cx="24" cy="26" r="4.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="26" cy="24" r="2" fill="currentColor" />
    </svg>
  )
  // COMBO default
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <polygon
        points="24,4 29.5,16.5 43,18.5 33,28 35.6,41.5 24,35.5 12.4,41.5 15,28 5,18.5 18.5,16.5"
        stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none"
      />
    </svg>
  )
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

  const SHORT_DESC = 88

  return (
    <div
      className="card flex flex-col group animate-fadeInUp"
      style={{ position: 'relative' }}
    >
      {/* ── Fotograma de película (imagen o icono) ── */}
      <div
        className="film-frame relative mb-4"
        style={{
          height: '160px',
          background: `
            linear-gradient(160deg,
              var(--gray-800) 0%,
              var(--gray-900) 60%,
              var(--black) 100%
            )
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          /* Trama interna tipo hatching */
          backgroundImage: `
            linear-gradient(160deg, var(--gray-800) 0%, var(--gray-900) 60%, var(--black) 100%),
            repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.015) 0px,
              rgba(255,255,255,0.015) 1px,
              transparent 1px,
              transparent 7px
            )
          `,
          backgroundBlendMode: 'normal, overlay',
        }}
      >
        {servicio.imagenUrl ? (
          <img
            src={servicio.imagenUrl}
            alt={servicio.nombre}
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(100%) contrast(1.2) brightness(0.85)' }}
          />
        ) : (
          <div
            style={{
              color: 'var(--gray-500)',
              transition: 'color 0.2s ease, transform 0.2s ease',
            }}
            className="group-hover:scale-110"
          >
            <CategoryIconSVG cat={servicio.categoria} size={52} />
          </div>
        )}

        {/* Badge popular — sello de goma */}
        {servicio.popular && (
          <div
            className="badge badge-popular absolute top-2 right-2"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <StarInkSVG size={10} />
            POPULAR
          </div>
        )}

        {/* Tag de categoría — impreso */}
        <div
          className="absolute bottom-2 left-2"
          style={{
            background: 'var(--black)',
            border: '1.5px solid var(--gray-700)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-label)',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gray-400)',
          }}
        >
          {servicio.categoria}
        </div>
      </div>

      {/* ── Contenido de la tarjeta ── */}
      <div className="flex flex-col flex-1">
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--white)',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          }}
        >
          {servicio.nombre}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--gray-400)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            flex: 1,
          }}
        >
          {truncate(servicio.descripcion, SHORT_DESC)}
        </p>

        {/* Duración */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'var(--font-label)',
            fontSize: '0.75rem',
            color: 'var(--gray-500)',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          <Clock size={13} style={{ color: 'var(--gray-600)' }} />
          <span>A partir de {servicio.duracionMinutos} min</span>
        </div>

        {/* Precio + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '2px solid var(--gray-700)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: 'var(--white)',
              lineHeight: 1,
            }}
          >
            {formatCOP(servicio.precio)}
          </span>
          <button
            onClick={handleReservar}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.classList.add('animate-squash')
              el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
            }}
          >
            <ScissorsInkSVG size={14} />
            Reservar
          </button>
        </div>
      </div>
    </div>
  )
}
