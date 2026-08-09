/**
 * seed.ts — Poblar Barbería Denver con datos de prueba
 * Ejecutar: npx tsx prisma/seed.ts
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Iniciando seed de Barbería Denver...')

  // ─── 1. SERVICIOS ─────────────────────────────────────────────────────────
  const servicios = [
    {
      nombre: 'Corte Clásico',
      descripcion: 'Corte tradicional con tijera y navaja, acabado con cera y peinado a tu estilo.',
      precio: 35000,
      duracionMinutos: 30,
      categoria: 'CORTE' as const,
      popular: true,
    },
    {
      nombre: 'Corte + Barba',
      descripcion: 'Combo completo: corte a tu medida más perfilado y acondicionado de barba.',
      precio: 55000,
      duracionMinutos: 50,
      categoria: 'COMBO' as const,
      popular: true,
    },
    {
      nombre: 'Afeitado con Navaja',
      descripcion: 'Afeitado tradicional con navaja recta, toalla caliente y bálsamo post-afeitado.',
      precio: 30000,
      duracionMinutos: 30,
      categoria: 'BARBA' as const,
      popular: false,
    },
    {
      nombre: 'Perfilado de Cejas',
      descripcion: 'Definición y perfilado de cejas con cera y pinza para un look impecable.',
      precio: 20000,
      duracionMinutos: 20,
      categoria: 'CEJAS' as const,
      popular: false,
    },
    {
      nombre: 'Corte Premium',
      descripcion: 'Corte de alta precisión con consulta de estilo personalizada, lavado y secado.',
      precio: 60000,
      duracionMinutos: 60,
      categoria: 'PREMIUM' as const,
      popular: true,
    },
    {
      nombre: 'Tratamiento de Barba',
      descripcion: 'Hidratación profunda de barba con aceite de argán, peinado y fijado.',
      precio: 25000,
      duracionMinutos: 25,
      categoria: 'BARBA' as const,
      popular: false,
    },
    {
      nombre: 'Combo Familiar (2 cortes)',
      descripcion: 'Dos cortes clásicos para adulto y niño. Ideal para venir en familia.',
      precio: 60000,
      duracionMinutos: 55,
      categoria: 'COMBO' as const,
      popular: false,
    },
    {
      nombre: 'Fade Degradado',
      descripcion: 'Fade americano o skin fade con máquina, definición de línea y nuca.',
      precio: 40000,
      duracionMinutos: 40,
      categoria: 'CORTE' as const,
      popular: true,
    },
  ]

  console.log('✂  Creando servicios...')
  for (const s of servicios) {
    await prisma.servicio.upsert({
      where: { nombre: s.nombre } as any,
      update: s,
      create: s,
    }).catch(async () => {
      // Si no hay índice único en nombre, usamos create ignorando duplicados
      const exists = await prisma.servicio.findFirst({ where: { nombre: s.nombre } })
      if (!exists) await prisma.servicio.create({ data: s })
    })
  }
  console.log(`   ✓ ${servicios.length} servicios listos`)

  // ─── 2. USUARIOS BARBERO ───────────────────────────────────────────────────
  const barberosSeed = [
    {
      firebaseUid: 'seed_barbero_001',
      nombre: 'Carlos Mendoza',
      email: 'carlos.mendoza@barberiaDenver.com',
      especialidad: 'Fade & Skin Fade',
      calificacion: 4.9,
    },
    {
      firebaseUid: 'seed_barbero_002',
      nombre: 'Rodrigo Pérez',
      email: 'rodrigo.perez@barberiaDenver.com',
      especialidad: 'Corte Clásico & Barba',
      calificacion: 4.7,
    },
    {
      firebaseUid: 'seed_barbero_003',
      nombre: 'Miguel Ángel Torres',
      email: 'miguel.torres@barberiaDenver.com',
      especialidad: 'Corte Premium & Tratamientos',
      calificacion: 4.8,
    },
  ]

  console.log('👤 Creando barberos...')
  for (const b of barberosSeed) {
    // Crear o encontrar Usuario
    let usuario = await prisma.usuario.findFirst({ where: { firebaseUid: b.firebaseUid } })
    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          firebaseUid: b.firebaseUid,
          nombre: b.nombre,
          email: b.email,
          rol: 'BARBERO',
        },
      })
    }

    // Crear o encontrar Barbero
    const barberoExiste = await prisma.barbero.findFirst({ where: { usuarioId: usuario.id } })
    if (!barberoExiste) {
      const barbero = await prisma.barbero.create({
        data: {
          usuarioId: usuario.id,
          especialidad: b.especialidad,
          activo: true,
        },
      })

      // Crear horarios L-S 9:00-18:00
      const dias = [1, 2, 3, 4, 5, 6] // Lun-Sáb
      for (const dia of dias) {
        await prisma.horarioBarbero.create({
          data: {
            barberoId: barbero.id,
            diaSemana: dia,
            horaInicio: '09:00',
            horaFin: '18:00',
            disponible: true,
          },
        })
      }
      console.log(`   ✓ Barbero "${b.nombre}" creado con horarios L-S`)
    } else {
      console.log(`   ⚠  Barbero "${b.nombre}" ya existe, skipping`)
    }
  }

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('   - Servicios:', servicios.length)
  console.log('   - Barberos:', barberosSeed.length)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
