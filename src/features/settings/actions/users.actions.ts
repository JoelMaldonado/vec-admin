'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: true } | { success: false; error: string }

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, dni: true, email: true, role: true, isActive: true, createdAt: true },
  })
}

interface CreateUserData {
  name: string
  dni: string
  email: string | null
  password: string
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
}

export async function createUser(data: CreateUserData): Promise<ActionResult> {
  try {
    const hashed = await bcrypt.hash(data.password, 12)
    await prisma.user.create({
      data: {
        name: data.name.trim(),
        dni: data.dni.trim(),
        email: data.email?.trim() || null,
        password: hashed,
        role: data.role,
      },
    })
    revalidatePath('/settings/users')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un usuario con ese DNI o correo.' }
    }
    return { success: false, error: 'No se pudo crear el usuario.' }
  }
}

interface UpdateUserData {
  name: string
  dni: string
  email: string | null
  role: 'ADMIN' | 'EDITOR' | 'VIEWER'
  isActive: boolean
  newPassword?: string
}

export async function updateUser(id: number, data: UpdateUserData): Promise<ActionResult> {
  try {
    const payload: Record<string, unknown> = {
      name: data.name.trim(),
      dni: data.dni.trim(),
      email: data.email?.trim() || null,
      role: data.role,
      isActive: data.isActive,
    }
    if (data.newPassword?.trim()) {
      payload.password = await bcrypt.hash(data.newPassword.trim(), 12)
    }
    await prisma.user.update({ where: { id }, data: payload })
    revalidatePath('/settings/users')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un usuario con ese DNI o correo.' }
    }
    return { success: false, error: 'No se pudo actualizar el usuario.' }
  }
}

export async function deleteUser(id: number): Promise<ActionResult> {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/settings/users')
    return { success: true }
  } catch {
    return { success: false, error: 'No se pudo eliminar el usuario.' }
  }
}
