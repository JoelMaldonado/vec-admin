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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { deleteChild } from '@/features/ministries/actions/ministries.actions'
import { ChildFormModal } from '@/features/ministries/components/child-form-modal'
import type { Child } from '@/features/ministries/types'
import { toTitleCase } from '@/lib/utils'
import { Baby, Edit, Phone, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

function calcAge(birthDate: Date | null): string {
  if (!birthDate) return '—'
  const today = new Date()
  const birth = new Date(birthDate)
  const years = today.getFullYear() - birth.getFullYear()
  const months = today.getMonth() - birth.getMonth()
  const age = months < 0 || (months === 0 && today.getDate() < birth.getDate()) ? years - 1 : years
  return `${age} año${age !== 1 ? 's' : ''}`
}

interface ChildTableProps {
  children: Child[]
  roomId: number
}

export function ChildTable({ children, roomId }: ChildTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [deletingChild, setDeletingChild] = useState<Child | null>(null)
  const [newOpen, setNewOpen] = useState(false)

  function handleConfirmDelete() {
    if (!deletingChild) return
    startTransition(async () => {
      await deleteChild(deletingChild.id)
      setDeletingChild(null)
      router.refresh()
    })
  }

  if (children.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Baby className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No hay niños en este salón</p>
          <Button className="mt-3" onClick={() => setNewOpen(true)}>
            Agregar niño
          </Button>
        </div>
        <ChildFormModal isOpen={newOpen} onClose={() => setNewOpen(false)} roomId={roomId} />
      </>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {children.map((child) => (
              <TableRow key={child.id}>
                <TableCell className="font-medium text-slate-900">
                  {toTitleCase(child.firstName)} {toTitleCase(child.lastName)}
                </TableCell>
                <TableCell className="text-slate-600">{calcAge(child.birthDate)}</TableCell>
                <TableCell className="text-slate-600">{toTitleCase(child.tutorName)}</TableCell>
                <TableCell>
                  {child.tutorPhone ? (
                    <a
                      href={`tel:${child.tutorPhone}`}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {child.tutorPhone}
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingChild(child)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingChild(child)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingChild && (
        <ChildFormModal
          isOpen={true}
          onClose={() => setEditingChild(null)}
          roomId={roomId}
          child={editingChild}
        />
      )}

      <AlertDialog open={!!deletingChild} onOpenChange={(open) => !open && setDeletingChild(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará a{' '}
              <strong>
                {deletingChild?.firstName} {deletingChild?.lastName}
              </strong>{' '}
              del salón. Esta acción se puede revertir.
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
