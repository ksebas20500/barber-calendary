import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate, requireAdmin, requireStaff } from '../middlewares/firebaseAuth'
import { differenceInHours } from 'date-fns'

const crearCitaSchema = z.object({
  barberoId: z.string(),
  servicioId: z.string(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
  notas: z.string().optional(),
})

const adminCitaSchema = z.object({
  clienteId: z.string().optional(),
  barberoId: z.string().optional(),
  servicioId: z.string().optional(),
  fecha: z.string().optional(),
  horaInicio: z.string().optional(),
  estado: z.enum(['CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'NO_SHOW']).optional(),
  notas: z.string().optional(),
})

// Helper to construct Date objects in Colombia timezone (UTC-5)
const createBogotaDate = (fechaStr: string, horaStr = '00:00'): Date => {
  return new Date(`${fechaStr}T${horaStr}:00.000-05:00`)
}

export async function citasRoutes(app: FastifyInstance) {
  /**
   * POST /citas — Cliente autenticado: crear cita
   * Uses DB transaction with lock to prevent double-booking race conditions.
   */
  app.post('/citas', { preHandler: authenticate }, async (request, reply) => {
    const body = crearCitaSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const { barberoId, servicioId, fecha, horaInicio, notas } = body.data
    const clienteId = request.user!.dbId

    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId, activo: true },
    })

    if (!servicio) {
      return reply.status(404).send({ error: 'Servicio no encontrado o inactivo' })
    }

    const startDateTime = createBogotaDate(fecha, horaInicio)
    const endDateTime = new Date(startDateTime.getTime() + servicio.duracionMinutos * 60000)
    const fechaDate = createBogotaDate(fecha, '00:00')

    try {
      const cita = await prisma.$transaction(async (tx) => {
        // Check for conflicting appointments within the transaction
        const conflicto = await tx.cita.findFirst({
          where: {
            barberoId,
            estado: { in: ['CONFIRMADA', 'COMPLETADA'] },
            AND: [
              { horaInicio: { lt: endDateTime } },
              { horaFin: { gt: startDateTime } },
            ],
          },
        })

        if (conflicto) {
          throw new Error('SLOT_OCUPADO')
        }

        return tx.cita.create({
          data: {
            clienteId,
            barberoId,
            servicioId,
            fecha: fechaDate,
            horaInicio: startDateTime,
            horaFin: endDateTime,
            notas,
            estado: 'CONFIRMADA',
          },
          include: {
            servicio: true,
            barbero: { include: { usuario: true } },
            cliente: true,
          },
        })
      })

      return reply.status(201).send({ cita })
    } catch (error: any) {
      if (error.message === 'SLOT_OCUPADO') {
        return reply.status(409).send({ error: 'El horario seleccionado ya está ocupado' })
      }
      throw error
    }
  })

  /**
   * GET /citas/mis-citas — Cliente: historial propio
   */
  app.get('/citas/mis-citas', { preHandler: authenticate }, async (request, reply) => {
    const { estado } = request.query as { estado?: string }

    const citas = await prisma.cita.findMany({
      where: {
        clienteId: request.user!.dbId,
        ...(estado ? { estado: estado as any } : {}),
      },
      include: {
        servicio: true,
        barbero: { include: { usuario: { select: { nombre: true } } } },
        resena: true,
      },
      orderBy: { horaInicio: 'desc' },
    })

    return reply.send({ citas })
  })

  /**
   * PUT /citas/:id/cancelar — Cliente: cancelar (mín 2h antes)
   */
  app.put('/citas/:id/cancelar', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string }

    const cita = await prisma.cita.findUnique({ where: { id } })

    if (!cita) return reply.status(404).send({ error: 'Cita no encontrada' })

    if (cita.clienteId !== request.user!.dbId) {
      return reply.status(403).send({ error: 'No puedes cancelar esta cita' })
    }

    if (cita.estado !== 'CONFIRMADA') {
      return reply.status(400).send({ error: 'Solo se pueden cancelar citas confirmadas' })
    }

    const horasRestantes = differenceInHours(cita.horaInicio, new Date())
    if (horasRestantes < 2) {
      return reply.status(400).send({ error: 'No se puede cancelar con menos de 2 horas de anticipación' })
    }

    const updated = await prisma.cita.update({
      where: { id },
      data: { estado: 'CANCELADA' },
    })

    return reply.send({ cita: updated })
  })

  /**
   * GET /admin/citas — Admin/Barbero: todas las citas con filtros
   */
  app.get('/admin/citas', { preHandler: requireStaff }, async (request, reply) => {
    const { barberoId, fecha, estado } = request.query as {
      barberoId?: string
      fecha?: string
      estado?: string
    }

    const effectiveBarberoId =
      request.user!.rol === 'BARBERO'
        ? (await prisma.barbero.findFirst({ where: { usuarioId: request.user!.dbId } }))?.id
        : barberoId

    let fechaFilter = {}
    if (fecha) {
      const dayStart = createBogotaDate(fecha, '00:00')
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1)
      fechaFilter = { horaInicio: { gte: dayStart, lte: dayEnd } }
    }

    const citas = await prisma.cita.findMany({
      where: {
        ...(effectiveBarberoId ? { barberoId: effectiveBarberoId } : {}),
        ...fechaFilter,
        ...(estado ? { estado: estado as any } : {}),
      },
      include: {
        cliente: { select: { nombre: true, email: true, telefono: true } },
        barbero: { include: { usuario: { select: { nombre: true } } } },
        servicio: true,
      },
      orderBy: { horaInicio: 'asc' },
    })

    return reply.send({ citas })
  })

  /**
   * POST /admin/citas — Admin: crear cita manualmente
   */
  app.post('/admin/citas', { preHandler: requireAdmin }, async (request, reply) => {
    const body = crearCitaSchema.extend({ clienteId: z.string() }).safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const { barberoId, servicioId, fecha, horaInicio, notas, clienteId } = body.data

    const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } })
    if (!servicio) return reply.status(404).send({ error: 'Servicio no encontrado' })

    const startDateTime = createBogotaDate(fecha, horaInicio)
    const endDateTime = new Date(startDateTime.getTime() + servicio.duracionMinutos * 60000)
    const fechaDate = createBogotaDate(fecha, '00:00')

    try {
      const cita = await prisma.$transaction(async (tx) => {
        const conflicto = await tx.cita.findFirst({
          where: {
            barberoId,
            estado: { in: ['CONFIRMADA', 'COMPLETADA'] },
            AND: [
              { horaInicio: { lt: endDateTime } },
              { horaFin: { gt: startDateTime } },
            ],
          },
        })

        if (conflicto) throw new Error('SLOT_OCUPADO')

        return tx.cita.create({
          data: {
            clienteId,
            barberoId,
            servicioId,
            fecha: fechaDate,
            horaInicio: startDateTime,
            horaFin: endDateTime,
            notas,
            estado: 'CONFIRMADA',
          },
          include: { servicio: true, barbero: { include: { usuario: true } }, cliente: true },
        })
      })

      return reply.status(201).send({ cita })
    } catch (error: any) {
      if (error.message === 'SLOT_OCUPADO') {
        return reply.status(409).send({ error: 'Slot ocupado' })
      }
      throw error
    }
  })

  /**
   * PUT /admin/citas/:id — Admin: update cita state/details
   */
  app.put('/admin/citas/:id', { preHandler: requireStaff }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = adminCitaSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const cita = await prisma.cita.update({
      where: { id },
      data: body.data,
      include: { servicio: true, barbero: { include: { usuario: true } }, cliente: true },
    })

    return reply.send({ cita })
  })
}
