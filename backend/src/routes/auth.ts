import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middlewares/firebaseAuth'
import { getAuth, DecodedIdToken } from 'firebase-admin/auth'

const syncSchema = z.object({
  firebaseUid: z.string(),
  nombre: z.string(),
  email: z.string().email(),
  telefono: z.string().optional(),
})

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /auth/sync
   * Syncs Firebase user → local DB after first login.
   * Called from frontend on every login (idempotent).
   */
  app.post('/auth/sync', async (request, reply) => {
    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Token requerido' })
    }

    const idToken = authHeader.split('Bearer ')[1]
    let decoded: DecodedIdToken

    try {
      decoded = await getAuth().verifyIdToken(idToken)
    } catch {
      return reply.status(401).send({ error: 'Token inválido' })
    }

    const body = syncSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const usuario = await prisma.usuario.upsert({
      where: { firebaseUid: decoded.uid },
      update: {
        nombre: body.data.nombre,
        email: body.data.email,
        telefono: body.data.telefono,
      },
      create: {
        firebaseUid: decoded.uid,
        nombre: body.data.nombre,
        email: body.data.email,
        telefono: body.data.telefono,
        rol: 'CLIENTE',
      },
    })

    return reply.send({ usuario })
  })

  /**
   * GET /auth/me
   * Returns current authenticated user data.
   */
  app.get('/auth/me', { preHandler: authenticate }, async (request, reply) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: request.user!.dbId },
      include: { barbero: true },
    })
    return reply.send({ usuario })
  })
}
