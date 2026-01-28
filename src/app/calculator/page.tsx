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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E07A5F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calculator...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-3 sm:py-4 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <Image
              src="/neptune-logo.png"
              alt="Neptune Plastics"
              width={45}
              height={45}
              className="rounded-lg object-contain transition-transform group-hover:scale-105 sm:w-[50px] sm:h-[50px]"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-[#1A1A1A]">Neptune Plastics</div>
              <div className="text-xs text-gray-500">ROI Calculator</div>
            </div>
          </Link>
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-gray-700 transition-colors text-xs sm:text-sm px-2 sm:px-3"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Step Content */}
      <div className="min-h-[calc(100vh-80px)] sm:min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Single card container - doesn't unmount */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-6">
            {/* Icon - changes without unmounting card */}
            <motion.div
              key={`icon-${currentStep}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-[#E07A5F] rounded-xl flex items-center justify-center mb-3 sm:mb-4"
            >
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.div>

            {/* Title - smooth transition */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2"
              >
                {step.title}
              </motion.h2>
            </AnimatePresence>

            {/* Description - smooth transition */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="text-gray-600 mb-5 sm:mb-6 text-sm"
              >
                {step.description}
              </motion.p>
            </AnimatePresence>

            {/* Input field - smooth transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`input-${currentStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="mb-5 sm:mb-6"
              >
                <div className="relative">
                  {step.prefix && (
                    <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-gray-400 pointer-events-none">
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
                    className={`w-full ${step.prefix ? 'pl-10 sm:pl-12' : 'pl-4'} ${step.suffix ? 'pr-24 sm:pr-32' : 'pr-4'} py-3 sm:py-4 text-2xl sm:text-3xl font-bold text-[#1A1A1A] bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/30 focus:border-[#E07A5F] transition-all`}
                  />
                  {step.suffix && (
                    <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-sm sm:text-base font-semibold text-gray-400 pointer-events-none whitespace-nowrap">
                      {step.suffix}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicator - always visible */}
            <ProgressIndicator
              currentStep={currentStep + 1}
              totalSteps={steps.length}
              onContinue={handleNext}
              onBack={currentStep > 0 ? handleBack : undefined}
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              continueLabel={currentStep === steps.length - 1 ? "See Results" : "Continue"}
            />
          </div>

          {/* Helper text */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-xs">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600 text-xs font-mono">Enter</kbd> to continue
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
