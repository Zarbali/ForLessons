import type { Metadata, Viewport } from "next";
import { Figtree, Syne } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Veronika — English Learning",
    template: "%s · Veronika",
  },
  description:
    "Veronika is a premium English learning experience — vocabulary, grammar, listening, games, and focus tools. Made with love.",
  applicationName: "Veronika",
  keywords: [
    "English learning",
    "Veronika",
    "vocabulary",
    "grammar",
    "IELTS",
    "TOEFL",
    "flashcards",
  ],
  authors: [{ name: "Veronika" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Veronika",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png" }],
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Veronika — English Learning",
    description: "Beautiful English practice made with love.",
    type: "website",
    siteName: "Veronika",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veronika — English Learning",
    description: "Beautiful English practice made with love.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${syne.variable} ${figtree.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem("lingua:theme")||'"light"');if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
