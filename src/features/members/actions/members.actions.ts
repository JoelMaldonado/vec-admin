'use server'

import { prisma } from '@/lib/prisma'
import type { CreateMemberInput, UpdateMemberInput } from '@/features/members/types'
import { revalidatePath } from 'next/cache'

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createMember(
  input: CreateMemberInput,
): Promise<ActionResult<{ id: number }>> {
  try {
    const member = await prisma.member.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        dni: input.dni.trim(),
        phone: input.phone?.trim() || null,
        address: input.address?.trim() || null,
        district: input.district || null,
        birthDate: input.birthDate || null,
        maritalStatus: input.maritalStatus || null,
        gender: input.gender,
        familyGroup: input.familyGroup || null,
        isBaptized: input.isBaptized,
        isActive: input.isActive,
      },
      select: { id: true },
    })
    revalidatePath('/members')
    return { success: true, data: { id: member.id } }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    if (code === 'P2002') {
      return { success: false, error: 'Ya existe un miembro con ese DNI.' }
    }
    return { success: false, error: 'No se pudo registrar el miembro. Intenta de nuevo.' }
  }
}

export async function updateMember(
  id: number,
  input: UpdateMemberInput,
): Promise<ActionResult> {
  try {
    await prisma.member.update({
      where: { id },
      data: {
        firstName: input.firstName?.trim(),
        lastName: input.lastName?.trim(),
        dni: input.dni?.trim(),
        phone: input.phone?.trim() || null,
        address: input.address?.trim() || null,
        district: input.district || null,
        birthDate: input.birthDate ?? null,
        maritalStatus: input.maritalStatus || null,
        gender: input.gender,
        familyGroup: input.familyGroup || null,
        isBaptized: input.isBaptized,
        isActive: input.isActive,
      },
    })
    revalidatePath('/members')
    revalidatePath(`/members/${id}`)
    return { success: true, data: undefined }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code
    if (code === 'P2002') {
      return { success: false, error: 'Ya existe un miembro con ese DNI.' }
    }
    return { success: false, error: 'No se pudo actualizar el miembro. Intenta de nuevo.' }
  }
}

export async function deleteMember(id: number): Promise<ActionResult> {
  try {
    await prisma.member.delete({ where: { id } })
    revalidatePath('/members')
    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'No se pudo eliminar el miembro. Intenta de nuevo.' }
  }
}
