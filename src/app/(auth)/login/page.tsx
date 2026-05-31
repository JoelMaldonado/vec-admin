import { LoginForm } from '@/features/auth/components/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
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
  )
}
