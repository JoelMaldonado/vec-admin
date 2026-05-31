import { prisma } from '@/lib/prisma'
import { MemberCard } from '@/features/members/components/member-card'
import { ChevronLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
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
  })

  if (!member) notFound()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Miembros
        </Link>
        <Link
          href={`/members/${member.id}/edit`}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Link>
      </div>

      <MemberCard member={member} />
    </div>
  )
}
