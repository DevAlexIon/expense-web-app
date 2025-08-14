import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  )
}

export const CardTitle = ({ children, className = '' }: CardProps) => {
  return (
    <h3
      className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
      {children}
    </h3>
  )
}

export const CardDescription = ({ children, className = '' }: CardProps) => {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  )
}

export const CardContent = ({ children, className = '' }: CardProps) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}
