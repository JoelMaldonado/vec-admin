'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: true } | { success: false; error: string }

export async function getFamilyGroups() {
  return prisma.familyGroup.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      leader: { select: { id: true, firstName: true, lastName: true } },
      _count: { select: { members: true } },
    },
  })
}

interface FamilyGroupData {
  name: string
  color: string
  leaderId: number | null
  address: string | null
  latitude: number | null
  longitude: number | null
}

export async function createFamilyGroup(data: FamilyGroupData): Promise<ActionResult> {
  try {
    await prisma.familyGroup.create({
      data: {
        name: data.name.trim(),
        color: data.color,
        leaderId: data.leaderId,
        address: data.address?.trim() || null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })
    revalidatePath('/settings/family-groups')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un grupo familiar con ese nombre.' }
    }
    return { success: false, error: 'No se pudo crear el grupo familiar.' }
  }
}

export async function updateFamilyGroup(id: number, data: FamilyGroupData): Promise<ActionResult> {
  try {
    await prisma.familyGroup.update({
      where: { id },
      data: {
        name: data.name.trim(),
        color: data.color,
        leaderId: data.leaderId,
        address: data.address?.trim() || null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    })
    revalidatePath('/settings/family-groups')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un grupo familiar con ese nombre.' }
    }
    return { success: false, error: 'No se pudo actualizar el grupo familiar.' }
  }
}

export async function deleteFamilyGroup(id: number): Promise<ActionResult> {
  try {
    await prisma.familyGroup.update({ where: { id }, data: { isActive: false } })
    revalidatePath('/settings/family-groups')
    return { success: true }
  } catch {
    return { success: false, error: 'No se pudo eliminar el grupo familiar.' }
  }
}
