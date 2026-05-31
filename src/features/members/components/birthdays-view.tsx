'use client'

import { Avatar } from '@/components/ui/avatar'
import { useState } from 'react'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export interface BirthdayMember {
  id: number
  firstName: string
  lastName: string
  birthDate: Date
}

interface BirthdaysViewProps {
  members: BirthdayMember[]
}

function turningAge(birthDate: Date): number {
  return new Date().getFullYear() - birthDate.getFullYear()
}

function formatDay(birthDate: Date): string {
  return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long' }).format(birthDate)
}

export function BirthdaysView({ members }: BirthdaysViewProps) {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())

  const byMonth = MONTHS.map((_, idx) =>
    members
      .filter((m) => new Date(m.birthDate).getMonth() === idx)
      .sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate()),
  )

  const currentList = byMonth[activeMonth]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {MONTHS.map((month, idx) => {
            const count = byMonth[idx].length
            const isActive = idx === activeMonth
            const isCurrentMonth = idx === new Date().getMonth()
            return (
              <button
                key={month}
                onClick={() => setActiveMonth(idx)}
                className={[
                  'relative flex flex-col items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                ].join(' ')}
              >
                {isCurrentMonth && !isActive && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
                <span>{month.slice(0, 3)}</span>
                <span className={`mt-0.5 text-[11px] font-bold ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {MONTHS[activeMonth]}
            <span className="ml-2 font-normal text-slate-400">
              {currentList.length === 0
                ? 'Sin cumpleaños'
                : `${currentList.length} cumpleaño${currentList.length > 1 ? 's' : ''}`}
            </span>
          </p>
        </div>

        {currentList.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Ningún miembro cumple años en {MONTHS[activeMonth].toLowerCase()}.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {currentList.map((member) => {
              const fullName = `${member.firstName} ${member.lastName}`
              const age = turningAge(new Date(member.birthDate))
              const day = formatDay(new Date(member.birthDate))
              return (
                <li key={member.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Avatar name={fullName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-700">{day}</p>
                    <p className="text-xs text-slate-400">Cumple {age} años</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
