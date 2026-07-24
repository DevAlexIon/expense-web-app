import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'brass'

type Size = 'default' | 'sm' | 'lg' | 'icon'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-brass/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variantClasses: Record<Variant, string> = {
  default:
    'magnetic-btn bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25',
  destructive:
    'bg-expense text-white hover:bg-expense/90 focus-visible:ring-expense/40',
  outline:
    'border border-border bg-card text-foreground hover:bg-secondary/80 hover:border-primary/15',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-secondary/80 text-muted-foreground hover:text-foreground',
  link: 'text-brass underline-offset-4 hover:underline font-medium',
  brass:
    'magnetic-btn bg-brass text-brass-foreground shadow-sm shadow-brass/25 hover:bg-brass/90',
}

const sizeClasses: Record<Size, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3.5 py-1.5 text-sm',
  lg: 'h-11 px-6 py-3',
  icon: 'h-9 w-9 p-2',
}

export function buttonVariants({
  variant = 'default',
  size = 'default',
}: {
  variant?: Variant
  size?: Size
} = {}) {
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={`${buttonVariants({ variant, size })} ${className}`}
      {...props}
    />
  )
}

export default Button
