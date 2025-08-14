import React, { useState } from 'react'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
})

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className='relative'>{children}</div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({
  children,
  className = '',
}: SelectTriggerProps) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)

  return (
    <button
      type='button'
      className={`flex h-10 w-full items-center justify-between rounded-md border border-border bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <svg
        className='h-4 w-4 opacity-50'
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='6,9 12,15 18,9'></polyline>
      </svg>
    </button>
  )
}

export const SelectContent = ({
  children,
  className = '',
}: SelectContentProps) => {
  const { isOpen } = React.useContext(SelectContext)

  if (!isOpen) return null

  return (
    <div
      className={`absolute top-full left-0 z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md ${className}`}
    >
      <div className='p-1'>{children}</div>
    </div>
  )
}

export const SelectItem = ({
  value,
  children,
  className = '',
}: SelectItemProps) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext)

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={() => {
        onValueChange(value)
        setIsOpen(false)
      }}
    >
      {children}
    </div>
  )
}

export const SelectValue = ({
  placeholder = '',
  className = '',
}: SelectValueProps) => {
  const { value } = React.useContext(SelectContext)

  return <span className={className}>{value || placeholder}</span>
}
