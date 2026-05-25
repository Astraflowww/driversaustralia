import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drivers Australia — Dynamic Listing Portal",
  description: "A premium form-based listing portal MVP connecting buyers and sellers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar profile={profile as any} />
        <main className="flex-grow flex flex-col">{children}</main>
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground bg-background/50 backdrop-blur-md">
          © {new Date().getFullYear()} Drivers Australia. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
