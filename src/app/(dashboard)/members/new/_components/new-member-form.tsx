'use client'

import { createMember } from '@/features/members/actions/members.actions'
import { MemberForm } from '@/features/members/components/member-form'
import type { CreateMemberInput, DistrictRef, FamilyGroupRef } from '@/features/members/types'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface NewMemberFormProps {
  districts: DistrictRef[]
  familyGroups: FamilyGroupRef[]
  dniLookupRemaining: number
}

export function NewMemberForm({ districts, familyGroups, dniLookupRemaining }: NewMemberFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  function handleSubmit(data: CreateMemberInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await createMember(data)
      if (result.success) {
        router.push('/members')
      } else {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}
      <MemberForm onSubmit={handleSubmit} districts={districts} familyGroups={familyGroups} dniLookupRemaining={dniLookupRemaining} isLoading={isPending} />
    </div>
  )
}
