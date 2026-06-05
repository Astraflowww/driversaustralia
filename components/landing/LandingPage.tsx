'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Coins,
  Truck,
  Car,
  Layers,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestimonialsSection } from '@/components/ui/testimonial-v2';
import { CTASection } from '@/components/blocks/cta-with-rectangle';

// Dynamically import the animated background to prevent SSR issues
const RaycastAnimatedBackground = dynamic(
  () => import('@/components/ui/raycast-animated-background').then(mod => mod.RaycastAnimatedBackground),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[#f5f1ec] dark:bg-neutral-950" /> }
);

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 border-b border-border/30 overflow-hidden">
        {/* Animated Background layer - Hue Rotated to turn Red streaks into Yellow */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ filter: 'hue-rotate(55deg) saturate(1.4) contrast(1.1)' }}>
          <RaycastAnimatedBackground />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-left max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0a500]/10 border border-[#f0a500]/25 px-4 py-1.5 text-xs font-semibold text-[#f0a500]">
                <Sparkles className="h-3.5 w-3.5" />
                Australia&apos;s Premium Heavy Vehicle Network
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] text-white lg:tracking-[-1.8px]">
                Connecting Fleets with{' '}
                <span className="text-[#f0a500] font-semibold">Verified Drivers</span> through Smart Forms.
              </h1>

              <p className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-xl font-normal">
                Business owners post custom questionnaire listings to pre-screen qualifications. Drivers apply in seconds with zero friction.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/register?role=seller">
                  <Button size="lg" className="w-full sm:w-auto bg-[#f0a500] hover:bg-[#d89400] text-black font-semibold px-8 py-6 rounded-lg cursor-pointer shadow-sm group border-none">
                    Hire Heavy Vehicle Drivers
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link href="/register?role=buyer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent font-semibold px-8 py-6 rounded-lg cursor-pointer">
                    Apply for Truck Driving Jobs
                  </Button>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 max-w-xl">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">10k+</p>
                  <p className="text-xs text-white/60">Registered Drivers</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/60">Fleet Partners</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">98%</p>
                  <p className="text-xs text-white/60">Completion Rate</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">&lt; 24h</p>
                  <p className="text-xs text-white/60">Average Hire Time</p>
                </div>
              </div>
            </div>

            {/* Right Product Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none rounded-2xl border border-border bg-card shadow-2xl p-4 sm:p-6 select-none overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Visual interface elements of mockup */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded border border-border/20">
                    Live Portal Preview
                  </span>
                </div>

                {/* Simulated dashboard card details */}
                <div className="space-y-4">
                  {/* Job Posting Mockup Card */}
                  <div className="rounded-xl border border-border/60 bg-background/50 p-4.5 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block rounded-md bg-[#f0a500]/10 border border-[#f0a500]/25 px-2 py-0.5 text-[10px] font-bold text-[#f0a500] uppercase">
                          MC Licence
                        </span>
                        <h4 className="font-semibold text-sm sm:text-base text-foreground mt-1.5 leading-snug">
                          Heavy Haulage Driver - Interstate Run
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Melbourne, VIC
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Seeking experienced MC driver for regular linehaul work. Custom questions help us review your driving history instantly.
                    </p>

                    <div className="flex items-center justify-between border-t border-border/20 pt-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        $42.50 / hour
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Posted 2h ago
                      </span>
                    </div>
                  </div>

                  {/* Questionnaire Mockup */}
                  <div className="rounded-xl border border-[#f0a500]/20 bg-[#f0a500]/5 p-4.5 space-y-3">
                    <h5 className="text-xs font-bold text-[#f0a500] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Dynamic Application Form
                    </h5>
                    
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">1. MC Licence Number *</label>
                        <div className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
                          VIC-MC987654...
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">2. Years of Multi-Combination Experience *</label>
                        <div className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
                          5 Years
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">3. Overnight sleeping cabin availability?</label>
                        <div className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
                          Yes, fully comfortable
                        </div>
                      </div>
                    </div>

                    <button disabled className="w-full rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-semibold py-2 mt-1 shadow-sm opacity-90 cursor-not-allowed">
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Core Value Proposition Section */}
      <section className="py-24 border-b border-border/30 bg-card/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f0a500]">Features & Benefits</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground lg:tracking-[-1px]">
              Better Screening. Faster Hiring. Zero Friction.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Standard job boards inundate you with generic PDFs. Drivers Australia filters matching candidate qualifications right at the application step.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col space-y-4 hover:border-foreground/20 transition-all">
              <div className="rounded-lg bg-[#f0a500]/10 border border-[#f0a500]/20 p-3.5 text-[#f0a500] w-fit">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground tracking-tight">Custom Questionnaire Listings</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                Define the precise questions you need answered. Choose text, textareas, telephone details, or select drop-downs to filter driver qualifications instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col space-y-4 hover:border-foreground/20 transition-all">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-emerald-600 w-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground tracking-tight">Compliance & Verification</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                Collect licence numbers, expiry dates, and experience verification securely before interviewing, ensuring compliance on every run.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-card p-8 flex flex-col space-y-4 hover:border-foreground/20 transition-all">
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3.5 text-blue-600 w-fit">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground tracking-tight">Token-Based Job Credits</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                Only pay for active listings with our flexible credit system. Each listing costs just 1 credit, with robust transaction history auditing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Driver Licence Grid Section */}
      <section className="py-24 border-b border-border/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f0a500]">Job Categories</span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground lg:tracking-[-1px]">
                Supporting All Heavy Vehicle Licences
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Whether you operate heavy B-Doubles, multi-combination road trains, medium rigid courier vans, or special transport configurations, we support the full spectrum of transport credentials.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Linehaul & Interstate MC Runs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Local HC Distribution & Depot Delivery</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4.5 w-4.5 text-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">HR/MR Rigid Truck & Freight Courier Work</span>
                </div>
              </div>
            </div>

            {/* Right Licence Cards */}
            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                
                {/* MC */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-[#65b5ff]/10 border border-[#65b5ff]/20 px-2 py-0.5 text-[10px] font-bold text-[#006bd6]">
                      MC
                    </span>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Multi Combination</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Road trains and B-double configurations for high capacity transport.
                  </p>
                </div>

                {/* HC */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-[#0bdf50]/10 border border-[#0bdf50]/20 px-2 py-0.5 text-[10px] font-bold text-[#079c37]">
                      HC
                    </span>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Heavy Combination</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Semi-trailers, low loaders, and heavy vehicle combinations.
                  </p>
                </div>

                {/* HR */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-[#03b2cb]/10 border border-[#03b2cb]/20 px-2 py-0.5 text-[10px] font-bold text-[#028194]">
                      HR
                    </span>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Heavy Rigid</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Rigid passenger buses and trucks with three or more axles.
                  </p>
                </div>

                {/* MR/LR */}
                <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-fin-orange/10 border border-fin-orange/20 px-2 py-0.5 text-[10px] font-bold text-fin-orange">
                      MR / LR
                    </span>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Medium & Light Rigid</h4>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Depot couriers, local freight transport, and small buses.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof (Scrolling Testimonials) */}
      <div className="bg-card/10 border-b border-border/30">
        <TestimonialsSection />
      </div>

      {/* Conversion Banner Section */}
      <CTASection
        badge={{ text: "Get Started" }}
        title="Ready to find qualified drivers or your next driving run?"
        description="Join Australia's fastest growing heavy vehicle recruitment platform today. Zero upfront subscription fees. Simple pay-as-you-go listings."
        action={{
          text: "Create Your Account",
          href: "/register",
        }}
      />


    </div>
  );
}
