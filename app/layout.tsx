import type { Metadata } from "next";
import { ThemeProvider } from "@wrksz/themes/next";

import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "DeFi Dashboard — Live crypto & on-chain markets",
  description:
    "Premium DeFi dashboard with live market data, DEX pools, gainers, losers, and watchlist from CoinGecko and GeckoTerminal.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
