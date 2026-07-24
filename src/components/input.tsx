import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = ({ className = '', ...props }: InputProps) => {
  const baseClasses =
    'flex h-10 w-full rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass/50 disabled:cursor-not-allowed disabled:opacity-50'

  return <input className={`${baseClasses} ${className}`} {...props} />
}
