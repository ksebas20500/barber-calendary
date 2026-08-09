import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import ServicioCard from '@/components/client/ServicioCard'

const CATEGORIAS = ['TODOS', 'CORTE', 'PREMIUM', 'CEJAS', 'BARBA', 'COMBO']

export default function ServiciosPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODOS')
  const [busqueda, setBusqueda] = useState('')

  const { data, isLoading } = useQuery({
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
    <div className="py-16">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 style={{ color: 'var(--color-cream)' }}>Nuestros servicios</h1>
          <p className="text-[var(--color-gray)] mt-3 max-w-xl mx-auto">
            Desde el corte clásico hasta tratamientos premium — arte y precisión en cada sesión.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray)]"
            />
            <input
              type="text"
              placeholder="Buscar servicio..."
              className="input pl-9"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[var(--color-sepia)]" />
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
                  categoriaFiltro === cat
                    ? 'border-[var(--color-red)] bg-[var(--color-red)] text-white'
                    : 'border-[var(--color-border)] text-[var(--color-gray)] hover:border-[var(--color-sepia)] hover:text-[var(--color-cream)]'
                }`}
              >
                {cat === 'TODOS' ? 'Todos' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-80 skeleton" />
            ))}
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✂</div>
            <p className="text-[var(--color-gray)]">No se encontraron servicios con esos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosFiltrados.map((s: any, i: number) => (
              <div key={s.id} style={{ animationDelay: `${i * 60}ms` }}>
                <ServicioCard servicio={s} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
