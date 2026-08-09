import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { LayoutDashboard, Scissors, Users, Calendar, Star, ArrowLeft, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout() {
  const { user, loading, isBarbero } = useAuth()

  if (loading) return null

  // Restrict admin panel to BARBERO or ADMIN role
  if (!user || !isBarbero) {
    return (
      <div className="page-container py-24 text-center">
        <div className="card max-w-md mx-auto py-12">
          <ShieldAlert size={48} className="mx-auto mb-4 text-[var(--color-red)]" />
          <h2 className="text-xl font-bold mb-2 text-[var(--color-cream)]">Acceso Restringido</h2>
          <p className="text-sm text-[var(--color-gray)] mb-6">
            Esta sección está reservada exclusivamente para el equipo y administración de Barbería Denver.
          </p>
          <NavLink to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Volver al inicio
          </NavLink>
        </div>
      </div>
    )
  }

  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/calendario', label: 'Calendario', icon: <Calendar size={18} /> },
    { to: '/admin/servicios', label: 'Servicios', icon: <Scissors size={18} /> },
    { to: '/admin/barberos', label: 'Barberos', icon: <Users size={18} /> },
    { to: '/admin/resenas', label: 'Reseñas', icon: <Star size={18} /> },
  ]

  return (
    <div className="page-container py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <div className="card p-3 sticky top-24">
            <div className="px-3 py-2 border-b border-[var(--color-border)] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sepia)]">
                Panel Admin
              </span>
              <p className="text-xs text-[var(--color-cream)] font-semibold truncate mt-0.5">
                {user.firebaseUser.displayName || user.firebaseUser.email}
              </p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[var(--color-red)] text-white shadow-sm'
                        : 'text-[var(--color-gray)] hover:text-[var(--color-cream)] hover:bg-[rgba(255,255,255,0.04)]'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
