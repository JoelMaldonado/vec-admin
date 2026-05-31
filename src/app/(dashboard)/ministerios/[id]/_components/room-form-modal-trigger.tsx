'use client'

import { RoomFormModal } from '@/features/ministries/components/room-form-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface RoomFormModalTriggerProps {
  ministryId: number
}

export function RoomFormModalTrigger({ ministryId }: RoomFormModalTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Nuevo salón
      </Button>
      <RoomFormModal isOpen={open} onClose={() => setOpen(false)} ministryId={ministryId} />
    </>
  )
}
