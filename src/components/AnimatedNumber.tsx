import { usePrevious } from '@/hooks/usePrevious'
import CountUp from 'react-countup'
import { useRef } from 'react'

type AnimatedNumberProps = {
  value: number
  decimals?: number
  duration?: number
  className?: string
  /** First paint after login — animate from 0. Route remounts should pass false. */
  playInitial?: boolean
}

/**
 * Count-up on first entry (playInitial), then count-up/down when value changes
 * while mounted. Route remounts with playInitial=false show the value instantly.
 */
export function AnimatedNumber({
  value,
  decimals = 2,
  duration = 1.15,
  className,
  playInitial = false,
}: AnimatedNumberProps) {
  const previous = usePrevious(value)
  const isFirstPaint = useRef(true)

  let start = value
  let animDuration = duration

  if (isFirstPaint.current) {
    isFirstPaint.current = false
    if (playInitial) {
      start = 0
    } else {
      start = value
      animDuration = 0
    }
  } else {
    start = previous ?? value
    if (start === value) animDuration = 0
  }

  return (
    <span className={className}>
      <CountUp
        start={start}
        end={value}
        duration={animDuration}
        decimals={decimals}
        decimal='.'
        separator=','
        preserveValue
        useEasing
      />
    </span>
  )
}
