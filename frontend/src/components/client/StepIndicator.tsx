import { Check } from 'lucide-react'

interface StepIndicatorProps {
  pasoActual: 1 | 2 | 3
}

const pasos = [
  { num: 1, label: 'Servicio' },
  { num: 2, label: 'Barbero' },
  { num: 3, label: 'Horario' },
]

export default function StepIndicator({ pasoActual }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="step-indicator w-full max-w-xs">
        {pasos.map((paso, i) => (
          <div key={paso.num} className="flex items-center" style={{ flex: i < pasos.length - 1 ? '1' : undefined }}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`step-dot ${
                  pasoActual > paso.num ? 'done' : pasoActual === paso.num ? 'active' : ''
                }`}
              >
                {pasoActual > paso.num ? <Check size={14} /> : paso.num}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  pasoActual >= paso.num ? 'text-[var(--color-cream)]' : 'text-[var(--color-gray)]'
                }`}
              >
                {paso.label}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div className={`step-line mx-2 mb-5 ${pasoActual > paso.num ? 'done' : ''}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
