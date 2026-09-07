"use client"

import { useEffect, useRef, useState } from "react"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

const FAQS = [
  {
    question: "What verticals do you cover?",
    answer:
      "We generate leads and calls across Insurance (Final Expense, ACA, Medicare, Auto, Home, Life), Home Services (Solar, Roofing, HVAC, Windows), Finance (Debt, Tax Relief, Mortgage), and Legal (Mass Tort, Personal Injury).",
  },
  {
    question: "Are your leads exclusive, or resold?",
    answer:
      "You choose. We offer real-time exclusive leads and calls that are delivered only to you, as well as shared options for buyers who want lower cost per lead. We never quietly resell an exclusive lead.",
  },
  {
    question: "How are leads and calls delivered?",
    answer:
      "In real time — via ping/post, direct API, or CRM integration for leads, and live warm transfers for calls. You'll typically be up and receiving volume within days.",
  },
  {
    question: "How do you ensure lead quality?",
    answer:
      "Every source is screened by our dedicated QA team before it ever reaches you, and traffic is monitored continuously. Leads are freshly generated — never aged or recycled data.",
  },
  {
    question: "How do you handle TCPA and compliance?",
    answer:
      "All leads and calls are TCPA opt-in and backed by TrustedForm and/or Jornaya certificates, so you have documented consent on every record.",
  },
  {
    question: "What's your policy on bad leads?",
    answer:
      "We have a clear return/credit policy. If a lead falls outside the agreed criteria (wrong vertical, invalid contact info, duplicate, etc.), you can submit it for review and credit.",
  },
  {
    question: "How do I get started?",
    answer:
      "Tell us your target vertical, geos, and volume. We'll match vetted traffic, set up delivery, and assign you a dedicated account manager to optimize as you scale.",
  },
]

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  delay,
  isVisible,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  delay: number
  isVisible: boolean
}) {
  return (
    <div
      className={`border-b border-[var(--color-baltic-sea-800)] transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${delay % 2 === 0 ? "-translate-x-8" : "translate-x-8"}`
      }`}
      style={{ transitionDelay: `${delay * 75 + 200}ms` }}
    >
      <button onClick={onClick} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-medium text-[var(--color-baltic-sea-200)] group-hover:text-[var(--color-keppel-400)] transition-colors">
          {question}
        </span>
        <CaretDown
          weight="bold"
          className={`h-5 w-5 text-[var(--color-baltic-sea-500)] group-hover:text-[var(--color-keppel-400)] transition-all duration-300 ${isOpen ? "rotate-180 text-[var(--color-keppel-400)]" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[var(--color-baltic-sea-400)] leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
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
      <div className="mx-auto max-w-[800px] px-2.5 sm:px-6 lg:px-12">
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-sm"}`}
        >
          <span className="text-sm font-medium text-[var(--color-keppel-400)] uppercase tracking-wider">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-baltic-sea-100)] md:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              delay={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
