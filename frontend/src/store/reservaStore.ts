import { create } from 'zustand'

interface Servicio {
  id: string
  nombre: string
  precio: number
  duracionMinutos: number
  categoria: string
}

interface Barbero {
  id: string
  nombre: string
  especialidad: string
  fotoUrl: string | null
  calificacionPromedio: number
}

interface ReservaState {
  paso: 1 | 2 | 3
  servicio: Servicio | null
  barbero: Barbero | null
  fecha: string | null      // YYYY-MM-DD
  horaInicio: string | null // HH:MM

  setPaso: (paso: 1 | 2 | 3) => void
  setServicio: (servicio: Servicio) => void
  setBarbero: (barbero: Barbero) => void
  setFecha: (fecha: string) => void
  setHoraInicio: (hora: string) => void
  reset: () => void
}

export const useReservaStore = create<ReservaState>((set) => ({
  paso: 1,
  servicio: null,
  barbero: null,
  fecha: null,
  horaInicio: null,

  setPaso: (paso) => set({ paso }),
  setServicio: (servicio) => set({ servicio, barbero: null, fecha: null, horaInicio: null }),
  setBarbero: (barbero) => set({ barbero, fecha: null, horaInicio: null }),
  setFecha: (fecha) => set({ fecha, horaInicio: null }),
  setHoraInicio: (horaInicio) => set({ horaInicio }),
  reset: () => set({ paso: 1, servicio: null, barbero: null, fecha: null, horaInicio: null }),
}))
