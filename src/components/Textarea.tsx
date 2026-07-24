import React from 'react'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export const Textarea = ({ className = '', ...props }: TextareaProps) => {
  const baseClasses =
    'flex min-h-[72px] w-full rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass/50 disabled:cursor-not-allowed disabled:opacity-50'

  return <textarea className={`${baseClasses} ${className}`} {...props} />
}
