import { StatCard } from '@/components/ui/stat-card'
import { BarChart2, Calendar, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Bienvenido</h2>
        <p className="mt-1 text-sm text-slate-500">
          Resumen general de la Iglesia Vida en Cristo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Miembros"
          value="248"
          icon={Users}
          trend={{ value: 4.2, label: 'este mes' }}
        />
        <StatCard
          title="Miembros Activos"
          value="211"
          icon={TrendingUp}
          trend={{ value: 1.8, label: 'este mes' }}
        />
        <StatCard title="Eventos este mes" value="6" icon={Calendar} />
        <StatCard title="Grupos Familiares" value="5" icon={BarChart2} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Próximamente</p>
        <p className="mt-1 text-slate-400 text-sm">
          Gráficos y actividad reciente estarán disponibles aquí.
        </p>
      </div>
    </div>
  )
}
