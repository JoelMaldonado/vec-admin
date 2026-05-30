import { prisma } from '@/lib/prisma'
import { MemberStatsCards } from '@/features/members/components/member-stats'
import { MembersView } from './_components/members-view'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { firstName: 'asc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dni: true,
      phone: true,
      address: true,
      district: true,
      birthDate: true,
      maritalStatus: true,
      gender: true,
      familyGroup: true,
      isBaptized: true,
      isActive: true,
      createdAt: true,
    },
  })

  const total = members.length
  const active = members.filter((m) => m.isActive).length
  const baptized = members.filter((m) => m.isBaptized).length
  const familyGroups = new Set(
    members.map((m) => m.familyGroup).filter(Boolean),
  ).size

  const stats = { total, active, baptized, familyGroups }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Miembros</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestión del registro de miembros de la iglesia
          </p>
        </div>
        <Link
          href="/members/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo Miembro
        </Link>
      </div>

      <MemberStatsCards stats={stats} />

      <MembersView members={members} />
    </div>
  )
}
