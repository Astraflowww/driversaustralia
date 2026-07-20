'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { Frame } from 'lucide-react';

const Facebook = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	</svg>
);

const Instagram = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
	</svg>
);

const Youtube = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
		<polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
	</svg>
);

const Linkedin = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
		<rect x="2" y="9" width="4" height="12" />
		<circle cx="4" cy="4" r="2" />
	</svg>
);

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '#features' },
			{ title: 'Pricing', href: '#pricing' },
			{ title: 'Testimonials', href: '#testimonials' },
			{ title: 'Integration', href: '/' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'FAQs', href: '/faqs' },
			{ title: 'About Us', href: '/about' },
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Services', href: '/terms' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Changelog', href: '/changelog' },
			{ title: 'Brand', href: '/brand' },
			{ title: 'Help', href: '/help' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Facebook', href: '#', icon: Facebook },
			{ title: 'Instagram', href: '#', icon: Instagram },
			{ title: 'Youtube', href: '#', icon: Youtube },
			{ title: 'LinkedIn', href: '#', icon: Linkedin },
		],
	},
];

export function Footer() {
	const pathname = usePathname();

	// Hide public footer on admin dashboard pages
	if (pathname?.startsWith('/admin')) {
		return null;
	}

	return (
		<footer className="w-full bg-[#17191a] text-[#b9bcb2] pt-12 pb-6 border-t border-[#2f322f]">
			<div className="max-w-[1180px] mx-auto px-4 sm:px-7">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
					
					{/* Brand Column */}
					<div className="lg:col-span-4 space-y-4">
						<div className="flex items-center gap-2.5 select-none">
							<div className="shrink-0">
								<svg viewBox="0 0 100 100" className="h-8 w-8" fillRule="evenodd">
									<rect width="100" height="100" rx="16" fill="#f0a500" />
									<path d="M30 18h15c20 0 35 12 35 32s-15 32-35 32H30c-4.4 0-8-3.6-8-8V26c0-4.4 3.6-8 8-8zm13 14H35v36h8c11 0 19-7 19-18s-8-18-19-18z" fill="#ffffff" />
								</svg>
							</div>
							<div className="flex items-center">
								<div className="flex flex-col leading-none">
									<span className="text-[17px] font-bold tracking-[0.03em] text-[#f0a500] leading-[1.05]">DRIVERS</span>
									<span className="text-[14px] font-black tracking-normal text-white leading-[1.05] mt-0.5">AUSTRALIA</span>
								</div>
								<div className="text-[8px] font-medium text-[#b9bcb2] self-stretch flex items-end pl-0.5 pb-[2px] select-none" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
									.com.au
								</div>
							</div>
						</div>
						<p className="text-xs text-[#b9bcb2] leading-relaxed max-w-[280px]">
							The job board built for the front seat — connecting Australian drivers with verified work, from local delivery to interstate linehaul.
						</p>
					</div>

					{/* Navigation Columns */}
					<div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
						<div>
							<h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#f2efe6] mb-3">For Drivers</h4>
							<ul className="space-y-2 text-xs">
								<li><a href="/#jobs" className="hover:text-[#ffb81c] transition-colors">Browse Jobs</a></li>
								<li><a href="/#vehicles" className="hover:text-[#ffb81c] transition-colors">Vehicle Types</a></li>
								<li><a href="/faq" className="hover:text-[#ffb81c] transition-colors">Licence Guide</a></li>
								<li><a href="/register?role=buyer" className="hover:text-[#ffb81c] transition-colors">Create Profile</a></li>
							</ul>
						</div>

						<div>
							<h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#f2efe6] mb-3">For Employers</h4>
							<ul className="space-y-2 text-xs">
								<li><a href="/register?role=seller" className="hover:text-[#ffb81c] transition-colors">Post a Job</a></li>
								<li><a href="/pricing" className="hover:text-[#ffb81c] transition-colors">Pricing</a></li>
								<li><a href="/login" className="hover:text-[#ffb81c] transition-colors">Verify Your Company</a></li>
							</ul>
						</div>

						<div>
							<h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#f2efe6] mb-3">Company</h4>
							<ul className="space-y-2 text-xs">
								<li><a href="/privacy" className="hover:text-[#ffb81c] transition-colors">Privacy Policy</a></li>
								<li><a href="/terms" className="hover:text-[#ffb81c] transition-colors">Terms of Service</a></li>
								<li><a href="/faq" className="hover:text-[#ffb81c] transition-colors">Contact Support</a></li>
							</ul>
						</div>
					</div>

				</div>

				{/* Bottom Bar */}
				<div className="pt-6 border-t border-[#2f322f] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#7b8079]">
					<span>© {new Date().getFullYear()} Drivers Australia. All rights reserved.</span>
					<span>Made for the roads of AU 🇦🇺</span>
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};