export type Member = {
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
  updatedAt: Date
}

export type CreateMemberInput = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateMemberInput = Partial<CreateMemberInput>
