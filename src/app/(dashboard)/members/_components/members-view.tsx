'use client'

import { Button } from '@/components/ui/button'
import { MemberFilters } from '@/features/members/components/member-filters'
import { MemberTable } from '@/features/members/components/member-table'
import type { Member, MemberFilters as MemberFiltersType } from '@/features/members/types'
import { DEFAULT_FILTERS } from '@/features/members/types'
import { PAGE_SIZE } from '@/lib/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

interface MembersViewProps {
  members: Member[]
}

function applyFilters(members: Member[], filters: MemberFiltersType): Member[] {
  return members.filter((m) => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase()
    const search = filters.search.toLowerCase().trim()

    if (search && !fullName.includes(search) && !m.dni.includes(search)) return false
    if (filters.district && m.district !== filters.district) return false
    if (filters.familyGroup && m.familyGroup !== filters.familyGroup) return false
    if (filters.gender && m.gender !== filters.gender) return false
    if (filters.isActive === 'true' && !m.isActive) return false
    if (filters.isActive === 'false' && m.isActive) return false

    return true
  })
}

export function MembersView({ members }: MembersViewProps) {
  const [filters, setFilters] = useState<MemberFiltersType>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    setPage(1)
    return applyFilters(members, filters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFiltersChange(next: MemberFiltersType) {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <MemberFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <MemberTable members={paginated} />

      {/* Pagination */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-slate-500">
          {filtered.length === 0
            ? 'Sin resultados'
            : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} de ${filtered.length} miembros`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
