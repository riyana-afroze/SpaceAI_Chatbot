"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MovingBorderProps {
  children: ReactNode
  className?: string
  duration?: number
}

export function MovingBorder({ children, className, duration = 3000 }: MovingBorderProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
          backgroundSize: "200% 100%",
          animation: `moveBorder ${duration}ms linear infinite`,
        }}
      />
      <div className="relative bg-slate-900 rounded-lg m-[1px]">{children}</div>
    </div>
  )
}
