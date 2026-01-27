"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/calculator/progress-bar";
import {
  ArrowLeft,
  ArrowRight,
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

  const step = steps[currentStep];
  const Icon = step.icon;

  // Initialize current value when step changes
  useEffect(() => {
    const value = inputs.factory[step.field as keyof typeof inputs.factory];
    setCurrentValue(value?.toString() || step.defaultValue.toString());
  }, [currentStep, step, inputs]);

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

      localStorage.setItem("calculatorInputs", JSON.stringify(finalInputs));
      router.push("/calculator/results");
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

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/neptune-logo.png"
              alt="Neptune Plastics"
              width={80}
              height={80}
              className="rounded-lg object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-[#1A1A1A]">Neptune Plastics</div>
            </div>
          </Link>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Exit Calculator
          </Button>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Progress */}
      <div className="pt-8 px-4">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      </div>

      {/* Step Content */}
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-8 md:p-12"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-[#E07A5F]/10 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-[#E07A5F]" />
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-[#6B7280] mb-8">{step.description}</p>

              {/* Input */}
              <div className="mb-8">
                <Input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  prefix={step.prefix}
                  suffix={step.suffix}
                  placeholder={step.placeholder}
                  autoFocus
                  className="text-center text-2xl font-semibold"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-[#E5E7EB]">
                {currentStep > 0 ? (
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button
                  onClick={handleNext}
                  disabled={!isValidInput}
                  className="group"
                >
                  {currentStep === steps.length - 1 ? "See Results" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
