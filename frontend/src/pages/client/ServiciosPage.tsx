import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import ServicioCard from '@/components/client/ServicioCard'

const CATEGORIAS = ['TODOS', 'CORTE', 'PREMIUM', 'CEJAS', 'BARBA', 'COMBO']

export default function ServiciosPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios,
  })

  const serviciosFiltrados = data?.filter((s: any) => {
    const matchCategoria = categoriaFiltro === 'TODOS' || s.categoria === categoriaFiltro
    const matchBusqueda =
      busqueda === '' ||
      s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchBusqueda
  }) ?? []

  return (
    <div className="bg-[#eae5d8] min-h-screen py-16 text-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header estilo La Carta */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 block mb-2">
            LA CARTA
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold text-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nuestros servicios
          </h1>
          <p className="font-mono text-xs text-black/70 mt-3 max-w-xl mx-auto">
            Desde el corte clásico hasta tratamientos premium — arte y precisión en cada sesión.
          </p>
        </div>

        {/* Buscador y Filtros alineados perfectamente */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Campo de Búsqueda Vintage */}
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/50"
            />
            <input
              type="text"
              placeholder="Buscar servicio..."
              className="w-full bg-[#e2ded2] border-1.5 border-black pl-10 pr-4 py-2.5 font-mono text-xs text-black focus:outline-none focus:bg-white placeholder:text-black/50"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Filtros por Categoría */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider border-1.5 transition-colors cursor-pointer ${
                  categoriaFiltro === cat
                    ? 'border-black bg-black text-white'
                    : 'border-black/30 bg-[#e2ded2] text-black hover:border-black'
                }`}
              >
                {cat === 'TODOS' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de 2 Columnas (Estilo Foto 2: La Carta, amplio y sin desbordamientos) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-56 bg-[#e2ded2] border-2 border-black animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 border-2 border-black bg-[#eae5d8] p-8 max-w-lg mx-auto shadow-[4px_4px_0_#000]">
            <div className="text-3xl mb-3 text-black font-bold font-mono">⚠️ ERROR DE CONEXIÓN</div>
            <p className="text-black/80 text-xs mb-6 font-mono">
              No se pudo obtener la lista de servicios del servidor backend.
            </p>
            <button
              onClick={() => refetch()}
              className="btn-vintage-black"
            >
              Reintentar
            </button>
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 text-black">✂</div>
            <p className="font-mono text-sm text-black/60">No se encontraron servicios con esos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviciosFiltrados.map((s: any, i: number) => (
              <ServicioCard key={s.id} servicio={s} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
