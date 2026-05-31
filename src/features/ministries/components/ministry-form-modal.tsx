'use client'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { createMinistry, updateMinistry } from '@/features/ministries/actions/ministries.actions'
import type { Ministry, CreateMinistryInput } from '@/features/ministries/types'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#0ea5e9']

interface MinistryFormModalProps {
  isOpen: boolean
  onClose: () => void
  ministry?: Ministry
}

export function MinistryFormModal({ isOpen, onClose, ministry }: MinistryFormModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CreateMinistryInput>({
    name: ministry?.name ?? '',
    type: ministry?.type ?? 'ADULTS',
    color: ministry?.color ?? '#3b82f6',
  })

  function handleClose() {
    setError(null)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = ministry
        ? await updateMinistry(ministry.id, form)
        : await createMinistry(form)

      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
      handleClose()
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={ministry ? 'Editar ministerio' : 'Nuevo ministerio'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Nombre</label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Ej. ABC Niños"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        {!ministry && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'ADULTS' | 'CHILDREN' }))}
            >
              <option value="ADULTS">Adultos</option>
              <option value="CHILDREN">Niños</option>
            </select>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                className="h-7 w-7 rounded-full ring-offset-2 transition-all"
                style={{
                  backgroundColor: c,
                  boxShadow: form.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
                }}
              />
            ))}
          </div>
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
