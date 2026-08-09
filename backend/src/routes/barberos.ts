import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middlewares/firebaseAuth'

const barberoSchema = z.object({
  usuarioId: z.string(),
  especialidad: z.string().default('Barbero'),
  fotoUrl: z.string().url().optional().or(z.literal('')),
  activo: z.boolean().default(true),
})

const horarioSchema = z.object({
  horarios: z.array(z.object({
    diaSemana: z.number().int().min(0).max(6),
    horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
    horaFin: z.string().regex(/^\d{2}:\d{2}$/),
    disponible: z.boolean().default(true),
  })),
})

export async function barberosRoutes(app: FastifyInstance) {
  /**
   * GET /barberos — Público: lista barberos activos con calificación promedio
   */
  app.get('/barberos', async (request, reply) => {
    const barberos = await prisma.barbero.findMany({
      where: { activo: true },
      include: {
        usuario: { select: { nombre: true, email: true } },
        resenas: {
          where: { oculta: false },
          select: { estrellas: true },
        },
        horarios: { orderBy: { diaSemana: 'asc' } },
      },
    })

    const barberosConRating = barberos.map((b) => {
      const totalResenas = b.resenas.length
      const promedio = totalResenas > 0
        ? b.resenas.reduce((sum, r) => sum + r.estrellas, 0) / totalResenas
        : 0

      return {
        id: b.id,
        nombre: b.usuario.nombre,
        email: b.usuario.email,
        especialidad: b.especialidad,
        fotoUrl: b.fotoUrl,
        activo: b.activo,
        calificacionPromedio: Math.round(promedio * 10) / 10,
        totalResenas,
        horarios: b.horarios,
      }
    })

    return reply.send({ barberos: barberosConRating })
  })

  /**
   * GET /barberos/:id/disponibilidad — Público
   * Query params: fecha (YYYY-MM-DD), servicioId
   * Takes into account exact service duration & existing Colombia time appointments
   */
  app.get('/barberos/:id/disponibilidad', async (request, reply) => {
    const { id } = request.params as { id: string }
    const { fecha, servicioId } = request.query as { fecha: string; servicioId: string }

    if (!fecha || !servicioId) {
      return reply.status(400).send({ error: 'Se requieren fecha y servicioId' })
    }

    const fechaBogota = new Date(`${fecha}T00:00:00.000-05:00`)
    const diaSemana = fechaBogota.getDay()

    // Get barber schedule for the day
    const horario = await prisma.horarioBarbero.findUnique({
      where: { barberoId_diaSemana: { barberoId: id, diaSemana } },
    })

    if (!horario || !horario.disponible) {
      return reply.send({ slots: [], mensaje: 'El barbero no trabaja este día' })
    }

    // Get service duration
    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
      select: { duracionMinutos: true },
    })

    if (!servicio) {
      return reply.status(404).send({ error: 'Servicio no encontrado' })
    }

    // Get existing appointments for this barber on this date (Colombia time range)
    const dayStart = new Date(`${fecha}T00:00:00.000-05:00`)
    const dayEnd = new Date(`${fecha}T23:59:59.999-05:00`)

    const citasExistentes = await prisma.cita.findMany({
      where: {
        barberoId: id,
        estado: { in: ['CONFIRMADA', 'COMPLETADA'] },
        horaInicio: { gte: dayStart, lte: dayEnd },
      },
      select: { horaInicio: true, horaFin: true },
    })

    // Generate available slots (considering requested service duration)
    const slots: string[] = []
    const startMs = new Date(`${fecha}T${horario.horaInicio}:00.000-05:00`).getTime()
    const endMs = new Date(`${fecha}T${horario.horaFin}:00.000-05:00`).getTime()

    const lunchStartMs = new Date(`${fecha}T12:00:00.000-05:00`).getTime()
    const lunchEndMs = new Date(`${fecha}T12:30:00.000-05:00`).getTime()

    const serviceDurationMs = servicio.duracionMinutos * 60000
    let curr = startMs

    while (curr + serviceDurationMs <= endMs) {
      const slotEndMs = curr + serviceDurationMs

      // Check lunch break overlap
      const overlapsLunch = curr < lunchEndMs && slotEndMs > lunchStartMs

      // Check existing appointment overlap
      const overlapsAppointment = citasExistentes.some((cita) => {
        const citaStartMs = new Date(cita.horaInicio).getTime()
        const citaEndMs = new Date(cita.horaFin).getTime()
        return curr < citaEndMs && slotEndMs > citaStartMs
      })

      if (!overlapsLunch && !overlapsAppointment) {
        const slotLabel = new Date(curr).toLocaleTimeString('es-CO', {
          timeZone: 'America/Bogota',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        slots.push(slotLabel)
      }

      curr += 30 * 60000 // 30-minute interval check
    }

    return reply.send({ slots, duracionMinutos: servicio.duracionMinutos })
  })

  /**
   * GET /admin/barberos — Admin: todos los barberos
   */
  app.get('/admin/barberos', { preHandler: requireAdmin }, async (request, reply) => {
    const barberos = await prisma.barbero.findMany({
      include: {
        usuario: { select: { nombre: true, email: true, telefono: true } },
        horarios: { orderBy: { diaSemana: 'asc' } },
        resenas: { select: { estrellas: true } },
        _count: { select: { citas: true } },
      },
      orderBy: { creadoEn: 'desc' },
    })
    return reply.send({ barberos })
  })

  /**
   * POST /admin/barberos — Admin: crear barbero
   */
  app.post('/admin/barberos', { preHandler: requireAdmin }, async (request, reply) => {
    const body = barberoSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const barbero = await prisma.barbero.create({
      data: body.data,
      include: { usuario: { select: { nombre: true, email: true } } },
    })
    return reply.status(201).send({ barbero })
  })

  /**
   * PUT /admin/barberos/:id — Admin: editar barbero
   */
  app.put('/admin/barberos/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = barberoSchema.partial().safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    const barbero = await prisma.barbero.update({
      where: { id },
      data: body.data,
    })
    return reply.send({ barbero })
  })

  /**
   * PUT /admin/barberos/:id/horarios — Admin: set schedule for barber
   */
  app.put('/admin/barberos/:id/horarios', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const body = horarioSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() })
    }

    // Upsert all schedules
    await prisma.$transaction(
      body.data.horarios.map((h) =>
        prisma.horarioBarbero.upsert({
          where: { barberoId_diaSemana: { barberoId: id, diaSemana: h.diaSemana } },
          update: h,
          create: { barberoId: id, ...h },
        })
      )
    )

    const horarios = await prisma.horarioBarbero.findMany({
      where: { barberoId: id },
      orderBy: { diaSemana: 'asc' },
    })
    return reply.send({ horarios })
  })

  /**
   * DELETE /admin/barberos/:id — Admin: desactivar barbero (soft delete)
   */
  app.delete('/admin/barberos/:id', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string }
    await prisma.barbero.update({
      where: { id },
      data: { activo: false },
    })
    return reply.send({ message: 'Barbero desactivado' })
  })
}
