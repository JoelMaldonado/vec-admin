'use client'

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type Role = 'ADMIN' | 'EDITOR' | 'VIEWER'

const ROLES: { value: Role; label: string }[] = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'VIEWER', label: 'Visualizador' },
]

const roleBadge: Record<Role, 'danger' | 'info' | 'default'> = {
  ADMIN: 'danger',
  EDITOR: 'info',
  VIEWER: 'default',
}

export interface UserItem {
  id: number
  name: string
  dni: string
  email: string | null
  role: Role
  isActive: boolean
  createdAt: Date
}

type ActionResult = { success: true } | { success: false; error: string }

interface UsersViewProps {
  users: UserItem[]
  onCreate: (data: { name: string; dni: string; email: string | null; password: string; role: Role }) => Promise<ActionResult>
  onUpdate: (id: number, data: { name: string; dni: string; email: string | null; role: Role; isActive: boolean; newPassword?: string }) => Promise<ActionResult>
  onDelete: (id: number) => Promise<ActionResult>
}

const EMPTY = { name: '', dni: '', email: '', password: '', confirmPassword: '', role: 'VIEWER' as Role, isActive: true, newPassword: '' }

export function UsersView({ users, onCreate, onUpdate, onDelete }: UsersViewProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserItem | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [formError, setFormError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setFormError(null)
    setIsModalOpen(true)
  }

  function openEdit(user: UserItem) {
    setEditing(user)
    setForm({ ...EMPTY, name: user.name, dni: user.dni, email: user.email ?? '', role: user.role, isActive: user.isActive })
    setFormError(null)
    setIsModalOpen(true)
  }

  function set(field: keyof typeof EMPTY, value: string | boolean) {
    setForm((p) => ({ ...p, [field]: value }))
    setFormError(null)
  }

  function handleSave() {
    if (!form.name.trim()) { setFormError('El nombre es requerido.'); return }
    if (form.dni.length !== 8) { setFormError('El DNI debe tener 8 dígitos.'); return }
    if (!editing && !form.password.trim()) { setFormError('La contraseña es requerida.'); return }
    if (!editing && form.password !== form.confirmPassword) { setFormError('Las contraseñas no coinciden.'); return }
    if (editing && form.newPassword && form.newPassword !== form.confirmPassword) {
      setFormError('Las contraseñas no coinciden.')
      return
    }

    startTransition(async () => {
      const result = editing
        ? await onUpdate(editing.id, {
            name: form.name, dni: form.dni,
            email: form.email || null,
            role: form.role, isActive: form.isActive,
            newPassword: form.newPassword || undefined,
          })
        : await onCreate({
            name: form.name, dni: form.dni,
            email: form.email || null,
            password: form.password, role: form.role,
          })

      if (!result.success) { setFormError(result.error); return }
      setIsModalOpen(false)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!deletingUser) return
    startTransition(async () => {
      await onDelete(deletingUser.id)
      setDeletingUser(null)
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-medium text-slate-500">
            {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
          </p>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No hay usuarios registrados.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                  {user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">DNI {user.dni}{user.email ? ` · ${user.email}` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={roleBadge[user.role]}>{ROLES.find((r) => r.value === user.role)?.label}</Badge>
                  <Badge variant={user.isActive ? 'success' : 'warning'}>{user.isActive ? 'Activo' : 'Inactivo'}</Badge>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(user)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeletingUser(user)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Usuario' : 'Nuevo Usuario'} className="max-w-sm">
        <div className="space-y-4">
          <Input label="Nombre completo *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej. Carlos Huamaní" />
          <Input label="DNI *" value={form.dni} onChange={(e) => set('dni', e.target.value)} placeholder="12345678" maxLength={8} />
          <Input label="Correo electrónico" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="correo@ejemplo.com" type="email" />

          <div>
            <p className="mb-1.5 text-sm font-medium text-slate-700">Rol *</p>
            <select
              value={form.role}
              onChange={(e) => set('role', e.target.value as Role)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {editing && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              <label htmlFor="isActive" className="cursor-pointer text-sm text-slate-700">Usuario activo</label>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3">
            <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
              {editing ? 'Cambiar contraseña (dejar vacío para mantener)' : 'Contraseña'}
            </p>
            <div className="space-y-3">
              <Input
                label={editing ? 'Nueva contraseña' : 'Contraseña *'}
                value={editing ? form.newPassword : form.password}
                onChange={(e) => set(editing ? 'newPassword' : 'password', e.target.value)}
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirmar contraseña"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isPending}>Cancelar</Button>
            <Button onClick={handleSave} isLoading={isPending}>{editing ? 'Guardar cambios' : 'Crear usuario'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete */}
      <AlertDialog open={deletingUser !== null} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente a <span className="font-semibold text-slate-700">{deletingUser?.name}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>{isPending ? 'Eliminando…' : 'Eliminar'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
