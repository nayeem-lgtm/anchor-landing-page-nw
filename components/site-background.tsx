export function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(var(--color-baltic-sea-800) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Soft keppel glow, top-right */}
      <div
        className="absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-500) 22%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Cooler glow, mid-left */}
      <div
        className="absolute top-[38%] left-[-12%] h-[520px] w-[520px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-700) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Deep glow, lower-right for balance */}
      <div
        className="absolute bottom-[6%] right-[-8%] h-[480px] w-[480px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-baltic-sea-700) 30%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Vignette to keep edges grounded */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 40%, transparent 55%, color-mix(in oklch, var(--background) 70%, transparent) 100%)",
        }}
      />
    </div>
  )
}
