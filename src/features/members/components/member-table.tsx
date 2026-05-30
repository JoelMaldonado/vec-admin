'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Member } from '@/features/members/types'
import { Edit, Eye, Trash2, Users } from 'lucide-react'
import Link from 'next/link'

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <Users className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">No se encontraron miembros</p>
        <p className="mt-1 text-xs text-slate-400">
          Prueba ajustando los filtros de búsqueda
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>Distrito</TableHead>
          <TableHead>Grupo</TableHead>
          <TableHead>Bautizado</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium text-slate-900">
              {member.firstName} {member.lastName}
            </TableCell>
            <TableCell className="font-mono text-slate-500">{member.dni}</TableCell>
            <TableCell>{member.district ?? '—'}</TableCell>
            <TableCell>{member.familyGroup ?? '—'}</TableCell>
            <TableCell>
              <Badge variant={member.isBaptized ? 'success' : 'default'}>
                {member.isBaptized ? 'Sí' : 'No'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={member.isActive ? 'info' : 'warning'}>
                {member.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/members/${member.id}`}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
                  title="Ver detalle"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/members/${member.id}/edit`}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => alert(`Eliminar miembro #${member.id} (maqueta)`)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
