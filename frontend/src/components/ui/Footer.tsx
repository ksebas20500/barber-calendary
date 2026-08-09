import { MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#0d0d0d] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-lg font-mono border-2 border-white">
                D
              </div>
              <div>
                <span
                  className="block text-xl font-bold tracking-wider text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  BARBERÍA DENVER
                </span>
              </div>
            </div>
            <p className="text-xs font-mono text-white/70 leading-relaxed">
              Cortes clásicos, toallas calientes y perfilado a navaja. El encanto de los dibujos animados de los años treinta.
            </p>
            <a
              href="https://www.instagram.com/barberiadenver/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs font-mono font-bold text-white hover:underline"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              @barberiadenver
            </a>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-xs font-mono font-bold uppercase tracking-widest mb-4 text-white/90"
            >
              Navegación
            </h4>
            <ul className="space-y-2 font-mono text-xs text-white/70">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/servicios', label: 'Servicios' },
                { to: '/barberos', label: 'Barberos' },
                { to: '/reservar', label: 'Reservar cita' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4
              className="text-xs font-mono font-bold uppercase tracking-widest mb-4 text-white/90"
            >
              Horarios de atención
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-white" />
                <span>Lun – Vie: 9:00 a.m. – 5:00 p.m.</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-white" />
                <span>Sábado: 9:00 a.m. – 3:00 p.m.</span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <MapPin size={14} className="text-white" />
                <span>Villa del Rosario, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 my-8"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Barbería Denver. Todos los derechos reservados.
          </p>
          <p className="text-white/80 font-bold">
            Pagos exclusivamente en caja • No se procesan pagos en línea
          </p>
        </div>
      </div>
    </footer>
  )
}
