import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Scissors, Star, Clock, ChevronRight, Award, Users, Calendar } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import ServicioCard from '@/components/client/ServicioCard'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loginWithGoogle } = useAuth()

  const { data: serviciosData } = useQuery({
    queryKey: ['servicios-populares'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios.filter((s: any) => s.popular).slice(0, 3),
  })

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[var(--ink)]">
      {/* ── HERO VINTAGE FLEISCHER B&W ──────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b-4 border-black">
        {/* Subtle Vignette & B&W Film Frame */}
        <div className="vignette-overlay" />

        {/* Vintage film lines hint */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="page-container relative z-10 py-20 text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border-2 border-white bg-[#141414] shadow-[3px_3px_0px_#000000] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-white">
              Est. Bogotá, Colombia • 1930 Style
            </span>
          </div>

          {/* Main heading in Bungee vintage font */}
          <h1 className="mb-6 leading-tight">
            <span className="block text-[clamp(2.8rem,7vw,6.5rem)] font-black text-white text-cartoon-shadow">
              BARBERÍA
            </span>
            <span
              className="block text-[clamp(3.5rem,8.5vw,7.5rem)] font-black text-[var(--accent)] text-cartoon-shadow"
            >
              DENVER
            </span>
          </h1>

          <p className="text-base md:text-xl max-w-xl text-[var(--ink-muted)] mb-10 font-medium leading-relaxed">
            Cortes clásicos, toallas calientes y perfilado a navaja.
            Estética vintage cartoon de los 30 con precisión quirúrgica.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-5 mb-14">
            <Link
              to="/reservar"
              className="btn btn-primary text-base px-8 py-3.5"
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.classList.add('animate-squash')
                el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
              }}
            >
              <Calendar size={20} />
              Reservar hora
            </Link>
            <Link to="/servicios" className="btn btn-secondary text-base px-8 py-3.5">
              Ver catálogo
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Social proof in crisp B&W */}
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl border-2 border-[#262626] bg-[#141414]">
            <div className="flex items-center gap-2">
              <div className="flex text-white font-extrabold tracking-widest text-sm">★★★★★</div>
              <span className="text-xs font-bold text-white">4.9 / 5.0</span>
            </div>
            <div className="h-4 w-px bg-[#333333]" />
            <div className="flex items-center gap-2">
              <Users size={16} className="text-white" />
              <span className="text-xs font-bold text-[var(--ink-muted)]">+500 Clientes Felices</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ───────────────────────────────────────── */}
      <section className="py-12 border-b-2 border-[#262626] bg-[#141414]">
        <div className="page-container">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { icon: <Star size={24} className="stroke-[2.5]" />, value: '4.9', label: 'Calificación' },
              { icon: <Scissors size={24} className="stroke-[2.5]" />, value: '8+', label: 'Servicios' },
              { icon: <Clock size={24} className="stroke-[2.5]" />, value: '5 Años', label: 'Experiencia' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg border-2 border-white bg-black flex items-center justify-center text-white shadow-[3px_3px_0px_#000000]">
                  {stat.icon}
                </div>
                <div
                  className="text-2xl md:text-3xl font-black text-white"
                  style={{ fontFamily: 'var(--font-title)' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SERVICES ───────────────────────────────────── */}
      {serviciosData && serviciosData.length > 0 && (
        <section className="py-20 border-b-2 border-[#262626]">
          <div className="page-container">
            <div className="text-center mb-14">
              <div className="divider-ornament justify-center mb-4">
                <Award size={20} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl text-white font-black">Servicios Populares</h2>
              <p className="text-[var(--ink-muted)] mt-2 font-medium">Los cortes preferidos en la silla de barbero</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {serviciosData.map((s: any) => (
                <ServicioCard key={s.id} servicio={s} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/servicios" className="btn btn-secondary text-sm">
                Ver todos los servicios
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS (RUBBER HOSE CARTOON STEPS) ─────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl text-white font-black">¿Cómo Reservar?</h2>
            <p className="text-[var(--ink-muted)] mt-2 font-medium">Agenda tu cita en 3 sencillos pasos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Elige tu servicio',
                desc: 'Selecciona corte de cabello, perfilado de barba o combos completos.',
                icon: '✂',
              },
              {
                num: '02',
                title: 'Selecciona tu barbero',
                desc: 'Elige a tu barbero de confianza y revisa sus horarios libres.',
                icon: '💈',
              },
              {
                num: '03',
                title: 'Confirma tu cita',
                desc: 'Escoge fecha y hora. El pago se efectúa directamente en caja al finalizar.',
                icon: '📅',
              },
            ].map((step) => (
              <div key={step.num} className="card text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl border-3 border-white bg-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_#000000] mb-4">
                  {step.icon}
                </div>
                <div
                  className="text-4xl font-black mb-2 text-[var(--accent)]"
                  style={{ fontFamily: 'var(--font-title)' }}
                >
                  STEP {step.num}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link to="/reservar" className="btn btn-primary text-base px-10 py-3.5">
                <Calendar size={18} />
                Reservar turno ahora
              </Link>
            ) : (
              <button onClick={loginWithGoogle} className="btn btn-primary text-base px-10 py-3.5">
                Iniciar sesión para reservar
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

