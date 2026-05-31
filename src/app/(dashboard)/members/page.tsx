import { prisma } from '@/lib/prisma'
import { MemberStatsCards } from '@/features/members/components/member-stats'
import { MembersView } from './_components/members-view'
import { Cake, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function MembersPage() {
  const [members, districts, familyGroups] = await Promise.all([
    prisma.member.findMany({
      orderBy: { firstName: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        address: true,
        districtId: true,
        district: { select: { id: true, name: true, color: true } },
        familyGroupId: true,
        familyGroup: { select: { id: true, name: true, color: true } },
        birthDate: true,
        maritalStatus: true,
        gender: true,
        isBaptized: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.district.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, color: true },
    }),
    prisma.familyGroup.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, color: true },
    }),
  ])

  const total = members.length
  const active = members.filter((m) => m.isActive).length
  const baptized = members.filter((m) => m.isBaptized).length
  const familyGroupCount = new Set(members.map((m) => m.familyGroupId).filter(Boolean)).size

  const stats = { total, active, baptized, familyGroups: familyGroupCount }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Miembros</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gestión del registro de miembros de la iglesia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/members/birthdays"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Cake className="h-4 w-4" />
            Cumpleaños
          </Link>
          <Link
            href="/members/new"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Miembro
          </Link>
        </div>
      </div>

      <MemberStatsCards stats={stats} />

      <MembersView members={members} districts={districts} familyGroups={familyGroups} />
    </div>
  )
}
