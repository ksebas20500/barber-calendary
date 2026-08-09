import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Award, Users } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import ServicioCard from '@/components/client/ServicioCard'
import { useAuth } from '@/contexts/AuthContext'

// ── SVG CUSTOM: Tijeras de tinta (trazo variable, NO Lucide) ──────────────
const ScissorsSVG = ({ size = 28, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Trazo orgánico con stroke-width variable = aspecto de pluma de tinta */}
    <path
      d="M8 6 C9 5, 11 5.5, 12 7 L19 18"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      fill="none" strokeLinejoin="round"
    />
    <path
      d="M24 6 C23 5, 21 5.5, 20 7 L13 18"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round"
      fill="none" strokeLinejoin="round"
    />
    {/* Pivote central — círculo de tinta */}
    <circle cx="16" cy="17" r="2.2" stroke="currentColor" strokeWidth="2.5" fill="none" />
    {/* Mangos redondeados estilo rubber-hose */}
    <ellipse cx="10" cy="25" rx="4" ry="3.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <ellipse cx="22" cy="25" rx="4" ry="3.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <line x1="12.5" y1="18.5" x2="9" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="19.5" y1="18.5" x2="23" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// ── SVG CUSTOM: Polo de barbero animado ──────────────────────────────────
const BarberPoleSVG = () => (
  <svg width="14" height="48" viewBox="0 0 14 48" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="12" height="46" rx="6" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Espirales tipo poste de barbería */}
    <path d="M1 12 Q7 14 13 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M1 20 Q7 22 13 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M1 28 Q7 30 13 28" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M1 36 Q7 38 13 36" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
)

// ── SVG CUSTOM: Calendario de cita (trazo de tinta variable) ─────────────
const CalendarInkSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* Marco exterior — trazo más grueso para contorno tipo tinta */}
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
    {/* Línea horizontal de encabezado */}
    <line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="2" />
    {/* Argollas superiores */}
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Puntos de fechas — detalles finos */}
    <circle cx="8" cy="14" r="1.2" fill="currentColor" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    <circle cx="16" cy="14" r="1.2" fill="currentColor" />
    <circle cx="8" cy="18" r="1.2" fill="currentColor" />
    <circle cx="12" cy="18" r="1.2" fill="currentColor" />
  </svg>
)

// ── SVG CUSTOM: Estrella de tinta (no rellenada con color) ────────────────
const StarInkSVG = ({ filled = false, size = 16 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke="currentColor"
      strokeWidth={filled ? '0' : '2'}
      fill={filled ? 'currentColor' : 'none'}
      strokeLinejoin="round"
    />
  </svg>
)

// ── SVG MASCOTA: Barbero estilo rubber-hose Fleischer 1930s ──────────────
// Personaje cartoon con ojos "pie-eye", guantes de 4 dedos, extremidades hose
const BarberMascotSVG = () => (
  <svg
    viewBox="0 0 220 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Barbero vintage estilo caricatura 1930s"
    className="w-full h-full"
  >
    {/* ── Cuerpo rubber-hose (forma ovalada sin articulaciones rígidas) ── */}
    {/* Sombra del personaje */}
    <ellipse cx="113" cy="373" rx="55" ry="8" fill="rgba(0,0,0,0.35)" />

    {/* Piernas tipo manguera — curvas orgánicas */}
    <path d="M95 300 Q85 340 75 365 Q70 372 78 373 Q87 374 90 366 Q98 345 105 315"
      stroke="#242424" strokeWidth="22" strokeLinecap="round" fill="none" />
    <path d="M95 300 Q85 340 75 365 Q70 372 78 373 Q87 374 90 366 Q98 345 105 315"
      stroke="#6b6b6b" strokeWidth="16" strokeLinecap="round" fill="none" />

    <path d="M125 300 Q135 340 145 365 Q150 372 142 373 Q133 374 130 366 Q122 345 115 315"
      stroke="#242424" strokeWidth="22" strokeLinecap="round" fill="none" />
    <path d="M125 300 Q135 340 145 365 Q150 372 142 373 Q133 374 130 366 Q122 345 115 315"
      stroke="#6b6b6b" strokeWidth="16" strokeLinecap="round" fill="none" />

    {/* Zapatos tipo globo rubber-hose */}
    <ellipse cx="80" cy="371" rx="18" ry="9" fill="#1a1a1a" stroke="#0d0d0d" strokeWidth="2" />
    <ellipse cx="140" cy="371" rx="18" ry="9" fill="#1a1a1a" stroke="#0d0d0d" strokeWidth="2" />
    <ellipse cx="79" cy="369" rx="12" ry="5" fill="#3d3d3d" />
    <ellipse cx="139" cy="369" rx="12" ry="5" fill="#3d3d3d" />

    {/* Cuerpo principal — traje de barbero */}
    {/* Sombra del cuerpo con trama */}
    <ellipse cx="114" cy="265" rx="58" ry="60" fill="#1a1a1a" />
    {/* Cuerpo blanco de la camisa */}
    <ellipse cx="110" cy="258" rx="55" ry="58" fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="3" />
    {/* Chaleco oscuro */}
    <path d="M80 210 Q82 265 85 300 Q110 310 135 300 Q138 265 140 210 Q125 195 110 193 Q95 195 80 210Z"
      fill="#242424" stroke="#0d0d0d" strokeWidth="2.5" />
    {/* Detalle trama del chaleco — hatching tipo ilustración */}
    <path d="M90 215 L88 295 M97 212 L95 298 M104 210 L102 300 M111 210 L109 300 M118 210 L116 300 M125 212 L123 298 M132 215 L130 295"
      stroke="#3d3d3d" strokeWidth="0.8" opacity="0.6" />
    {/* Solapa de camisa */}
    <path d="M95 210 L110 230 L125 210 L115 205 L110 215 L105 205Z"
      fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="2" />
    {/* Corbatín de moño */}
    <path d="M104 226 L98 221 L104 218 L110 222 L116 218 L122 221 L116 226 L110 230Z"
      fill="#c1272d" stroke="#0d0d0d" strokeWidth="1.5" />
    {/* Botones de la camisa */}
    <circle cx="110" cy="242" r="3" fill="#0d0d0d" />
    <circle cx="110" cy="256" r="3" fill="#0d0d0d" />
    <circle cx="110" cy="270" r="3" fill="#0d0d0d" />

    {/* Brazos rubber-hose */}
    {/* Brazo izquierdo — sosteniendo tijeras */}
    <path d="M80 220 Q50 230 35 255 Q30 265 38 270 Q46 275 52 265 Q65 248 85 238"
      stroke="#0d0d0d" strokeWidth="24" strokeLinecap="round" fill="none" />
    <path d="M80 220 Q50 230 35 255 Q30 265 38 270 Q46 275 52 265 Q65 248 85 238"
      stroke="#f5f5ef" strokeWidth="17" strokeLinecap="round" fill="none" />

    {/* Guante izquierdo tipo rubber-hose (4 dedos) */}
    <ellipse cx="37" cy="272" rx="14" ry="12" fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="2.5" />
    {/* Dedos del guante */}
    <path d="M26 265 Q22 258 25 252 Q28 248 32 251 Q30 260 31 267"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M30 263 Q26 254 30 249 Q34 246 37 250 Q35 260 34 268"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M37 261 Q35 252 40 249 Q44 248 46 253 Q43 261 41 268"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M44 263 Q44 254 48 252 Q52 253 51 260 Q49 267 47 272"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />

    {/* Tijeras en la mano izquierda */}
    <g transform="translate(12,245) rotate(-30)">
      <path d="M8 4 L18 22" stroke="#525252" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 4 L12 22" stroke="#525252" strokeWidth="4" strokeLinecap="round" />
      <circle cx="15" cy="20" r="3" stroke="#525252" strokeWidth="2.5" fill="none" />
      <ellipse cx="10" cy="27" rx="4" ry="3" stroke="#525252" strokeWidth="2" fill="none" />
      <ellipse cx="20" cy="27" rx="4" ry="3" stroke="#525252" strokeWidth="2" fill="none" />
      <line x1="12.5" y1="21.5" x2="9.5" y2="24" stroke="#525252" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="17.5" y1="21.5" x2="20.5" y2="24" stroke="#525252" strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Brazo derecho — levantado */}
    <path d="M140 220 Q170 225 185 210 Q195 200 188 193 Q181 186 172 195 Q165 205 148 212"
      stroke="#0d0d0d" strokeWidth="24" strokeLinecap="round" fill="none" />
    <path d="M140 220 Q170 225 185 210 Q195 200 188 193 Q181 186 172 195 Q165 205 148 212"
      stroke="#f5f5ef" strokeWidth="17" strokeLinecap="round" fill="none" />
    {/* Guante derecho saludando */}
    <ellipse cx="188" cy="191" rx="14" ry="13" fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="2.5" />
    <path d="M178 184 Q175 176 179 172 Q184 170 187 175"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M183 182 Q181 174 185 170 Q189 169 191 174"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M188 181 Q187 173 191 170 Q195 170 196 175"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />
    <path d="M193 183 Q193 175 196 173 Q200 173 200 179"
      stroke="#0d0d0d" strokeWidth="2" fill="#f5f5ef" strokeLinecap="round" />

    {/* ── CABEZA: proporciones exageradas Fleischer ── */}
    {/* Cuello */}
    <rect x="100" y="185" width="20" height="20" rx="4" fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="2.5" />

    {/* Cabeza grande */}
    <ellipse cx="110" cy="145" rx="62" ry="58" fill="#f5f5ef" stroke="#0d0d0d" strokeWidth="3" />
    {/* Sombra lateral de cabeza (volumen con gris intermedio) */}
    <path d="M155 120 Q172 145 168 175 Q160 180 148 175 Q160 150 158 120Z"
      fill="#a8a8a0" opacity="0.45" />
    {/* Sombra inferior de cuello */}
    <path d="M80 180 Q90 195 110 195 Q130 195 140 180 Q130 190 110 192 Q90 190 80 180Z"
      fill="#6b6b6b" opacity="0.3" />

    {/* ── BIGOTE CARACTERÍSTICO 1930s ── */}
    <path d="M92 162 Q100 155 110 158 Q120 155 128 162"
      stroke="#0d0d0d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {/* Bigote rizado por cada extremo */}
    <path d="M93 162 Q87 165 86 170 Q87 173 91 170 Q93 165 93 162"
      fill="#0d0d0d" />
    <path d="M127 162 Q133 165 134 170 Q133 173 129 170 Q127 165 127 162"
      fill="#0d0d0d" />

    {/* ── OJOS "PIE-EYE" — característica Fleischer ── */}
    {/* Esclerótica grande */}
    <ellipse cx="90" cy="138" rx="18" ry="17" fill="white" stroke="#0d0d0d" strokeWidth="3" />
    <ellipse cx="130" cy="138" rx="18" ry="17" fill="white" stroke="#0d0d0d" strokeWidth="3" />
    {/* Iris oscuro */}
    <circle cx="92" cy="140" r="10" fill="#1a1a1a" />
    <circle cx="132" cy="140" r="10" fill="#1a1a1a" />
    {/* Pupila brillante */}
    <circle cx="95" cy="136" r="4" fill="#f5f5ef" />
    <circle cx="135" cy="136" r="4" fill="#f5f5ef" />
    {/* Destello pequeño */}
    <circle cx="98" cy="133" r="2" fill="white" />
    <circle cx="138" cy="133" r="2" fill="white" />
    {/* Cejas expresivas */}
    <path d="M75 122 Q90 116 105 120" stroke="#0d0d0d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M115 120 Q130 116 145 122" stroke="#0d0d0d" strokeWidth="3.5" strokeLinecap="round" fill="none" />

    {/* ── SONRISA GRANDE ── */}
    <path d="M88 170 Q110 185 132 170"
      stroke="#0d0d0d" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M88 170 Q110 190 132 170 L130 172 Q110 188 90 172Z"
      fill="#0d0d0d" opacity="0.85" />
    {/* Dientes */}
    <path d="M98 172 Q110 182 122 172" fill="white" />
    <line x1="110" y1="172" x2="110" y2="181" stroke="#0d0d0d" strokeWidth="1.5" />
    <line x1="104" y1="172" x2="103" y2="180" stroke="#0d0d0d" strokeWidth="1" />
    <line x1="116" y1="172" x2="117" y2="180" stroke="#0d0d0d" strokeWidth="1" />

    {/* ── SOMBRERO DE BARBERO ── */}
    {/* Ala del sombrero */}
    <ellipse cx="110" cy="88" rx="72" ry="9" fill="#1a1a1a" stroke="#0d0d0d" strokeWidth="2.5" />
    {/* Copa */}
    <rect x="72" y="40" width="76" height="50" rx="6" fill="#1a1a1a" stroke="#0d0d0d" strokeWidth="2.5" />
    {/* Banda roja del sombrero */}
    <rect x="72" y="76" width="76" height="12" rx="2" fill="#c1272d" stroke="#0d0d0d" strokeWidth="1.5" />
    {/* Detalle de trama en copa */}
    <path d="M80 45 L78 76 M87 43 L85 76 M94 42 L92 76 M101 41 L99 76 M108 41 L106 76 M115 41 L113 76 M122 42 L120 76 M129 43 L127 76 M136 45 L134 76"
      stroke="#3d3d3d" strokeWidth="0.7" opacity="0.5" />
    {/* Ornamento de botón en la copa */}
    <circle cx="110" cy="43" r="5" fill="#525252" stroke="#0d0d0d" strokeWidth="1.5" />
  </svg>
)

export default function HomePage() {
  const { user, loginWithGoogle } = useAuth()

  const { data: serviciosData } = useQuery({
    queryKey: ['servicios-populares'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios.filter((s: any) => s.popular).slice(0, 3),
  })

  return (
    <div style={{ backgroundColor: 'var(--gray-900)', color: 'var(--white)' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO — Iluminación cinematográfica dura, estilo Mickey Noir
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        style={{
          /* Fondo con degradado de "foco de luz única" (Ref B: iluminación noir) */
          background: `
            radial-gradient(ellipse 55% 70% at 30% 50%,
              #2a2a2a 0%,
              #1a1a1a 35%,
              #111111 60%,
              #080808 100%
            )
          `,
        }}
      >
        {/* Viñeta fuerte cinematográfica */}
        <div className="vignette-hard" />

        {/* Trama de fondo tipo papel/madera (Ref B) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.012) 0px,
                rgba(255,255,255,0.012) 1px,
                transparent 1px,
                transparent 18px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.008) 0px,
                rgba(255,255,255,0.008) 1px,
                transparent 1px,
                transparent 24px
              )
            `,
          }}
        />

        {/* Líneas de película horizontales (scratches) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                transparent 0%,
                rgba(255,255,255,0.03) 12%,
                transparent 12.1%,
                transparent 47%,
                rgba(255,255,255,0.02) 47.1%,
                transparent 47.3%,
                transparent 73%,
                rgba(255,255,255,0.025) 73.1%,
                transparent 73.3%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Contenido del hero */}
        <div className="page-container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Texto hero ── */}
            <div>
              {/* Eyebrow — sello de época */}
              <div
                className="inline-flex items-center gap-2.5 mb-7"
                style={{
                  background: 'var(--gray-800)',
                  border: '2px solid var(--gray-600)',
                  boxShadow: '3px 3px 0 var(--black)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ color: 'var(--accent-red)' }}>◆</span>
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-300)',
                  }}
                >
                  Est. Bogotá, Colombia — Desde 1930
                </span>
                <span style={{ color: 'var(--accent-red)' }}>◆</span>
              </div>

              {/* Título principal — Ultra slab serif con contorno de tinta */}
              <h1
                className="animate-fadeInUp"
                style={{
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.0,
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  className="block text-ink-outline"
                  style={{
                    fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                    color: 'var(--white)',
                    letterSpacing: '0.04em',
                  }}
                >
                  BARBERÍA
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                    color: 'var(--accent-red)',
                    letterSpacing: '0.04em',
                    textShadow: `
                      3px 3px 0 #6a0e11,
                      -1px -1px 0 var(--black),
                      1px -1px 0 var(--black),
                      -1px 1px 0 var(--black)
                    `,
                  }}
                >
                  DENVER
                </span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--gray-400)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '42ch',
                  marginBottom: '2.5rem',
                  borderLeft: '3px solid var(--gray-700)',
                  paddingLeft: '1rem',
                }}
              >
                Cortes clásicos a navaja, perfilado de barba y toalla caliente —
                la vieja guardia del oficio, sin concesiones.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/reservar"
                  className="btn btn-primary"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.classList.add('animate-squash')
                    el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
                  }}
                >
                  <CalendarInkSVG size={18} />
                  Reservar turno
                </Link>
                <Link to="/servicios" className="btn btn-secondary">
                  Ver catálogo
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Social proof — en tono papel y gris */}
              <div
                className="inline-flex items-center gap-5"
                style={{
                  background: 'var(--gray-800)',
                  border: '2px solid var(--gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 1.2rem',
                  boxShadow: '3px 3px 0 var(--black)',
                }}
              >
                <div className="flex flex-col">
                  <div className="flex gap-0.5" style={{ color: 'var(--gray-100)' }}>
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--gray-500)', letterSpacing: '0.08em' }}>
                    4.9 / 5.0 — Calificación
                  </span>
                </div>
                <div style={{ width: '1.5px', height: '32px', background: 'var(--gray-700)' }} />
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: 'var(--gray-400)' }} />
                  <div className="flex flex-col">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--white)', lineHeight: 1 }}>+500</span>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Clientes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mascota Fleischer + Polo de Barbería ── */}
            <div className="hidden lg:flex flex-col items-center justify-center relative">
              {/* Halo de luz cinematográfica detrás del personaje (Ref B) */}
              <div
                className="absolute"
                style={{
                  width: '340px',
                  height: '340px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(80,80,80,0.15) 0%, transparent 70%)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Polos de barbería decorativos */}
              <div className="absolute left-4 top-8" style={{ color: 'var(--gray-700)', opacity: 0.6 }}>
                <BarberPoleSVG />
              </div>
              <div className="absolute right-4 top-8" style={{ color: 'var(--gray-700)', opacity: 0.6 }}>
                <BarberPoleSVG />
              </div>

              {/* Mascota SVG */}
              <div
                className="animate-fadeInUp"
                style={{
                  width: '280px',
                  height: '400px',
                  filter: 'drop-shadow(6px 8px 0px rgba(0,0,0,0.7))',
                }}
              >
                <BarberMascotSVG />
              </div>

              {/* Letrero vintage debajo del personaje */}
              <div
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-600)',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  borderTop: '1px solid var(--gray-700)',
                  paddingTop: '0.5rem',
                }}
              >
                ✦ El Maestro Sánchez ✦
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Panel de cómic horizontal
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--gray-800)',
          borderTop: '3px solid var(--gray-700)',
          borderBottom: '3px solid var(--gray-700)',
        }}
      >
        <div className="page-container py-10">
          <div className="grid grid-cols-3 gap-0 text-center">
            {[
              {
                value: '4.9',
                label: 'Estrellas',
                icon: <StarInkSVG filled size={22} />,
              },
              {
                value: '8+',
                label: 'Servicios',
                icon: <ScissorsSVG size={22} />,
              },
              {
                value: '5',
                label: 'Años de oficio',
                icon: <CalendarInkSVG size={22} />,
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 py-4"
                style={{
                  borderRight: i < 2 ? '2px solid var(--gray-700)' : 'none',
                }}
              >
                {/* Icono en marco de tinta */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '2.5px solid var(--gray-600)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--gray-900)',
                    boxShadow: '3px 3px 0 var(--black)',
                    color: 'var(--gray-300)',
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: 'var(--white)',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-500)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICIOS POPULARES
          ═══════════════════════════════════════════════════════ */}
      {serviciosData && serviciosData.length > 0 && (
        <section className="py-20">
          <div className="page-container">
            <div className="text-center mb-14">
              <div className="divider-ornament justify-center mb-5">
                <Award size={18} style={{ color: 'var(--gray-400)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
                Servicios Populares
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--gray-500)',
                  marginTop: '0.5rem',
                }}
              >
                Los cortes más solicitados en la silla del maestro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {serviciosData.map((s: any) => (
                <ServicioCard key={s.id} servicio={s} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/servicios" className="btn btn-secondary">
                Catálogo completo
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          CÓMO FUNCIONA — Paneles de cómic verticales
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          borderTop: '3px solid var(--gray-700)',
          background: `
            linear-gradient(180deg, var(--gray-900) 0%, var(--gray-800) 100%)
          `,
        }}
        className="py-20"
      >
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
              ¿Cómo Reservar?
            </h2>
            <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
              Tres pasos. Sin complicaciones. A la antigua usanza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                num: '01',
                title: 'Elige tu corte',
                desc: 'Clásico fade, perfilado de barba, combo completo o tratamiento premium. El catálogo habla solo.',
                icon: <ScissorsSVG size={32} />,
              },
              {
                num: '02',
                title: 'Elige tu barbero',
                desc: 'Selecciona al maestro de tu confianza y consulta su disponibilidad en tiempo real.',
                icon: <BarberPoleSVG />,
              },
              {
                num: '03',
                title: 'Confirma tu hora',
                desc: 'Escoge la fecha y el horario. El pago se efectúa directamente en caja al finalizar el servicio.',
                icon: <CalendarInkSVG size={32} />,
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="card flex flex-col"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  borderRight: i < 2 ? 'none' : undefined,
                  marginRight: i < 2 ? '-1px' : '0',
                  zIndex: 3 - i,
                }}
              >
                {/* Número de panel tipo cómic */}
                <div className="flex items-start gap-4 mb-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3.5rem',
                      lineHeight: 0.9,
                      color: 'var(--gray-700)',
                      userSelect: 'none',
                    }}
                  >
                    {step.num}
                  </span>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      border: '2.5px solid var(--gray-600)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gray-900)',
                      boxShadow: '3px 3px 0 var(--black)',
                      color: 'var(--gray-300)',
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'var(--white)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link to="/reservar" className="btn btn-primary">
                <CalendarInkSVG size={18} />
                Reservar turno ahora
              </Link>
            ) : (
              <button onClick={loginWithGoogle} className="btn btn-primary">
                Iniciar sesión para reservar
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
