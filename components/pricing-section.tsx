"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import {
  Briefcase,
  CheckCheck,
  Database,
  Server,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    description: "Ideal for individual operators getting started.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Sign Up Free",
    buttonHref: "/register",
    buttonVariant: "outline" as const,
    features: [
      {
        text: "3 Free Listing Tokens",
        icon: <Briefcase size={18} className="text-[#ff5600]" />,
      },
      { text: "Standard Job Postings", icon: <Database size={18} /> },
      { text: "Basic Driver Filtering", icon: <Server size={18} /> },
    ],
    includes: [
      "Always Free includes:",
      "3 initial posting credits",
      "Direct driver applicant contacts",
      "Active listings for 30 days",
      "Standard support channel",
    ],
  },
  {
    name: "Professional",
    description: "For active operators needing regular postings.",
    price: 49,
    yearlyPrice: 399,
    buttonText: "Request Professional Credits",
    buttonHref:
      "mailto:admin@driversaustralia.com.au?subject=Professional Token Package Inquiry",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      {
        text: "15 Listing Tokens",
        icon: <Briefcase size={18} className="text-[#ff5600]" />,
      },
      {
        text: "Featured Job Postings",
        icon: <Sparkles size={18} className="text-[#ff5600]" />,
      },
      { text: "Advanced Driver Search", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "15 additional posting credits",
      "Featured job badge & ranking boost",
      "Priority driver matches",
      "Dedicated admin support queue",
    ],
  },
  {
    name: "Enterprise",
    description: "Custom volume and integration packages.",
    price: 99,
    yearlyPrice: 799,
    buttonText: "Contact Administrator",
    buttonHref:
      "mailto:admin@driversaustralia.com.au?subject=Enterprise Token Package Inquiry",
    buttonVariant: "outline" as const,
    features: [
      {
        text: "40+ Listing Tokens",
        icon: <Briefcase size={18} className="text-[#ff5600]" />,
      },
      { text: "Bulk Job Import API", icon: <Database size={18} /> },
      { text: "Dedicated Support Queue", icon: <Server size={18} /> },
    ],
    includes: [
      "Everything in Professional, plus:",
      "Volume-based manual adjustments",
      "API-driven bulk listing imports",
      "Dedicated account manager",
      "Custom billing & contract terms",
    ],
  },
];

/* ─── Billing Toggle ─────────────────────────────────────────────────────── */

const PricingSwitch = ({
  onSwitch,
  className,
}: {
  onSwitch: (value: string) => void;
  className?: string;
}) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-[#ebe7e1] border border-[#d3cec6] p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors sm:text-sm text-xs",
            selected === "0"
              ? "text-[#111111]"
              : "text-[#626260] hover:text-[#111111]"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-white border border-[#d3cec6] shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20">Monthly Billing</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit cursor-pointer h-10 flex-shrink-0 rounded-full sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors sm:text-sm text-xs",
            selected === "1"
              ? "text-[#111111]"
              : "text-[#626260] hover:text-[#111111]"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="pricing-switch"
              className="absolute inset-0 rounded-full bg-white border border-[#d3cec6] shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-20 flex items-center gap-1.5">
            Yearly Billing
            <span className="rounded-full bg-[#ff5600]/10 px-2 py-0.5 text-[10px] font-bold text-[#ff5600]">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="px-4 pt-20 pb-16 min-h-screen max-w-7xl mx-auto relative"
      ref={pricingRef}
    >
      {/* ── Header ── */}
      <article className="text-left mb-10 space-y-4 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#ff5600]/10 border border-[#ff5600]/20 px-3.5 py-1 text-xs font-semibold text-[#ff5600] tracking-wide uppercase">
          Flexible Token Bundles
        </span>

        <h2 className="md:text-6xl text-4xl font-medium tracking-tight text-[#111111] leading-tight">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.08}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-start flex-wrap"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            A plan that fits your recruitment scale
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="md:text-base text-sm text-[#626260] max-w-xl"
        >
          Every new operator account starts with 3 free listing tokens.
          Additional credits are provisioned directly by administrators as
          needed.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="pt-1"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} className="w-fit" />
        </TimelineContent>
      </article>

      {/* ── Cards ── */}
      <div className="grid md:grid-cols-3 gap-6 py-6">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="h-full"
          >
            <Card
              className={cn(
                "relative h-full flex flex-col border transition-all duration-300 rounded-[12px] p-6 bg-white shadow-none",
                plan.popular
                  ? "border-[#ff5600] ring-1 ring-[#ff5600] bg-[#111111] text-white"
                  : "border-[#d3cec6] text-[#111111]"
              )}
            >
              <CardHeader className="text-left p-0 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="xl:text-2xl md:text-xl text-2xl font-medium tracking-tight">
                    {plan.name} Package
                  </h3>
                  {plan.popular && (
                    <span className="bg-[#ff5600] text-white px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap">
                      Recommended
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "text-xs leading-relaxed mb-4",
                    plan.popular ? "text-[#9c9fa5]" : "text-[#626260]"
                  )}
                >
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    $
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-semibold tracking-tight"
                    />
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      plan.popular ? "text-[#9c9fa5]" : "text-[#626260]"
                    )}
                  >
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex-grow flex flex-col justify-between">
                {/* Features list */}
                <div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-2.5 text-sm font-medium"
                      >
                        {feature.icon}
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Includes */}
                  <div
                    className={cn(
                      "space-y-2.5 pt-4 border-t",
                      plan.popular ? "border-[#313130]" : "border-[#ebe7e1]"
                    )}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2 font-medium">
                      {plan.includes.slice(1).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <CheckCheck
                            className={cn(
                              "h-4 w-4 shrink-0 mt-0.5 mr-2 text-[#ff5600]"
                            )}
                          />
                          <span
                            className={cn(
                              "text-xs leading-relaxed",
                              plan.popular ? "text-[#9c9fa5]" : "text-[#626260]"
                            )}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <a href={plan.buttonHref} className="block w-full">
                    <button
                      className={cn(
                        "w-full py-3 px-4 rounded-[8px] font-medium text-sm transition-all duration-200 cursor-pointer select-none",
                        plan.popular
                          ? "bg-[#ff5600] text-white hover:bg-[#ff5600]/90 border border-[#ff5600]"
                          : "bg-[#111111] text-white hover:bg-[#111111]/90 border border-[#111111]"
                      )}
                    >
                      {plan.buttonText}
                    </button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      {/* ── Token info footer ── */}
      <div className="mt-16 text-center max-w-xl mx-auto space-y-2 border border-[#d3cec6] bg-[#ebe7e1]/50 rounded-[12px] p-6">
        <HelpCircle className="h-5 w-5 text-[#ff5600] mx-auto" />
        <h4 className="font-semibold text-sm text-[#111111]">
          How token billing works
        </h4>
        <p className="text-xs text-[#626260] leading-relaxed">
          Posting a job listing costs exactly <strong>1 token</strong>. Every
          new operator profile is credited with <strong>3 free tokens</strong>{" "}
          automatically upon signing up. For additional credits, please click
          &ldquo;Request Credits&rdquo; or contact our administrative team
          directly.
        </p>
      </div>
    </div>
  );
}
