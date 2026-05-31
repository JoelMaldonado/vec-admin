'use server'

import { prisma } from '@/lib/prisma'

const MAX_MONTHLY = 100
const SERVICE = 'reniec'

function monthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` // "YYYY-MM"
}

export async function getDniLookupUsage(): Promise<{ used: number; remaining: number }> {
  const usage = await prisma.apiUsage.findUnique({
    where: { service_date: { service: SERVICE, date: monthKey() } },
  })
  const used = usage?.count ?? 0
  return { used, remaining: MAX_MONTHLY - used }
}

type LookupResult =
  | { success: true; firstName: string; lastName: string; remaining: number }
  | { success: false; error: string }

export async function lookupDni(dni: string): Promise<LookupResult> {
  const date = monthKey()

  const usage = await prisma.apiUsage.upsert({
    where: { service_date: { service: SERVICE, date } },
    create: { service: SERVICE, date, count: 0 },
    update: {},
  })

  if (usage.count >= MAX_MONTHLY) {
    return { success: false, error: `Límite mensual de ${MAX_MONTHLY} consultas alcanzado. Se renueva el próximo mes.` }
  }

  try {
    const res = await fetch(
      `https://api.decolecta.com/v1/reniec/dni?numero=${dni}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.APIS_NET_PE_TOKEN}`,
        },
        cache: 'no-store',
      },
    )

    if (!res.ok) {
      return { success: false, error: 'DNI no encontrado en RENIEC.' }
    }

    const data = await res.json()

    await prisma.apiUsage.update({
      where: { service_date: { service: SERVICE, date } },
      data: { count: { increment: 1 } },
    })

    return {
      success: true,
      firstName: data.first_name ?? '',
      lastName: `${data.first_last_name ?? ''} ${data.second_last_name ?? ''}`.trim(),
      remaining: MAX_MONTHLY - usage.count - 1,
    }
  } catch {
    return { success: false, error: 'Error al conectar con el servicio. Intenta de nuevo.' }
  }
}
