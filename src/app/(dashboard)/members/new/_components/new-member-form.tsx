'use client'

import { MemberForm } from '@/features/members/components/member-form'
import { useRouter } from 'next/navigation'

export function NewMemberForm() {
  const router = useRouter()

  return (
    <MemberForm
      onSubmit={(data) => {
        console.log('Nuevo miembro:', data)
        alert('Miembro creado (maqueta)')
        router.push('/members')
      }}
    />
  )
}
