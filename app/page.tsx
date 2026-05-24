import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Features } from "@/components/sections/Features";
import { Transformation } from "@/components/sections/Transformation";
import { Programs } from "@/components/sections/Programs";
import { Brands } from "@/components/sections/Brands";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { JsonLd } from "@/components/ui/JsonLd";
import { localBusinessSchema } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <Hero />
      <StatsBar />
      <Brands />
      <Features />
      <Programs />
      <Transformation />
      <Testimonials />
      <CTABanner />
    </>
  );
}
