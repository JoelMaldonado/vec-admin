import { createDistrict, deleteDistrict, getDistricts, updateDistrict } from '@/features/settings/actions/districts.actions'
import { CatalogView } from '@/features/settings/components/catalog-view'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function DistrictsPage() {
  const districts = await getDistricts()

  const items = districts.map((d) => ({
    id: d.id,
    name: d.name,
    color: d.color,
    memberCount: d._count.members,
  }))

  return (
    <div className="space-y-5">
      <div>
        <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/settings" className="hover:text-slate-600">Configuración</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">Distritos</span>
        </nav>
        <h2 className="text-xl font-semibold text-slate-900">Distritos</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona los distritos y su color identificador
        </p>
      </div>

      <CatalogView
        title="Distritos"
        items={items}
        onCreate={createDistrict}
        onUpdate={updateDistrict}
        onDelete={deleteDistrict}
      />
    </div>
  )
}
