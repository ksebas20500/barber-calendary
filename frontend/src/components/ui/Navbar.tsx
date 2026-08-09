import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Scissors, Menu, X, User, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, loginWithGoogle, logout, isAdmin, isBarbero } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    await loginWithGoogle()
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs md:text-sm font-extrabold uppercase tracking-widest transition-all duration-150 py-1 ${
      isActive
        ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
        : 'text-[var(--ink-muted)] hover:text-white'
    }`

  return (
    <nav
      className="sticky top-0 z-50 border-b-2 border-[#262626]"
      style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo vintage cartoon B&W */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border-3 border-white bg-black shadow-[3px_3px_0px_#000000] group-hover:scale-105 transition-transform">
              <Scissors size={22} className="text-white stroke-[2.5]" />
            </div>
            <div>
              <span
                className="block text-xl leading-none font-black tracking-wider text-white"
                style={{ fontFamily: 'var(--font-title)' }}
              >
                BARBERÍA
              </span>
              <span
                className="block text-xs leading-tight tracking-[0.25em] font-extrabold uppercase text-[var(--ink-muted)]"
              >
                DENVER 1930
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/servicios" className={navLinkClass}>Servicios</NavLink>
            <NavLink to="/reservar" className={navLinkClass}>Reservar</NavLink>
            {isBarbero && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/perfil" className="flex items-center gap-2.5 group">
                  {user.firebaseUser.photoURL ? (
                    <img
                      src={user.firebaseUser.photoURL}
                      alt={user.firebaseUser.displayName || 'Usuario'}
                      className="w-9 h-9 rounded-full border-2 border-white object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center bg-[#141414]">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                    {user.firebaseUser.displayName?.split(' ')[0] || 'Perfil'}
                  </span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" title="Panel Admin">
                    <Settings size={18} className="text-[var(--ink-muted)] hover:text-white transition-colors" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors p-1"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn btn-primary text-xs px-5 py-2"
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.classList.add('animate-squash')
                  el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
                }}
              >
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t-2 border-[#262626] py-5 flex flex-col gap-4 animate-fadeIn">
            <NavLink to="/servicios" className={navLinkClass} onClick={() => setMenuOpen(false)}>Servicios</NavLink>
            <NavLink to="/reservar" className={navLinkClass} onClick={() => setMenuOpen(false)}>Reservar</NavLink>
            {isBarbero && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
            )}
            {user ? (
              <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
                <Link to="/perfil" className="text-sm font-bold text-white" onClick={() => setMenuOpen(false)}>
                  {user.firebaseUser.displayName?.split(' ')[0] || 'Perfil'}
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost text-xs">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn btn-primary text-xs w-full">
                Iniciar sesión con Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

