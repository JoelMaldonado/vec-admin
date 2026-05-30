import { StatCard } from '@/components/ui/stat-card'
import type { MemberStats } from '@/features/members/types'
import { CheckCircle, Shield, Users, UsersRound } from 'lucide-react'

interface MemberStatsProps {
  stats: MemberStats
}

export function MemberStatsCards({ stats }: MemberStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total Miembros" value={stats.total} icon={Users} />
      <StatCard
        title="Miembros Activos"
        value={stats.active}
        icon={CheckCircle}
        trend={{
          value: Math.round((stats.active / stats.total) * 100),
          label: '% del total',
        }}
      />
      <StatCard title="Bautizados" value={stats.baptized} icon={Shield} />
      <StatCard title="Grupos Familiares" value={stats.familyGroups} icon={UsersRound} />
    </div>
  )
}
