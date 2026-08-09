import { useState } from 'react'
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

// Iconos custom dibujados según la imagen de referencia
const ServiceIconBox = ({ cat, nombre }: { cat: string; nombre: string }) => {
  const isNavaja = nombre.toLowerCase().includes('navaja') || cat === 'BARBA' && nombre.toLowerCase().includes('afeitado')
  const isBarba = nombre.toLowerCase().includes('barba') && !isNavaja
  const isCejas = cat === 'CEJAS' || nombre.toLowerCase().includes('ceja')

  return (
    <div className="w-14 h-14 border-2 border-white bg-black flex items-center justify-center mb-4 shadow-[2px_2px_0_#000]">
      {isNavaja ? (
        /* Navaja recta / Afeitado */
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect x="6" y="8" width="24" height="12" rx="2" stroke="white" strokeWidth="2.5" fill="none" />
          <line x1="6" y1="14" x2="30" y2="14" stroke="white" strokeWidth="1.5" />
          <rect x="12" y="20" width="12" height="6" rx="1.5" stroke="white" strokeWidth="2" fill="none" />
          <path d="M12 26 Q18 32 24 26" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ) : isBarba ? (
        /* Silueta de Barba */
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <path
            d="M8 12 Q18 6 28 12 Q30 20 28 26 Q18 34 8 26 Q6 20 8 12 Z"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
          />
          <path d="M12 15 Q18 19 24 15" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ) : isCejas ? (
        /* Peine / Perfilador de Cejas */
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect x="6" y="10" width="24" height="8" rx="1" stroke="white" strokeWidth="2.5" fill="none" />
          <line x1="9" y1="18" x2="9" y2="24" stroke="white" strokeWidth="2" />
          <line x1="13" y1="18" x2="13" y2="24" stroke="white" strokeWidth="2" />
          <line x1="17" y1="18" x2="17" y2="24" stroke="white" strokeWidth="2" />
          <line x1="21" y1="18" x2="21" y2="24" stroke="white" strokeWidth="2" />
          <line x1="25" y1="18" x2="25" y2="24" stroke="white" strokeWidth="2" />
        </svg>
      ) : (
        /* Tijeras estilo 1930s por defecto */
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <path d="M9 7 C10 6, 12 7, 13.5 9 L21.5 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M27 7 C26 6, 24 7, 22.5 9 L14.5 20" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="18" cy="19" r="2.5" stroke="white" strokeWidth="2" fill="none" />
          <ellipse cx="11.5" cy="28" rx="5" ry="4.5" stroke="white" strokeWidth="2.5" fill="none" />
          <ellipse cx="24.5" cy="28" rx="5" ry="4.5" stroke="white" strokeWidth="2.5" fill="none" />
        </svg>
      )}
    </div>
  )
}

export default function ServicioCard({ servicio }: ServicioCardProps) {
  const navigate = useNavigate()
  const { setServicio, setPaso } = useReservaStore()
  const [expanded, setExpanded] = useState(false)

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

  const SHORT_DESC = 75

  return (
    <div className="relative bg-[#141414] border-2.5 border-white shadow-[5px_5px_0_#000] p-6 flex flex-col justify-between animate-fadeInUp">
      {/* ── Badge POPULAR (Sello rojo superior derecho) ── */}
      {servicio.popular && (
        <div className="bg-[#c1272d] text-white border-2 border-white px-3 py-0.5 text-[11px] font-black uppercase tracking-widest shadow-[2px_2px_0_#000] absolute -top-3.5 right-4 z-10">
          POPULAR
        </div>
      )}

      <div>
        {/* ── Icono en recuadro blanco de la guía ── */}
        <ServiceIconBox cat={servicio.categoria} nombre={servicio.nombre} />

        {/* ── Nombre del servicio (Ultra font) ── */}
        <h3
          className="text-2xl text-white font-black mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {servicio.nombre}
        </h3>

        {/* ── Descripción con Ver más ── */}
        <p className="text-sm text-[#a8a8a0] leading-relaxed mb-1 font-body">
          {expanded ? servicio.descripcion : truncate(servicio.descripcion, SHORT_DESC)}
        </p>
        {servicio.descripcion.length > SHORT_DESC && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-white underline font-bold font-mono inline-block mb-3 cursor-pointer hover:text-[var(--accent-red)]"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}

        {/* ── Duración (A PARTIR DE XX MIN) ── */}
        <div className="border-t border-[#333] pt-3 mb-5 mt-2 flex items-center gap-1.5 text-xs text-[#8c8c87] font-mono tracking-widest uppercase">
          <Clock size={14} className="text-[#8c8c87]" />
          <span>A PARTIR DE {servicio.duracionMinutos} MIN</span>
        </div>
      </div>

      {/* ── Fila inferior: Precio y Botón RESERVAR ── */}
      <div className="flex items-center justify-between pt-2">
        <span
          className="text-2xl md:text-3xl text-white font-black"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {formatCOP(servicio.precio)}
        </span>

        <button
          onClick={handleReservar}
          className="bg-[#c1272d] text-white border-2 border-white font-black text-xs uppercase px-5 py-2.5 shadow-[3px_3px_0_#000] hover:bg-[#9a1f24] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          RESERVAR
        </button>
      </div>
    </div>
  )
}
