import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        dni: { label: 'DNI', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const { dni, password } = credentials as { dni: string; password: string }

        if (!dni || !password) return null

        const user = await prisma.user.findUnique({ where: { dni } })

        if (!user || !user.isActive) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: String(user.id),
          dni: user.dni,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id)
        token.dni = (user as { dni: string }).dni
        token.role = (user as { role: string }).role
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: String(token.id),
          dni: token.dni as string,
          role: token.role as string,
          name: (token.name ?? '') as string,
        },
      }
    },
  },
})
