import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { addMonths, format, isValid, parse, subMonths } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Button from '@/components/button'
import { cn } from '@/helpers/utils'
import 'react-day-picker/style.css'

type DatePickerFieldProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function parseValue(value: string): Date | undefined {
  if (!value) return undefined
  const parsed = parse(value, 'yyyy-MM-dd', new Date())
  return isValid(parsed) ? parsed : undefined
}

export function DatePickerField({
  id,
  value,
  onChange,
  placeholder = 'Select a date',
  className,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = useMemo(() => parseValue(value), [value])
  const [draft, setDraft] = useState<Date | undefined>(selected)
  const [month, setMonth] = useState<Date>(() => selected ?? new Date())

  useEffect(() => {
    if (!open) return
    const next = selected ?? new Date()
    setDraft(next)
    setMonth(next)
  }, [open, selected])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const label = selected ? format(selected, 'EEE, MMM d, yyyy') : placeholder

  const apply = () => {
    if (!draft) return
    onChange(format(draft, 'yyyy-MM-dd'))
    setOpen(false)
  }

  const pickToday = () => {
    const today = new Date()
    setDraft(today)
    onChange(format(today, 'yyyy-MM-dd'))
    setOpen(false)
  }

  return (
    <>
      <button
        id={id}
        type='button'
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-input-background px-3 text-left text-sm transition-colors hover:border-brass/40 focus:outline-none focus:ring-2 focus:ring-brass/30',
          className,
        )}
      >
        <span
          className={
            selected ? 'font-medium text-foreground' : 'text-muted-foreground'
          }
        >
          {label}
        </span>
        <CalendarDays
          className='h-4 w-4 shrink-0 text-brass'
          strokeWidth={2.2}
        />
      </button>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className='fixed inset-0 z-[10000] flex items-end justify-center p-4 sm:items-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  type='button'
                  aria-label='Close date picker'
                  className='absolute inset-0 bg-[#0C1222]/45 backdrop-blur-[2px]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />

                <motion.div
                  role='dialog'
                  aria-modal='true'
                  aria-label='Choose date'
                  className='relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/20'
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className='flex items-start justify-between border-b border-border bg-gradient-to-br from-primary to-[#1a2236] px-5 py-4 text-primary-foreground'>
                    <div>
                      <p className='font-mono-label mb-1 text-brass'>
                        Pick a date
                      </p>
                      <p className='font-display text-2xl font-semibold tracking-tight'>
                        {draft
                          ? format(draft, 'EEE, MMM d')
                          : 'Select day'}
                      </p>
                      <p className='mt-0.5 text-sm text-white/55'>
                        {draft ? format(draft, 'yyyy') : '—'}
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() => setOpen(false)}
                      className='cursor-pointer rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white'
                      aria-label='Close'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>

                  <div className='date-picker-panel px-4 py-3'>
                    <div className='mb-3 flex items-center justify-between gap-2'>
                      <button
                        type='button'
                        aria-label='Previous month'
                        onClick={() => setMonth(current => subMonths(current, 1))}
                        className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground'
                      >
                        <ChevronLeft className='h-4 w-4' strokeWidth={2.2} />
                      </button>
                      <p className='font-display text-[0.95rem] font-semibold tracking-tight text-foreground'>
                        {format(month, 'MMMM yyyy')}
                      </p>
                      <button
                        type='button'
                        aria-label='Next month'
                        onClick={() => setMonth(current => addMonths(current, 1))}
                        className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground'
                      >
                        <ChevronRight className='h-4 w-4' strokeWidth={2.2} />
                      </button>
                    </div>

                    <DayPicker
                      mode='single'
                      selected={draft}
                      onSelect={day => {
                        if (!day) return
                        setDraft(day)
                        setMonth(day)
                      }}
                      month={month}
                      onMonthChange={setMonth}
                      hideNavigation
                      showOutsideDays
                      className='w-full'
                      classNames={{
                        root: 'rdp-root w-full',
                        months: 'flex w-full flex-col',
                        month: 'w-full space-y-2',
                        month_caption: 'hidden',
                        month_grid: 'w-full',
                        weekdays: 'grid w-full grid-cols-7',
                        weekday:
                          'text-center text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground py-1',
                        week: 'grid w-full grid-cols-7 mt-0.5',
                        day: 'flex w-full items-center justify-center p-0.5 text-center',
                        day_button:
                          'mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-sm font-medium text-foreground transition hover:bg-brass-soft hover:text-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/40',
                        selected:
                          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:shadow-sm',
                        today:
                          '[&>button]:ring-1 [&>button]:ring-brass/50 [&>button]:font-semibold',
                        outside: '[&>button]:text-muted-foreground/40',
                        disabled:
                          '[&>button]:cursor-not-allowed [&>button]:opacity-30',
                        hidden: 'invisible',
                      }}
                    />
                  </div>

                  <div className='flex items-center gap-2 border-t border-border px-4 py-3'>
                    <Button
                      type='button'
                      variant='ghost'
                      className='cursor-pointer'
                      onClick={pickToday}
                    >
                      Today
                    </Button>
                    <div className='flex-1' />
                    <Button
                      type='button'
                      variant='outline'
                      className='cursor-pointer'
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type='button'
                      className='cursor-pointer'
                      onClick={apply}
                      disabled={!draft}
                    >
                      Apply
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
