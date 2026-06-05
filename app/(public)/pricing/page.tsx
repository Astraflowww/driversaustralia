import React from "react";
import PricingSection from "@/components/pricing-section";

export const metadata = {
  title: "Pricing — Drivers Australia",
  description:
    "Simple and transparent pricing plans for posting transport driver jobs.",
};

export default function PricingPage() {
  return (
    <main className="bg-[#f5f1ec] min-h-screen">
      <PricingSection />
    </main>
  );
}
