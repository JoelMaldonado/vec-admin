import VecSvg from '@public/images/vec_large.svg'

interface VecLogoLargeProps {
  className?: string
}

export function VecLogoLarge({ className }: VecLogoLargeProps) {
  return <VecSvg className={className} />
}
