import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { GlobalReach } from "@/components/landing/global-reach";
import { VideoSection } from "@/components/landing/video-section";
import { Customers } from "@/components/landing/customers";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <GlobalReach />
      <VideoSection />
      <Customers />

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Neptune Plastics. Est. 1968.
          </p>
        </div>
      </footer>
    </main>
  );
}
