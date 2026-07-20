import type { Metadata } from "next";
import { Oswald, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/blocks/footer-section";
import { headers } from "next/headers";
import { FloatingChatButton } from "@/components/shared/FloatingChatButton";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Drivers Australia — Marketplace & Job Board",
  description: "Drivers Australia is a premium marketplace connecting sellers and drivers through custom dynamic forms and listings.",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isAdmin = pathname.startsWith('/admin');

  let profile = null;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Supabase profile fetch error in root layout:", error);
      }
      
      if (data) {
        profile = data;
      } else {
        // Fallback to user metadata in case the database profile trigger hasn't finished or failed
        profile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || 'New User',
          role: user.user_metadata?.role || 'buyer',
          tokens: 0
        };
      }
    }
  } catch (error: any) {
    if (error?.message?.includes("Dynamic server usage")) {
      // Safe Next.js dynamic rendering bailout, ignore
    } else {
      console.error("Error fetching user profile in root layout:", error);
    }
  }

  return (
    <html
      lang="en"
      className={`${oswald.variable} ${publicSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {!isAdmin && <Navbar profile={profile as any} />}
        <main className="flex-grow flex flex-col">{children}</main>
        {profile && !isAdmin && <FloatingChatButton />}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
