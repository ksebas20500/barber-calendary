import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, requireAdmin } from '../middlewares/firebaseAuth'

const resenaSchema = z.object({
  citaId: z.string(),
  estrellas: z.number().int().min(1).max(5),
  comentario: z.string().max(500).optional(),
})

export async function resenasRoutes(app: FastifyInstance) {
  /**
   * POST /resenas — Cliente: crear reseña (solo si tiene cita COMPLETADA)
   */
  app.post('/resenas', { preHandler: authenticate }, async (request, reply) => {
    const body = resenaSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const { citaId, estrellas, comentario } = body.data
    const clienteId = request.user!.dbId

    // Validate that the appointment exists, belongs to the client, and is COMPLETED
    const cita = await prisma.cita.findUnique({
      where: { id: citaId },
      include: { resena: true },
    })

    if (!cita) {
      return reply.status(404).send({ error: 'Cita no encontrada' })
    }

    if (cita.clienteId !== clienteId) {
      return reply.status(403).send({ error: 'No puedes calificar esta cita' })
    }

    if (cita.estado !== 'COMPLETADA') {
      return reply.status(400).send({ error: 'Solo puedes calificar citas completadas' })
    }

    if (cita.resena) {
      return reply.status(409).send({ error: 'Ya calificaste esta cita' })
    }

    const resena = await prisma.resena.create({
      data: {
        clienteId,
        barberoId: cita.barberoId,
        citaId,
        estrellas,
        comentario,
      },
    })

    return reply.status(201).send({ resena })
  })

  /**
   * GET /barberos/:id/resenas — Público: reseñas visibles de un barbero
   */
  app.get('/barberos/:id/resenas', async (request, reply) => {
    const { id } = request.params as { id: string }

    const resenas = await prisma.resena.findMany({
      where: { barberoId: id, oculta: false },
      include: {
        cliente: { select: { nombre: true } },
      },
      orderBy: { fecha: 'desc' },
    })

    const promedio = resenas.length > 0
      ? resenas.reduce((sum, r) => sum + r.estrellas, 0) / resenas.length
      : 0

    return reply.send({
      resenas,
      promedio: Math.round(promedio * 10) / 10,
      total: resenas.length,
    })
  })

  /**
   * GET /admin/resenas — Admin: moderación de todas las reseñas
   */
  app.get('/admin/resenas', { preHandler: requireAdmin }, async (request, reply) => {
    const resenas = await prisma.resena.findMany({
      include: {
        cliente: { select: { nombre: true, email: true } },
        barbero: { include: { usuario: { select: { nombre: true } } } },
      },
      orderBy: { fecha: 'desc' },
    })
    return reply.send({ resenas })
  })

  /**
   * PUT /admin/resenas/:id/ocultar — Admin: toggle visibilidad de reseña
   */
  app.put('/admin/resenas/:id/ocultar', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const resena = await prisma.resena.findUnique({ where: { id } })
    if (!resena) return reply.status(404).send({ error: 'Reseña no encontrada' })

    const updated = await prisma.resena.update({
      where: { id },
      data: { oculta: !resena.oculta },
    })

    return reply.send({ resena: updated, oculta: updated.oculta })
  })

  /**
   * DELETE /admin/resenas/:id — Admin: eliminar reseña definitivamente
   */
  app.delete('/admin/resenas/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.resena.delete({ where: { id } })
    return reply.send({ message: 'Reseña eliminada' })
  })
}
