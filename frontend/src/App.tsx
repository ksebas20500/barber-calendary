import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

import HomePage from '@/pages/client/HomePage'
import ServiciosPage from '@/pages/client/ServiciosPage'
import ReservaPage from '@/pages/client/ReservaPage'
import PerfilPage from '@/pages/client/PerfilPage'

import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboardPage from '@/pages/admin/DashboardPage'
import AdminServiciosPage from '@/pages/admin/ServiciosPage'
import AdminBarberosPage from '@/pages/admin/BarberosPage'
import AdminCalendarioPage from '@/pages/admin/CalendarioPage'
import AdminResenasPage from '@/pages/admin/ResenasPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Portal Cliente */}
                <Route path="/" element={<HomePage />} />
                <Route path="/servicios" element={<ServiciosPage />} />
                <Route path="/reservar" element={<ReservaPage />} />
                <Route path="/perfil" element={<PerfilPage />} />

                {/* Panel de Administración */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="servicios" element={<AdminServiciosPage />} />
                  <Route path="barberos" element={<AdminBarberosPage />} />
                  <Route path="calendario" element={<AdminCalendarioPage />} />
                  <Route path="resenas" element={<AdminResenasPage />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}
