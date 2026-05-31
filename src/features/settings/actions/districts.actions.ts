'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: true } | { success: false; error: string }

export async function getDistricts() {
  return prisma.district.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { members: true } } },
  })
}

export async function createDistrict(name: string, color: string): Promise<ActionResult> {
  try {
    await prisma.district.create({ data: { name: name.trim(), color } })
    revalidatePath('/settings/districts')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un distrito con ese nombre.' }
    }
    return { success: false, error: 'No se pudo crear el distrito.' }
  }
}

export async function updateDistrict(id: number, name: string, color: string): Promise<ActionResult> {
  try {
    await prisma.district.update({ where: { id }, data: { name: name.trim(), color } })
    revalidatePath('/settings/districts')
    return { success: true }
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === 'P2002') {
      return { success: false, error: 'Ya existe un distrito con ese nombre.' }
    }
    return { success: false, error: 'No se pudo actualizar el distrito.' }
  }
}

export async function deleteDistrict(id: number): Promise<ActionResult> {
  try {
    await prisma.district.update({ where: { id }, data: { isActive: false } })
    revalidatePath('/settings/districts')
    return { success: true }
  } catch {
    return { success: false, error: 'No se pudo eliminar el distrito.' }
  }
}
