'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { dniSchema, codeSchema, newPasswordSchema } from '../schemas/recover-password.schema'

type ActionResult = { success: boolean; error?: string }

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function requestPasswordReset(dni: string): Promise<ActionResult> {
  const parsed = dniSchema.safeParse({ dni })
  if (!parsed.success) {
    return { success: false, error: 'DNI inválido' }
  }

  const user = await prisma.user.findUnique({ where: { dni } })

  // Always return success to avoid revealing if DNI exists
  if (!user || !user.isActive) {
    return { success: true }
  }

  // Invalidate previous tokens
  await prisma.passwordResetToken.updateMany({
    where: { dni, used: false },
    data: { used: true },
  })

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { dni, token: code, expiresAt },
  })

  return { success: true }
}

export async function verifyResetCode(dni: string, code: string): Promise<ActionResult> {
  const parsedDni = dniSchema.safeParse({ dni })
  const parsedCode = codeSchema.safeParse({ code })

  if (!parsedDni.success || !parsedCode.success) {
    return { success: false, error: 'Datos inválidos' }
  }

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      dni,
      token: code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!token) {
    return { success: false, error: 'Código inválido o expirado' }
  }

  return { success: true }
}

export async function resetPassword(
  dni: string,
  code: string,
  newPassword: string,
): Promise<ActionResult> {
  const parsedDni = dniSchema.safeParse({ dni })
  const parsedCode = codeSchema.safeParse({ code })
  const parsedPassword = newPasswordSchema.safeParse({
    password: newPassword,
    confirmPassword: newPassword,
  })

  if (!parsedDni.success || !parsedCode.success || !parsedPassword.success) {
    return { success: false, error: 'Datos inválidos' }
  }

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      dni,
      token: code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!token) {
    return { success: false, error: 'Código inválido o expirado' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { dni },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { used: true },
    }),
  ])

  return { success: true }
}
