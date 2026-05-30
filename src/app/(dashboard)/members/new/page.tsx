import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { NewMemberForm } from './_components/new-member-form'

export default function NewMemberPage() {
  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/members" className="hover:text-slate-600">
          Miembros
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-600">Nuevo</span>
      </nav>

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Nuevo Miembro</h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa el formulario para registrar un nuevo miembro
        </p>
      </div>

      <NewMemberForm />
    </div>
  )
}
