import { prisma } from '@/lib/prisma'
import { RoomList } from '@/features/ministries/components/room-list'
import { RoomFormModalTrigger } from '@/app/(dashboard)/ministerios/[id]/_components/room-form-modal-trigger'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function MinistryDetailPage({ params }: Props) {
  const { id } = await params
  const ministryId = Number(id)

  const ministry = await prisma.ministry.findFirst({
    where: { id: ministryId, isActive: true },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      rooms: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          ageRange: true,
          ministryId: true,
          isActive: true,
          createdAt: true,
          _count: { select: { children: { where: { isActive: true } } } },
        },
      },
    },
  })

  if (!ministry) notFound()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/ministerios" className="hover:text-slate-700">
              Ministerios
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">{ministry.name}</span>
          </nav>
          <h2 className="text-xl font-semibold text-slate-900">{ministry.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {ministry.rooms.length} salón{ministry.rooms.length !== 1 ? 'es' : ''} ·{' '}
            {ministry.rooms.reduce((acc, r) => acc + (r._count?.children ?? 0), 0)} niños en total
          </p>
        </div>
        <RoomFormModalTrigger ministryId={ministry.id} />
      </div>

      <RoomList rooms={ministry.rooms} ministryId={ministry.id} />
    </div>
  )
}
