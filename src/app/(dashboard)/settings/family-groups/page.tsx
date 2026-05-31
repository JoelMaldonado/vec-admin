import { createFamilyGroup, deleteFamilyGroup, getFamilyGroups, updateFamilyGroup } from '@/features/settings/actions/family-groups.actions'
import { FamilyGroupsView } from '@/features/settings/components/family-groups-view'
import { prisma } from '@/lib/prisma'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function FamilyGroupsPage() {
  const [groups, members] = await Promise.all([
    getFamilyGroups(),
    prisma.member.findMany({
      where: { isActive: true },
      orderBy: { firstName: 'asc' },
      select: { id: true, firstName: true, lastName: true },
    }),
  ])

  const items = groups.map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    leaderName: g.leader ? `${g.leader.firstName} ${g.leader.lastName}` : null,
    memberCount: g._count.members,
    address: g.address,
    latitude: g.latitude ? Number(g.latitude) : null,
    longitude: g.longitude ? Number(g.longitude) : null,
  }))

  const memberOptions = members.map((m) => ({
    id: m.id,
    fullName: `${m.firstName} ${m.lastName}`,
  }))

  return (
    <div className="space-y-5">
      <div>
        <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/settings" className="hover:text-slate-600">Configuración</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">Grupos Familiares</span>
        </nav>
        <h2 className="text-xl font-semibold text-slate-900">Grupos Familiares</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona los grupos familiares, su líder y ubicación
        </p>
      </div>

      <FamilyGroupsView
        items={items}
        memberOptions={memberOptions}
        onCreate={createFamilyGroup}
        onUpdate={updateFamilyGroup}
        onDelete={deleteFamilyGroup}
      />
    </div>
  )
}
