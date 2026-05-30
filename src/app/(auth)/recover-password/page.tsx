import { RecoverPasswordForm } from '@/features/auth/components/recover-password-form'
import Link from 'next/link'

export default function RecoverPasswordPage() {
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
          <h2 className="mb-2 text-base font-semibold text-slate-800">Restablecer contraseña</h2>

          <RecoverPasswordForm />

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Iglesia Vida en Cristo &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
