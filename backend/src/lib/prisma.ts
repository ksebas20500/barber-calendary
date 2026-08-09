import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL no está definida. El backend no puede conectarse a la base de datos.')
  process.exit(1)
}

// Diagnóstico: loggear presencia de la URL (sin exponer credenciales)
const urlMask = connectionString.replace(/:\/\/([^:@]+):([^@]+)@/, '://***:***@')
console.log(`[prisma] Conectando a: ${urlMask}`)

// Neon requiere SSL; aseguramos que el pool lo use aunque no esté en la cadena
const sslRequired =
  connectionString.includes('neon.tech') ||
  connectionString.includes('sslmode=require') ||
  connectionString.includes('sslmode=verify')

const pool = new Pool({
  connectionString,
  ssl: sslRequired ? { rejectUnauthorized: false } : undefined,
})

pool.on('error', (err) => {
  console.error('[pg pool] Error inesperado:', err.message)
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
