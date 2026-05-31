'use client'

import { ChildFormModal } from '@/features/ministries/components/child-form-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface ChildFormModalTriggerProps {
  roomId: number
}

export function ChildFormModalTrigger({ roomId }: ChildFormModalTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Agregar niño
      </Button>
      <ChildFormModal isOpen={open} onClose={() => setOpen(false)} roomId={roomId} />
    </>
  )
}
