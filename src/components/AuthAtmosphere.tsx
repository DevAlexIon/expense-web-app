import { useEffect, useRef, useState } from 'react'

type AuthAtmosphereProps = {
  children: React.ReactNode
}

/**
 * Centered auth shell with ambient lights, expanding ring, and mouse-follow glow.
 */
export function AuthAtmosphere({ children }: AuthAtmosphereProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0.5, y: 0.45 })
  const current = useRef({ x: 0.5, y: 0.45 })
  const rafRef = useRef<number>(0)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08
      el.style.setProperty('--mx', `${current.current.x * 100}%`)
      el.style.setProperty('--my', `${current.current.y * 100}%`)
      rafRef.current = requestAnimationFrame(tick)
    }

    el.addEventListener('pointermove', onMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className='auth-stage relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10'
      style={
        {
          '--mx': '50%',
          '--my': '45%',
        } as React.CSSProperties
      }
    >
      {/* Soft photographic depth + CSS fallback */}
      <div
        className='pointer-events-none absolute inset-0 scale-105 bg-cover bg-center'
        style={{
          backgroundColor: '#E8EAF0',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 15%, rgba(184,149,108,0.28), transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 80%, rgba(12,18,34,0.12), transparent 50%),
            linear-gradient(165deg, #F3F4F7 0%, #EBE8E2 48%, #F3F4F7 100%)
          `,
        }}
      />
      <div className='pointer-events-none absolute inset-0 bg-[#F3F4F7]/55' />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0C1222]/06 via-transparent to-[#0C1222]/10' />

      {/* Grid */}
      <div className='pointer-events-none absolute inset-0 grid-bg opacity-50' />

      {/* Mouse-follow light */}
      <div
        className='pointer-events-none absolute inset-0 transition-opacity duration-700'
        style={{
          background: `
            radial-gradient(520px circle at var(--mx) var(--my), rgba(184,149,108,0.22), transparent 45%),
            radial-gradient(280px circle at var(--mx) var(--my), rgba(255,255,255,0.35), transparent 40%)
          `,
        }}
      />

      {/* Ambient orbs */}
      <div className='auth-orb auth-orb-a pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-brass/20 blur-3xl' />
      <div className='auth-orb auth-orb-b pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#0C1222]/10 blur-3xl' />

      {/* Expanding rings behind the card */}
      <div className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div
          className={`auth-ring absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/25 sm:h-[36rem] sm:w-[36rem] ${
            entered ? 'auth-ring-active' : ''
          }`}
        />
        <div
          className={`auth-ring auth-ring-delay absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0C1222]/10 sm:h-[28rem] sm:w-[28rem] ${
            entered ? 'auth-ring-active' : ''
          }`}
        />
        <div
          className={`auth-ring auth-ring-delay-2 absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/15 sm:h-[20rem] sm:w-[20rem] ${
            entered ? 'auth-ring-active' : ''
          }`}
        />
      </div>

      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 ease-out ${
          entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
