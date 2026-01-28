"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/neptune-logo.png"
            alt="Neptune Plastics"
            width={80}
            height={48}
            className="object-contain sm:w-[100px] sm:h-[60px]"
          />
        </Link>

        {/* CTA */}
        <Link href="/calculator">
          <Button
            size="sm"
            className="bg-[#E07A5F] hover:bg-[#C96A51] text-white font-medium px-4 sm:px-6 text-sm"
          >
            Calculate ROI
          </Button>
        </Link>
      </div>
    </header>
  );
}
