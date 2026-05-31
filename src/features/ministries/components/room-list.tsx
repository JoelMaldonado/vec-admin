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
import { deleteRoom } from '@/features/ministries/actions/ministries.actions'
import { RoomFormModal } from '@/features/ministries/components/room-form-modal'
import type { MinistryRoom } from '@/features/ministries/types'
import { ChevronRight, DoorOpen, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface RoomListProps {
  rooms: MinistryRoom[]
  ministryId: number
}

export function RoomList({ rooms, ministryId }: RoomListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingRoom, setEditingRoom] = useState<MinistryRoom | null>(null)
  const [deletingRoom, setDeletingRoom] = useState<MinistryRoom | null>(null)

  function handleConfirmDelete() {
    if (!deletingRoom) return
    startTransition(async () => {
      await deleteRoom(deletingRoom.id, ministryId)
      setDeletingRoom(null)
      router.refresh()
    })
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <DoorOpen className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No hay salones registrados</p>
        <p className="mt-1 text-xs text-slate-400">Crea el primero con el botón de arriba</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-shadow hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <DoorOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{room.name}</p>
              <p className="text-xs text-slate-500">
                {room.ageRange ? `${room.ageRange} · ` : ''}
                {room._count?.children ?? 0} niños
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingRoom(room)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeletingRoom(room)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link
                href={`/ministerios/${ministryId}/salones/${room.id}`}
                className="ml-1 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {editingRoom && (
        <RoomFormModal
          isOpen={true}
          onClose={() => setEditingRoom(null)}
          ministryId={ministryId}
          room={editingRoom}
        />
      )}

      <AlertDialog open={!!deletingRoom} onOpenChange={(open) => !open && setDeletingRoom(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar salón?</AlertDialogTitle>
            <AlertDialogDescription>
              Se desactivará <strong>{deletingRoom?.name}</strong>. Esta acción se puede revertir.
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
