import VecSvg from '@public/images/vec.svg'

interface VecLogoProps {
  className?: string
}

export function VecLogo({ className }: VecLogoProps) {
  return <VecSvg className={className} />
}
