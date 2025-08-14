import React from 'react'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export const Textarea = ({ className = '', ...props }: TextareaProps) => {
  const baseClasses =
    'flex min-h-[80px] w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

  return <textarea className={`${baseClasses} ${className}`} {...props} />
}
