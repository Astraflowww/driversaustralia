"use client"

import type { VariantProps } from "class-variance-authority"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>

interface CTAProps {
  badge?: {
    text: string
  }
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: ButtonVariant | "glow"
  }
  withGlow?: boolean
  className?: string
}

export function CTASection({
  badge,
  title,
  description,
  action,
  withGlow = true,
  className,
}: CTAProps) {
  const actionVariant: ButtonVariant = action.variant === "glow" ? "default" : action.variant ?? "default"

  return (
    <section className={cn("overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8", className)}>
      <div className="dark relative mx-auto flex max-w-container flex-col items-center gap-6 px-8 py-16 text-center sm:gap-8 md:py-24 rounded-xxl bg-[#111111] border border-white/10 text-white shadow-2xl overflow-hidden">
        {/* Badge */}
        {badge && (
          <Badge
            variant="outline"
            className="opacity-0 animate-fade-in-up delay-100 border-[#f0a500]/30 bg-[#f0a500]/10 text-[#fca57c] hover:bg-[#f0a500]/20"
          >
            <span className="font-semibold">{badge.text}</span>
          </Badge>
        )}

        {/* Title */}
        <h2 className="text-3xl font-medium sm:text-5xl opacity-0 animate-fade-in-up delay-200 text-white tracking-tight leading-[1.1] max-w-3xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-white/60 opacity-0 animate-fade-in-up delay-300 max-w-2xl text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        )}

        {/* Action Button */}
        <Button
          variant={actionVariant}
          size="lg"
          className="opacity-0 animate-fade-in-up delay-500 bg-[#f0a500] hover:bg-[#d89400] text-black font-semibold px-8 py-6 rounded-lg cursor-pointer border-none shadow-sm transition-all duration-200 active:scale-[0.98]"
          render={<a href={action.href} />}
          nativeButton={false}
        >
          {action.text}
        </Button>

        {/* Glow Effect */}
        {withGlow && (
          <div className="pointer-events-none absolute inset-0 rounded-xxl shadow-glow opacity-0 animate-scale-in delay-700" />
        )}
      </div>
    </section>
  )
}
