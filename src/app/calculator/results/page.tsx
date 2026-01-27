"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PainCard } from "@/components/results/pain-card";
import { BlurredTotal } from "@/components/results/blurred-total";
import { LeadForm, LeadFormData } from "@/components/results/lead-form";
import { ExplainModal } from "@/components/results/explain-modal";
import {
  AllInputs,
  defaultInputs,
  PainResult,
  calculateAllPains,
  calculateTotal,
} from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";

// Define input configurations for each pain point
const painInputConfigs: Record<number, { label: string; field: string; suffix?: string; prefix?: string }[]> = {
  1: [
    { label: "Rejected trials/month", field: "rejectedTrialsPerMonth", suffix: "trials" },
    { label: "Run time per batch", field: "runTimePerBatch", suffix: "hrs" },
  ],
  2: [
    { label: "Pigment savings", field: "pigmentSavingsPerKg", prefix: "₹", suffix: "/kg" },
  ],
  3: [
    { label: "Small batch requests/year", field: "smallBatchRequestsPerYear", suffix: "cases" },
    { label: "Loss per case", field: "lossPerCase", prefix: "₹" },
  ],
  4: [
    { label: "Experiment requests/year", field: "experimentRequestsPerYear", suffix: "cases" },
    { label: "Loss per case", field: "lossPerCase", prefix: "₹" },
  ],
  5: [
    { label: "Material savings", field: "recycledMaterialSavingsPerKg", prefix: "₹", suffix: "/kg" },
    { label: "Number of machines", field: "numberOfMachines", suffix: "machines" },
  ],
  6: [
    { label: "Peak season requests/year", field: "peakSeasonRequestsPerYear", suffix: "cases" },
    { label: "Loss per case", field: "lossPerCase", prefix: "₹" },
  ],
};

export default function ResultsPage() {
  const router = useRouter();
  const [inputs, setInputs] = useState<AllInputs>(defaultInputs);
  const [results, setResults] = useState<PainResult[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadData, setLeadData] = useState<LeadFormData | null>(null);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explainPainId, setExplainPainId] = useState<number>(1);

  // Recalculate results when inputs change
  const recalculateResults = useCallback((newInputs: AllInputs) => {
    const calculatedResults = calculateAllPains(newInputs);
    // Preserve selection state from existing results
    setResults((prevResults) => {
      if (prevResults.length === 0) return calculatedResults;
      return calculatedResults.map((newResult) => {
        const existing = prevResults.find((r) => r.id === newResult.id);
        return existing ? { ...newResult, isSelected: existing.isSelected } : newResult;
      });
    });
  }, []);

  useEffect(() => {
    // Load inputs from localStorage
    const savedInputs = localStorage.getItem("calculatorInputs");
    if (savedInputs) {
      const parsedInputs = JSON.parse(savedInputs) as AllInputs;
      setInputs(parsedInputs);
      const calculatedResults = calculateAllPains(parsedInputs);
      setResults(calculatedResults);
    } else {
      // Redirect to calculator if no inputs found
      router.push("/calculator");
    }
  }, [router]);

  const togglePainSelection = (painId: number) => {
    setResults((prev) =>
      prev.map((pain) =>
        pain.id === painId ? { ...pain, isSelected: !pain.isSelected } : pain
      )
    );
  };

  const handlePainInputChange = (painId: number, field: string, value: number) => {
    setInputs((prev) => {
      const painKey = `pain${painId}` as keyof AllInputs;
      const currentPainData = prev[painKey];
      const newInputs = {
        ...prev,
        [painKey]: {
          ...currentPainData,
          [field]: value,
        },
      };
      // Recalculate with new inputs
      recalculateResults(newInputs);
      return newInputs;
    });
  };

  const handleExplain = (painId: number) => {
    setExplainPainId(painId);
    setExplainModalOpen(true);
  };

  // Get input values for a specific pain point
  const getPainInputValues = (painId: number) => {
    const painKey = `pain${painId}` as keyof AllInputs;
    const painData = inputs[painKey];
    const config = painInputConfigs[painId] || [];

    return config.map((inputConfig) => ({
      ...inputConfig,
      value: (painData as unknown as Record<string, number>)[inputConfig.field] || 0,
    }));
  };

  const total = calculateTotal(results);

  const handleFormSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    setLeadData(data);

    try {
      // TODO: Re-enable API submission once Cloudflare Workers integration is set up
      // For now, just log the data to console
      console.log("=== ROI Calculator Submission (Client-side) ===");
      console.log("Lead:", data);
      console.log("Total Annual Impact:", total);
      console.log("Selected Pain Points:", results.filter((r) => r.isSelected).length);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reveal the total
      setIsRevealed(true);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      // Still reveal for demo purposes
      setIsRevealed(true);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
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
          <Button variant="ghost" onClick={() => router.push("/calculator")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Recalculate
          </Button>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Results Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            Your ROI Analysis Results
          </h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Select the pain points relevant to your business to calculate your potential annual savings
          </p>
        </motion.div>

        {/* Pain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {results.map((pain) => (
            <PainCard
              key={pain.id}
              id={pain.id}
              title={pain.title}
              description={pain.description}
              annualLoss={pain.annualLoss}
              isSelected={pain.isSelected}
              onToggle={() => togglePainSelection(pain.id)}
              onExplain={() => handleExplain(pain.id)}
              inputs={getPainInputValues(pain.id)}
              onInputChange={(field, value) => handlePainInputChange(pain.id, field, value)}
            />
          ))}
        </div>

        {/* Explain Modal */}
        <ExplainModal
          isOpen={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          painId={explainPainId}
          title={results.find((r) => r.id === explainPainId)?.title || ""}
        />

        {/* Blurred Total */}
        <div className="mb-12">
          <BlurredTotal total={total} isRevealed={isRevealed} />
        </div>

        {/* Lead Form or Success Message */}
        {!isSubmitted ? (
          <LeadForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
              Thank You, {leadData?.name}!
            </h3>
            <p className="text-[#6B7280] mb-6">
              Your detailed ROI report has been sent to {leadData?.email}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </motion.div>
        )}

        {/* Summary Cards - Show after reveal */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center">
              <p className="text-sm text-[#6B7280] mb-2">Monthly Savings</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {formatCurrency(total / 12)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center">
              <p className="text-sm text-[#6B7280] mb-2">Payback Period</p>
              <p className="text-2xl font-bold text-[#E07A5F]">
                &lt; 12 Months
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 text-center">
              <p className="text-sm text-[#6B7280] mb-2">5-Year Savings</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {formatCurrency(total * 5)}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E5E7EB] bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} Neptune Plastics. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
