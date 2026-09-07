"use client"

import { useEffect, useRef, useState } from "react"

type DeliveryEvent = {
  id: number
  icon: string
  vertical: string
  type: "call" | "lead"
  state: string
  ts: number
}

const EVENT_TEMPLATES: Omit<DeliveryEvent, "id" | "ts">[] = [
  { icon: "🛡", vertical: "Final Expense", type: "call", state: "TX" },
  { icon: "🏠", vertical: "Solar", type: "lead", state: "CA" },
  { icon: "💰", vertical: "Debt", type: "lead", state: "FL" },
  { icon: "⚖", vertical: "Mass Tort", type: "call", state: "NY" },
  { icon: "🩺", vertical: "Medicare", type: "call", state: "AZ" },
  { icon: "🔧", vertical: "HVAC", type: "lead", state: "OH" },
  { icon: "🚗", vertical: "Auto Insurance", type: "lead", state: "GA" },
  { icon: "🏦", vertical: "Tax Relief", type: "call", state: "IL" },
  { icon: "🪟", vertical: "Windows", type: "lead", state: "NC" },
  { icon: "⚖", vertical: "Personal Injury", type: "call", state: "PA" },
]

function timeAgo(ts: number, now: number) {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 2) return "just now"
  return `${s}s ago`
}

function useCountUp(target: number, decimals: number, isVisible: boolean, suffix = "", prefix = "") {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isVisible) return
    const duration = 1600
    const start = performance.now()
    const step = (t: number) => {
      const progress = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, isVisible])

  const display = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${prefix}${display}${suffix}`
}

type StatProps = {
  label: string
  value: string
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-mono text-xl sm:text-2xl font-semibold tabular-nums text-[var(--color-baltic-sea-50)] leading-none">
        {value}
      </span>
      <span className="text-xs text-[var(--color-baltic-sea-400)] whitespace-nowrap">{label}</span>
    </div>
  )
}

export function LiveDeliveryFeed() {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const nextId = useRef(0)

  const [events, setEvents] = useState<DeliveryEvent[]>(() => {
    const base = Date.now()
    return EVENT_TEMPLATES.slice(0, 4).map((tpl, i) => ({
      ...tpl,
      id: i,
      ts: base - i * 2500,
    }))
  })

  // Live counter target values that drift upward slowly while visible
  const [leadsToday, setLeadsToday] = useState(8247)
  const [activeBuyers, setActiveBuyers] = useState(320)

  useEffect(() => {
    nextId.current = events.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Tick "now" for relative timestamps
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Push new delivery events onto the ticker
  useEffect(() => {
    if (!isVisible) return
    const push = () => {
      const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]
      nextId.current += 1
      setEvents((prev) => [{ ...tpl, id: nextId.current, ts: Date.now() }, ...prev].slice(0, 4))
      setLeadsToday((n) => n + 1)
    }
    const interval = setInterval(push, 2500)
    return () => clearInterval(interval)
  }, [isVisible])

  // Slow drift on active buyers while visible
  useEffect(() => {
    if (!isVisible) return
    const t = setInterval(() => {
      setActiveBuyers((n) => (Math.random() > 0.5 ? n + 1 : n))
    }, 6000)
    return () => clearInterval(t)
  }, [isVisible])

  const leadsDisplay = useCountUp(leadsToday, 0, isVisible)
  const deliveryDisplay = useCountUp(1.4, 1, isVisible, "s")
  const buyersDisplay = useCountUp(activeBuyers, 0, isVisible, "+")
  const qaDisplay = useCountUp(96, 0, isVisible, "%")

  return (
    <section
      ref={ref}
      aria-label="Live delivery feed"
      className="border-y border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-950)]/60"
    >
      <div className="mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8">
          {/* LIVE anchor */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-keppel-400)] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-keppel-400)]" />
            </span>
            <span className="font-mono text-xs font-semibold tracking-widest text-[var(--color-keppel-300)]">
              LIVE
            </span>
          </div>

          {/* Ticker */}
          <div className="relative h-12 overflow-hidden lg:border-x lg:border-[var(--color-baltic-sea-800)] lg:px-8">
            <ul className="flex flex-col">
              {events.map((e, i) => (
                <li
                  key={e.id}
                  className="flex h-12 items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-500"
                  style={{ opacity: i === 0 ? 1 : Math.max(0.25, 1 - i * 0.28) }}
                  aria-hidden={i !== 0}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {e.icon}
                  </span>
                  <span className="text-[var(--color-baltic-sea-100)]">
                    <span className="font-medium">{e.vertical}</span>{" "}
                    <span className="text-[var(--color-baltic-sea-400)]">
                      {e.type} delivered
                    </span>
                  </span>
                  <span className="rounded-md bg-[var(--color-baltic-sea-800)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-baltic-sea-200)]">
                    {e.state}
                  </span>
                  <span className="ml-auto font-mono text-xs text-[var(--color-baltic-sea-500)] tabular-nums">
                    {timeAgo(e.ts, now)}
                  </span>
                </li>
              ))}
            </ul>
            {/* top/bottom fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[var(--color-baltic-sea-950)] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-[var(--color-baltic-sea-950)] to-transparent" />
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 lg:flex lg:gap-8">
            <Stat label="Leads & calls today" value={leadsDisplay} />
            <Stat label="Avg. delivery time" value={deliveryDisplay} />
            <Stat label="Active buyers" value={buyersDisplay} />
            <Stat label="QA acceptance" value={qaDisplay} />
          </div>
        </div>
      </div>
    </section>
  )
}
