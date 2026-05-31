'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { createChild, updateChild } from '@/features/ministries/actions/ministries.actions'
import type { Child, CreateChildInput } from '@/features/ministries/types'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface ChildFormModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: number
  child?: Child
}

export function ChildFormModal({ isOpen, onClose, roomId, child }: ChildFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Omit<CreateChildInput, 'roomId'>>({
    firstName: child?.firstName ?? '',
    lastName: child?.lastName ?? '',
    birthDate: child?.birthDate ?? null,
    tutorName: child?.tutorName ?? '',
    tutorPhone: child?.tutorPhone ?? '',
  })

  function handleClose() {
    setError(null)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = child
        ? await updateChild(child.id, form)
        : await createChild({ ...form, roomId })

      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
      handleClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={child ? 'Editar niño' : 'Agregar niño'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nombre"
            placeholder="Juan"
            value={form.firstName}
            onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            required
          />
          <Input
            label="Apellido"
            placeholder="Pérez"
            value={form.lastName}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Fecha de nacimiento <span className="text-slate-400">(opcional)</span>
          </label>
          <Input
            type="date"
            value={form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, birthDate: e.target.value ? new Date(e.target.value) : null }))
            }
          />
        </div>

        <Input
          label="Nombre del tutor"
          placeholder="María Pérez"
          value={form.tutorName}
          onChange={(e) => setForm((f) => ({ ...f, tutorName: e.target.value }))}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Teléfono del tutor <span className="text-slate-400">(opcional)</span>
          </label>
          <Input
            placeholder="999-123-456"
            value={form.tutorPhone ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, tutorPhone: e.target.value }))}
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
