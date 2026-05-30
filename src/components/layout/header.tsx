'use client'

import { Avatar } from '@/components/ui/avatar'
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Miembros',
  '/members/new': 'Nuevo Miembro',
  '/events': 'Eventos',
  '/finances': 'Finanzas',
  '/reports': 'Reportes',
}

function resolvePageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (/^\/members\/[^/]+\/edit$/.test(pathname)) return 'Editar Miembro'
  if (/^\/members\/[^/]+$/.test(pathname)) return 'Detalle de Miembro'
  return 'VEC Admin'
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const title = resolvePageTitle(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium text-slate-800">Admin VEC</span>
          <span className="text-xs text-slate-400">Administrador</span>
        </div>
        <Avatar name="Admin VEC" size="md" />
      </div>
    </header>
  )
}
