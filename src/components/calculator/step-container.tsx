"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepContainerProps {
  children: ReactNode;
  stepNumber: number;
  title: string;
  description?: string;
  icon?: ReactNode;
  onNext: () => void;
  onBack: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  canProceed?: boolean;
}

export function StepContainer({
  children,
  stepNumber,
  title,
  description,
  icon,
  onNext,
  onBack,
  isFirstStep = false,
  isLastStep = false,
  canProceed = true,
}: StepContainerProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8 md:p-12"
          >
            {/* Icon */}
            {icon && (
              <div className="w-16 h-16 bg-[#E07A5F]/10 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-[#E07A5F]">{icon}</div>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p className="text-[#6B7280] mb-8">{description}</p>
            )}

            {/* Content */}
            <div className="mb-8">{children}</div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
              {!isFirstStep ? (
                <Button variant="ghost" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={onNext}
                disabled={!canProceed}
                className="group"
              >
                {isLastStep ? "See Results" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
