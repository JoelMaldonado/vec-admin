'use client'

import { MinistryFormModal } from '@/features/ministries/components/ministry-form-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function MinistryFormModalTrigger() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Nuevo ministerio
      </Button>
      <MinistryFormModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
