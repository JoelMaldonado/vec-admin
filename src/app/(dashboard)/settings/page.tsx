import { MapPin, Users } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    href: '/settings/districts',
    icon: MapPin,
    label: 'Distritos',
    description: 'Administra los distritos y asígnales un color para identificarlos rápidamente.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    href: '/settings/family-groups',
    icon: Users,
    label: 'Grupos Familiares',
    description: 'Gestiona los grupos familiares de la iglesia con su color identificador.',
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Configuración</h2>
        <p className="mt-1 text-sm text-slate-500">
          Administra los catálogos y datos de referencia del sistema
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map(({ href, icon: Icon, label, description, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-blue-600">{label}</p>
              <p className="mt-0.5 text-sm text-slate-500">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
