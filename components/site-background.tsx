const PARTICLES = [
  { left: "8%", size: 3, delay: "0s", duration: "14s" },
  { left: "18%", size: 2, delay: "3s", duration: "18s" },
  { left: "27%", size: 4, delay: "6s", duration: "16s" },
  { left: "39%", size: 2, delay: "1.5s", duration: "20s" },
  { left: "52%", size: 3, delay: "5s", duration: "15s" },
  { left: "63%", size: 2, delay: "8s", duration: "19s" },
  { left: "71%", size: 4, delay: "2.5s", duration: "17s" },
  { left: "83%", size: 3, delay: "7s", duration: "21s" },
  { left: "92%", size: 2, delay: "4s", duration: "16s" },
]

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

      {/* Animated keppel glow, top-right */}
      <div
        className="ambient-animate absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full blur-[120px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-500) 24%, transparent) 0%, transparent 70%)",
          animation: "drift-a 26s ease-in-out infinite",
        }}
      />

      {/* Animated cooler glow, mid-left */}
      <div
        className="ambient-animate absolute top-[42%] left-[-12%] h-[520px] w-[520px] rounded-full blur-[130px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-700) 20%, transparent) 0%, transparent 70%)",
          animation: "drift-b 32s ease-in-out infinite",
        }}
      />

      {/* Animated keppel accent, lower-center */}
      <div
        className="ambient-animate absolute bottom-[-6%] left-1/2 h-[480px] w-[680px] rounded-full blur-[140px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-keppel-600) 14%, transparent) 0%, transparent 70%)",
          animation: "drift-c 30s ease-in-out infinite",
        }}
      />

      {/* Animated deep glow, lower-right for balance */}
      <div
        className="ambient-animate absolute bottom-[6%] right-[-8%] h-[480px] w-[480px] rounded-full blur-[130px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-baltic-sea-700) 32%, transparent) 0%, transparent 70%)",
          animation: "drift-a 34s ease-in-out infinite reverse",
        }}
      />

      {/* Floating particles rising slowly */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 40%, transparent 90%)",
        }}
      >
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="ambient-animate absolute rounded-full will-change-transform"
            style={{
              left: p.left,
              top: `${20 + ((i * 9) % 60)}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                i % 3 === 0
                  ? "color-mix(in oklch, var(--color-keppel-400) 80%, transparent)"
                  : "color-mix(in oklch, var(--color-baltic-sea-300) 55%, transparent)",
              boxShadow:
                i % 3 === 0 ? "0 0 8px color-mix(in oklch, var(--color-keppel-400) 60%, transparent)" : "none",
              animation: `float-up ${p.duration} linear ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

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
