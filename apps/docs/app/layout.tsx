import type { Metadata } from "next";
import { ThemeProvider, ThemeScript, ToastProvider } from "@projectx/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjectX UI — eigen component library",
  description:
    "Een volledig eigen React component library op basis van het ProjectX UI-design. Geen shadcn, geen Radix, geen externe UI-dependencies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400,500,600,700,800&family=JetBrains+Mono:wght@400,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
