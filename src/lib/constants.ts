export const MARITAL_STATUSES = [
  'Soltero',
  'Soltera',
  'Casado',
  'Casada',
  'Viudo',
  'Viuda',
  'Divorciado',
  'Divorciada',
] as const

export const GENDER_OPTIONS = ['Masculino', 'Femenino'] as const

export const MARITAL_STATUS_OPTIONS_BY_GENDER = {
  Masculino: ['Soltero', 'Casado', 'Viudo', 'Divorciado'],
  Femenino: ['Soltera', 'Casada', 'Viuda', 'Divorciada'],
} as const

export const PAGE_SIZE = 10
