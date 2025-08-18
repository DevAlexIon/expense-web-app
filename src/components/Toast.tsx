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
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-sm max-w-sm text-sm relative overflow-hidden
                ${
                  toast.type === 'success'
                    ? 'bg-green-100/90 border-green-300 text-green-900'
                    : toast.type === 'error'
                    ? 'bg-red-100/90 border-red-300 text-red-900'
                    : 'bg-blue-100/90 border-blue-300 text-blue-900'
                }`}
            >
              {toast.type === 'success' && <CheckCircle className='w-5 h-5' />}
              {toast.type === 'error' && <XCircle className='w-5 h-5' />}
              {toast.type === 'info' && <Info className='w-5 h-5' />}

              <div className='flex-1'>{toast.message}</div>

              <button
                onClick={() => removeToast(toast.id)}
                className='opacity-60 hover:opacity-100 transition'
              >
                <X className='w-4 h-4' />
              </button>

              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${
                  toast.type === 'success'
                    ? 'bg-green-500'
                    : toast.type === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
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
