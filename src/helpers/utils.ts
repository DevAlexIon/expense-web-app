import toast from 'react-hot-toast'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ToastOptions {
  duration: number
  style?: {
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap'
    maxWidth?: string
    minWidth?: string
    height?: string
    background?: string
    color?: string
  }
}

type ShowToastProps = (message: string, type?: 'success' | 'error') => void
export const showToast: ShowToastProps = (message, type = 'success') => {
  const toastOptions: ToastOptions = {
    duration: 3000,
    style: {
      background: '#232323',
      color: '#FFFFFF',
      whiteSpace: 'normal',
      minWidth: `${message.length * 5}px`,
    },
  }

  if (type === 'success') {
    toast.success(message, toastOptions)
  } else if (type === 'error') {
    toast.error(message, toastOptions)
  }
}

export const isWithinRange = (
  value: number | undefined,
  range: string | undefined,
) => {
  if (!range || typeof range !== 'string') {
    return false
  }

  if (range.includes('<')) {
    // @ts-ignore
    const min = parseInt(range.split('<')[0], 10)
    return value! > min
  }

  const [min, max] = range.split('-').map(Number)
  // @ts-ignore
  return value >= min && value <= max
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err)
  }
}

export const bigIntSerializer = {
  serialize: (value: any): any => {
    if (typeof value === 'bigint') {
      return {
        _type: 'BigInt',
        value: value.toString(),
      }
    }
    return value
  },
  deserialize: (value: any): any => {
    if (value && value._type === 'BigInt') {
      return BigInt(value.value)
    }
    return value
  },
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateForInput = (isoDate?: string) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
