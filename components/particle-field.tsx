"use client"

import { useEffect, useRef } from "react"

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

/**
 * Animated particle network rendered on a canvas.
 * Glowing nodes drift across the viewport and draw connecting lines
 * when they come close, creating a living "signal graph" backdrop.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = 1
    let nodes: Node[] = []
    const pointer = { x: -9999, y: -9999, active: false }

    const LINK_DIST = 150
    const KEPPEL = "112, 214, 197" // rgb approximation of keppel-400

    function makeNodes() {
      // Density scales with viewport area, capped for performance.
      const target = Math.min(110, Math.floor((width * height) / 16000))
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
      }))
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeNodes()
    }

    let raf = 0
    function frame() {
      ctx!.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        // Gentle attraction toward the pointer for interactivity.
        if (pointer.active) {
          const dx = pointer.x - n.x
          const dy = pointer.y - n.y
          const dist = Math.hypot(dx, dy)
          if (dist < 220 && dist > 0.1) {
            n.x += (dx / dist) * 0.25
            n.y += (dy / dist) * 0.25
          }
        }

        if (n.x < 0) n.x = width
        if (n.x > width) n.x = 0
        if (n.y < 0) n.y = height
        if (n.y > height) n.y = 0
      }

      // Connecting lines.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5
            ctx!.strokeStyle = `rgba(${KEPPEL}, ${alpha})`
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Glowing nodes.
      for (const n of nodes) {
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${KEPPEL}, 0.9)`
        ctx!.shadowColor = `rgba(${KEPPEL}, 0.9)`
        ctx!.shadowBlur = 8
        ctx!.fill()
        ctx!.shadowBlur = 0
      }

      raf = requestAnimationFrame(frame)
    }

    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
    }
    function onPointerLeave() {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    resize()
    window.addEventListener("resize", resize)

    if (reduceMotion) {
      // Draw a single static frame instead of animating.
      frame()
      cancelAnimationFrame(raf)
    } else {
      window.addEventListener("pointermove", onPointerMove)
      window.addEventListener("pointerleave", onPointerLeave)
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{
        maskImage: "radial-gradient(ellipse 110% 100% at 50% 40%, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 110% 100% at 50% 40%, black 55%, transparent 100%)",
      }}
    />
  )
}
