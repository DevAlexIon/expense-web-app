import { cn } from '@/helpers/utils'

type LedgerLogoProps = {
  className?: string
  markClassName?: string
  showWordmark?: boolean
  inverted?: boolean
}

/** Geometric ledger mark — ascending bars + brass spine */
export function LedgerLogo({
  className,
  markClassName,
  showWordmark = false,
  inverted = false,
}: LedgerLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div
        className={cn(
          'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm',
          inverted
            ? 'bg-white/10 ring-1 ring-white/15'
            : 'bg-primary shadow-primary/20',
          markClassName,
        )}
      >
        <svg
          viewBox='0 0 40 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='h-[22px] w-[22px]'
          aria-hidden
        >
          <rect
            x='8'
            y='22'
            width='5.5'
            height='10'
            rx='1.5'
            className={inverted ? 'fill-white/45' : 'fill-primary-foreground/40'}
          />
          <rect
            x='16.25'
            y='15'
            width='5.5'
            height='17'
            rx='1.5'
            className={inverted ? 'fill-white/70' : 'fill-primary-foreground/70'}
          />
          <rect
            x='24.5'
            y='9'
            width='5.5'
            height='23'
            rx='1.5'
            className={inverted ? 'fill-white' : 'fill-primary-foreground'}
          />
          <path
            d='M7 31.5h24'
            stroke='#B8956C'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </div>
      {showWordmark && (
        <span
          className={cn(
            'font-display text-2xl font-semibold leading-none tracking-tight',
            inverted ? 'text-white' : 'text-foreground',
          )}
        >
          Ledger
        </span>
      )}
    </div>
  )
}

export function LedgerMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden
    >
      <rect width='40' height='40' rx='10' fill='#0C1222' />
      <rect x='8' y='22' width='5.5' height='10' rx='1.5' fill='#F8F7F4' fillOpacity='0.4' />
      <rect x='16.25' y='15' width='5.5' height='17' rx='1.5' fill='#F8F7F4' fillOpacity='0.7' />
      <rect x='24.5' y='9' width='5.5' height='23' rx='1.5' fill='#F8F7F4' />
      <path d='M7 31.5h24' stroke='#B8956C' strokeWidth='2' strokeLinecap='round' />
    </svg>
  )
}
