import type { Metadata } from "next";
import "./globals.css";
import MouseFollowLight from "@/components/ui/MouseFollowLight";
import PremiumBackground from "@/components/ui/PremiumBackground";

export const metadata: Metadata = {
  title: {
    default: "EconUz — O'zbekiston Bozor Analytika Platformasi",
    template: "%s | EconUz",
  },
  description:
    "O'zbekiston bozorining real vaqt tahlili, narxlar, trendlar va AI bashoratlari. 369+ mahsulot, 50+ kategoriya.",
  keywords: ["O'zbekiston", "bozor", "narxlar", "analytika", "AI", "bashorat", "EconUz"],
  authors: [{ name: "EconUz" }],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "EconUz",
    title: "EconUz — O'zbekiston Bozor Analytika Platformasi",
    description: "O'zbekiston bozorining real vaqt tahlili, narxlar, trendlar va AI bashoratlari.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EconUz — O'zbekiston Bozor Analytika Platformasi",
    description: "O'zbekiston bozorining real vaqt tahlili, narxlar, trendlar va AI bashoratlari.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark" suppressHydrationWarning>
      <body className="font-body antialiased">
        <PremiumBackground />
        <MouseFollowLight />
        {children}
      </body>
    </html>
  );
}
