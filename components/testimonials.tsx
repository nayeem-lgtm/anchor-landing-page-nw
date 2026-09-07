"use client"

import { useEffect, useRef, useState } from "react"

const TESTIMONIALS_ROW_1 = [
  {
    quote:
      "We've tested a lot of call partners. RAY is one of the few where the QA actually holds up at volume — the transfers connect, the intent is real, and our agents aren't wasting time. Contact rates went up within the first two weeks.",
    author: "VP of Acquisition",
    role: "National final expense carrier",
    company: "Final Expense",
    avatar: "FE",
  },
  {
    quote:
      "During AEP we needed to scale fast without the lead quality falling apart. RAY held the standard even when we tripled our daily caps. That's rare.",
    author: "Director of Sales",
    role: "Medicare-focused agency",
    company: "Medicare",
    avatar: "MC",
  },
  {
    quote:
      "The lead-to-appointment rate is the number I actually care about, and RAY's beats every other source we run. Their team optimizes with us instead of just handing over a feed.",
    author: "Marketing Manager",
    role: "Regional solar installer",
    company: "Home Services / Solar",
    avatar: "HS",
  },
  {
    quote:
      "Real-time delivery and clean source-level reporting mean I can see exactly what's working and shift budget the same day. Full transparency, no black box.",
    author: "Performance Marketing Lead",
    role: "Auto insurance brand",
    company: "Auto Insurance",
    avatar: "AI",
  },
]

const TESTIMONIALS_ROW_2 = [
  {
    quote:
      "Compliance is non-negotiable in our space. RAY's TCPA and TrustedForm coverage gives our legal team peace of mind, and the leads still convert. Both, not one or the other.",
    author: "Head of Growth",
    role: "Debt relief company",
    company: "Finance / Debt Relief",
    avatar: "DR",
  },
  {
    quote:
      "Qualified intake calls, pre-screened, on the verticals we asked for. Our intake team spends time closing instead of filtering. Volume scaled cleanly.",
    author: "Case Acquisition Manager",
    role: "Mass tort law firm",
    company: "Legal / Mass Tort",
    avatar: "MT",
  },
  {
    quote:
      "What sets RAY apart is the account management. When something needs adjusting, there's a real person who knows our campaign and acts fast.",
    author: "Owner",
    role: "ACA insurance agency",
    company: "ACA",
    avatar: "AC",
  },
  {
    quote:
      "We buy across a lot of networks. RAY is the one I trust when quality matters more than just hitting a volume number.",
    author: "Media Buyer",
    role: "Multi-vertical lead buyer",
    company: "General",
    avatar: "MB",
  },
]

function TestimonialCard({
  testimonial,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial: (typeof TESTIMONIALS_ROW_1)[0]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex-shrink-0 w-[350px] md:w-[400px] rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-950)] p-6 hover:border-[var(--color-keppel-800)] transition-colors duration-300"
      style={{ boxShadow: "var(--bento-shadow)" }}
    >
      <p className="text-[var(--color-baltic-sea-300)] leading-relaxed text-sm">{testimonial.quote}</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--color-keppel-600)] to-[var(--color-keppel-800)] flex items-center justify-center text-xs font-bold text-[var(--color-keppel-100)]">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-medium text-[var(--color-baltic-sea-200)] text-sm">{testimonial.author}</div>
          <div className="text-xs text-[var(--color-baltic-sea-500)]">{testimonial.role}</div>
        </div>
        <span className="ml-auto rounded-full border border-[var(--color-keppel-900)] bg-[var(--color-keppel-950)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-keppel-400)] whitespace-nowrap">
          {testimonial.company}
        </span>
      </div>
    </div>
  )
}

function MarqueeRow({
  testimonials,
  direction = "left",
  speed = 30,
}: {
  testimonials: typeof TESTIMONIALS_ROW_1
  direction?: "left" | "right"
  speed?: number
}) {
  const [isPaused, setIsPaused] = useState(false)
  const duplicated = [...testimonials, ...testimonials]

  return (
    <div className="relative flex overflow-hidden">
      {/* Gradient masks on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />

      <div
        className="flex gap-6 py-4"
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicated.map((testimonial, i) => (
          <TestimonialCard
            key={`${testimonial.author}-${i}`}
            testimonial={testimonial}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          />
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 border-t border-[var(--color-baltic-sea-900)] overflow-hidden">
      {/* Section header */}
      <div className="mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12">
        <div
          className={`relative text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-sm"}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 blur-2xl"
            style={{
              background:
                "radial-gradient(55% 65% at 50% 50%, color-mix(in oklch, var(--background) 82%, transparent) 0%, color-mix(in oklch, var(--background) 45%, transparent) 50%, transparent 78%)",
            }}
          />
          <span className="text-sm font-medium text-[var(--color-keppel-400)] uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-baltic-sea-100)] md:text-4xl text-balance">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      <div
        className={`space-y-6 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "300ms" }}
      >
        <MarqueeRow testimonials={TESTIMONIALS_ROW_1} direction="left" speed={40} />
        <MarqueeRow testimonials={TESTIMONIALS_ROW_2} direction="right" speed={45} />
      </div>
    </section>
  )
}
