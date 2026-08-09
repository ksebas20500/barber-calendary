import { useNavigate } from 'react-router-dom'
import { formatCOP } from '@/lib/utils'
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
  index?: number
}

export default function ServicioCard({ servicio, index = 1 }: ServicioCardProps) {
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

  return (
    <div className="card-servicio-vintage h-full flex flex-col justify-between">
      <div>
        {/* Header Line: Nombre y Precio con número índice (Estilo Foto 2) */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[0.65rem] font-bold text-black/60 uppercase tracking-wider block mb-0.5">
              {servicio.categoria}
            </span>
            <h3
              className="text-2xl font-bold text-black leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {servicio.nombre}
            </h3>
          </div>

          <div className="text-right">
            <span className="font-mono text-[0.65rem] text-black/40 block leading-none font-bold">
              0{index}
            </span>
            <span
              className="text-2xl md:text-3xl font-bold text-black leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {formatCOP(servicio.precio)}
            </span>
          </div>
        </div>

        {/* Separador Punteado */}
        <div className="border-b-2 border-dotted border-black/40 my-3.5" />

        {/* Descripción estilo mecanografía */}
        <p className="font-mono text-xs text-black/80 leading-relaxed mb-3">
          {servicio.descripcion}
        </p>
      </div>

      <div>
        {/* Separador Punteado */}
        <div className="border-b-2 border-dotted border-black/40 my-3.5" />

        {/* Footer: Duración y Botón Reservar */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.7rem] font-bold text-black/70 uppercase tracking-widest">
            DURACIÓN · {servicio.duracionMinutos} MIN
          </span>

          <button
            onClick={handleReservar}
            className="btn-vintage-black py-2 px-4 text-[0.7rem]"
          >
            RESERVAR
          </button>
        </div>
      </div>
    </div>
  )
}
