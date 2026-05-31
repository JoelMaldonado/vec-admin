import { createUser, deleteUser, getUsers, updateUser } from '@/features/settings/actions/users.actions'
import { UsersView } from '@/features/settings/components/users-view'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-5">
      <div>
        <nav className="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <Link href="/settings" className="hover:text-slate-600">Configuración</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">Usuarios</span>
        </nav>
        <h2 className="text-xl font-semibold text-slate-900">Usuarios</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra los accesos al sistema y sus roles
        </p>
      </div>

      <UsersView
        users={users}
        onCreate={createUser}
        onUpdate={updateUser}
        onDelete={deleteUser}
      />
    </div>
  )
}
