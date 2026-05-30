import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { dni: '00000000' },
    update: {},
    create: {
      dni: '00000000',
      name: 'Administrador VEC',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log(`Usuario admin creado: ${admin.name} (DNI: ${admin.dni})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
