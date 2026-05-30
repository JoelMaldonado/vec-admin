import { z } from 'zod'

export const dniSchema = z.object({
  dni: z
    .string()
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^\d{8}$/, 'El DNI solo puede contener números'),
})

export const codeSchema = z.object({
  code: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d{6}$/, 'El código solo puede contener números'),
})

export const newPasswordSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type DniInput = z.infer<typeof dniSchema>
export type CodeInput = z.infer<typeof codeSchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>
