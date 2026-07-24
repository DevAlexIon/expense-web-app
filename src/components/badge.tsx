import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'income' | 'expense' | 'brass'
  className?: string
}

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) => {
  const baseClasses =
    'inline-flex items-center rounded-lg border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'

  const variants = {
    default:
      'border-transparent bg-primary text-primary-foreground',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground',
    destructive:
      'border-transparent bg-expense-soft text-expense',
    income:
      'border-transparent bg-income-soft text-income',
    expense:
      'border-transparent bg-expense-soft text-expense',
    brass:
      'border-transparent bg-brass-soft text-brass',
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
