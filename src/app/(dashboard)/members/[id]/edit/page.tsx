import { getMemberById } from '@/features/members/data/mock-members'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EditMemberForm } from './_components/edit-member-form'

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const member = getMemberById(Number(id))

  if (!member) notFound()

  const fullName = `${member.firstName} ${member.lastName}`

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/members" className="hover:text-slate-600">
          Miembros
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/members/${member.id}`} className="hover:text-slate-600">
          {fullName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-600">Editar</span>
      </nav>

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Editar Miembro</h2>
        <p className="mt-1 text-sm text-slate-500">{fullName}</p>
      </div>

      <EditMemberForm member={member} />
    </div>
  )
}
