import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'

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

  return (
    <nav className="bg-[#eae5d8] border-b-2 border-black sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo estilo "La Navaja de Oro": Circle (D) + Tipografía Rye/Ultra */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-xl font-mono shadow-[2px_2px_0_#000] border-2 border-black group-hover:scale-105 transition-transform">
              D
            </div>
            <div>
              <span
                className="block leading-none text-black font-bold text-xl md:text-2xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Barbería Denver
              </span>
              <span className="block text-[0.6rem] font-mono tracking-[0.25em] text-black/60 uppercase mt-0.5">
                EST. 2019 · VILLA DEL ROSARIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation links (Estilo Foto 1: Monospace uppercase subrayado) */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-[0.18em] uppercase font-bold text-black">
            <NavLink
              to="/servicios"
              className={({ isActive }) =>
                `transition-all py-1 border-b-2 ${
                  isActive ? 'border-black font-black' : 'border-transparent hover:border-black/50'
                }`
              }
            >
              SERVICIOS
            </NavLink>
            <NavLink
              to="/barberos"
              className={({ isActive }) =>
                `transition-all py-1 border-b-2 ${
                  isActive ? 'border-black font-black' : 'border-transparent hover:border-black/50'
                }`
              }
            >
              BARBEROS
            </NavLink>
            <NavLink
              to="/reservar"
              className={({ isActive }) =>
                `transition-all py-1 border-b-2 ${
                  isActive ? 'border-black font-black' : 'border-transparent hover:border-black/50'
                }`
              }
            >
              RESERVAR
            </NavLink>
            {isBarbero && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `transition-all py-1 border-b-2 ${
                    isActive ? 'border-black font-black' : 'border-transparent hover:border-black/50'
                  }`
                }
              >
                ADMIN
              </NavLink>
            )}
          </div>

          {/* Auth Button (Estilo Foto 1: Solid Black Box) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/perfil" className="flex items-center gap-2 group">
                  {user.firebaseUser.photoURL ? (
                    <img
                      src={user.firebaseUser.photoURL}
                      alt={user.firebaseUser.displayName || 'Usuario'}
                      className="w-8 h-8 rounded-full border-2 border-black object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-black text-white flex items-center justify-center">
                      <User size={14} />
                    </div>
                  )}
                  <span className="text-xs font-mono font-bold text-black group-hover:underline">
                    {user.firebaseUser.displayName?.split(' ')[0] || 'Perfil'}
                  </span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" title="Panel Admin">
                    <Settings size={18} className="text-black/70 hover:text-black transition-colors" />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="text-black/70 hover:text-black transition-colors p-1"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn-vintage-black text-xs py-2 px-5"
              >
                INICIAR SESIÓN
              </button>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <button
            className="md:hidden text-black p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t-2 border-black py-4 flex flex-col gap-3 font-mono text-xs font-bold uppercase tracking-wider">
            <NavLink
              to="/servicios"
              className="py-2 text-black hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              SERVICIOS
            </NavLink>
            <NavLink
              to="/barberos"
              className="py-2 text-black hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              BARBEROS
            </NavLink>
            <NavLink
              to="/reservar"
              className="py-2 text-black hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              RESERVAR
            </NavLink>
            {isBarbero && (
              <NavLink
                to="/admin"
                className="py-2 text-black hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                ADMIN
              </NavLink>
            )}
            {user ? (
              <div className="flex items-center justify-between pt-3 border-t border-black">
                <Link
                  to="/perfil"
                  className="text-xs font-bold text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {user.firebaseUser.displayName?.split(' ')[0] || 'Perfil'}
                </Link>
                <button onClick={handleLogout} className="text-xs text-red-600 font-bold">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn-vintage-black text-xs w-full py-3"
              >
                INICIAR SESIÓN CON GOOGLE
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
