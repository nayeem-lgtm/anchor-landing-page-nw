"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Broadcast,
  Lightning,
  ShieldCheck,
  Target,
  Database,
  CheckCircle,
  CaretDown,
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

const GEOS = [
  "Nationwide (US)",
  "California",
  "Texas",
  "Florida",
  "New York",
  "Northeast Region",
  "Southeast Region",
  "West Coast",
] as const

type TrafficType = {
  id: string
  label: string
  model: string
  delivery: string
  integration: string
  unit: string
}

const TRAFFIC_TYPES: TrafficType[] = [
  {
    id: "exclusive-leads",
    label: "Exclusive Leads",
    model: "Exclusive CPL",
    delivery: "Real-Time · Ping/Post",
    integration: "Ping/Post · API · CRM",
    unit: "leads",
  },
  {
    id: "inbound-calls",
    label: "Inbound Calls",
    model: "Pay Per Call",
    delivery: "Real-Time · Warm",
    integration: "SIP · Twilio · CRM",
    unit: "calls",
  },
  {
    id: "live-transfers",
    label: "Live Transfers",
    model: "CPA · Per Transfer",
    delivery: "Real-Time · Warm",
    integration: "SIP · Warm Transfer · CRM",
    unit: "transfers",
  },
  {
    id: "high-intent-clicks",
    label: "High-Intent Clicks",
    model: "CPC · Managed",
    delivery: "Real-Time",
    integration: "API · S2S Postback · CRM",
    unit: "clicks",
  },
]

const VOLUMES = [
  { label: "1,000", value: 1000 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "25,000", value: 25000 },
  { label: "50,000+", value: 50000, isMax: true },
] as const

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
  index,
  onChange,
}: {
  index: number
  onChange: (i: number) => void
}) {
  const pct = (index / (VOLUMES.length - 1)) * 100
  return (
    <div className="pt-1">
      <div className="relative h-9">
        {/* track */}
        <div className="absolute left-0 right-0 top-[10px] h-[3px] rounded-full bg-[var(--color-baltic-sea-800)]" />
        {/* filled */}
        <div
          className="absolute top-[10px] h-[3px] rounded-full bg-[var(--color-keppel-400)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        {/* nodes */}
        <div className="absolute inset-0 flex items-start justify-between">
          {VOLUMES.map((v, i) => {
            const active = i <= index
            return (
              <button
                key={v.label}
                type="button"
                onClick={() => onChange(i)}
                className="group flex flex-col items-center gap-2"
                aria-label={`Monthly volume ${v.label}`}
                aria-pressed={i === index}
              >
                <span
                  className={`h-[22px] w-[22px] rounded-full border-2 transition-all duration-300 ${
                    i === index
                      ? "border-[var(--color-keppel-300)] bg-[var(--color-keppel-400)] scale-110 shadow-[0_0_0_5px_var(--color-keppel-950)]"
                      : active
                        ? "border-[var(--color-keppel-500)] bg-[var(--color-keppel-600)]"
                        : "border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-900)] group-hover:border-[var(--color-baltic-sea-500)]"
                  }`}
                />
                <span
                  className={`text-xs font-medium tabular-nums transition-colors ${
                    i === index ? "text-[var(--color-keppel-300)]" : "text-[var(--color-baltic-sea-400)]"
                  }`}
                >
                  {v.label}
                </span>
              </button>
            )
          })}
        </div>
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

/* ------------------------------- plan row/badge --------------------------- */

function PlanRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-[var(--color-baltic-sea-800)] py-3 first:border-t-0 first:pt-0">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-900)] px-2.5 py-1 text-xs font-medium text-[var(--color-baltic-sea-200)]">
      {children}
    </span>
  )
}

/* -------------------------------- component -------------------------------- */

export function DemandEngine() {
  const [verticalIndex, setVerticalIndex] = useState(0)
  const [geo, setGeo] = useState<string>(GEOS[1])
  const [trafficIndex, setTrafficIndex] = useState(0)
  const [volumeIndex, setVolumeIndex] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" })

  const vertical = VERTICALS[verticalIndex]
  const traffic = TRAFFIC_TYPES[trafficIndex]
  const volume = VOLUMES[volumeIndex]

  // Recompute the pulse animation whenever any input changes.
  const pulseKey = useMemo(
    () => verticalIndex * 1000 + trafficIndex * 100 + volumeIndex * 10 + GEOS.indexOf(geo),
    [verticalIndex, trafficIndex, volumeIndex, geo],
  )

  const plan = useMemo(() => {
    const low = volume.value
    const high = "isMax" in volume && volume.isMax ? null : Math.round(volume.value * 1.6)
    const estVolume = high ? `${fmt(low)} – ${fmt(high)}` : `${fmt(low)}+`
    const sources = 18 + verticalIndex * 2 + volumeIndex * 7
    const bidsPerMin = Math.max(6, Math.round(volume.value / 900))
    const qa = 94 + ((verticalIndex + trafficIndex) % 4)
    return { low, estVolume, sources, bidsPerMin, qa }
  }, [volume, verticalIndex, volumeIndex, trafficIndex])

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
        key: "buying",
        label: "RAY Media Buying",
        metricLabel: "live bids / min · optimized",
        icon: <Lightning weight="fill" className="h-5 w-5" />,
        render: <AnimatedNumber value={plan.bidsPerMin} />,
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
            Configure your vertical, geography, and volume. Watch your traffic plan build in real time through our own
            media-buying engine.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — configurator + plan */}
          <div
            className="rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)] p-6 sm:p-8"
            style={{ boxShadow: "var(--bento-shadow)" }}
          >
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

            {/* Geo */}
            <label
              htmlFor="geo-select"
              className="mt-7 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]"
            >
              Geography
            </label>
            <div className="relative mt-3">
              <select
                id="geo-select"
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-950)]/40 px-4 py-3 text-sm font-medium text-[var(--color-baltic-sea-100)] outline-none transition-colors focus:border-[var(--color-keppel-500)]"
              >
                {GEOS.map((g) => (
                  <option key={g} value={g} className="bg-[var(--color-baltic-sea-900)]">
                    {g}
                  </option>
                ))}
              </select>
              <CaretDown
                weight="bold"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-baltic-sea-400)]"
              />
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
            <VolumeSlider index={volumeIndex} onChange={setVolumeIndex} />
          </div>

          {/* RIGHT — pipeline + plan result */}
          <div className="flex flex-col gap-6">
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
        </div>

        {/* Plan result — full width beneath */}
        <div
          className="relative mt-6 overflow-hidden rounded-2xl border border-[var(--color-keppel-900)] bg-[var(--color-baltic-sea-900)] p-6 sm:p-8"
          style={{ boxShadow: "var(--bento-shadow)" }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--color-keppel-500)" }}
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* plan details */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-keppel-400)]">
                Your RAY Traffic Plan
              </span>
              <h3 className="mt-2 text-2xl font-bold text-[var(--color-baltic-sea-50)]">
                {vertical} · {geo} · {traffic.label}
              </h3>

              <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
                <div>
                  <PlanRow label="Estimated Monthly Volume">
                    <span className="text-xl font-bold tabular-nums text-[var(--color-keppel-300)]">
                      {plan.estVolume}
                    </span>
                  </PlanRow>
                  <PlanRow label="Recommended Model">
                    <span className="text-base font-semibold text-[var(--color-baltic-sea-100)]">{traffic.model}</span>
                  </PlanRow>
                </div>
                <div>
                  <PlanRow label="Estimated Delivery">
                    <span className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-baltic-sea-100)]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-keppel-400)] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-keppel-400)]" />
                      </span>
                      {traffic.delivery}
                    </span>
                  </PlanRow>
                  <PlanRow label="Available Integration">
                    {traffic.integration.split(" · ").map((x) => (
                      <Chip key={x}>{x}</Chip>
                    ))}
                  </PlanRow>
                </div>
              </div>

              <div className="mt-3 border-t border-[var(--color-baltic-sea-800)] pt-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-baltic-sea-500)]">
                  Quality Controls
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["QA Verified", "TCPA", "Source-Level Tracking", "TrustedForm"].map((q) => (
                    <Chip key={q}>
                      <CheckCircle weight="fill" className="h-3.5 w-3.5 text-[var(--color-keppel-400)]" />
                      {q}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA / capture */}
            <div className="flex flex-col justify-center rounded-xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-950)]/50 p-6">
              {submitted ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-keppel-700)] bg-[var(--color-keppel-950)]">
                    <CheckCircle weight="fill" className="h-7 w-7 text-[var(--color-keppel-400)]" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-[var(--color-baltic-sea-50)]">Your plan is on its way</h4>
                  <p className="mt-2 text-sm text-[var(--color-baltic-sea-400)]">
                    A RAY media strategist will reach out with your {vertical} traffic plan for {geo} shortly.
                  </p>
                </div>
              ) : !showForm ? (
                <div className="text-center">
                  <h4 className="text-lg font-bold text-[var(--color-baltic-sea-50)]">Ready to go live?</h4>
                  <p className="mt-2 text-sm text-[var(--color-baltic-sea-400)]">
                    Lock in this configuration and we&apos;ll build your full traffic plan.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="mt-5 h-12 w-full rounded-full bg-[var(--color-keppel-400)] px-6 text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)]"
                  >
                    Build My Traffic Plan
                    <ArrowRight weight="bold" className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h4 className="text-base font-bold text-[var(--color-baltic-sea-50)]">Where should we send it?</h4>
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
                        className="w-full rounded-lg border border-[var(--color-baltic-sea-700)] bg-[var(--color-baltic-sea-900)] px-3.5 py-2.5 text-sm text-[var(--color-baltic-sea-100)] placeholder:text-[var(--color-baltic-sea-500)] outline-none transition-colors focus:border-[var(--color-keppel-500)]"
                      />
                    </div>
                  ))}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!isFormValid}
                    className="h-11 w-full rounded-full bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)] disabled:opacity-40"
                  >
                    Send My Traffic Plan
                    <ArrowRight weight="bold" className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-center text-[11px] text-[var(--color-baltic-sea-500)]">
                    No spam. Your details stay with our media team.
                  </p>
                </form>
              )}
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
