"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/neptune-logo.png"
            alt="Neptune Plastics"
            width={100}
            height={60}
            className="object-contain"
          />
        </Link>

        {/* CTA */}
        <Link href="/calculator">
          <Button
            size="sm"
            className="bg-[#E07A5F] hover:bg-[#C96A51] text-white font-medium px-6"
          >
            Calculate ROI
          </Button>
        </Link>
      </div>
    </header>
  );
}
