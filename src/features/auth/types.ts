export type AuthUser = {
  id: string
  email: string
  name: string | null
}

export type LoginCredentials = {
  email: string
  password: string
}
