"use client"

import type React from "react"

import { BentoCard } from "./bento-card"
import { ShieldCheck, Scales, Broadcast, Handshake } from "@phosphor-icons/react/dist/ssr"
import { useEffect, useRef, useState } from "react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Vetted Quality",
    description:
      "Every traffic source goes through dedicated QA to help ensure the leads and calls you receive meet your buying requirements.",
  },
  {
    icon: Scales,
    title: "Compliance-First",
    description:
      "Built with compliance at the core, including TCPA-conscious processes and verification through trusted solutions such as TrustedForm and Jornaya.",
  },
  {
    icon: Broadcast,
    title: "Real-Time Delivery & Reporting",
    description:
      "Receive leads and calls in real time through ping/post and live transfers, with source-level reporting for greater visibility into performance.",
  },
  {
    icon: Handshake,
    title: "Managed Partnership",
    description:
      "Get more than traffic. Work directly with dedicated account managers who understand your targets, optimize delivery, and help you scale.",
  },
]

function AnimatedItem({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-sm"
      }`}
    >
      {children}
    </div>
  )
}

export function WhyRay() {
  return (
    <section id="why-ray" className="py-24 border-t border-[var(--color-baltic-sea-900)]">
      <div className="mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12">
        <AnimatedItem delay={0}>
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-medium text-[var(--color-keppel-400)] uppercase tracking-wider">
              Why RAY
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[var(--color-baltic-sea-100)] md:text-4xl text-balance">
              Why Buyers Choose RAY
            </h2>
            <p className="mt-4 text-lg text-[var(--color-baltic-sea-400)] text-pretty">
              A trusted lead-gen partner engineered around quality, compliance, and measurable performance.
            </p>
          </div>
        </AnimatedItem>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <AnimatedItem key={feature.title} delay={120 * (i + 1)} className="h-full">
              <BentoCard className="flex h-full flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-keppel-900)] transition-transform duration-300 group-hover:scale-110">
                  <feature.icon weight="duotone" className="h-6 w-6 text-[var(--color-keppel-400)]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--color-baltic-sea-100)] text-balance">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-baltic-sea-400)]">
                  {feature.description}
                </p>
              </BentoCard>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  )
}
