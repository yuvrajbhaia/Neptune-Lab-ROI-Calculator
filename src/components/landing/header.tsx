"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/neptune-logo.png"
            alt="Neptune Plastics"
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
          <div className="hidden sm:block">
            <div className="font-semibold text-[#1A1A1A]">Neptune Plastics</div>
            <div className="text-xs text-[#6B7280]">Est. 1968</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/calculator"
            className="text-sm font-medium text-[#6B7280] hover:text-[#E07A5F] transition-colors"
          >
            Calculator
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-white bg-[#E07A5F] hover:bg-[#C96A51] px-4 py-2 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
