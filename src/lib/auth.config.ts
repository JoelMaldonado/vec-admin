import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
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
