import { RecoverPasswordForm } from '@/features/auth/components/recover-password-form'
import Link from 'next/link'

export default function RecoverPasswordPage() {
  return (
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
  )
}
