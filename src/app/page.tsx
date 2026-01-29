import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { GlobalReach } from "@/components/landing/global-reach";
import { VideoSection } from "@/components/landing/video-section";
import { Customers } from "@/components/landing/customers";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <GlobalReach />
      <VideoSection />
      <Customers />
      <Footer />
    </main>
  );
}
