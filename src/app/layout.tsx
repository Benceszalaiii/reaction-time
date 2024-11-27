import type { Metadata } from "next";
import "./globals.css";
import { caveat, geistMono, geistSans, inter, sfPro } from "./fonts";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reaction Time Game",
  description: "A simple reaction time game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⌚</text></svg>"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sfPro.variable} ${inter.variable} ${caveat.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="dark"
          attribute={"class"}
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
        <footer className="bg-neutral-950 py-4 w-full text-center font-geistmono text-gray-400">Made by <Link href={"https://www.github.com/benceszalaiii"} className="text-foreground">Benceszalaiii</Link></footer>
      </body>
    </html>
  );
}
