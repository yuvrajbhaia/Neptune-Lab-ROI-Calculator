"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";

interface BlurredTotalProps {
  total: number;
  isRevealed: boolean;
}

export function BlurredTotal({ total, isRevealed }: BlurredTotalProps) {
  return (
    <div className="relative py-8 px-6 bg-[#2D2D2D] rounded-2xl overflow-hidden">
      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Unlock className="w-5 h-5 text-[#E07A5F]" />
          <p className="text-sm text-[#9CA3AF] uppercase tracking-wider">
            Your Total Annual Impact
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-5xl md:text-6xl font-bold text-white mb-2">
            {formatCurrency(total)}
          </p>
          <p className="text-sm text-[#E07A5F]">
            Potential savings per year
          </p>
        </motion.div>
      </div>
    </div>
  );
}
