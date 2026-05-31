import { LoginForm } from '@/features/auth/components/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <span className="text-2xl font-bold text-white">VEC</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Vida en Cristo</h1>
          <p className="mt-1 text-sm text-slate-500">Sistema de Administración</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-slate-800">Iniciar sesión</h2>

          <LoginForm />

          <div className="mt-5 text-center">
            <Link
              href="/recover-password"
              className="text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Iglesia Vida en Cristo &copy; {new Date().getFullYear()} &middot; v{process.env.NEXT_PUBLIC_APP_VERSION}
        </p>
      </div>
    </div>
  )
}
