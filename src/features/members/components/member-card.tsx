import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Member } from '@/features/members/types'
import { Calendar, Home, MapPin, Phone, Users } from 'lucide-react'

interface MemberCardProps {
  member: Member
}

function formatDate(date: Date | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function calculateAge(birthDate: Date | null): string {
  if (!birthDate) return '—'
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  const adjusted = m < 0 || (m === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
  return `${adjusted} años`
}

interface DetailRowProps {
  icon: React.ElementType
  label: string
  value: string
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 rounded-lg bg-slate-100 p-1.5">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export function MemberCard({ member }: MemberCardProps) {
  const fullName = `${member.firstName} ${member.lastName}`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-6">
        <Avatar name={fullName} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
          <p className="font-mono text-sm text-slate-400">DNI: {member.dni}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant={member.isActive ? 'info' : 'warning'}>
              {member.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
            {member.isBaptized && <Badge variant="success">Bautizado</Badge>}
            {member.familyGroup && (
              <Badge variant="default">{member.familyGroup.name}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Personal data */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Información Personal
          </h3>
          <div className="space-y-3">
            <DetailRow
              icon={Calendar}
              label="Fecha de nacimiento"
              value={`${formatDate(member.birthDate)} (${calculateAge(member.birthDate)})`}
            />
            <DetailRow
              icon={Users}
              label="Estado civil"
              value={member.maritalStatus ?? '—'}
            />
            <DetailRow
              icon={Users}
              label="Género"
              value={member.gender}
            />
            {member.phone && (
              <DetailRow icon={Phone} label="Teléfono" value={member.phone} />
            )}
          </div>
        </div>

        {/* Location & church */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Ubicación y Datos Eclesiásticos
          </h3>
          <div className="space-y-3">
            {member.address && (
              <DetailRow icon={Home} label="Dirección" value={member.address} />
            )}
            <DetailRow
              icon={MapPin}
              label="Distrito"
              value={member.district?.name ?? '—'}
            />
            <DetailRow
              icon={Users}
              label="Grupo Familiar"
              value={member.familyGroup?.name ?? '—'}
            />
            <DetailRow
              icon={Calendar}
              label="Miembro desde"
              value={formatDate(member.createdAt)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
