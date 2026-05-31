import { prisma } from '@/lib/prisma'
import { MinistryList } from '@/features/ministries/components/ministry-list'
import { MinistryFormModalTrigger } from '@/app/(dashboard)/ministerios/_components/ministry-form-modal-trigger'

export default async function MinisteriosPage() {
  const ministries = await prisma.ministry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      type: true,
      color: true,
      isActive: true,
      createdAt: true,
      _count: { select: { rooms: { where: { isActive: true } } } },
    },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Ministerios</h2>
          <p className="mt-1 text-sm text-slate-500">Gestión de ministerios y grupos de la iglesia</p>
        </div>
        <MinistryFormModalTrigger />
      </div>

      <MinistryList ministries={ministries} />
    </div>
  )
}
