'use client'

import { ChildFormModal } from '@/features/ministries/components/child-form-modal'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface ChildFormModalTriggerProps {
  roomId: number
}

export function ChildFormModalTrigger({ roomId }: ChildFormModalTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        Agregar niño
      </button>
      <ChildFormModal isOpen={open} onClose={() => setOpen(false)} roomId={roomId} />
    </>
  )
}
