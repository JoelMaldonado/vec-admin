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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#14b8a6', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#64748b',
]

export interface CatalogItem {
  id: number
  name: string
  color: string
  memberCount: number
}

type ActionResult = { success: true } | { success: false; error: string }

interface CatalogViewProps {
  title: string
  items: CatalogItem[]
  onCreate?: (name: string, color: string) => Promise<ActionResult>
  onUpdate?: (id: number, name: string, color: string) => Promise<ActionResult>
  onDelete?: (id: number) => Promise<ActionResult>
}

export function CatalogView({ title, items, onCreate, onUpdate, onDelete }: CatalogViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<CatalogItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<CatalogItem | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[5])
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setName('')
    setColor(COLORS[5])
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEdit(item: CatalogItem) {
    setEditing(item)
    setName(item.name)
    setColor(item.color)
    setFormError(null)
    setIsModalOpen(true)
  }

  function handleSave() {
    if (!name.trim()) {
      setFormError('El nombre es requerido.')
      return
    }
    startTransition(async () => {
      const result = editing
        ? await onUpdate?.(editing.id, name, color) ?? { success: true as const }
        : await onCreate?.(name, color) ?? { success: true as const }

      if (!result.success) {
        setFormError(result.error)
        return
      }
      setIsModalOpen(false)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!deletingItem) return
    startTransition(async () => {
      await onDelete?.(deletingItem.id)
      setDeletingItem(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-medium text-slate-500">
            {items.length} {items.length === 1 ? 'registro' : 'registros'}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No hay registros aún. Crea el primero.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1 text-sm font-medium text-slate-800">{item.name}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  {item.memberCount} {item.memberCount === 1 ? 'miembro' : 'miembros'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? `Editar ${title.slice(0, -1)}` : `Nuevo ${title.slice(0, -1)}`}
        className="max-w-sm"
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={name}
            onChange={(e) => { setName(e.target.value); setFormError(null) }}
            placeholder={`Nombre del ${title.toLowerCase().slice(0, -1)}`}
            error={formError ?? undefined}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `3px solid ${c}` : undefined,
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-slate-500">Color seleccionado</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSave} isLoading={isPending}>
              {editing ? 'Guardar cambios' : 'Crear'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <AlertDialog
        open={deletingItem !== null}
        onOpenChange={(open) => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <AlertDialogTitle>¿Eliminar {title.toLowerCase().slice(0, -1)}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará{' '}
              <span className="font-semibold text-slate-700">{deletingItem?.name}</span>.
              Los miembros asociados quedarán sin {title.toLowerCase().slice(0, -1)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
