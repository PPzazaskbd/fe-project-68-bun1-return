'use client'
import { ReactNode } from "react"

export default function InteractiveCard({ children }: { children: ReactNode }) {
  return (
    <div className="
      px-3
      w-64
      rounded-lg
      shadow-lg
      shadow-2xl
      bg-white
      bg-neutral-200
    ">
      {children}
    </div>
  )
}