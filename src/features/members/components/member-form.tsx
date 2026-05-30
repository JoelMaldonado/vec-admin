'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { CreateMemberInput, Member } from '@/features/members/types'
import { DISTRICTS, FAMILY_GROUPS, GENDER_OPTIONS, MARITAL_STATUSES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const memberSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'Los apellidos son requeridos'),
  dni: z
    .string()
    .length(8, 'El DNI debe tener 8 dígitos')
    .regex(/^\d{8}$/, 'El DNI debe contener solo números'),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  district: z.string().nullable(),
  birthDate: z.string().nullable(),
  maritalStatus: z.string().nullable(),
  gender: z.string().min(1, 'El género es requerido'),
  familyGroup: z.string().nullable(),
  isBaptized: z.boolean(),
  isActive: z.boolean(),
})

type MemberFormValues = z.infer<typeof memberSchema>

interface MemberFormProps {
  onSubmit: (data: CreateMemberInput) => void
  defaultValues?: Partial<Member>
  isLoading?: boolean
}

function toFormValues(defaults?: Partial<Member>): Partial<MemberFormValues> {
  if (!defaults) return { isBaptized: false, isActive: true }
  return {
    ...defaults,
    birthDate: defaults.birthDate
      ? defaults.birthDate.toISOString().split('T')[0]
      : null,
  }
}

const districtOptions = DISTRICTS.map((d) => ({ value: d, label: d }))
const groupOptions = FAMILY_GROUPS.map((g) => ({ value: g, label: g }))
const genderOptions = GENDER_OPTIONS.map((g) => ({ value: g, label: g }))
const maritalOptions = MARITAL_STATUSES.map((s) => ({ value: s, label: s }))

export function MemberForm({ onSubmit, defaultValues, isLoading }: MemberFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      isBaptized: false,
      isActive: true,
      ...toFormValues(defaultValues),
    },
  })

  function handleFormSubmit(values: MemberFormValues) {
    const input: CreateMemberInput = {
      ...values,
      birthDate: values.birthDate ? new Date(values.birthDate) : null,
    }
    onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Personal info */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">
          Información Personal
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombres *"
            placeholder="Ej. Carlos"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Apellidos *"
            placeholder="Ej. Huamaní Quispe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <Input
            label="DNI *"
            placeholder="12345678"
            maxLength={8}
            error={errors.dni?.message}
            {...register('dni')}
          />
          <Input
            label="Teléfono"
            placeholder="Ej. 956 123 456"
            type="tel"
            {...register('phone')}
          />
          <Input
            label="Fecha de nacimiento"
            type="date"
            {...register('birthDate')}
          />
          <Select
            label="Género *"
            placeholder="Seleccionar..."
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender')}
          />
          <Select
            label="Estado civil"
            placeholder="Seleccionar..."
            options={maritalOptions}
            {...register('maritalStatus')}
          />
        </div>
      </section>

      {/* Location */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Ubicación</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Dirección"
              placeholder="Ej. Av. Los Maestros 234"
              {...register('address')}
            />
          </div>
          <Select
            label="Distrito"
            placeholder="Seleccionar..."
            options={districtOptions}
            {...register('district')}
          />
        </div>
      </section>

      {/* Church info */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-700">Datos Eclesiásticos</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Grupo Familiar"
            placeholder="Seleccionar..."
            options={groupOptions}
            {...register('familyGroup')}
          />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              {...register('isBaptized')}
            />
            <span className="text-sm text-slate-700">Miembro bautizado</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              {...register('isActive')}
            />
            <span className="text-sm text-slate-700">Miembro activo</span>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/members')}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Guardar
        </Button>
      </div>
    </form>
  )
}
