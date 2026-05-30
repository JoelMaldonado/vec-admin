export interface Member {
  id: number
  firstName: string
  lastName: string
  dni: string
  phone: string | null
  address: string | null
  district: string | null
  birthDate: Date | null
  maritalStatus: string | null
  gender: string
  familyGroup: string | null
  isBaptized: boolean
  isActive: boolean
  createdAt: Date
}

export interface MemberFilters {
  search: string
  district: string
  familyGroup: string
  gender: string
  isActive: string // 'all' | 'true' | 'false'
}

export interface MemberStats {
  total: number
  active: number
  baptized: number
  familyGroups: number
}

export type CreateMemberInput = Omit<Member, 'id' | 'createdAt'>

export type UpdateMemberInput = Partial<CreateMemberInput>

export const DEFAULT_FILTERS: MemberFilters = {
  search: '',
  district: '',
  familyGroup: '',
  gender: '',
  isActive: 'all',
}
