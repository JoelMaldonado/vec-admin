'use client'

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
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Juan"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Apellido</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Pérez"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Fecha de nacimiento <span className="text-slate-400">(opcional)</span>
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            value={form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, birthDate: e.target.value ? new Date(e.target.value) : null }))
            }
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre del tutor</label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="María Pérez"
            value={form.tutorName}
            onChange={(e) => setForm((f) => ({ ...f, tutorName: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Teléfono del tutor <span className="text-slate-400">(opcional)</span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="999-123-456"
            value={form.tutorPhone ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, tutorPhone: e.target.value }))}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
