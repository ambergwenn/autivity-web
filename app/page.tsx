import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { BouncyCardsFeatures } from "@/components/features";
import AdaptiveProcess from "@/components/adaptive-process";
import Science from "@/components/science";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <BouncyCardsFeatures />
      <AdaptiveProcess />
      <Science />
      <FAQ />
      <Footer />
    </main>
  );
}