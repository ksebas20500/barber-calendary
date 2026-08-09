import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, requireAdmin } from '../middlewares/firebaseAuth'

const servicioSchema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().min(10),
  precio: z.number().int().positive(),
  duracionMinutos: z.number().int().positive(),
  categoria: z.enum(['CORTE', 'PREMIUM', 'CEJAS', 'BARBA', 'COMBO']),
  imagenUrl: z.string().url().optional().or(z.literal('')),
  popular: z.boolean().default(false),
  activo: z.boolean().default(true),
})

export async function serviciosRoutes(app: FastifyInstance) {
  /**
   * GET /servicios — Público: lista servicios activos
   */
  app.get('/servicios', async (request, reply) => {
    const servicios = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: [{ popular: 'desc' }, { nombre: 'asc' }],
    })
    return reply.send({ servicios })
  })

  /**
   * GET /admin/servicios — Admin: todos los servicios incluyendo inactivos
   */
  app.get('/admin/servicios', { preHandler: requireAdmin }, async (request, reply) => {
    const servicios = await prisma.servicio.findMany({
      orderBy: { creadoEn: 'desc' },
    })
    return reply.send({ servicios })
  })

  /**
   * POST /admin/servicios — Admin: crear servicio
   */
  app.post('/admin/servicios', { preHandler: requireAdmin }, async (request, reply) => {
    const body = servicioSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const servicio = await prisma.servicio.create({ data: body.data })
    return reply.status(201).send({ servicio })
  })

  /**
   * PUT /admin/servicios/:id — Admin: editar servicio
   */
  app.put('/admin/servicios/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = servicioSchema.partial().safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const servicio = await prisma.servicio.update({
      where: { id },
      data: body.data,
    })
    return reply.send({ servicio })
  })

  /**
   * DELETE /admin/servicios/:id — Admin: desactivar servicio (soft delete)
   */
  app.delete('/admin/servicios/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.servicio.update({
      where: { id },
      data: { activo: false },
    })
    return reply.send({ message: 'Servicio desactivado' })
  })
}
