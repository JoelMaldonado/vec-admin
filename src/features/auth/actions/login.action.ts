'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { loginSchema, type LoginInput } from '../schemas/login.schema'

export type LoginResult = { success: true } | { success: false; error: string }

export async function loginAction(data: LoginInput): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: 'Datos de acceso inválidos' }
  }

  try {
    await signIn('credentials', {
      dni: parsed.data.dni,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'DNI o contraseña incorrectos' }
    }
    throw error
  }
}
