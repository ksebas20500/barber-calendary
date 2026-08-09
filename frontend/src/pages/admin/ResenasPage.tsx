import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Trash2, Loader2, Star } from 'lucide-react'
import { resenasApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function AdminResenasPage() {
  const qc = useQueryClient()

  const { data: resenas, isLoading } = useQuery({
    queryKey: ['admin-resenas'],
    queryFn: () => resenasApi.adminGetAll(),
    select: (res) => res.data.resenas,
  })

  const { mutate: toggleOcultar } = useMutation({
    mutationFn: (id: string) => resenasApi.ocultar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-resenas'] }),
  })

  const { mutate: eliminarResena } = useMutation({
    mutationFn: (id: string) => resenasApi.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-resenas'] }),
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>Moderación de reseñas</h1>
        <p className="text-sm text-[var(--color-gray)]">{resenas?.length || 0} reseñas recibidas</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
        </div>
      ) : (
        <div className="space-y-4">
          {resenas?.map((r: any) => (
            <div
              key={r.id}
              className={`card flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity ${
                r.oculta ? 'opacity-50 bg-stone-950/40' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-[var(--color-cream)]">{r.cliente.nombre}</span>
                  <span className="text-xs text-[var(--color-gray)]">({r.cliente.email})</span>
                  <span className="text-xs text-[var(--color-gray)]">• {formatDate(r.fecha)}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="stars text-sm">
                    {'★'.repeat(r.estrellas) + '☆'.repeat(5 - r.estrellas)}
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-sepia)]">
                    Barbero: {r.barbero.usuario.nombre}
                  </span>
                </div>

                {r.comentario ? (
                  <p className="text-sm text-[var(--color-cream)] italic">"{r.comentario}"</p>
                ) : (
                  <p className="text-xs text-[var(--color-gray)] italic">Sin comentario escrito</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleOcultar(r.id)}
                  className={`btn text-xs py-1.5 px-3 ${
                    r.oculta ? 'btn-secondary' : 'btn-ghost text-[var(--color-gray)] hover:text-white'
                  }`}
                  title={r.oculta ? 'Mostrar reseña' : 'Ocultar reseña'}
                >
                  {r.oculta ? <Eye size={14} /> : <EyeOff size={14} />}
                  {r.oculta ? 'Oculta' : 'Ocultar'}
                </button>

                <button
                  onClick={() => { if (window.confirm('¿Eliminar reseña de forma permanente?')) eliminarResena(r.id) }}
                  className="btn btn-ghost text-xs text-[var(--color-red)] hover:bg-red-900/20 py-1.5 px-3"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
