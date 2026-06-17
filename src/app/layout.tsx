import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://bright-money-lime.vercel.app"),
  title: {
    default: "Proton Finance — Wealth Curator",
    template: "%s · Proton Finance",
  },
  description:
    "A premium personal finance dashboard. Track net worth, spending, AI-driven insights, budgets and portfolio intelligence in one place.",
  openGraph: {
    title: "Proton Finance — Wealth Curator",
    description:
      "Track net worth, spending, AI insights, budgets and portfolio intelligence.",
    type: "website",
    siteName: "Proton Finance",
  },
};

const themeScript = `
  (function(){
    try {
      var t = localStorage.getItem('proton-theme');
      if (t !== 'light' && t !== 'dark') t = 'dark';
      var r = document.documentElement;
      r.classList.remove('dark','light');
      r.classList.add(t);
      r.style.colorScheme = t;
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
