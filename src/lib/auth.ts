import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
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
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id)
        token.dni = (user as any).dni
        token.role = (user as any).role
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as number
      session.user.dni = token.dni as string
      session.user.role = token.role as any
      session.user.name = token.name as string
      return session
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = request.nextUrl

      const protectedPrefixes = ['/dashboard', '/members', '/events', '/finances', '/reports']
      const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))

      if (isProtected) return isLoggedIn

      if (pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', request.nextUrl))
      }

      return true
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
