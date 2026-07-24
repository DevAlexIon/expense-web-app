import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
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

type MenuPos = { top: number; left: number; width: number; openUp: boolean }

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  menuRef: React.MutableRefObject<HTMLDivElement | null>
}>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: { current: null },
  menuRef: { current: null },
})

export const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      const inRoot = rootRef.current?.contains(target)
      const inMenu = menuRef.current?.contains(target)
      if (!inRoot && !inMenu) setIsOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, isOpen, setIsOpen, triggerRef, menuRef }}
    >
      <div ref={rootRef} className='relative'>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({
  children,
  className = '',
}: SelectTriggerProps) => {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(SelectContext)

  return (
    <button
      ref={triggerRef}
      type='button'
      aria-expanded={isOpen}
      className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-input-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass/30 focus:border-brass/50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <svg
        className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
  const { isOpen, triggerRef, menuRef } = React.useContext(SelectContext)
  const [pos, setPos] = useState<MenuPos | null>(null)

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setPos(null)
      return
    }

    const update = () => {
      const el = triggerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const menuMax = 224
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < menuMax && rect.top > spaceBelow

      setPos({
        top: openUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        openUp,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [isOpen, triggerRef])

  if (!isOpen || !pos || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={node => {
        menuRef.current = node
      }}
      role='listbox'
      className={`fixed z-[9999] max-h-56 overflow-y-auto rounded-xl border border-border bg-white p-1.5 shadow-xl shadow-primary/15 ${className}`}
      style={
        pos.openUp
          ? {
              bottom: window.innerHeight - pos.top,
              left: pos.left,
              width: pos.width,
            }
          : {
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }
      }
    >
      {children}
    </div>,
    document.body,
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
      role='option'
      className={`relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-secondary hover:text-foreground ${className}`}
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
