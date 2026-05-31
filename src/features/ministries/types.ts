export type MinistryType = 'ADULTS' | 'CHILDREN'

export interface Ministry {
  id: number
  name: string
  type: MinistryType
  color: string
  isActive: boolean
  createdAt: Date
  _count?: { rooms: number }
}

export interface MinistryRoom {
  id: number
  name: string
  ageRange: string | null
  ministryId: number
  isActive: boolean
  createdAt: Date
  _count?: { children: number }
}

export interface Child {
  id: number
  firstName: string
  lastName: string
  birthDate: Date | null
  tutorName: string
  tutorPhone: string | null
  roomId: number
  isActive: boolean
  createdAt: Date
}

export type CreateMinistryInput = Pick<Ministry, 'name' | 'type' | 'color'>
export type UpdateMinistryInput = Partial<CreateMinistryInput>

export type CreateRoomInput = Pick<MinistryRoom, 'name' | 'ageRange' | 'ministryId'>
export type UpdateRoomInput = Partial<Pick<MinistryRoom, 'name' | 'ageRange'>>

export type CreateChildInput = Pick<Child, 'firstName' | 'lastName' | 'birthDate' | 'tutorName' | 'tutorPhone' | 'roomId'>
export type UpdateChildInput = Partial<Omit<CreateChildInput, 'roomId'>>
