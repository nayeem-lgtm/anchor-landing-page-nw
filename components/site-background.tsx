export function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dot grid across the entire viewport */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(var(--color-baltic-sea-700) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 120% 100% at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 120% 100% at 50% 50%, black 60%, transparent 100%)",
        }}
      />

      {/* Fine grid lines for subtle structure */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-baltic-sea-800) 1px, transparent 1px), linear-gradient(to bottom, var(--color-baltic-sea-800) 1px, transparent 1px)",
          backgroundSize: "min(12vw, 160px) min(12vw, 160px)",
          maskImage: "radial-gradient(ellipse 100% 90% at 50% 40%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 90% at 50% 40%, black 30%, transparent 85%)",
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
        className="absolute top-[42%] left-[-12%] h-[520px] w-[520px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-700) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Warm keppel accent, lower-center */}
      <div
        className="absolute bottom-[-6%] left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-600) 12%, transparent) 0%, transparent 70%)",
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
            "radial-gradient(ellipse 100% 85% at 50% 45%, transparent 60%, color-mix(in oklch, var(--background) 65%, transparent) 100%)",
        }}
      />
    </div>
  )
}
