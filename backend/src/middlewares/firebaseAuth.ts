import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  })
}

export interface AuthenticatedUser {
  uid: string
  email: string
  nombre: string
  rol: 'CLIENTE' | 'BARBERO' | 'ADMIN'
  dbId: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser
  }
}

/**
 * Middleware: validates Firebase ID token and attaches user to request.
 * Requires: Authorization: Bearer <firebase_id_token>
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'No autorizado: falta token' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decoded = await getAuth().verifyIdToken(idToken)

    const usuario = await prisma.usuario.findUnique({
      where: { firebaseUid: decoded.uid },
    })

    if (!usuario) {
      return reply.status(401).send({ error: 'Usuario no registrado en el sistema' })
    }

    request.user = {
      uid: decoded.uid,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol as AuthenticatedUser['rol'],
      dbId: usuario.id,
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido o expirado' })
  }
}

/**
 * Middleware: allows only ADMIN role
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authenticate(request, reply)
  if (request.user?.rol !== 'ADMIN') {
    return reply.status(403).send({ error: 'Acceso denegado: se requiere rol ADMIN' })
  }
}

/**
 * Middleware: allows ADMIN or BARBERO role
 */
export async function requireStaff(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authenticate(request, reply)
  if (request.user?.rol !== 'ADMIN' && request.user?.rol !== 'BARBERO') {
    return reply.status(403).send({ error: 'Acceso denegado: se requiere rol de staff' })
  }
}
