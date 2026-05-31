import { getDniLookupUsage } from '@/features/members/actions/dni-lookup.action'
import { prisma } from '@/lib/prisma'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { NewMemberForm } from './_components/new-member-form'

export default async function NewMemberPage() {
  const [districts, familyGroups, { remaining }] = await Promise.all([
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
    getDniLookupUsage(),
  ])

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/members" className="hover:text-slate-600">Miembros</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-600">Nuevo</span>
      </nav>

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Nuevo Miembro</h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa el formulario para registrar un nuevo miembro
        </p>
      </div>

      <NewMemberForm districts={districts} familyGroups={familyGroups} dniLookupRemaining={remaining} />
    </div>
  )
}
