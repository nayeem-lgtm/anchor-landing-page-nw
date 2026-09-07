"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Broadcast,
  ShieldCheck,
  Target,
  Database,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr"

/* ---------------------------------- data ---------------------------------- */

const VERTICALS = [
  "Insurance",
  "Home Service",
  "Finance",
  "Nutra",
  "Mass Tort",
  "Sweepstakes",
  "Ecommerce",
  "Other",
] as const

type TrafficType = {
  id: string
  label: string
  unit: string
}

const TRAFFIC_TYPES: TrafficType[] = [
  { id: "exclusive-leads", label: "Exclusive Leads", unit: "leads" },
  { id: "inbound-calls", label: "Inbound Calls", unit: "calls" },
  { id: "live-transfers", label: "Live Transfers", unit: "transfers" },
  { id: "high-intent-clicks", label: "High-Intent Clicks", unit: "clicks" },
]

const VOL_MIN = 500
const VOL_MAX = 50000
const VOL_STEP = 500

const fmt = (n: number) => n.toLocaleString("en-US")

/* ------------------------------ animated number --------------------------- */

function AnimatedNumber({
  value,
  duration = 900,
  format = (n: number) => fmt(Math.round(n)),
}: {
  value: number
  duration?: number
  format?: (n: number) => string
}) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = value
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return <>{format(display)}</>
}

/* ------------------------------ volume slider ----------------------------- */

function VolumeSlider({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)

  const atMax = value >= VOL_MAX
  const pct = ((value - VOL_MIN) / (VOL_MAX - VOL_MIN)) * 100

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const raw = VOL_MIN + ratio * (VOL_MAX - VOL_MIN)
      const stepped = Math.round(raw / VOL_STEP) * VOL_STEP
      onChange(Math.min(VOL_MAX, Math.max(VOL_MIN, stepped)))
    },
    [onChange],
  )

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!draggingRef.current) return
      e.preventDefault()
      setFromClientX(e.clientX)
    }
    const up = () => {
      draggingRef.current = false
      setDragging(false)
    }
    window.addEventListener("pointermove", move, { passive: false })
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  }, [setFromClientX])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      onChange(Math.min(VOL_MAX, value + VOL_STEP))
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      onChange(Math.max(VOL_MIN, value - VOL_STEP))
    } else if (e.key === "Home") {
      e.preventDefault()
      onChange(VOL_MIN)
    } else if (e.key === "End") {
      e.preventDefault()
      onChange(VOL_MAX)
    }
  }

  return (
    <div className="pt-2">
      {/* live readout */}
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-[var(--color-keppel-300)]">
          <AnimatedNumber value={value} duration={400} />
          {atMax ? "+" : ""}
        </span>
        <span className="text-sm text-[var(--color-baltic-sea-400)]">/ month</span>
      </div>

      {/* draggable track */}
      <div
        ref={trackRef}
        className="relative flex h-6 cursor-pointer items-center touch-none select-none"
        onPointerDown={(e) => {
          draggingRef.current = true
          setDragging(true)
          setFromClientX(e.clientX)
        }}
      >
        <div className="absolute left-0 right-0 h-[4px] rounded-full bg-[var(--color-baltic-sea-800)]" />
        <div
          className="absolute h-[4px] rounded-full bg-[var(--color-keppel-400)]"
          style={{ width: `${pct}%`, transition: dragging ? "none" : "width 200ms ease-out" }}
        />
        <button
          type="button"
          role="slider"
          aria-label="Monthly volume"
          aria-valuemin={VOL_MIN}
          aria-valuemax={VOL_MAX}
          aria-valuenow={value}
          aria-valuetext={`${fmt(value)}${atMax ? "+" : ""} per month`}
          onKeyDown={onKeyDown}
          className={`absolute -ml-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-keppel-300)] bg-[var(--color-keppel-400)] outline-none ring-offset-2 ring-offset-[var(--color-baltic-sea-900)] transition-transform focus-visible:ring-2 focus-visible:ring-[var(--color-keppel-400)] ${
            dragging ? "scale-110 shadow-[0_0_0_6px_var(--color-keppel-950)]" : "shadow-[0_0_0_4px_var(--color-keppel-950)]"
          }`}
          style={{ left: `${pct}%`, transition: dragging ? "none" : "left 200ms ease-out, transform 150ms ease-out" }}
        >
          <span className="h-2 w-2 rounded-full bg-[var(--color-keppel-950)]" />
        </button>
      </div>

      {/* range endpoints */}
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-baltic-sea-500)]">
        <span>{fmt(VOL_MIN)}</span>
        <span>{fmt(VOL_MAX)}+</span>
      </div>
    </div>
  )
}

/* --------------------------------- pipeline -------------------------------- */

type Stage = {
  key: string
  label: string
  metricLabel: string
  icon: React.ReactNode
  render: React.ReactNode
}

function Pipeline({ stages, pulseKey }: { stages: Stage[]; pulseKey: number }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
    const total = stages.length
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % (total + 2))
    }, 750)
    return () => clearInterval(id)
  }, [pulseKey, stages.length])

  return (
    <div className="relative">
      <div className="mb-6 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-keppel-400)] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-keppel-400)]" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-keppel-400)]">
          RAY Media-Buying Engine · Live
        </span>
      </div>

      <div className="flex flex-col">
        {stages.map((stage, i) => {
          const lit = i <= active
          const connectorLit = i < active
          return (
            <div key={stage.key}>
              <div
                className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-500 ${
                  lit
                    ? "border-[var(--color-keppel-800)] bg-[var(--color-keppel-950)]/40"
                    : "border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-950)]/40"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all duration-500 ${
                    lit
                      ? "border-[var(--color-keppel-700)] bg-[var(--color-keppel-900)]/60 text-[var(--color-keppel-300)]"
                      : "border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)] text-[var(--color-baltic-sea-500)]"
                  }`}
                >
                  {stage.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                      lit ? "text-[var(--color-keppel-400)]" : "text-[var(--color-baltic-sea-500)]"
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-bold tabular-nums text-[var(--color-baltic-sea-100)]">
                      {stage.render}
                    </span>
                    <span className="truncate text-xs text-[var(--color-baltic-sea-400)]">{stage.metricLabel}</span>
                  </div>
                </div>
              </div>

              {i < stages.length - 1 && (
                <div className="flex h-7 items-center justify-start pl-[42px]">
                  <div className="relative h-full w-[2px] overflow-hidden rounded-full bg-[var(--color-baltic-sea-800)]">
                    <div
                      className={`absolute inset-x-0 top-0 rounded-full bg-[var(--color-keppel-400)] transition-all duration-500 ${
                        connectorLit ? "h-full opacity-100" : "h-0 opacity-40"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------- component -------------------------------- */

export function DemandEngine() {
  const [verticalIndex, setVerticalIndex] = useState(0)
  const [trafficIndex, setTrafficIndex] = useState(0)
  const [volume, setVolume] = useState(5000)

  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" })

  const vertical = VERTICALS[verticalIndex]
  const traffic = TRAFFIC_TYPES[trafficIndex]

  // Recompute the pulse animation whenever any input changes.
  const pulseKey = useMemo(
    () => verticalIndex * 1000 + trafficIndex * 100 + volume,
    [verticalIndex, trafficIndex, volume],
  )

  const plan = useMemo(() => {
    const sources = 18 + verticalIndex * 2 + Math.round(volume / 2500)
    const qa = 94 + ((verticalIndex + trafficIndex) % 4)
    return { sources, qa, low: volume }
  }, [verticalIndex, trafficIndex, volume])

  const stages: Stage[] = useMemo(
    () => [
      {
        key: "sources",
        label: "Media Sources",
        metricLabel: "owned & vetted channels",
        icon: <Broadcast weight="fill" className="h-5 w-5" />,
        render: <AnimatedNumber value={plan.sources} />,
      },
      {
        key: "qa",
        label: "QA + Compliance",
        metricLabel: "acceptance · TCPA verified",
        icon: <ShieldCheck weight="fill" className="h-5 w-5" />,
        render: <AnimatedNumber value={plan.qa} format={(n) => `${Math.round(n)}%`} />,
      },
      {
        key: "qualified",
        label: `Qualified ${traffic.unit === "leads" ? "Lead" : traffic.unit === "calls" ? "Call" : "Match"}`,
        metricLabel: `${traffic.unit} / mo est.`,
        icon: <Target weight="fill" className="h-5 w-5" />,
        render: <AnimatedNumber value={plan.low} />,
      },
      {
        key: "crm",
        label: "Your CRM",
        metricLabel: "avg delivery latency",
        icon: <Database weight="fill" className="h-5 w-5" />,
        render: <span>1.4s</span>,
      },
    ],
    [plan, traffic],
  )

  const isFormValid = form.name.trim() && form.email.trim() && form.company.trim() && form.phone.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    setSubmitted(true)
  }

  return (
    <section id="demand-engine" className="border-t border-[var(--color-baltic-sea-900)] py-24">
      <div className="mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-[var(--color-keppel-400)]">
            RAY Demand Engine&trade;
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-baltic-sea-50)] md:text-4xl text-balance">
            Tell us what you need. We&apos;ll show you what we can deliver.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-baltic-sea-400)] text-pretty">
            Configure your vertical, traffic type, and volume. Watch your traffic plan build in real time through our
            own media-buying engine.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — configurator / capture */}
          <div
            className="rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)] p-6 sm:p-8"
            style={{ boxShadow: "var(--bento-shadow)" }}
          >
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-keppel-700)] bg-[var(--color-keppel-950)]">
                  <CheckCircle weight="fill" className="h-8 w-8 text-[var(--color-keppel-400)]" />
                </div>
                <h4 className="mt-5 text-xl font-bold text-[var(--color-baltic-sea-50)]">Your plan is on its way</h4>
                <p className="mt-2 max-w-sm text-sm text-[var(--color-baltic-sea-400)]">
                  A RAY media strategist will reach out with your {vertical} {traffic.label.toLowerCase()} plan for{" "}
                  {fmt(volume)}
                  {volume >= VOL_MAX ? "+" : ""} {traffic.unit}/mo shortly.
                </p>
              </div>
            ) : showForm ? (
              <form onSubmit={handleSubmit} className="flex h-full flex-col">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mb-4 self-start text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)] transition-colors hover:text-[var(--color-baltic-sea-300)]"
                >
                  ← Edit configuration
                </button>
                <h3 className="text-xl font-bold text-[var(--color-baltic-sea-50)]">Where should we send it?</h3>
                <p className="mt-2 text-sm text-[var(--color-baltic-sea-400)]">
                  Tell us where to send your {vertical} traffic plan and a strategist will follow up.
                </p>
                <div className="mt-6 space-y-3">
                  {(
                    [
                      { key: "name", label: "Full name", type: "text", placeholder: "Jordan Rivera" },
                      { key: "email", label: "Work email", type: "email", placeholder: "you@company.com" },
                      { key: "company", label: "Company", type: "text", placeholder: "Acme Media" },
                      { key: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
                    ] as const
                  ).map((f) => (
                    <div key={f.key}>
                      <label htmlFor={f.key} className="sr-only">
                        {f.label}
                      </label>
                      <input
                        id={f.key}
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full rounded-lg border border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-950)]/40 px-3.5 py-2.5 text-sm text-[var(--color-baltic-sea-100)] placeholder:text-[var(--color-baltic-sea-500)] outline-none transition-colors focus:border-[var(--color-keppel-500)]"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid}
                  className="mt-5 h-12 w-full rounded-full bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)] disabled:opacity-40"
                >
                  Send My Traffic Plan
                  <ArrowRight weight="bold" className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-[11px] text-[var(--color-baltic-sea-500)]">
                  No spam. Your details stay with our media team.
                </p>
              </form>
            ) : (
              <>
                {/* Vertical */}
                <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]">
                  Vertical
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {VERTICALS.map((v, i) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVerticalIndex(i)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                        i === verticalIndex
                          ? "border-[var(--color-keppel-500)] bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)]"
                          : "border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-950)]/40 text-[var(--color-baltic-sea-300)] hover:border-[var(--color-baltic-sea-500)] hover:text-[var(--color-baltic-sea-100)]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                {/* Traffic type */}
                <label className="mt-7 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]">
                  Traffic Type
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {TRAFFIC_TYPES.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTrafficIndex(i)}
                      className={`rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200 ${
                        i === trafficIndex
                          ? "border-[var(--color-keppel-500)] bg-[var(--color-keppel-950)]/60 text-[var(--color-keppel-200)]"
                          : "border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-950)]/40 text-[var(--color-baltic-sea-300)] hover:border-[var(--color-baltic-sea-500)]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Volume */}
                <label className="mt-7 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]">
                  Monthly Volume
                </label>
                <VolumeSlider value={volume} onChange={setVolume} />

                <Button
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="mt-8 h-12 w-full rounded-full bg-[var(--color-keppel-400)] px-6 text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)]"
                >
                  Build My Traffic Plan
                  <ArrowRight weight="bold" className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* RIGHT — pipeline */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-950)]/60 p-6 sm:p-8"
            style={{ boxShadow: "var(--bento-shadow)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-baltic-sea-800) 1px, transparent 1px), linear-gradient(90deg, var(--color-baltic-sea-800) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              }}
            />
            <div className="relative">
              <Pipeline stages={stages} pulseKey={pulseKey} />
            </div>
          </div>
        </div>

        {/* differentiator line */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-baltic-sea-400)] text-pretty">
          We don&apos;t resell someone else&apos;s traffic. We acquire and optimize it through our own media-buying
          engine.
        </p>
      </div>
    </section>
  )
}
