import { prisma } from '@/lib/prisma'
import { ChildTable } from '@/features/ministries/components/child-table'
import { ChildFormModalTrigger } from '@/app/(dashboard)/ministerios/[id]/salones/[roomId]/_components/child-form-modal-trigger'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string; roomId: string }>
}

export default async function RoomDetailPage({ params }: Props) {
  const { id, roomId } = await params
  const ministryId = Number(id)
  const roomIdNum = Number(roomId)

  const room = await prisma.ministryRoom.findFirst({
    where: { id: roomIdNum, isActive: true, ministryId },
    select: {
      id: true,
      name: true,
      ageRange: true,
      ministry: { select: { id: true, name: true } },
      children: {
        where: { isActive: true },
        orderBy: { firstName: 'asc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          tutorName: true,
          tutorPhone: true,
          roomId: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  })

  if (!room) notFound()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/ministerios" className="hover:text-slate-700">
              Ministerios
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/ministerios/${ministryId}`} className="hover:text-slate-700">
              {room.ministry.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">{room.name}</span>
          </nav>
          <h2 className="text-xl font-semibold text-slate-900">{room.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {room.ageRange ? `${room.ageRange} · ` : ''}
            {room.children.length} niño{room.children.length !== 1 ? 's' : ''} registrados
          </p>
        </div>
        {room.children.length > 0 && <ChildFormModalTrigger roomId={room.id} />}
      </div>

      <ChildTable children={room.children} roomId={room.id} />
    </div>
  )
}
