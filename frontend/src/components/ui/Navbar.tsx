import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'

// Tijeras de tinta custom (trazo variable) — NO ícono genérico de librería
const ScissorsInkSVG = () => (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M8 5 C9 4.2, 11 4.8, 12 6.5 L18.5 17.5"
      stroke="white" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <path d="M24 5 C23 4.2, 21 4.8, 20 6.5 L13.5 17.5"
      stroke="white" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <circle cx="16" cy="16.8" r="2.5" stroke="white" strokeWidth="2.5" fill="none" />
    <ellipse cx="10" cy="25" rx="4.5" ry="4" stroke="white" strokeWidth="2.5" fill="none" />
    <ellipse cx="22" cy="25" rx="4.5" ry="4" stroke="white" strokeWidth="2.5" fill="none" />
    <line x1="12.8" y1="18.8" x2="9.5" y2="21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="19.2" y1="18.8" x2="22.5" y2="21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

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
    `transition-all duration-150 py-1 ${
      isActive
        ? 'nav-active'
        : 'hover:text-white'
    }`

  const navLinkStyle = {
    fontFamily: 'var(--font-label)',
    fontSize: '0.78rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: 'var(--gray-400)',
  }

  return (
    <nav
      className="navbar-bg sticky top-0 z-50"
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo: marco de tinta, tijeras custom, tipografía Ultra */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              style={{
                width: '42px',
                height: '42px',
                border: '2.5px solid var(--gray-600)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--black)',
                boxShadow: '3px 3px 0 var(--black)',
                transition: 'transform 0.15s ease',
              }}
              className="group-hover:scale-105"
            >
              <ScissorsInkSVG />
            </div>
            <div>
              <span
                className="block leading-none text-white"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  letterSpacing: '0.06em',
                }}
              >
                BARBERÍA
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-500)',
                  lineHeight: 1.4,
                }}
              >
                DENVER ✦ EST. 2019
              </span>
            </div>
          </Link>

          {/* Desktop Nav — Special Elite font, trazo fino */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/servicios" className={navLinkClass} style={navLinkStyle}>Servicios</NavLink>
            <NavLink to="/reservar" className={navLinkClass} style={navLinkStyle}>Reservar</NavLink>
            {isBarbero && (
              <NavLink to="/admin" className={navLinkClass} style={navLinkStyle}>Admin</NavLink>
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
            <NavLink to="/servicios" className={navLinkClass} style={navLinkStyle} onClick={() => setMenuOpen(false)}>Servicios</NavLink>
            <NavLink to="/reservar" className={navLinkClass} style={navLinkStyle} onClick={() => setMenuOpen(false)}>Reservar</NavLink>
            {isBarbero && (
              <NavLink to="/admin" className={navLinkClass} style={navLinkStyle} onClick={() => setMenuOpen(false)}>Admin</NavLink>
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

