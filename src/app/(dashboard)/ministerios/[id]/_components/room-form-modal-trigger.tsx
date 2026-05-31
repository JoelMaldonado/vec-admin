'use client'

import { RoomFormModal } from '@/features/ministries/components/room-form-modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface RoomFormModalTriggerProps {
  ministryId: number
}

export function RoomFormModalTrigger({ ministryId }: RoomFormModalTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Nuevo salón
      </button>
      <RoomFormModal isOpen={open} onClose={() => setOpen(false)} ministryId={ministryId} />
    </>
  )
}
