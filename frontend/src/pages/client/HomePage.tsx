import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Award, Users } from 'lucide-react'
import { serviciosApi } from '@/lib/api'
import ServicioCard from '@/components/client/ServicioCard'
import { useAuth } from '@/contexts/AuthContext'

// ── SVG CUSTOM: Tijeras de tinta analógica 1930s (trazo variable + hatching) ──
const ScissorsSVG = ({ size = 28, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Hojas de la tijera con contorno grueso y filo fino */}
    <path
      d="M9 7 C10 6, 12 7, 13.5 9 L21.5 20"
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M27 7 C26 6, 24 7, 22.5 9 L14.5 20"
      stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    />
    {/* Línea interna de filo (detalle fino) */}
    <path d="M11 9.5 L19.5 19" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
    <path d="M25 9.5 L16.5 19" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.6" />
    {/* Pivote remachado */}
    <circle cx="18" cy="19" r="2.8" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="18" cy="19" r="1" fill="currentColor" />
    {/* Mangos circulares rubber-hose */}
    <ellipse cx="11.5" cy="28" rx="5" ry="4.5" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="24.5" cy="28" rx="5" ry="4.5" stroke="currentColor" strokeWidth="3" fill="none" />
    <line x1="14" y1="21" x2="10.5" y2="24.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <line x1="22" y1="21" x2="25.5" y2="24.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// ── SVG CUSTOM: Poste de barbero 1930s con trama ──────────────────────────
const BarberPoleSVG = () => (
  <svg width="18" height="52" viewBox="0 0 18 52" fill="none" aria-hidden="true">
    {/* Marco exterior contorno tinta */}
    <rect x="2" y="2" width="14" height="48" rx="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
    {/* Tapas esféricas superior e inferior */}
    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="9" cy="46" r="3.5" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Espirales con trazo de tinta variable */}
    <path d="M2 14 Q9 17 16 14" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M2 22 Q9 25 16 22" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M2 30 Q9 33 16 30" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M2 38 Q9 41 16 38" stroke="currentColor" strokeWidth="2.5" fill="none" />
  </svg>
)

// ── SVG CUSTOM: Calendario de cita ─────────────────────────────────────────
const CalendarInkSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2.8" fill="none" />
    <line x1="2" y1="9.5" x2="22" y2="9.5" stroke="currentColor" strokeWidth="2" />
    <line x1="7.5" y1="2" x2="7.5" y2="6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="16.5" y1="2" x2="16.5" y2="6" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="7.5" cy="14" r="1.3" fill="currentColor" />
    <circle cx="12" cy="14" r="1.3" fill="currentColor" />
    <circle cx="16.5" cy="14" r="1.3" fill="currentColor" />
    <circle cx="7.5" cy="18" r="1.3" fill="currentColor" />
    <circle cx="12" cy="18" r="1.3" fill="currentColor" />
  </svg>
)

// ── SVG CUSTOM: Estrella de tinta ──────────────────────────────────────────
const StarInkSVG = ({ filled = false, size = 16 }: { filled?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      stroke="currentColor"
      strokeWidth={filled ? '0' : '2.2'}
      fill={filled ? 'currentColor' : 'none'}
      strokeLinejoin="round"
    />
  </svg>
)

// ═══════════════════════════════════════════════════════════════════════════
// MASCOTA "EL MAESTRO SÁNCHEZ" — ESTILO CARTOON RUBBER-HOSE FLEISCHER 1930s
// Cumple estrictamente las 6 reglas:
// 1. Hatching / Cross-hatching en negro para volumen y sombras (sin plano gris)
// 2. Grosor de tinta VARIABLE (silueta externa 5-6px, detalles internos 1.5-2px)
// 3. Ojos "Pie-Eye" clásicos años 30, cejas expresivas gruesas, boca exagerada sonriente
// 4. Extremidades Rubber-Hose (tubos flexibles sin codos/rodillas), guante blanco mitón 4-dedos Mickey
// 5. Textura de grano/tinta y trama analógica integrada sobre la ilustración
// 6. Pose idéntica con sombrero de copa y tijeras en mano
// ═══════════════════════════════════════════════════════════════════════════
const BarberMascotSVG = () => (
  <svg
    viewBox="0 0 260 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="El Maestro Sánchez — Caricatura Rubber-Hose 1930s"
    className="w-full h-full"
  >
    <defs>
      {/* ── Rule 1: Patrones de Hatching (Rayado analógico a mano) ── */}
      {/* Rayado diagonal 45° ligero para sombras de ropa y piel */}
      <pattern id="hatch-light" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#000000" strokeWidth="1.2" />
      </pattern>

      {/* Rayado diagonal 45° denso para sombras bajo sombrero, barbilla y chaleco */}
      <pattern id="hatch-dark" width="3.5" height="3.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="3.5" stroke="#000000" strokeWidth="1.4" />
      </pattern>

      {/* Cross-Hatching (rayado cruzado) para sombras profundas */}
      <pattern id="cross-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#000000" strokeWidth="1.3" />
        <line x1="0" y1="0" x2="4" y2="0" stroke="#000000" strokeWidth="1.3" />
      </pattern>

      {/* ── Rule 5: Filtro de Grano de Celuloide/Tinta 1930s ── */}
      <filter id="ink-grain-filter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.12 0" />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </defs>

    <g filter="url(#ink-grain-filter)">
      {/* ── Sombra proyectada en suelo (Hatching denso) ── */}
      <ellipse cx="130" cy="404" rx="70" ry="10" fill="url(#cross-hatch)" stroke="#000000" strokeWidth="2" />

      {/* ── Rule 4: PIERNAS RUBBER-HOSE (Tubos flexibles sin rodillas) ── */}
      {/* Pierna Izquierda */}
      <path d="M102 315 Q88 355 78 392"
        stroke="#000000" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M102 315 Q88 355 78 392"
        stroke="#f5f5ef" strokeWidth="15" strokeLinecap="round" fill="none" />
      {/* Sombra de pierna izq en hatching */}
      <path d="M96 325 Q84 358 75 390 L81 392 Q92 358 102 325 Z"
        fill="url(#hatch-dark)" opacity="0.85" />

      {/* Pierna Derecha */}
      <path d="M158 315 Q172 355 182 392"
        stroke="#000000" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M158 315 Q172 355 182 392"
        stroke="#f5f5ef" strokeWidth="15" strokeLinecap="round" fill="none" />
      {/* Sombra de pierna der en hatching */}
      <path d="M164 325 Q176 358 185 390 L179 392 Q168 358 158 325 Z"
        fill="url(#hatch-dark)" opacity="0.85" />

      {/* Zapatos inflados tipo bola Fleischer */}
      {/* Zapato Izquierdo */}
      <path d="M52 395 C45 385 70 380 92 388 C98 395 95 404 82 405 C65 406 55 403 52 395 Z"
        fill="#000000" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
      <path d="M60 388 C68 384 82 386 86 392" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Zapato Derecho */}
      <path d="M208 395 C215 385 190 380 168 388 C162 395 165 404 178 405 C195 406 205 403 208 395 Z"
        fill="#000000" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
      <path d="M200 388 C192 384 178 386 174 392" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />


      {/* ── CUERPO PRINCIPAL (Tronco Rubber-Hose) ── */}
      {/* Silueta exterior súper gruesa (Rule 2) */}
      <ellipse cx="130" cy="265" rx="66" ry="64" fill="#000000" />
      {/* Interior camisa blanco hueso */}
      <ellipse cx="130" cy="263" rx="60" ry="58" fill="#f5f5ef" stroke="#000000" strokeWidth="4" />

      {/* Hatching de sombra lateral en el cuerpo (Rule 1) */}
      <path d="M72 263 C72 295 95 320 130 321 C100 320 78 295 78 263 Z"
        fill="url(#hatch-dark)" />
      <path d="M188 263 C188 295 165 320 130 321 C160 320 182 295 182 263 Z"
        fill="url(#hatch-dark)" />

      {/* Chaleco de barbero 1930s con solapas */}
      <path d="M90 215 Q95 285 98 320 Q130 330 162 320 Q165 285 170 215 Q150 200 130 198 Q110 200 90 215 Z"
        fill="#141414" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />

      {/* Hatching en el chaleco (Líneas de sombra cruzadas) */}
      <path d="M92 217 Q97 285 100 318 L160 318 Q163 285 168 217 Z"
        fill="url(#cross-hatch)" opacity="0.9" />

      {/* Solapas de la camisa */}
      <path d="M108 200 L130 232 L152 200 L140 196 L130 208 L120 196 Z"
        fill="#f5f5ef" stroke="#000000" strokeWidth="3" />

      {/* Corbatín de moño rojo vintage */}
      <path d="M120 225 L110 218 L120 214 L130 220 L140 214 L150 218 L140 225 L130 230 Z"
        fill="#c1272d" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Botones de tinta en chaleco (Rule 2: detalles internos finos) */}
      <circle cx="130" cy="245" r="3.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
      <circle cx="130" cy="265" r="3.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />
      <circle cx="130" cy="285" r="3.5" fill="#000000" stroke="#ffffff" strokeWidth="1" />


      {/* ── Rule 4: BRAZO IZQUIERDO RUBBER-HOSE (Sosteniendo tijeras) ── */}
      {/* Tubo de brazo negro exterior */}
      <path d="M90 230 Q45 245 32 275 Q26 288 38 294 Q50 300 58 286 Q72 262 96 250"
        stroke="#000000" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Tubo de brazo blanco interior */}
      <path d="M90 230 Q45 245 32 275 Q26 288 38 294 Q50 300 58 286 Q72 262 96 250"
        stroke="#f5f5ef" strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Sombra de brazo en hatching */}
      <path d="M45 245 Q32 275 26 288 L34 292 Q42 275 52 250 Z"
        fill="url(#hatch-dark)" />

      {/* Guante Blanco Cartoon Mitón 4-dedos (Mickey/Cuphead style) */}
      <g transform="translate(10, 270)">
        {/* Muñeca con doble pliegue de guante */}
        <ellipse cx="32" cy="18" rx="12" ry="6" fill="#f5f5ef" stroke="#000000" strokeWidth="3.5" />
        {/* Cuerpo principal del guante */}
        <path d="M20 18 C10 12 8 30 22 36 C34 40 42 28 32 18 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />

        {/* 4 Dedos regordetes de guante */}
        {/* Pulgar */}
        <path d="M15 15 C8 10 5 20 14 22 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 2 */}
        <path d="M16 28 C8 32 10 42 20 38 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 3 */}
        <path d="M23 35 C18 44 26 48 30 40 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 4 */}
        <path d="M30 36 C30 44 38 42 34 34 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="3" />

        {/* 3 Costuras negras traseras del guante clásico Mickey */}
        <path d="M24 22 L22 29" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M28 22 L27 30" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 23 L32 29" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Tijeras en mano izquierda (con trazo orgánico de tinta y hatching) */}
      <g transform="translate(0, 260) rotate(-22)">
        <path d="M10 6 L24 28" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
        <path d="M10 6 L24 28" stroke="#d4d4cc" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 6 L14 28" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
        <path d="M28 6 L14 28" stroke="#d4d4cc" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19" cy="25" r="4" stroke="#000000" strokeWidth="3" fill="#f5f5ef" />
        <circle cx="19" cy="25" r="1.5" fill="#000000" />
        <ellipse cx="12" cy="33" rx="5" ry="4" stroke="#000000" strokeWidth="3" fill="none" />
        <ellipse cx="26" cy="33" rx="5" ry="4" stroke="#000000" strokeWidth="3" fill="none" />
      </g>


      {/* ── Rule 4: BRAZO DERECHO RUBBER-HOSE (Saludando entusiasta) ── */}
      {/* Tubo de brazo negro exterior */}
      <path d="M170 230 Q210 235 228 210 Q240 195 230 184 Q218 175 208 190 Q192 210 164 220"
        stroke="#000000" strokeWidth="26" strokeLinecap="round" fill="none" />
      {/* Tubo de brazo blanco interior */}
      <path d="M170 230 Q210 235 228 210 Q240 195 230 184 Q218 175 208 190 Q192 210 164 220"
        stroke="#f5f5ef" strokeWidth="16" strokeLinecap="round" fill="none" />
      {/* Sombra de brazo derecho en hatching */}
      <path d="M210 235 Q228 210 240 195 L234 188 Q220 208 204 230 Z"
        fill="url(#hatch-dark)" />

      {/* Guante Blanco Derecho Saludando (4 dedos mitón cartoon) */}
      <g transform="translate(208, 155)">
        {/* Muñeca guante */}
        <ellipse cx="16" cy="30" rx="10" ry="5" fill="#f5f5ef" stroke="#000000" strokeWidth="3.5" />
        {/* Palma del guante */}
        <path d="M8 26 C2 15 28 8 30 24 C31 34 16 36 8 26 Z"
          fill="#f5f5ef" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />

        {/* 4 Dedos extendidos en saludo */}
        {/* Dedo 1 (Pulgar) */}
        <path d="M6 22 C-2 18 2 8 10 14 Z" fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 2 */}
        <path d="M12 12 C10 0 20 0 20 10 Z" fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 3 */}
        <path d="M20 10 C22 -2 30 0 28 12 Z" fill="#f5f5ef" stroke="#000000" strokeWidth="3" />
        {/* Dedo 4 */}
        <path d="M27 14 C32 4 38 8 32 18 Z" fill="#f5f5ef" stroke="#000000" strokeWidth="3" />

        {/* 3 Costuras negras de guante */}
        <path d="M14 22 L17 28" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M19 21 L21 28" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 22 L24 27" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
      </g>


      {/* ── CABEZA GRANDE RUBBER-HOSE FLEISCHER ── */}
      {/* Cuello */}
      <rect x="118" y="186" width="24" height="22" rx="4" fill="#f5f5ef" stroke="#000000" strokeWidth="4" />
      {/* Hatching en cuello (Rule 1: sombra bajo barbilla) */}
      <rect x="119" y="188" width="22" height="12" fill="url(#hatch-dark)" />

      {/* Silueta exterior pesada de la cabeza (Rule 2) */}
      <ellipse cx="130" cy="142" rx="68" ry="62" fill="#000000" />
      {/* Rostro blanco hueso */}
      <ellipse cx="130" cy="140" rx="63" ry="57" fill="#f5f5ef" stroke="#000000" strokeWidth="4" />

      {/* Hatching lateral de volumen en la mejilla izquierda (Rule 1: volumen 3D) */}
      <path d="M68 140 Q68 185 110 194 Q80 180 72 140 Z"
        fill="url(#hatch-light)" opacity="0.8" />


      {/* ── Rule 3: OJOS PIE-EYE CLÁSICOS FLEISCHER 1930s ── */}
      {/* Ojo Izquierdo */}
      <g transform="translate(100, 130)">
        {/* Esclerótica ovalada grande */}
        <ellipse cx="0" cy="0" rx="16" ry="20" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />
        {/* Pupila negra grande Pie-Eye */}
        <ellipse cx="2" cy="2" rx="11" ry="15" fill="#000000" />
        {/* RECORTE TRIANGULAR "PIE-CUTOUT" (Famoso ojo de pastel de los años 30) */}
        <polygon points="2,2 -6,-8 6,-10" fill="#ffffff" />
        {/* Punto de brillo circular secundario */}
        <circle cx="5" cy="6" r="2.2" fill="#ffffff" />
      </g>

      {/* Ojo Derecho */}
      <g transform="translate(150, 130)">
        {/* Esclerótica ovalada grande */}
        <ellipse cx="0" cy="0" rx="16" ry="20" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />
        {/* Pupila negra grande Pie-Eye */}
        <ellipse cx="-2" cy="2" rx="11" ry="15" fill="#000000" />
        {/* RECORTE TRIANGULAR "PIE-CUTOUT" */}
        <polygon points="-2,2 -10,-8 2,-10" fill="#ffffff" />
        {/* Punto de brillo circular secundario */}
        <circle cx="1" cy="6" r="2.2" fill="#ffffff" />
      </g>

      {/* Rule 3: Cejas Gruesas Expresivas y Entusiastas */}
      <path d="M82 104 Q100 95 118 104" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <path d="M142 104 Q160 95 178 104" stroke="#000000" strokeWidth="5.5" strokeLinecap="round" fill="none" />


      {/* ── BIGOTE VINTAGE CARACTERÍSTICO ── */}
      <path d="M102 154 Q116 146 130 150 Q144 146 158 154 Q166 160 162 165 Q152 162 130 164 Q108 162 98 165 Q94 160 102 154 Z"
        fill="#000000" stroke="#000000" strokeWidth="2" />
      {/* Rizo de punta izquierda */}
      <path d="M99 164 Q90 166 88 172 Q91 176 96 171 Z" fill="#000000" />
      {/* Rizo de punta derecha */}
      <path d="M161 164 Q170 166 172 172 Q169 176 164 171 Z" fill="#000000" />


      {/* ── Rule 3: BOCA EXAGERADA / SONRISA CARTOON ANOS 30 ── */}
      {/* Boca abierta gigante en D con lengua y dientes */}
      <g transform="translate(130, 168)">
        {/* Contorno boca */}
        <path d="M-28 0 Q0 30 28 0 Q0 38 -28 0 Z"
          fill="#000000" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
        {/* Dientes superiores */}
        <path d="M-22 2 Q0 12 22 2 L20 8 Q0 16 -20 8 Z" fill="#ffffff" />
        <line x1="0" y1="4" x2="0" y2="12" stroke="#000000" strokeWidth="1.5" />
        <line x1="-10" y1="3" x2="-9" y2="10" stroke="#000000" strokeWidth="1.5" />
        <line x1="10" y1="3" x2="9" y2="10" stroke="#000000" strokeWidth="1.5" />
        {/* Lengua roja vintage abajo */}
        <path d="M-14 20 Q0 12 14 20 Q0 34 -14 20 Z" fill="#c1272d" stroke="#000000" strokeWidth="1.5" />
        {/* Hoyuelos/Pliegues de risa en comisuras */}
        <path d="M-32 -3 Q-28 4 -30 10" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M32 -3 Q28 4 30 10" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>


      {/* ── SOMBRERO DE COPA BARBERO 1930s (Con Hatching debajo) ── */}
      {/* Rule 1: Hatching denso de sombra bajo la visera sobre la frente */}
      <path d="M68 95 Q130 115 192 95 Q180 118 130 122 Q80 118 68 95 Z"
        fill="url(#cross-hatch)" />

      {/* Visera / Ala del sombrero */}
      <ellipse cx="130" cy="94" rx="82" ry="14" fill="#141414" stroke="#000000" strokeWidth="4.5" />
      {/* Hatching en el ala izquierda */}
      <ellipse cx="130" cy="94" rx="80" ry="12" fill="url(#hatch-dark)" opacity="0.6" />

      {/* Copa del sombrero */}
      <path d="M84 42 C82 32 95 30 130 30 C165 30 178 32 176 42 L172 90 Q130 98 88 90 Z"
        fill="#141414" stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />

      {/* Hatching de volumen en el lado izquierdo del sombrero */}
      <path d="M84 42 C82 32 95 30 115 30 L112 92 Q98 94 88 90 Z"
        fill="url(#hatch-dark)" opacity="0.9" />

      {/* Banda roja del sombrero */}
      <path d="M87 78 Q130 86 173 78 L172 90 Q130 98 88 90 Z"
        fill="#c1272d" stroke="#000000" strokeWidth="2.5" />

      {/* Botón de adorno en la copa */}
      <circle cx="130" cy="30" r="5" fill="#f5f5ef" stroke="#000000" strokeWidth="2" />
    </g>
  </svg>
)

export default function HomePage() {
  const { user, loginWithGoogle } = useAuth()

  const { data: serviciosData } = useQuery({
    queryKey: ['servicios-populares'],
    queryFn: () => serviciosApi.getAll(),
    select: (res) => res.data.servicios.filter((s: any) => s.popular).slice(0, 3),
  })

  return (
    <div style={{ backgroundColor: 'var(--gray-900)', color: 'var(--white)' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO — Iluminación cinematográfica dura, estilo Mickey Noir
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 55% 70% at 30% 50%,
              #2a2a2a 0%,
              #1a1a1a 35%,
              #111111 60%,
              #080808 100%
            )
          `,
        }}
      >
        {/* Viñeta fuerte cinematográfica */}
        <div className="vignette-hard" />

        {/* Trama de fondo tipo papel/madera */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                rgba(255,255,255,0.012) 0px,
                rgba(255,255,255,0.012) 1px,
                transparent 1px,
                transparent 18px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.008) 0px,
                rgba(255,255,255,0.008) 1px,
                transparent 1px,
                transparent 24px
              )
            `,
          }}
        />

        {/* Líneas de película horizontales (scratches) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                transparent 0%,
                rgba(255,255,255,0.03) 12%,
                transparent 12.1%,
                transparent 47%,
                rgba(255,255,255,0.02) 47.1%,
                transparent 47.3%,
                transparent 73%,
                rgba(255,255,255,0.025) 73.1%,
                transparent 73.3%,
                transparent 100%
              )
            `,
          }}
        />

        {/* Contenido del hero */}
        <div className="page-container relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Texto hero ── */}
            <div>
              {/* Eyebrow — sello de época */}
              <div
                className="inline-flex items-center gap-2.5 mb-7"
                style={{
                  background: 'var(--gray-800)',
                  border: '2px solid var(--gray-600)',
                  boxShadow: '3px 3px 0 var(--black)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ color: 'var(--accent-red)' }}>◆</span>
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-300)',
                  }}
                >
                  Est. Bogotá, Colombia — Desde 1930
                </span>
                <span style={{ color: 'var(--accent-red)' }}>◆</span>
              </div>

              {/* Título principal — Ultra slab serif con contorno de tinta */}
              <h1
                className="animate-fadeInUp"
                style={{
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1.0,
                  marginBottom: '1.5rem',
                }}
              >
                <span
                  className="block text-ink-outline"
                  style={{
                    fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                    color: 'var(--white)',
                    letterSpacing: '0.04em',
                  }}
                >
                  BARBERÍA
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                    color: 'var(--accent-red)',
                    letterSpacing: '0.04em',
                    textShadow: `
                      3px 3px 0 #6a0e11,
                      -1px -1px 0 var(--black),
                      1px -1px 0 var(--black),
                      -1px 1px 0 var(--black)
                    `,
                  }}
                >
                  DENVER
                </span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--gray-400)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '42ch',
                  marginBottom: '2.5rem',
                  borderLeft: '3px solid var(--gray-700)',
                  paddingLeft: '1rem',
                }}
              >
                Cortes clásicos a navaja, perfilado de barba y toalla caliente —
                la vieja guardia del oficio, sin concesiones.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/reservar"
                  className="btn btn-primary"
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.classList.add('animate-squash')
                    el.addEventListener('animationend', () => el.classList.remove('animate-squash'), { once: true })
                  }}
                >
                  <CalendarInkSVG size={18} />
                  Reservar turno
                </Link>
                <Link to="/servicios" className="btn btn-secondary">
                  Ver catálogo
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Social proof */}
              <div
                className="inline-flex items-center gap-5"
                style={{
                  background: 'var(--gray-800)',
                  border: '2px solid var(--gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 1.2rem',
                  boxShadow: '3px 3px 0 var(--black)',
                }}
              >
                <div className="flex flex-col">
                  <div className="flex gap-0.5" style={{ color: 'var(--gray-100)' }}>
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                    <StarInkSVG filled size={15} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.7rem', color: 'var(--gray-500)', letterSpacing: '0.08em' }}>
                    4.9 / 5.0 — Calificación
                  </span>
                </div>
                <div style={{ width: '1.5px', height: '32px', background: 'var(--gray-700)' }} />
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: 'var(--gray-400)' }} />
                  <div className="flex flex-col">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--white)', lineHeight: 1 }}>+500</span>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Clientes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mascota Fleischer + Polo de Barbería ── */}
            <div className="hidden lg:flex flex-col items-center justify-center relative">
              {/* Halo de luz cinematográfica detrás del personaje */}
              <div
                className="absolute"
                style={{
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(90,90,90,0.18) 0%, transparent 70%)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Polos de barbería decorativos */}
              <div className="absolute left-2 top-6" style={{ color: 'var(--gray-700)', opacity: 0.6 }}>
                <BarberPoleSVG />
              </div>
              <div className="absolute right-2 top-6" style={{ color: 'var(--gray-700)', opacity: 0.6 }}>
                <BarberPoleSVG />
              </div>

              {/* Mascota SVG Rubber-Hose 1930s */}
              <div
                className="animate-fadeInUp"
                style={{
                  width: '320px',
                  height: '430px',
                  filter: 'drop-shadow(6px 8px 0px rgba(0,0,0,0.85))',
                }}
              >
                <BarberMascotSVG />
              </div>

              {/* Letrero vintage debajo del personaje */}
              <div
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-500)',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  borderTop: '1px solid var(--gray-700)',
                  paddingTop: '0.5rem',
                }}
              >
                ✦ El Maestro Sánchez ✦
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS — Panel de cómic horizontal
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--gray-800)',
          borderTop: '3px solid var(--gray-700)',
          borderBottom: '3px solid var(--gray-700)',
        }}
      >
        <div className="page-container py-10">
          <div className="grid grid-cols-3 gap-0 text-center">
            {[
              {
                value: '4.9',
                label: 'Estrellas',
                icon: <StarInkSVG filled size={22} />,
              },
              {
                value: '8+',
                label: 'Servicios',
                icon: <ScissorsSVG size={22} />,
              },
              {
                value: '5',
                label: 'Años de oficio',
                icon: <CalendarInkSVG size={22} />,
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 py-4"
                style={{
                  borderRight: i < 2 ? '2px solid var(--gray-700)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    border: '2.5px solid var(--gray-600)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--gray-900)',
                    boxShadow: '3px 3px 0 var(--black)',
                    color: 'var(--gray-300)',
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: 'var(--white)',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-500)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICIOS POPULARES
          ═══════════════════════════════════════════════════════ */}
      {serviciosData && serviciosData.length > 0 && (
        <section className="py-20">
          <div className="page-container">
            <div className="text-center mb-14">
              <div className="divider-ornament justify-center mb-5">
                <Award size={18} style={{ color: 'var(--gray-400)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
                Servicios Populares
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  color: 'var(--gray-500)',
                  marginTop: '0.5rem',
                }}
              >
                Los cortes más solicitados en la silla del maestro
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {serviciosData.map((s: any) => (
                <ServicioCard key={s.id} servicio={s} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/servicios" className="btn btn-secondary">
                Catálogo completo
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          CÓMO FUNCIONA — Paneles de cómic verticales
          ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          borderTop: '3px solid var(--gray-700)',
          background: `
            linear-gradient(180deg, var(--gray-900) 0%, var(--gray-800) 100%)
          `,
        }}
        className="py-20"
      >
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)' }}>
              ¿Cómo Reservar?
            </h2>
            <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--gray-500)', marginTop: '0.5rem' }}>
              Tres pasos. Sin complicaciones. A la antigua usanza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                num: '01',
                title: 'Elige tu corte',
                desc: 'Clásico fade, perfilado de barba, combo completo o tratamiento premium. El catálogo habla solo.',
                icon: <ScissorsSVG size={32} />,
              },
              {
                num: '02',
                title: 'Elige tu barbero',
                desc: 'Selecciona al maestro de tu confianza y consulta su disponibilidad en tiempo real.',
                icon: <BarberPoleSVG />,
              },
              {
                num: '03',
                title: 'Confirma tu hora',
                desc: 'Escoge la fecha y el horario. El pago se efectúa directamente en caja al finalizar el servicio.',
                icon: <CalendarInkSVG size={32} />,
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="card flex flex-col"
                style={{
                  borderRadius: 'var(--radius-sm)',
                  borderRight: i < 2 ? 'none' : undefined,
                  marginRight: i < 2 ? '-1px' : '0',
                  zIndex: 3 - i,
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3.5rem',
                      lineHeight: 0.9,
                      color: 'var(--gray-700)',
                      userSelect: 'none',
                    }}
                  >
                    {step.num}
                  </span>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      border: '2.5px solid var(--gray-600)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gray-900)',
                      boxShadow: '3px 3px 0 var(--black)',
                      color: 'var(--gray-300)',
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'var(--white)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link to="/reservar" className="btn btn-primary">
                <CalendarInkSVG size={18} />
                Reservar turno ahora
              </Link>
            ) : (
              <button onClick={loginWithGoogle} className="btn btn-primary">
                Iniciar sesión para reservar
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
