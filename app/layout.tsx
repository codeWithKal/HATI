import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "HATI Construction",
  description: "Premium construction and engineering services in Ethiopia",
  generator: "v0.app",
  icons: {
    icon: "/hati-logo.png",
    apple: "/hati-logo.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            {process.env.NODE_ENV === "production" && <Analytics />}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
