import { Scissors, MapPin, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="border-t-4 border-black bg-[#0a0a0a] mt-24 text-[var(--ink)]"
    >
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-white bg-black shadow-[3px_3px_0px_#000000]">
                <Scissors size={20} className="text-white stroke-[2.5]" />
              </div>
              <div>
                <span
                  className="block text-xl font-black tracking-wider text-white"
                  style={{ fontFamily: 'var(--font-title)' }}
                >
                  BARBERÍA DENVER
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--ink-muted)] leading-relaxed font-medium">
              Cortes clásicos, toallas calientes y perfilado a navaja. Estilo 1930 Fleischer Cartoon con precisión quirúrgica.
            </p>
            <a
              href="https://www.instagram.com/barberiadenver/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm font-extrabold text-white hover:text-[var(--accent)] transition-colors"
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
              className="text-sm font-black uppercase tracking-widest mb-4 text-white"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              Navegación
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Inicio' },
                { to: '/servicios', label: 'Servicios' },
                { to: '/reservar', label: 'Reservar cita' },
                { to: '/perfil', label: 'Mi perfil' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-semibold text-[var(--ink-muted)] hover:text-white transition-colors"
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
              className="text-sm font-black uppercase tracking-widest mb-4 text-white"
              style={{ fontFamily: 'var(--font-title)' }}
            >
              Horarios de atención
            </h4>
            <ul className="space-y-3 text-sm text-[var(--ink-muted)] font-medium">
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="text-white" />
                <span>Lun – Vie: 9:00 a.m. – 5:00 p.m.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={16} className="text-white" />
                <span>Sábado: 9:00 a.m. – 3:00 p.m.</span>
              </li>
              <li className="flex items-center gap-2.5 pt-2">
                <MapPin size={16} className="text-white" />
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-ornament my-10">✦</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[var(--ink-muted)]">
            © {new Date().getFullYear()} Barbería Denver. Todos los derechos reservados.
          </p>
          <p className="text-xs font-bold text-white">
            Pagos exclusivamente en caja • No se procesan pagos en línea
          </p>
        </div>
      </div>
    </footer>
  )
}

