import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

function loadServiceAccount() {
  const serviceAccountEnv =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT

  let serviceAccountObj: Record<string, any> = {}

  if (serviceAccountEnv) {
    try {
      serviceAccountObj = JSON.parse(serviceAccountEnv)
    } catch (err: any) {
      throw new Error(
        `Error al parsear la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY (JSON inválido): ${err.message}`
      )
    }
  }

  // Soporte para claves snake_case del JSON descargado de Firebase Console e individual env vars
  const project_id =
    serviceAccountObj.project_id ||
    serviceAccountObj.projectId ||
    process.env.FIREBASE_PROJECT_ID

  const client_email =
    serviceAccountObj.client_email ||
    serviceAccountObj.clientEmail ||
    process.env.FIREBASE_CLIENT_EMAIL

  const rawPrivateKey =
    serviceAccountObj.private_key ||
    serviceAccountObj.privateKey ||
    process.env.FIREBASE_PRIVATE_KEY

  const private_key = rawPrivateKey
    ? rawPrivateKey.replace(/\\n/g, '\n')
    : undefined

  // 1. Validación explícita al iniciar la app
  if (!project_id || !client_email || !private_key) {
    const missing: string[] = []
    if (!project_id) missing.push('project_id (FIREBASE_PROJECT_ID o FIREBASE_SERVICE_ACCOUNT_KEY)')
    if (!client_email) missing.push('client_email (FIREBASE_CLIENT_EMAIL o FIREBASE_SERVICE_ACCOUNT_KEY)')
    if (!private_key) missing.push('private_key (FIREBASE_PRIVATE_KEY o FIREBASE_SERVICE_ACCOUNT_KEY)')

    throw new Error(
      `Faltan credenciales de Firebase Service Account: ${missing.join(', ')}. Define la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY (JSON) o las variables individuales FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.`
    )
  }

  // 3. Confirmar que se usan las claves snake_case (project_id, client_email, private_key) tal como vienen en el JSON
  const serviceAccount: ServiceAccount & { project_id: string; client_email: string; private_key: string } = {
    projectId: project_id,
    clientEmail: client_email,
    privateKey: private_key,
    project_id,
    client_email,
    private_key,
  }

  // 2. Loggear presencia de las propiedades sin exponer el private_key completo
  console.log('[Firebase Admin Init] Verificando credenciales de Service Account:', {
    hasProjectId: Boolean(serviceAccount.project_id),
    project_id: serviceAccount.project_id,
    hasClientEmail: Boolean(serviceAccount.client_email),
    client_email: serviceAccount.client_email,
    hasPrivateKey: Boolean(serviceAccount.private_key),
    privateKeyLength: serviceAccount.private_key ? serviceAccount.private_key.length : 0,
  })

  return serviceAccount
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccount = loadServiceAccount()
  initializeApp({
    credential: cert(serviceAccount),
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
