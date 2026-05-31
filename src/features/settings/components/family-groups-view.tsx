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
import { MapPin, Pencil, Plus, Trash2, User } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const MapPicker = dynamic(
  () => import('./map-picker').then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-83.5 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
    ),
  },
)

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#14b8a6', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#64748b',
]

export interface FamilyGroupItem {
  id: number
  name: string
  color: string
  leaderName: string | null
  memberCount: number
  address: string | null
  latitude: number | null
  longitude: number | null
}

export interface MemberOption {
  id: number
  fullName: string
}

type ActionResult = { success: true } | { success: false; error: string }

interface FamilyGroupsViewProps {
  items: FamilyGroupItem[]
  memberOptions: MemberOption[]
  onCreate: (data: { name: string; color: string; leaderId: number | null; address: string | null; latitude: number | null; longitude: number | null }) => Promise<ActionResult>
  onUpdate: (id: number, data: { name: string; color: string; leaderId: number | null; address: string | null; latitude: number | null; longitude: number | null }) => Promise<ActionResult>
  onDelete: (id: number) => Promise<ActionResult>
}

const EMPTY_FORM = {
  name: '',
  color: COLORS[5],
  leaderId: '',
  address: '',
  latitude: '',
  longitude: '',
}

export function FamilyGroupsView({ items, memberOptions, onCreate, onUpdate, onDelete }: FamilyGroupsViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<FamilyGroupItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<FamilyGroupItem | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEdit(item: FamilyGroupItem) {
    setEditing(item)
    setForm({
      name: item.name,
      color: item.color,
      leaderId: '',
      address: item.address ?? '',
      latitude: item.latitude != null ? String(item.latitude) : '',
      longitude: item.longitude != null ? String(item.longitude) : '',
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  function set(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  function handleSave() {
    if (!form.name.trim()) { setFormError('El nombre es requerido.'); return }
    const data = {
      name: form.name,
      color: form.color,
      leaderId: form.leaderId ? parseInt(form.leaderId) : null,
      address: form.address || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    }
    startTransition(async () => {
      const result = editing
        ? await onUpdate(editing.id, data)
        : await onCreate(data)
      if (!result.success) { setFormError(result.error); return }
      setIsModalOpen(false)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!deletingItem) return
    startTransition(async () => {
      await onDelete(deletingItem.id)
      setDeletingItem(null)
      router.refresh()
    })
  }


  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-medium text-slate-500">
            {items.length} {items.length === 1 ? 'registro' : 'registros'}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo
          </Button>
        </div>

        {/* List */}
        {items.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No hay grupos familiares registrados aún.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-5 py-4">
                {/* Color dot */}
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {item.leaderName && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <User className="h-3 w-3" />
                        {item.leaderName}
                      </span>
                    )}
                    {item.address && (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {item.address}
                      </span>
                    )}
                  </div>
                </div>

                {/* Member count */}
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  {item.memberCount} {item.memberCount === 1 ? 'miembro' : 'miembros'}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
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
        title={editing ? 'Editar Grupo Familiar' : 'Nuevo Grupo Familiar'}
        className="max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-5">
          {/* Nombre + color */}
          <div className="space-y-4">
            <Input
              label="Nombre del grupo *"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej. Grupo Alfa"
            />

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => set('color', c)}
                    className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: form.color === c ? `3px solid ${c}` : undefined,
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lider */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Líder del grupo</p>
            <select
              value={form.leaderId}
              onChange={(e) => set('leaderId', e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Sin líder asignado</option>
              {memberOptions.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Ubicacion */}
          <div className="space-y-3">
            <Input
              label="Dirección"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Ej. Av. Los Maestros 234, Ica"
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Ubicación en mapa</p>
              <MapPicker
                lat={form.latitude ? parseFloat(form.latitude) : null}
                lng={form.longitude ? parseFloat(form.longitude) : null}
                onChange={(lat, lng) => {
                  set('latitude', String(lat))
                  set('longitude', String(lng))
                }}
              />
            </div>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
          )}

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
            <AlertDialogTitle>¿Eliminar grupo familiar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará{' '}
              <span className="font-semibold text-slate-700">{deletingItem?.name}</span>.
              Los miembros asociados quedarán sin grupo familiar.
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
