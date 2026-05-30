'use client'

import { MemberForm } from '@/features/members/components/member-form'
import type { Member } from '@/features/members/types'
import { useRouter } from 'next/navigation'

interface EditMemberFormProps {
  member: Member
}

export function EditMemberForm({ member }: EditMemberFormProps) {
  const router = useRouter()

  return (
    <MemberForm
      defaultValues={member}
      onSubmit={(data) => {
        console.log('Actualizar miembro:', data)
        alert('Miembro actualizado (maqueta)')
        router.push(`/members/${member.id}`)
      }}
    />
  )
}
