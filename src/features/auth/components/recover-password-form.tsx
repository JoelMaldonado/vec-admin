'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  dniSchema,
  codeSchema,
  newPasswordSchema,
  type DniInput,
  type CodeInput,
  type NewPasswordInput,
} from '../schemas/recover-password.schema'
import {
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
} from '../actions/recover-password.action'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Step = 1 | 2 | 3

export function RecoverPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [dni, setDni] = useState('')
  const [code, setCode] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const dniForm = useForm<DniInput>({ resolver: zodResolver(dniSchema) })
  const codeForm = useForm<CodeInput>({ resolver: zodResolver(codeSchema) })
  const passwordForm = useForm<NewPasswordInput>({ resolver: zodResolver(newPasswordSchema) })

  const onDniSubmit = async (data: DniInput) => {
    setServerError(null)
    const result = await requestPasswordReset(data.dni)
    if (!result.success) {
      setServerError(result.error ?? 'Error al procesar la solicitud')
      return
    }
    setDni(data.dni)
    setStep(2)
  }

  const onCodeSubmit = async (data: CodeInput) => {
    setServerError(null)
    const result = await verifyResetCode(dni, data.code)
    if (!result.success) {
      setServerError(result.error ?? 'Código inválido')
      return
    }
    setCode(data.code)
    setStep(3)
  }

  const onPasswordSubmit = async (data: NewPasswordInput) => {
    setServerError(null)
    const result = await resetPassword(dni, code, data.password)
    if (!result.success) {
      setServerError(result.error ?? 'Error al restablecer la contraseña')
      return
    }
    router.push('/login?reset=success')
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        {([1, 2, 3] as Step[]).map((s) => (
          <div
            key={s}
            className={[
              'h-1.5 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-blue-600' : 'bg-slate-200',
            ].join(' ')}
          />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={dniForm.handleSubmit(onDniSubmit)} className="space-y-4" noValidate>
          <p className="mb-4 text-sm text-slate-500">
            Ingresa tu DNI y te enviaremos un código a tu correo registrado.
          </p>
          <Input
            label="DNI"
            type="text"
            placeholder="Ingresa tu DNI"
            maxLength={8}
            error={dniForm.formState.errors.dni?.message}
            {...dniForm.register('dni')}
          />
          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={dniForm.formState.isSubmitting}
          >
            Enviar código
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4" noValidate>
          <p className="mb-4 text-sm text-slate-500">
            Ingresa el código de 6 dígitos que enviamos a tu correo.
          </p>
          <Input
            label="Código de verificación"
            type="text"
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            className="text-center text-xl tracking-widest"
            error={codeForm.formState.errors.code?.message}
            {...codeForm.register('code')}
          />
          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={codeForm.formState.isSubmitting}
          >
            Verificar código
          </Button>
          <button
            type="button"
            onClick={() => { setStep(1); setServerError(null) }}
            className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
          >
            Volver
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-4"
          noValidate
        >
          <p className="mb-4 text-sm text-slate-500">Ingresa tu nueva contraseña.</p>
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            error={passwordForm.formState.errors.password?.message}
            {...passwordForm.register('password')}
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />
          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={passwordForm.formState.isSubmitting}
          >
            Cambiar contraseña
          </Button>
        </form>
      )}
    </div>
  )
}
