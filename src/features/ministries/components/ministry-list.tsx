'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteMinistry } from '@/features/ministries/actions/ministries.actions'
import { MinistryFormModal } from '@/features/ministries/components/ministry-form-modal'
import type { Ministry } from '@/features/ministries/types'
import { Baby, ChevronRight, Edit, Trash2, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface MinistryListProps {
  ministries: Ministry[]
}

export function MinistryList({ ministries }: MinistryListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null)
  const [deletingMinistry, setDeletingMinistry] = useState<Ministry | null>(null)

  function handleConfirmDelete() {
    if (!deletingMinistry) return
    startTransition(async () => {
      await deleteMinistry(deletingMinistry.id)
      setDeletingMinistry(null)
      router.refresh()
    })
  }

  if (ministries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <Users className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No hay ministerios registrados</p>
        <p className="mt-1 text-xs text-slate-400">Crea el primero con el botón de arriba</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {ministries.map((ministry) => {
          const Icon = ministry.type === 'CHILDREN' ? Baby : Users
          const roomsOrMembers =
            ministry.type === 'CHILDREN'
              ? `${ministry._count?.rooms ?? 0} salones`
              : `${ministry._count?.rooms ?? 0} miembros`

          return (
            <div
              key={ministry.id}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-shadow hover:shadow-sm"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${ministry.color}20`, color: ministry.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{ministry.name}</p>
                <p className="text-xs text-slate-500">{roomsOrMembers}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingMinistry(ministry)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingMinistry(ministry)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <Link
                  href={`/ministerios/${ministry.id}`}
                  className="ml-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {editingMinistry && (
        <MinistryFormModal
          isOpen={true}
          onClose={() => setEditingMinistry(null)}
          ministry={editingMinistry}
        />
      )}

      <AlertDialog open={!!deletingMinistry} onOpenChange={(open) => !open && setDeletingMinistry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ministerio?</AlertDialogTitle>
            <AlertDialogDescription>
              Se desactivará <strong>{deletingMinistry?.name}</strong>. Esta acción se puede revertir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending}>
              {isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
