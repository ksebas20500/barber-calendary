import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Loader2, X, Check } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import { formatCOP } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres'),
  precio: z.coerce.number().int().positive(),
  duracionMinutos: z.coerce.number().int().positive(),
  categoria: z.enum(['CORTE', 'PREMIUM', 'CEJAS', 'BARBA', 'COMBO']),
  popular: z.boolean(),
  activo: z.boolean(),
  imagenUrl: z.string().url().optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

export default function AdminServiciosPage() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; servicio?: any } | null>(null)

  const { data: servicios, isLoading } = useQuery({
    queryKey: ['admin-servicios'],
    queryFn: () => serviciosApi.adminGetAll(),
    select: (res) => res.data.servicios,
  })

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: modal?.servicio || { popular: false, activo: true },
  })

  const { mutate: guardar, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      modal?.mode === 'edit'
        ? serviciosApi.update(modal.servicio.id, data)
        : serviciosApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-servicios'] })
      setModal(null)
      resetForm()
    },
  })

  const { mutate: eliminar } = useMutation({
    mutationFn: (id: string) => serviciosApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-servicios'] }),
  })

  const openCreate = () => {
    resetForm({ nombre: '', descripcion: '', precio: 0, duracionMinutos: 30, categoria: 'CORTE', popular: false, activo: true, imagenUrl: '' })
    setModal({ mode: 'create' })
  }

  const openEdit = (s: any) => {
    resetForm({ ...s, precio: s.precio, duracionMinutos: s.duracionMinutos, imagenUrl: s.imagenUrl || '' })
    setModal({ mode: 'edit', servicio: s })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl" style={{ color: 'var(--color-cream)' }}>Gestión de servicios</h1>
          <p className="text-sm text-[var(--color-gray)]">{servicios?.length || 0} servicios registrados</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={28} className="animate-spin text-[var(--color-sepia)]" />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(58, 46, 30, 0.5)', borderBottom: '1px solid var(--color-border)' }}>
                {['Servicio', 'Categoría', 'Precio', 'Duración', 'Estado', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servicios?.map((s: any) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--color-border)] hover:bg-[rgba(58,46,30,0.2)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--color-cream)]">{s.nombre}</div>
                    <div className="text-xs text-[var(--color-gray)] mt-0.5">{s.descripcion.slice(0, 50)}...</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-gray)]">{s.categoria}</td>
                  <td className="px-4 py-3 font-semibold text-[var(--color-cream)]">{formatCOP(s.precio)}</td>
                  <td className="px-4 py-3 text-[var(--color-gray)]">{s.duracionMinutos} min</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${s.activo ? 'badge-active' : 'badge-inactive'}`}>
                      {s.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 rounded text-[var(--color-gray)] hover:text-[var(--color-sepia)] hover:bg-[rgba(200,169,110,0.1)] transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => confirmarEliminar(s.id)}
                        className="p-1.5 rounded text-[var(--color-gray)] hover:text-[var(--color-red)] hover:bg-[rgba(200,20,30,0.1)] transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="card max-w-lg w-full animate-fadeInUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--color-cream)]">
                {modal.mode === 'create' ? 'Nuevo servicio' : 'Editar servicio'}
              </h2>
              <button onClick={() => setModal(null)} className="text-[var(--color-gray)] hover:text-[var(--color-cream)]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => guardar(data as FormData))} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">Nombre</label>
                <input {...register('nombre')} className="input" placeholder="Ej: Corte clásico" />
                {errors.nombre && <p className="text-xs text-[var(--color-red)] mt-1">{errors.nombre.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">Descripción</label>
                <textarea {...register('descripcion')} className="input h-20 resize-none" placeholder="Descripción del servicio..." />
                {errors.descripcion && <p className="text-xs text-[var(--color-red)] mt-1">{errors.descripcion.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">Precio (COP)</label>
                  <input {...register('precio')} type="number" className="input" placeholder="25000" />
                  {errors.precio && <p className="text-xs text-[var(--color-red)] mt-1">{errors.precio.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">Duración (min)</label>
                  <input {...register('duracionMinutos')} type="number" className="input" placeholder="30" />
                  {errors.duracionMinutos && <p className="text-xs text-[var(--color-red)] mt-1">{errors.duracionMinutos.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">Categoría</label>
                <select {...register('categoria')} className="input">
                  {['CORTE', 'PREMIUM', 'CEJAS', 'BARBA', 'COMBO'].map((c) => (
                    <option key={c} value={c} style={{ background: 'var(--color-bg)' }}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)] mb-1">URL de imagen (opcional)</label>
                <input {...register('imagenUrl')} className="input" placeholder="https://..." />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('popular')} type="checkbox" className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-[var(--color-cream)]">Marcar como popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('activo')} type="checkbox" className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-[var(--color-cream)]">Activo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="btn btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="btn btn-primary flex-1">
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {modal.mode === 'create' ? 'Crear' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )

  function confirmarEliminar(id: string) {
    if (window.confirm('¿Desactivar este servicio?')) eliminar(id)
  }
}
