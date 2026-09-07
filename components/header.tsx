"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Lightning, CaretDown, List, X } from "@phosphor-icons/react/dist/ssr"

const VERTICALS = [
  { label: "Insurance", slug: "insurance" },
  { label: "Home Services", slug: "home-services" },
  { label: "Finance", slug: "finance" },
  { label: "Nutra", slug: "nutra" },
  { label: "Ecommerce", slug: "ecommerce" },
  { label: "Mass Tort", slug: "mass-tort" },
  { label: "Sweepstakes", slug: "sweepstakes" },
  { label: "Other", slug: "other" },
]

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Resources", href: "#resources" },
  { label: "Contact Us", href: "#contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [verticalsOpen, setVerticalsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileVerticalsOpen, setMobileVerticalsOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openVerticals = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setVerticalsOpen(true)
  }

  const scheduleCloseVerticals = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setVerticalsOpen(false), 120)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-2.5 sm:px-6 lg:px-12">
          {/* Logo */}
          <a href="#" className="flex items-center" aria-label="RAY Advertising home">
            <img src="/images/ray-logo-white.png" alt="RAY Advertising" className="h-24 w-24 object-contain" />
          </a>

          {/* Desktop navigation */}
          <nav
            className={`
              hidden md:flex items-center gap-1 rounded-full border border-[var(--color-baltic-sea-800)]
              bg-[var(--color-baltic-sea-900)]/80 backdrop-blur-md px-2 py-1.5
              transition-all duration-500 ease-out
              ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}
              absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2
            `}
          >
            <a
              href="#about"
              className="px-4 py-1.5 text-sm text-[var(--color-baltic-sea-400)] hover:text-[var(--color-baltic-sea-100)] transition-colors rounded-full"
            >
              About
            </a>
            <a
              href="#services"
              className="px-4 py-1.5 text-sm text-[var(--color-baltic-sea-400)] hover:text-[var(--color-baltic-sea-100)] transition-colors rounded-full"
            >
              Services
            </a>

            {/* Verticals dropdown */}
            <div className="relative" onMouseEnter={openVerticals} onMouseLeave={scheduleCloseVerticals}>
              <button
                type="button"
                onClick={() => setVerticalsOpen((v) => !v)}
                aria-expanded={verticalsOpen}
                aria-haspopup="true"
                className={`
                  flex items-center gap-1 px-4 py-1.5 text-sm rounded-full transition-colors
                  ${verticalsOpen ? "text-[var(--color-baltic-sea-100)] bg-[var(--color-baltic-sea-800)]" : "text-[var(--color-baltic-sea-400)] hover:text-[var(--color-baltic-sea-100)]"}
                `}
              >
                Verticals
                <CaretDown
                  weight="bold"
                  className={`h-3 w-3 transition-transform duration-200 ${verticalsOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 top-full pt-3 w-60
                  transition-all duration-200 ease-out origin-top
                  ${verticalsOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"}
                `}
              >
                <div className="overflow-hidden rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)]/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/40">
                  {VERTICALS.map((v) => (
                    <a
                      key={v.slug}
                      href={`/verticals/${v.slug}`}
                      className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-[var(--color-baltic-sea-300)] hover:bg-[var(--color-baltic-sea-800)] hover:text-[var(--color-baltic-sea-50)] transition-colors"
                    >
                      {v.label}
                      <CaretDown
                        weight="bold"
                        className="h-3 w-3 -rotate-90 opacity-0 -translate-x-1 text-[var(--color-keppel-400)] transition-all group-hover:opacity-100 group-hover:translate-x-0"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="#resources"
              className="px-4 py-1.5 text-sm text-[var(--color-baltic-sea-400)] hover:text-[var(--color-baltic-sea-100)] transition-colors rounded-full"
            >
              Resources
            </a>
            <a
              href="#contact"
              className="px-4 py-1.5 text-sm text-[var(--color-baltic-sea-400)] hover:text-[var(--color-baltic-sea-100)] transition-colors rounded-full"
            >
              Contact Us
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              className={`
                hidden md:flex bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)]
                rounded-full px-5 py-2.5 h-auto text-sm
                transition-all duration-500
                ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}
              `}
            >
              <Lightning weight="fill" className="mr-1.5 h-4 w-4" />
              Get Started
            </Button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)]/80 backdrop-blur-md text-[var(--color-baltic-sea-100)]"
            >
              {mobileOpen ? <X weight="bold" className="h-5 w-5" /> : <List weight="bold" className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-out
            ${mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <div className="mx-2.5 sm:mx-6 mb-4 rounded-2xl border border-[var(--color-baltic-sea-800)] bg-[var(--color-baltic-sea-900)]/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/40">
            <a
              href="#about"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[var(--color-baltic-sea-200)] hover:bg-[var(--color-baltic-sea-800)] transition-colors"
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[var(--color-baltic-sea-200)] hover:bg-[var(--color-baltic-sea-800)] transition-colors"
            >
              Services
            </a>

            {/* Mobile verticals accordion */}
            <button
              type="button"
              onClick={() => setMobileVerticalsOpen((v) => !v)}
              aria-expanded={mobileVerticalsOpen}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm text-[var(--color-baltic-sea-200)] hover:bg-[var(--color-baltic-sea-800)] transition-colors"
            >
              Verticals
              <CaretDown
                weight="bold"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileVerticalsOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${mobileVerticalsOpen ? "max-h-96" : "max-h-0"}`}
            >
              <div className="ml-2 border-l border-[var(--color-baltic-sea-800)] pl-2 py-1">
                {VERTICALS.map((v) => (
                  <a
                    key={v.slug}
                    href={`/verticals/${v.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-[var(--color-baltic-sea-400)] hover:bg-[var(--color-baltic-sea-800)] hover:text-[var(--color-baltic-sea-100)] transition-colors"
                  >
                    {v.label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#resources"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[var(--color-baltic-sea-200)] hover:bg-[var(--color-baltic-sea-800)] transition-colors"
            >
              Resources
            </a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[var(--color-baltic-sea-200)] hover:bg-[var(--color-baltic-sea-800)] transition-colors"
            >
              Contact Us
            </a>

            <Button className="mt-2 w-full bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)] rounded-xl py-3 h-auto text-sm">
              <Lightning weight="fill" className="mr-1.5 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div
        className={`
          fixed z-50 bottom-6 right-6 lg:right-12
          transition-all duration-500 ease-out
          ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >
        <Button
          className="bg-[var(--color-keppel-400)] text-[var(--color-keppel-950)] hover:bg-[var(--color-keppel-300)]
            rounded-full px-6 py-3 h-auto text-sm shadow-lg shadow-[var(--color-keppel-400)]/20"
        >
          <Lightning weight="fill" className="mr-1.5 h-4 w-4" />
          Get Started
        </Button>
      </div>
    </>
  )
}
