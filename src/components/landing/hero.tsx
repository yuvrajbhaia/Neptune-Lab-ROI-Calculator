"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ColourfulText } from "@/components/ui/colourful-text";

export function Hero() {
  return (
    <section className="pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            Still struggling with <ColourfulText text="COLOUR" /> matching?
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-[#6B7280] mb-6 max-w-3xl mx-auto">
            Lab extrusion lines for masterbatch, Raffia tape, film filament and pipes
          </p>

          {/* Secondary text */}
          <p className="text-2xl md:text-3xl lg:text-4xl text-[#E07A5F] mb-8 font-bold">
            Stop losing money on production trials
          </p>

          {/* CTA Button */}
          <Link href="/calculator" className="block sm:inline-block">
            <Button
              size="lg"
              className="bg-[#E07A5F] hover:bg-[#C96A51] text-white font-medium px-8 py-6 text-base h-auto group w-full sm:w-auto"
            >
              Calculate Your Savings
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Trust indicator */}
          <p className="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
            Takes 2 minutes. No signup required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
