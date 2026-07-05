'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, ShieldAlert, Coins, Key, UserCheck, HelpCircle } from 'lucide-react';

const sections = [
  { id: 'agreement', title: '1. Agreement to Terms', icon: Scale },
  { id: 'accounts', title: '2. User Accounts & Roles', icon: UserCheck },
  { id: 'tokens', title: '3. Token System & Listings', icon: Coins },
  { id: 'conduct', title: '4. Platform Rules & Conduct', icon: ShieldAlert },
  { id: 'disclaimer', title: '5. Verification Disclaimer', icon: Key },
  { id: 'liability', title: '6. Limitation of Liability', icon: FileText },
  { id: 'governing-law', title: '7. Governing Law', icon: HelpCircle },
];

export default function TermsPage() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 sm:py-24">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-[#f0a500]/5 via-transparent to-transparent pointer-events-none blur-3xl z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-16 text-left max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0a500]/10 border border-[#f0a500]/25 px-4 py-1.5 text-xs font-semibold text-[#f0a500]">
            Last updated: July 2026
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-4 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Please read these terms carefully before using Drivers Australia. By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:block hidden">
            <div className="sticky top-28 p-6 rounded-2xl border border-border/60 bg-card shadow-sm space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Table of Contents
              </h3>
              <nav className="flex flex-col gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleScroll(section.id)}
                      className="flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer group"
                    >
                      <Icon className="h-4 w-4 text-[#f0a500]/80 group-hover:text-[#f0a500] shrink-0" />
                      <span className="truncate">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Legal Text Content */}
          <div className="lg:col-span-8 space-y-12">
            
            <section id="agreement" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Welcome to Drivers Australia. These Terms & Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Drivers Australia, concerning your access to and use of our website and services.
                </p>
                <p>
                  By accessing the site, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms & Conditions. If you do not agree with all of these terms, then you are expressly prohibited from using the site and must discontinue use immediately.
                </p>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">2. User Accounts & Roles</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  To access certain features of the platform, you must register for an account. Drivers Australia offers two primary roles:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Licensed Drivers (Buyers/Candidates):</strong> Can view job postings, fill out operator-specific pre-screening questionnaires, and apply to driver listings.
                  </li>
                  <li>
                    <strong>Fleet Operators (Sellers/Employers):</strong> Can create and publish job listings, design custom pre-screening forms, and manage driver application responses.
                  </li>
                </ul>
                <p>
                  You agree to provide true, accurate, and complete registration information and to update it promptly. You are responsible for safeguarding your password and account details, and accept full responsibility for all activities occurring under your account.
                </p>
              </div>
            </section>

            <section id="tokens" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Coins className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">3. Token System & Listings</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Drivers Australia operates a token-based system for Fleet Operators to publish listings:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Creating and publishing a single listing consumes exactly one (1) token credit.</li>
                  <li>New Operator accounts are automatically provisioned with three (3) free token credits.</li>
                  <li>Additional token credits can be purchased or requested through the Operator Dashboard.</li>
                  <li>Tokens are non-refundable and non-transferable, unless explicitly authorized by the platform administration.</li>
                </ul>
              </div>
            </section>

            <section id="conduct" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">4. Platform Rules & Conduct</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  You agree to use Drivers Australia only for lawful purposes. You must not:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Post false, inaccurate, misleading, or defamatory job listings or profile details.</li>
                  <li>Violate any local, state, or federal laws regarding heavy vehicle compliance, employment, and safety regulations.</li>
                  <li>Use the platform to distribute unsolicited communications, spam, or malicious software.</li>
                  <li>Attempt to bypass, disable, or interfere with security measures or access-control systems.</li>
                </ul>
              </div>
            </section>

            <section id="disclaimer" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Key className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">5. Verification Disclaimer</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Drivers Australia is an online connection marketplace. We do not directly hire drivers, nor do we act as an employment agency.
                </p>
                <p className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-600 dark:text-[#f0a500] font-medium">
                  <strong>IMPORTANT FOR OPERATORS:</strong> Fleet operators are solely responsible for conducting background checks, verification of driver licences (MC, HC, HR, MR, LR), reference checks, drug and alcohol screenings, and assessing the physical/technical eligibility of candidates. Drivers Australia does not verify or guarantee the validity of any documents uploaded or statements made by candidates on this platform.
                </p>
              </div>
            </section>

            <section id="liability" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  To the maximum extent permitted by applicable law, Drivers Australia, its founders, and affiliates will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your use of, or inability to use, the site or services.</li>
                  <li>Any transactions, agreements, employment arrangements, or physical operations (including transport and driving operations) that result from matches made on this platform.</li>
                  <li>Any errors, omissions, or inaccuracies in the content provided on the platform.</li>
                </ul>
              </div>
            </section>

            <section id="governing-law" className="scroll-mt-24 space-y-4 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">7. Governing Law</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  These Terms & Conditions and your use of the website are governed by and construed in accordance with the laws of Australia and the relevant State in which the dispute arises, without regard to its conflict of law principles.
                </p>
                <p>
                  We reserve the right, in our sole discretion, to make changes or modifications to these Terms & Conditions at any time. We will alert you about any changes by updating the &quot;Last updated&quot; date of these Terms.
                </p>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
