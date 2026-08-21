import { useEffect, useState } from 'react'

const FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
})

function formatNow(): { time: string; meridiem: string } {
  const parts = FORMATTER.formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const time = `${get('hour')}:${get('minute')}:${get('second')}`
  const meridiem = get('dayPeriod').toUpperCase()
  return { time, meridiem }
}

/** Developer's local time (IST), independent of the visitor's own timezone. */
export function LiveClock() {
  const [now, setNow] = useState(formatNow)

  useEffect(() => {
    const id = setInterval(() => setNow(formatNow()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="live-clock">
      <span className="live-clock__time">{now.time}</span>
      <span className="live-clock__meridiem">{now.meridiem}</span>
    </span>
  )
}
