'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type {
  CreateMinistryInput,
  UpdateMinistryInput,
  CreateRoomInput,
  UpdateRoomInput,
  CreateChildInput,
  UpdateChildInput,
} from '@/features/ministries/types'

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// ── Ministries ────────────────────────────────────────────────────────────────

export async function createMinistry(
  input: CreateMinistryInput,
): Promise<ActionResult<{ id: number }>> {
  try {
    const ministry = await prisma.ministry.create({
      data: { name: input.name.trim(), type: input.type, color: input.color },
      select: { id: true },
    })
    revalidatePath('/ministerios')
    return { success: true, data: { id: ministry.id } }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    if (code === 'P2002') return { success: false, error: 'Ya existe un ministerio con ese nombre.' }
    return { success: false, error: 'No se pudo crear el ministerio.' }
  }
}

export async function updateMinistry(
  id: number,
  input: UpdateMinistryInput,
): Promise<ActionResult> {
  try {
    await prisma.ministry.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.color && { color: input.color }),
      },
    })
    revalidatePath('/ministerios')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo actualizar el ministerio.' }
  }
}

export async function deleteMinistry(id: number): Promise<ActionResult> {
  try {
    await prisma.ministry.update({ where: { id }, data: { isActive: false } })
    revalidatePath('/ministerios')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo eliminar el ministerio.' }
  }
}

// ── Rooms ─────────────────────────────────────────────────────────────────────

export async function createRoom(input: CreateRoomInput): Promise<ActionResult<{ id: number }>> {
  try {
    const room = await prisma.ministryRoom.create({
      data: {
        name: input.name.trim(),
        ageRange: input.ageRange?.trim() || null,
        ministryId: input.ministryId,
      },
      select: { id: true },
    })
    revalidatePath(`/ministerios/${input.ministryId}`)
    return { success: true, data: { id: room.id } }
  } catch {
    return { success: false, error: 'No se pudo crear el salón.' }
  }
}

export async function updateRoom(
  id: number,
  ministryId: number,
  input: UpdateRoomInput,
): Promise<ActionResult> {
  try {
    await prisma.ministryRoom.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name.trim() }),
        ...(input.ageRange !== undefined && { ageRange: input.ageRange?.trim() || null }),
      },
    })
    revalidatePath(`/ministerios/${ministryId}`)
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo actualizar el salón.' }
  }
}

export async function deleteRoom(id: number, ministryId: number): Promise<ActionResult> {
  try {
    await prisma.ministryRoom.update({ where: { id }, data: { isActive: false } })
    revalidatePath(`/ministerios/${ministryId}`)
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo eliminar el salón.' }
  }
}

// ── Children ──────────────────────────────────────────────────────────────────

export async function createChild(input: CreateChildInput): Promise<ActionResult<{ id: number }>> {
  try {
    const child = await prisma.child.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        birthDate: input.birthDate || null,
        tutorName: input.tutorName.trim(),
        tutorPhone: input.tutorPhone?.trim() || null,
        roomId: input.roomId,
      },
      select: { id: true },
    })
    revalidatePath(`/ministerios`)
    return { success: true, data: { id: child.id } }
  } catch {
    return { success: false, error: 'No se pudo registrar al niño.' }
  }
}

export async function updateChild(
  id: number,
  input: UpdateChildInput,
): Promise<ActionResult> {
  try {
    await prisma.child.update({
      where: { id },
      data: {
        ...(input.firstName && { firstName: input.firstName.trim() }),
        ...(input.lastName && { lastName: input.lastName.trim() }),
        ...(input.birthDate !== undefined && { birthDate: input.birthDate || null }),
        ...(input.tutorName && { tutorName: input.tutorName.trim() }),
        ...(input.tutorPhone !== undefined && { tutorPhone: input.tutorPhone?.trim() || null }),
      },
    })
    revalidatePath('/ministerios')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo actualizar al niño.' }
  }
}

export async function deleteChild(id: number): Promise<ActionResult> {
  try {
    await prisma.child.update({ where: { id }, data: { isActive: false } })
    revalidatePath('/ministerios')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo eliminar al niño.' }
  }
}
