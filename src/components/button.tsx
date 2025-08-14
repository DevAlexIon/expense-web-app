import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  const baseClasses =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100',
    secondary: 'bg-secondary text-white hover:bg-secondary/80',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    link: 'text-primary underline-offset-4 hover:underline',
  }

  const sizeClasses = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 py-1.5 text-sm',
    lg: 'h-10 px-6 py-3 text-lg',
    icon: 'h-9 w-9 p-2',
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return <Comp className={combinedClasses} {...props} />
}

export default Button
