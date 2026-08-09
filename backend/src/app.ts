import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import 'dotenv/config'

import { authRoutes } from './routes/auth'
import { serviciosRoutes } from './routes/servicios'
import { barberosRoutes } from './routes/barberos'
import { citasRoutes } from './routes/citas'
import { resenasRoutes } from './routes/resenas'

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
})

// ── Plugins ──────────────────────────────────────────────────────────────────
app.register(helmet, {
  contentSecurityPolicy: false, // handled by Firebase Hosting
})

app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.register(authRoutes, { prefix: '' })
app.register(serviciosRoutes, { prefix: '' })
app.register(barberosRoutes, { prefix: '' })
app.register(citasRoutes, { prefix: '' })
app.register(resenasRoutes, { prefix: '' })

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3001', 10)

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`🪒 Barbería Denver API running at ${address}`)
})

export default app
