'use client'

import { updateMember } from '@/features/members/actions/members.actions'
import { MemberForm } from '@/features/members/components/member-form'
import type { CreateMemberInput, Member } from '@/features/members/types'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface EditMemberFormProps {
  member: Member
}

export function EditMemberForm({ member }: EditMemberFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)

  function handleSubmit(data: CreateMemberInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await updateMember(member.id, data)
      if (result.success) {
        router.push(`/members/${member.id}`)
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
      <MemberForm
        defaultValues={member}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </div>
  )
}
