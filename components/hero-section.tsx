import { Button } from "@/components/ui/button"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { LiveDeliveryPanel } from "@/components/live-delivery-panel"

export function HeroSection() {
  return (
    <section className="relative min-h-screen pb-12 overflow-hidden">
      <div className="absolute inset-0 -top-20 -left-20 -right-20 overflow-hidden">
        {/* Rotating aurora spotlight behind the headline */}
        <div
          className="hero-animate absolute left-[30%] top-[38%] h-[900px] w-[900px] rounded-full blur-[120px] will-change-transform"
          style={{
            background:
              "conic-gradient(from 0deg, color-mix(in oklch, var(--color-keppel-500) 22%, transparent), transparent 35%, color-mix(in oklch, var(--color-keppel-700) 18%, transparent) 60%, transparent 85%, color-mix(in oklch, var(--color-keppel-500) 22%, transparent))",
            animation: "hero-spotlight 40s linear infinite",
          }}
        />

        {/* Subtly breathing tech grid */}
        <div
          className="hero-animate absolute inset-0 grid grid-cols-10 sm:grid-cols-15 lg:grid-cols-20 gap-3 sm:gap-4 lg:gap-5 p-4 opacity-30 will-change-[opacity]"
          style={{ animation: "ambient-pulse 9s ease-in-out infinite" }}
        >
          {[...Array(240)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm border border-[var(--color-baltic-sea-800)] bg-transparent"
              style={{ opacity: 0.4 }}
            />
          ))}
        </div>

        {/* Sweeping light beam */}
        <div className="absolute inset-x-0 top-[26%] h-px overflow-hidden opacity-70">
          <div
            className="hero-animate absolute inset-y-0 w-2/3 will-change-transform"
            style={{
              background:
                "linear-gradient(to right, transparent, color-mix(in oklch, var(--color-keppel-400) 70%, transparent), transparent)",
              animation: "beam-sweep 11s ease-in-out infinite",
            }}
          />
        </div>

        {/* Soft fades that let the animated site background show through instead of a solid fill */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-2.5 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-20">
          {/* Left column - text content */}
          <div className="relative lg:max-w-xl lg:min-h-screen flex flex-col justify-center pt-24 lg:pt-20">
            {/* Soft scrim to keep text legible over the animated background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 blur-2xl"
              style={{
                background:
                  "radial-gradient(60% 55% at 35% 50%, color-mix(in oklch, var(--background) 85%, transparent) 0%, color-mix(in oklch, var(--background) 55%, transparent) 45%, transparent 75%)",
              }}
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-keppel-700)] bg-[var(--color-keppel-950)] px-3 py-1 text-xs text-[var(--color-keppel-300)] mb-8 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-keppel-400)]" />
              Performance-driven acquisition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-baltic-sea-50)] leading-[1.1] text-balance">
              High Intent.
              <br />
              <span className="text-[var(--color-keppel-400)]">High Impact.</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--color-baltic-sea-200)] max-w-md leading-relaxed">
              We connect your business with consumers who are ready to act.
            </p>

            <p className="mt-4 text-base text-[var(--color-baltic-sea-400)] max-w-md leading-relaxed text-pretty">
              Reach qualified customers through performance-driven acquisition. We connect real consumer demand with
              businesses ready to serve it—delivering opportunities built around intent, relevance, and measurable
              performance.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-[var(--color-keppel-500)] hover:bg-[var(--color-keppel-600)] text-[var(--color-keppel-950)] font-semibold px-6"
              >
                Start deploying
                <ArrowRight className="ml-2 h-4 w-4" weight="bold" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-[var(--color-baltic-sea-300)] hover:text-[var(--color-baltic-sea-100)] hover:bg-[var(--color-baltic-sea-900)]"
              >
                View documentation
              </Button>
            </div>
          </div>

          {/* Right column - live delivery feed */}
          <div className="lg:flex-1 lg:max-w-2xl lg:min-h-screen flex flex-col items-center justify-center lg:pt-20">
            <LiveDeliveryPanel />
          </div>
        </div>
      </div>
    </section>
  )
}
