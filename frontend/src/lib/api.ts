import axios from 'axios'
import { auth } from './firebase'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API service functions
export const serviciosApi = {
  getAll: () => api.get('/servicios'),
  adminGetAll: () => api.get('/admin/servicios'),
  create: (data: any) => api.post('/admin/servicios', data),
  update: (id: string, data: any) => api.put(`/admin/servicios/${id}`, data),
  delete: (id: string) => api.delete(`/admin/servicios/${id}`),
}

export const barberosApi = {
  getAll: () => api.get('/barberos'),
  adminGetAll: () => api.get('/admin/barberos'),
  getDisponibilidad: (id: string, fecha: string, servicioId: string) =>
    api.get(`/barberos/${id}/disponibilidad`, { params: { fecha, servicioId } }),
  getResenas: (id: string) => api.get(`/barberos/${id}/resenas`),
  create: (data: any) => api.post('/admin/barberos', data),
  update: (id: string, data: any) => api.put(`/admin/barberos/${id}`, data),
  updateHorarios: (id: string, data: any) => api.put(`/admin/barberos/${id}/horarios`, data),
  delete: (id: string) => api.delete(`/admin/barberos/${id}`),
}

export const citasApi = {
  crear: (data: any) => api.post('/citas', data),
  misCitas: (estado?: string) => api.get('/citas/mis-citas', { params: { estado } }),
  cancelar: (id: string) => api.put(`/citas/${id}/cancelar`),
  adminGetAll: (params?: any) => api.get('/admin/citas', { params }),
  adminCreate: (data: any) => api.post('/admin/citas', data),
  adminUpdate: (id: string, data: any) => api.put(`/admin/citas/${id}`, data),
}

export const resenasApi = {
  crear: (data: any) => api.post('/resenas', data),
  adminGetAll: () => api.get('/admin/resenas'),
  ocultar: (id: string) => api.put(`/admin/resenas/${id}/ocultar`),
  eliminar: (id: string) => api.delete(`/admin/resenas/${id}`),
}

export const authApi = {
  sync: (data: any) => api.post('/auth/sync', data),
  me: () => api.get('/auth/me'),
}

export default api
