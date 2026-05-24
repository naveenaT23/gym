import type { Metadata } from "next";
import { Bebas_Neue, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { JsonLd } from "@/components/ui/JsonLd";

const bebas = Bebas_Neue({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: "Royal Fitness Gym | Forge Your Legend",
    template: "%s | Royal Fitness Gym",
  },
  description: "Royal Fitness Gym - The ultimate destination for strength, fitness, and transformation. Forge your legend today with our expert trainers and modern equipment.",
  keywords: ["Gym", "Fitness", "Pendurthi", "Andhra Pradesh", "Weight Training", "CrossFit", "Yoga", "Personal Training"],
  metadataBase: new URL("https://royalfitnessgym.com"), // Placeholder URL
};

import { localBusinessSchema } from "@/lib/structured-data";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bebas.variable} ${nunito.variable} font-nunito bg-charcoal text-white antialiased`}>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <JsonLd data={localBusinessSchema} />
      </body>
    </html>
  );
}
