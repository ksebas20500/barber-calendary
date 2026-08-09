import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { serviciosApi, barberosApi } from '@/lib/api'

// ═══════════════════════════════════════════════════════════════════════════
// MASCOTA "EL MAESTRO SÁNCHEZ" — ESTILO TINTA AÑOS 30S (REFERENCIA FOTO 1)
// Trazos limpios de tinta negra sobre pergamino, delantal a rayas, moño negro,
// sosteniendo navaja de afeitar en una mano y peine en la otra.
// ═══════════════════════════════════════════════════════════════════════════
const BarberMascotSVG = () => (
  <svg
    viewBox="0 0 280 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="El Maestro Sánchez — Caricatura 1930s"
    className="w-full h-auto max-h-[360px] mx-auto"
  >
    <defs>
      {/* Tramas de rayado analógico para sombras */}
      <pattern id="hatch-dark" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.5" />
      </pattern>
    </defs>

    {/* SOMBRA EN EL SUELO */}
    <ellipse cx="140" cy="325" rx="75" ry="10" fill="#000000" fillOpacity="0.15" />

    {/* PIERNAS & ZAPATOS */}
    <path d="M110 240 Q105 275 100 295" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
    <path d="M100 295 C85 295 70 300 70 310 C70 318 85 320 105 320 C115 320 115 305 105 295 Z" fill="#000000" />
    <path d="M170 240 Q175 275 180 295" stroke="#000000" strokeWidth="10" strokeLinecap="round" />
    <path d="M180 295 C170 305 170 320 180 320 C200 320 215 318 215 310 C215 300 200 295 185 295 Z" fill="#000000" />

    {/* CUERPO & CAMISA */}
    <path d="M100 120 L180 120 L195 240 L85 240 Z" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />

    {/* DELANTAL A RAYAS (Estilo Foto 1) */}
    <path d="M108 135 L172 135 L185 240 L95 240 Z" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />
    <g stroke="#000000" strokeWidth="3.5">
      <line x1="120" y1="135" x2="112" y2="240" />
      <line x1="133" y1="135" x2="128" y2="240" />
      <line x1="147" y1="135" x2="147" y2="240" />
      <line x1="160" y1="135" x2="165" y2="240" />
    </g>
    <path d="M115 135 L110 110" stroke="#000000" strokeWidth="3" />
    <path d="M165 135 L170 110" stroke="#000000" strokeWidth="3" />

    {/* BRAZO IZQUIERDO (Navaja recta) */}
    <path d="M90 125 C60 120 45 90 60 70" stroke="#000000" strokeWidth="11" strokeLinecap="round" fill="none" />
    <circle cx="60" cy="70" r="14" fill="#ffffff" stroke="#000000" strokeWidth="3" />
    <g transform="translate(35, 30) rotate(-30)">
      <rect x="10" y="20" width="35" height="7" rx="3" fill="#000000" />
      <path d="M30 15 L60 10 L62 22 L32 24 Z" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
    </g>

    {/* BRAZO DERECHO (Peine) */}
    <path d="M190 125 C220 130 235 150 240 170" stroke="#000000" strokeWidth="11" strokeLinecap="round" fill="none" />
    <circle cx="240" cy="170" r="14" fill="#ffffff" stroke="#000000" strokeWidth="3" />
    <g transform="translate(230, 140) rotate(15)">
      <rect x="0" y="0" width="40" height="12" fill="#000000" rx="2" />
      <line x1="4" y1="12" x2="4" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="9" y1="12" x2="9" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="14" y1="12" x2="14" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="19" y1="12" x2="19" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="24" y1="12" x2="24" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="29" y1="12" x2="29" y2="24" stroke="#000000" strokeWidth="2" />
      <line x1="34" y1="12" x2="34" y2="24" stroke="#000000" strokeWidth="2" />
    </g>

    {/* CABEZA & ROSTRO */}
    <circle cx="140" cy="75" r="36" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />
    <path d="M106 70 C110 45 140 42 174 65 C165 52 135 46 115 58 Z" fill="#000000" />
    <ellipse cx="126" cy="72" rx="6" ry="9" fill="#000000" />
    <polygon points="126,69 123,73 129,73" fill="#ffffff" />
    <ellipse cx="154" cy="72" rx="6" ry="9" fill="#000000" />
    <polygon points="154,69 151,73 157,73" fill="#ffffff" />
    <path d="M120 58 Q126 53 132 58" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
    <path d="M148 58 Q154 53 160 58" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
    <path d="M140 76 C137 81 143 81 140 76" stroke="#000000" strokeWidth="3" />
    <path d="M116 82 Q140 106 164 82 Z" fill="#ffffff" stroke="#000000" strokeWidth="3" />
    <line x1="140" y1="83" x2="140" y2="94" stroke="#000000" strokeWidth="2" />
    <line x1="128" y1="85" x2="128" y2="92" stroke="#000000" strokeWidth="1.5" />
    <line x1="152" y1="85" x2="152" y2="92" stroke="#000000" strokeWidth="1.5" />
    <path d="M112 80 C110 84 114 86 116 83" stroke="#000000" strokeWidth="2" />
    <path d="M168 80 C170 84 166 86 164 83" stroke="#000000" strokeWidth="2" />

    {/* CUELLO & MOÑO NEGRO */}
    <rect x="132" y="108" width="16" height="10" fill="#000000" />
    <polygon points="140,113 120,103 120,123" fill="#000000" />
    <polygon points="140,113 160,103 160,123" fill="#000000" />
    <circle cx="140" cy="113" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
  </svg>
)

export default function HomePage() {
  const { data: serviciosData } = useQuery({
    queryKey: ['servicios-home'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios,
  })

  const { data: barberosData } = useQuery({
    queryKey: ['barberos-home'],
    queryFn: () => barberosApi.getAll(),
    select: (res) => res.data.barberos,
  })

  const serviciosList = serviciosData || [
    { id: '1', nombre: 'Corte Clásico', descripcion: 'Tijera y máquina, peinado con pomada y acabado impecable.', precio: 35000, duracionMinutos: 45 },
    { id: '2', nombre: 'Afeitado a Navaja', descripcion: 'Toalla caliente, aceites y navaja al viejo estilo.', precio: 30000, duracionMinutos: 30 },
    { id: '3', nombre: 'Barba de Época', descripcion: 'Perfilado, recorte y aceite para una barba de caballero.', precio: 25000, duracionMinutos: 30 },
    { id: '4', nombre: 'El Combo Dorado', descripcion: 'Corte, afeitado y barba. El tratamiento completo.', precio: 55000, duracionMinutos: 75 },
  ]

  const barberosList = barberosData || [
    { id: 'b1', usuario: { nombre: 'Don Alfonso' }, especialidad: 'MAESTRO BARBERO', anosOficio: '40 años de oficio' },
    { id: 'b2', usuario: { nombre: 'El Zurdo' }, especialidad: 'ESPECIALISTA EN NAVAJA', anosOficio: 'Manos de seda' },
    { id: 'b3', usuario: { nombre: 'Tito Vals' }, especialidad: 'DISEÑO DE BARBA', anosOficio: 'Estilo a medida' },
  ]

  return (
    <div className="bg-[#eae5d8] text-[#1a1a1a]">
      {/* ═════════════════════════════════════════════════════════════════════
          SECCIÓN 1: HERO
          ═════════════════════════════════════════════════════════════════════ */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="inline-block border-2 border-black px-3.5 py-1 font-mono text-xs font-bold tracking-[0.2em] uppercase mb-6 bg-transparent">
              EST. 2019 · CABALLEROS
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold text-black leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Un corte de otra época
            </h1>

            <p className="font-mono text-sm md:text-base text-black/80 max-w-lg mb-8 leading-relaxed">
              Afeitado a navaja, toallas calientes y cortes clásicos servidos con el encanto de los dibujos animados de los años treinta.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/reservar" className="btn-vintage-black py-3.5 px-7">
                AGENDAR MI CITA
              </Link>
              <a href="#servicios" className="btn-vintage-outline py-3.5 px-7">
                VER SERVICIOS
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-[#f4efe4] border-2 border-black p-6 shadow-[10px_10px_0_#000] relative">
              <BarberMascotSVG />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE INFERIOR HERO ── */}
      <div className="bg-black text-white py-3.5 border-t-2 border-b-2 border-black font-mono text-xs tracking-[0.25em] uppercase text-center overflow-hidden">
        <div className="flex items-center justify-center gap-6 whitespace-nowrap">
          <span>CORTES CLÁSICOS</span>
          <span className="text-white">★</span>
          <span>AFEITADO A NAVAJA</span>
          <span className="text-white">★</span>
          <span>ARREGLO DE BARBA</span>
          <span className="text-white">★</span>
          <span>TOALLA CALIENTE</span>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          SECCIÓN 2: LA CARTA - SERVICIOS DE LA CASA
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="servicios" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 block mb-2">
            LA CARTA
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Servicios de la casa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviciosList.slice(0, 4).map((s: any, idx: number) => (
            <div key={s.id} className="card-servicio-vintage">
              <div className="flex items-start justify-between gap-4">
                <h3
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.nombre}
                </h3>
                <div className="text-right">
                  <span className="font-mono text-[0.65rem] text-black/40 block leading-none font-bold">
                    0{idx + 1}
                  </span>
                  <span
                    className="text-3xl font-bold text-black leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ${s.precio ? (s.precio > 1000 ? Math.round(s.precio / 1000) : s.precio) : 35}
                  </span>
                </div>
              </div>

              <div className="border-b-2 border-dotted border-black/40 my-4" />

              <p className="font-mono text-xs text-black/80 leading-relaxed mb-4">
                {s.descripcion}
              </p>

              <div className="border-b-2 border-dotted border-black/40 my-4" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] font-bold text-black/70 uppercase tracking-widest">
                  DURACIÓN · {s.duracionMinutos || 45} MIN
                </span>
                <Link to="/reservar" className="btn-vintage-black py-2 px-4 text-xs">
                  RESERVAR
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/servicios" className="btn-vintage-outline py-3.5 px-8">
            VER TODOS LOS SERVICIOS
          </Link>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          SECCIÓN 3: LA CUADRILLA - NUESTROS BARBEROS
          (Fondo pergamino tonal cálido #ded8c7 en lugar de negro plano)
          ═════════════════════════════════════════════════════════════════════ */}
      <section id="barberos" className="bg-[#ded8c7] border-t-2 border-b-2 border-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-14">
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-black/60 block mb-2">
                LA CUADRILLA
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold text-black"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Nuestros barberos
              </h2>
            </div>
            <div className="hidden sm:flex w-12 h-12 border-2 border-black bg-[#eae5d8] items-center justify-center font-mono font-bold text-xl text-black shadow-[3px_3px_0_#000]">
              ✂
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barberosList.map((b: any) => {
              const nombreBarbero = b.usuario?.nombre || b.nombre || 'Barbero'
              const inicial = nombreBarbero.charAt(0).toUpperCase()
              return (
                <div key={b.id} className="card-barbero-vintage bg-[#eae5d8] shadow-[5px_5px_0_#000]">
                  <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mb-5 border-2 border-black shadow-[2px_2px_0_#000]">
                    <span
                      className="text-3xl font-bold font-mono"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {inicial}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold text-black mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {nombreBarbero}
                  </h3>

                  <p className="font-mono text-[0.7rem] font-bold text-black/70 uppercase tracking-[0.18em] mb-3">
                    {b.especialidad || 'BARBERO PROFESIONAL'}
                  </p>

                  <p className="font-mono text-xs text-black/80 mb-6">
                    {b.anosOficio || 'Especialista en corte clásico & navaja'}
                  </p>

                  <Link to="/reservar" className="btn-vintage-black w-full py-3 text-xs">
                    RESERVAR CITA
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
