'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { DistrictRef, FamilyGroupRef, MemberFilters } from '@/features/members/types'
import { DEFAULT_FILTERS } from '@/features/members/types'
import { GENDER_OPTIONS } from '@/lib/constants'
import { X } from 'lucide-react'

interface MemberFiltersProps {
  filters: MemberFilters
  districts: DistrictRef[]
  familyGroups: FamilyGroupRef[]
  onFiltersChange: (filters: MemberFilters) => void
}
const genderOptions = GENDER_OPTIONS.map((g) => ({ value: g, label: g }))
const statusOptions = [
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
]

function hasActiveFilters(filters: MemberFilters): boolean {
  return (
    filters.search !== '' ||
    filters.district !== '' ||
    filters.familyGroup !== '' ||
    filters.gender !== '' ||
    filters.isActive !== 'all'
  )
}

export function MemberFilters({ filters, districts, familyGroups, onFiltersChange }: MemberFiltersProps) {
  const districtOptions = districts.map((d) => ({ value: d.name, label: d.name }))
  const groupOptions = familyGroups.map((g) => ({ value: g.name, label: g.name }))

  function update(partial: Partial<MemberFilters>) {
    onFiltersChange({ ...filters, ...partial })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-55 flex-1">
          <Input
            label="Buscar"
            placeholder="Nombre o DNI..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>

        <div className="w-40">
          <Select
            label="Distrito"
            placeholder="Todos"
            options={districtOptions}
            value={filters.district}
            onChange={(e) => update({ district: e.target.value })}
          />
        </div>

        <div className="w-40">
          <Select
            label="Grupo Familiar"
            placeholder="Todos"
            options={groupOptions}
            value={filters.familyGroup}
            onChange={(e) => update({ familyGroup: e.target.value })}
          />
        </div>

        <div className="w-35">
          <Select
            label="Género"
            placeholder="Todos"
            options={genderOptions}
            value={filters.gender}
            onChange={(e) => update({ gender: e.target.value })}
          />
        </div>

        <div className="w-35">
          <Select
            label="Estado"
            placeholder="Todos"
            options={statusOptions}
            value={filters.isActive === 'all' ? '' : filters.isActive}
            onChange={(e) =>
              update({ isActive: e.target.value === '' ? 'all' : e.target.value })
            }
          />
        </div>

        {hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
            className="gap-1.5 self-end"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
