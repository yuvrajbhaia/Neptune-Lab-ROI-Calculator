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
          {isRevealed ? (
            <Unlock className="w-5 h-5 text-[#E07A5F]" />
          ) : (
            <Lock className="w-5 h-5 text-[#9CA3AF]" />
          )}
          <p className="text-sm text-[#9CA3AF] uppercase tracking-wider">
            {isRevealed ? "Your Total Annual Impact" : "Total Annual Impact"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isRevealed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                {formatCurrency(total)}
              </p>
              <p className="text-sm text-[#E07A5F]">
                Potential savings per year
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <p
                className="text-5xl md:text-6xl font-bold text-white mb-2 select-none"
                style={{ filter: "blur(12px)" }}
              >
                {formatCurrency(total)}
              </p>
              <p className="text-sm text-[#6B7280]">
                Fill the form below to reveal
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
