import React, { useState, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString()
    const newToast = { id, message, type }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className='fixed top-6 left-1/2 -translate-x-1/2 z-50 space-y-3'>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`relative flex max-w-sm items-center gap-3 overflow-hidden rounded-2xl border p-4 text-sm shadow-xl backdrop-blur-sm
                ${
                  toast.type === 'success'
                    ? 'border-income/25 bg-income-soft/95 text-income'
                    : toast.type === 'error'
                    ? 'border-expense/25 bg-expense-soft/95 text-expense'
                    : 'border-brass/30 bg-brass-soft/95 text-foreground'
                }`}
            >
              {toast.type === 'success' && <CheckCircle className='h-5 w-5' />}
              {toast.type === 'error' && <XCircle className='h-5 w-5' />}
              {toast.type === 'info' && <Info className='h-5 w-5 text-brass' />}

              <div className='flex-1 font-medium'>{toast.message}</div>

              <button
                onClick={() => removeToast(toast.id)}
                className='opacity-60 transition hover:opacity-100'
              >
                <X className='h-4 w-4' />
              </button>

              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  toast.type === 'success'
                    ? 'bg-income'
                    : toast.type === 'error'
                    ? 'bg-expense'
                    : 'bg-brass'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
