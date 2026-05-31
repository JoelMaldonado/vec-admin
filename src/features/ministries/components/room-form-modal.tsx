'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { createRoom, updateRoom } from '@/features/ministries/actions/ministries.actions'
import type { MinistryRoom, CreateRoomInput } from '@/features/ministries/types'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface RoomFormModalProps {
  isOpen: boolean
  onClose: () => void
  ministryId: number
  room?: MinistryRoom
}

export function RoomFormModal({ isOpen, onClose, ministryId, room }: RoomFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Omit<CreateRoomInput, 'ministryId'>>({
    name: room?.name ?? '',
    ageRange: room?.ageRange ?? '',
  })

  function handleClose() {
    setError(null)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = room
        ? await updateRoom(room.id, ministryId, form)
        : await createRoom({ ...form, ministryId })

      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
      handleClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={room ? 'Editar salón' : 'Nuevo salón'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del salón"
          placeholder="Ej. Salón 1"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Rango de edades <span className="text-slate-400">(opcional)</span>
          </label>
          <Input
            placeholder="Ej. 3-5 años"
            value={form.ageRange ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
