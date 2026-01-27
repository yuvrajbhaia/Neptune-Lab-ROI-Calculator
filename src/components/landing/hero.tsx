"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Small label */}
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">
            For Masterbatch Manufacturers
          </p>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-[1.1] mb-6">
            Stop losing money on
            <br />
            <span className="text-[#E07A5F]">production trials</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Our 25mm Lab Raffia Tape Line helps you test colors, pigments, and
            materials without disrupting your main production.
          </p>

          {/* CTA Button */}
          <Link href="/calculator">
            <Button
              size="lg"
              className="bg-[#E07A5F] hover:bg-[#C96A51] text-white font-medium px-8 py-6 text-base h-auto group"
            >
              Calculate Your Savings
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Trust indicator */}
          <p className="text-sm text-gray-400 mt-6">
            Takes 2 minutes. No signup required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
