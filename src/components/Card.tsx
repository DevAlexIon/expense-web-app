import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`surface-card text-card-foreground ${className}`}>
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`flex flex-col space-y-1 p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return (
    <h3
      className={`font-display text-[0.975rem] font-semibold leading-snug tracking-tight text-foreground ${className}`}
    >
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }: CardProps) => {
  return (
    <p className={`text-sm leading-snug text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}

export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={`p-4 pt-0 sm:p-5 sm:pt-0 ${className}`}>{children}</div>
}
