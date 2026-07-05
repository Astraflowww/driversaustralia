'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, User, FileText, Lock, Eye, Activity, Mail } from 'lucide-react';

const sections = [
  { id: 'collection', title: '1. Information We Collect', icon: User },
  { id: 'usage', title: '2. How We Use Information', icon: Activity },
  { id: 'sharing', title: '3. Sharing of Information', icon: Eye },
  { id: 'security', title: '4. Data Security', icon: Lock },
  { id: 'rights', title: '5. Your Rights & Choices', icon: Shield },
  { id: 'cookies', title: '6. Cookies & Tracking', icon: FileText },
  { id: 'contact', title: '7. Contact Us', icon: Mail },
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            At Drivers Australia, we are committed to protecting your privacy. This Privacy Policy details how we collect, use, and share your personal information.
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
            
            <section id="collection" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  We collect information to provide a better user experience and facilitate job matching. The types of personal information collected depend on your user role:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>From Drivers:</strong> Name, contact details (email, phone number), driving licence type/class (e.g. MC, HC, HR, MR, LR), work eligibility status, ABN details, CV/resume details, and answers to custom questionnaire screens.
                  </li>
                  <li>
                    <strong>From Fleet Operators:</strong> Business/company name, contact names, ABN/ACN details, email addresses, and phone numbers.
                  </li>
                  <li>
                    <strong>Automatically Collected:</strong> Log files, IP address, browser type, device information, and interactions with the website.
                  </li>
                </ul>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Activity className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Drivers Australia uses the information collected for various operational purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To verify operator registrations and establish secure accounts.</li>
                  <li>To matching driver qualifications with operator pre-screening requirements.</li>
                  <li>To notify operators in real time when new application forms are submitted.</li>
                  <li>To provide client dashboard analytics, token balance monitoring, and account tools.</li>
                  <li>To diagnose, resolve technical issues, and improve platform speed/usability.</li>
                </ul>
              </div>
            </section>

            <section id="sharing" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">3. Sharing of Information</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Your privacy is highly valued. We share information only under strict guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="font-semibold text-foreground">
                    We NEVER sell, trade, or rent driver or operator personal details to third-party advertisers.
                  </li>
                  <li>
                    <strong>With Fleet Operators:</strong> When a driver submits an application, their contact information, licensing categories, and questionnaire answers are transmitted directly to the operator hosting that listing.
                  </li>
                  <li>
                    <strong>For Legal Compliance:</strong> We may disclose information if required to do so by Australian federal/state law or court order.
                  </li>
                </ul>
              </div>
            </section>

            <section id="security" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">4. Data Security</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  All database and user interactions are secured using industry-standard protocols. We leverage Supabase database security rules, role-based database policies (RLS), and HTTPS encryption.
                </p>
                <p>
                  While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, we cannot guarantee its absolute security.
                </p>
              </div>
            </section>

            <section id="rights" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">5. Your Rights & Choices</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  Depending on your jurisdiction, you have the following rights regarding your personal data:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Access:</strong> The right to request copies of your personal data stored on our platform.</li>
                  <li><strong>Correction:</strong> The right to update or correct any information you believe is inaccurate.</li>
                  <li><strong>Erasure/Deletion:</strong> The right to request that we erase your personal database records under certain conditions.</li>
                  <li><strong>Opt-Out:</strong> The right to withdraw consent for direct communications.</li>
                </ul>
              </div>
            </section>

            <section id="cookies" className="scroll-mt-24 space-y-4 border-b border-border/20 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">6. Cookies & Tracking Technologies</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  We use cookies and similar session technologies to keep you logged in, remember dashboard preferences, and analyze website traffic.
                </p>
                <p>
                  You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or fail to function properly.
                </p>
              </div>
            </section>

            <section id="contact" className="scroll-mt-24 space-y-4 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#f0a500]/10 text-[#f0a500]">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold">7. Contact Us</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  If you have any questions or concerns regarding this Privacy Policy, your database records, or how we manage data protection, please contact us at:
                </p>
                <div className="bg-muted/40 p-4 rounded-xl border border-border/40 inline-block font-medium">
                  <p>Drivers Australia Admin Team</p>
                  <p className="text-[#f0a500] hover:underline mt-1">
                    <a href="mailto:privacy@driversaustralia.com.au">privacy@driversaustralia.com.au</a>
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
