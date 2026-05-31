import { prisma } from '@/lib/prisma'
import { BirthdaysView } from '@/features/members/components/birthdays-view'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function BirthdaysPage() {
  const members = await prisma.member.findMany({
    where: { isActive: true, birthDate: { not: null } },
    orderBy: { firstName: 'asc' },
    select: { id: true, firstName: true, lastName: true, birthDate: true },
  })

  const currentMonth = new Date().toLocaleString('es-PE', { month: 'long' })
  const thisMonthCount = members.filter(
    (m) => new Date(m.birthDate!).getMonth() === new Date().getMonth(),
  ).length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/members"
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Miembros
          </Link>
          <h2 className="text-xl font-semibold text-slate-900">Cumpleaños {new Date().getFullYear()}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {thisMonthCount > 0
              ? `${thisMonthCount} cumpleaño${thisMonthCount > 1 ? 's' : ''} en ${currentMonth}`
              : `Sin cumpleaños en ${currentMonth}`}
          </p>
        </div>
      </div>

      <BirthdaysView members={members as { id: number; firstName: string; lastName: string; birthDate: Date }[]} />
    </div>
  )
}
