'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { lookupDni } from '@/features/members/actions/dni-lookup.action'
import type { CreateMemberInput, DistrictRef, FamilyGroupRef, Member } from '@/features/members/types'
import { GENDER_OPTIONS, MARITAL_STATUSES } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
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
  districtId: z.string().nullable().optional(),
  birthDate: z.string().nullable(),
  maritalStatus: z.string().nullable(),
  gender: z.string().min(1, 'El género es requerido'),
  familyGroupId: z.string().nullable().optional(),
  isBaptized: z.boolean(),
  isActive: z.boolean(),
})

type MemberFormValues = z.infer<typeof memberSchema>

interface MemberFormProps {
  onSubmit: (data: CreateMemberInput) => void
  defaultValues?: Partial<Member>
  districts: DistrictRef[]
  familyGroups: FamilyGroupRef[]
  dniLookupRemaining: number
  isLoading?: boolean
}

function toFormValues(defaults?: Partial<Member>): Partial<MemberFormValues> {
  if (!defaults) return { isBaptized: false, isActive: true }
  return {
    ...defaults,
    districtId: defaults.districtId != null ? String(defaults.districtId) : null,
    familyGroupId: defaults.familyGroupId != null ? String(defaults.familyGroupId) : null,
    birthDate: defaults.birthDate
      ? defaults.birthDate.toISOString().split('T')[0]
      : null,
  }
}

const genderOptions = GENDER_OPTIONS.map((g) => ({ value: g, label: g }))
const maritalOptions = MARITAL_STATUSES.map((s) => ({ value: s, label: s }))

export function MemberForm({ onSubmit, defaultValues, districts, familyGroups, dniLookupRemaining, isLoading }: MemberFormProps) {
  const router = useRouter()
  const [remaining, setRemaining] = useState(dniLookupRemaining)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [lookupSuccess, setLookupSuccess] = useState(false)
  const [isLooking, startLookup] = useTransition()

  const districtOptions = districts.map((d) => ({ value: String(d.id), label: d.name }))
  const familyGroupOptions = familyGroups.map((g) => ({ value: String(g.id), label: g.name }))

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      isBaptized: false,
      isActive: true,
      ...toFormValues(defaultValues),
    },
  })

  function handleLookup() {
    const dni = getValues('dni')
    if (dni.length !== 8) { setLookupError('Ingresa un DNI de 8 dígitos primero.'); return }
    if (remaining <= 0) { setLookupError('Sin búsquedas disponibles hoy.'); return }

    setLookupError(null)
    setLookupSuccess(false)
    startLookup(async () => {
      const result = await lookupDni(dni)
      if (!result.success) {
        setLookupError(result.error)
        return
      }
      setValue('firstName', result.firstName, { shouldValidate: true })
      setValue('lastName', result.lastName, { shouldValidate: true })
      setRemaining(result.remaining)
      setLookupSuccess(true)
      setTimeout(() => setLookupSuccess(false), 3000)
    })
  }

  function handleFormSubmit(values: MemberFormValues) {
    const input: CreateMemberInput = {
      ...values,
      districtId: values.districtId ? parseInt(values.districtId) : null,
      familyGroupId: values.familyGroupId ? parseInt(values.familyGroupId) : null,
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

          {/* DNI + botón buscar */}
          <div className="space-y-1.5">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="DNI *"
                  placeholder="12345678"
                  maxLength={8}
                  error={errors.dni?.message}
                  {...register('dni')}
                />
              </div>
              <button
                type="button"
                onClick={handleLookup}
                disabled={isLooking || remaining <= 0}
                title={remaining <= 0 ? 'Sin búsquedas disponibles hoy' : 'Buscar datos en RENIEC'}
                className="mb-px flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLooking ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Buscar
              </button>
            </div>

            {/* Contador */}
            <p className={`text-xs ${remaining <= 10 ? 'text-amber-500' : 'text-slate-400'}`}>
              {remaining} de 100 búsquedas disponibles este mes
            </p>

            {lookupError && (
              <p className="text-xs text-red-500">{lookupError}</p>
            )}
            {lookupSuccess && (
              <p className="text-xs text-green-600">✓ Datos cargados desde RENIEC</p>
            )}
          </div>

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
            {...register('districtId')}
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
            options={familyGroupOptions}
            {...register('familyGroupId')}
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
