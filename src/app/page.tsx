import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Customers } from "@/components/landing/customers";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      <Hero />
      <Stats />
      <Customers />

      {/* Footer */}
      <footer className="py-8 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} Neptune Plastics. All rights reserved.
          </p>
          <p className="text-xs text-[#9CA3AF] mt-2">
            57 years of excellence in pipe, films & filaments
          </p>
        </div>
      </footer>
    </main>
  );
}
