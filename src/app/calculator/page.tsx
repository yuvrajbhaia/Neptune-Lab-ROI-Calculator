"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import {
  Factory,
  Clock,
  Calendar,
  DollarSign,
  Cog,
} from "lucide-react";
import { AllInputs, defaultInputs } from "@/lib/calculations";
import Link from "next/link";
import Image from "next/image";

// Step configuration - Only factory settings now
const steps = [
  {
    id: "output",
    title: "What is your machine output?",
    description: "Enter your production output per hour in kilograms",
    field: "outputPerHour" as const,
    category: "factory" as const,
    icon: Factory,
    suffix: "kg/hr",
    placeholder: "200",
    defaultValue: 200,
  },
  {
    id: "hours",
    title: "How many hours do you operate daily?",
    description: "Enter your typical working hours per day",
    field: "workingHoursPerDay" as const,
    category: "factory" as const,
    icon: Clock,
    suffix: "hrs/day",
    placeholder: "22",
    defaultValue: 22,
  },
  {
    id: "days",
    title: "How many days do you work per month?",
    description: "Enter your working days in a typical month",
    field: "workingDaysPerMonth" as const,
    category: "factory" as const,
    icon: Calendar,
    suffix: "days/month",
    placeholder: "25",
    defaultValue: 25,
  },
  {
    id: "material",
    title: "What is your material cost per kg?",
    description: "Enter the average cost of raw materials",
    field: "materialCostPerKg" as const,
    category: "factory" as const,
    icon: DollarSign,
    prefix: "₹",
    suffix: "/kg",
    placeholder: "100",
    defaultValue: 100,
  },
  {
    id: "processing",
    title: "What is your processing cost per kg?",
    description: "Enter your processing/operation cost",
    field: "processingCostPerKg" as const,
    category: "factory" as const,
    icon: Cog,
    prefix: "₹",
    suffix: "/kg",
    placeholder: "10",
    defaultValue: 10,
  },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<AllInputs>(defaultInputs);
  const [currentValue, setCurrentValue] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing client-side features
  useEffect(() => {
    setMounted(true);
  }, []);

  const step = steps[currentStep];
  const Icon = step.icon;

  // Initialize current value when step changes
  useEffect(() => {
    if (!mounted) return;
    const value = inputs.factory[step.field as keyof typeof inputs.factory];
    setCurrentValue(value?.toString() || step.defaultValue.toString());
  }, [currentStep, step, inputs, mounted]);

  const updateInput = (value: number) => {
    setInputs((prev) => ({
      ...prev,
      factory: {
        ...prev.factory,
        [step.field]: value,
      },
    }));
  };

  const handleNext = () => {
    const numValue = parseFloat(currentValue) || step.defaultValue;
    updateInput(numValue);

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save to localStorage and navigate to results
      const finalInputs = { ...inputs };
      finalInputs.factory = {
        ...finalInputs.factory,
        [step.field]: numValue,
      };

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem("calculatorInputs", JSON.stringify(finalInputs));
        }
        router.push("/calculator/results");
      } catch (error) {
        console.error("Failed to save inputs:", error);
        // Still navigate even if localStorage fails
        router.push("/calculator/results");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const numValue = parseFloat(currentValue) || step.defaultValue;
      updateInput(numValue);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const isValidInput = currentValue.trim() !== "" && !isNaN(parseFloat(currentValue));

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading calculator...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/neptune-logo.png"
              alt="Neptune Plastics"
              width={60}
              height={60}
              className="rounded-lg object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-white">Neptune Plastics</div>
              <div className="text-xs text-white/60">ROI Calculator</div>
            </div>
          </Link>
          <button
            onClick={() => router.push("/")}
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Step Content */}
      <div className="relative z-10 min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Step indicator badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
              </motion.div>

              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20"
              >
                {/* Icon circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-[#006cff] to-[#0052cc] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3 leading-tight"
                >
                  {step.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-[#6B7280] mb-8 text-lg"
                >
                  {step.description}
                </motion.p>

                {/* Input field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-10"
                >
                  <div className="relative">
                    {step.prefix && (
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400 pointer-events-none">
                        {step.prefix}
                      </span>
                    )}
                    <input
                      type="number"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={step.placeholder}
                      autoFocus
                      className={`w-full ${step.prefix ? 'pl-14' : 'pl-6'} ${step.suffix ? 'pr-28' : 'pr-6'} py-6 text-4xl font-bold text-[#1A1A1A] bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#006cff]/20 focus:border-[#006cff] transition-all text-center`}
                    />
                    {step.suffix && (
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-400 pointer-events-none">
                        {step.suffix}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Progress Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ProgressIndicator
                    currentStep={currentStep + 1}
                    totalSteps={steps.length}
                    onContinue={handleNext}
                    onBack={currentStep > 0 ? handleBack : undefined}
                    isFirstStep={currentStep === 0}
                    isLastStep={currentStep === steps.length - 1}
                    continueLabel={currentStep === steps.length - 1 ? "See Results" : "Continue"}
                  />
                </motion.div>
              </motion.div>

              {/* Helper text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-white/60 text-sm">
                  Press <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 text-white/80 text-xs">Enter</kbd> to continue
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
